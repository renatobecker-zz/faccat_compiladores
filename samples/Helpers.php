    function uploadTenantImage($tenant_hash, $input_name) {

        if (Request::hasFile($input_name)) {

            $shortPath = '/tenants/' . $tenant_hash . '/images';
            $imagePathDir = public_path() . $shortPath;

            if (self::verifyFolder($imagePathDir)) {                
                $extension = Request::file($input_name)->getClientOriginalExtension(); 
                $fileName = rand(11111,99999).'.'.$extension; 
                Request::file($input_name)->move($imagePathDir, $fileName);
                return $shortPath . '/'.  $fileName;
            } else {
                return;
            }    
        }
        else {
            return;
        }        
    }

    function uploadTenantCSV($tenant_hash, $input_name) {

        if (Request::hasFile($input_name)) {

            $shortPath = '/tenants/' . $tenant_hash . '/csv';
            $filePathDir = public_path() . $shortPath;

            if (self::verifyFolder($filePathDir)) {                
                $extension = Request::file($input_name)->getClientOriginalExtension(); 
                $fileName = rand(11111,99999).'.'.$extension; 
                Request::file($input_name)->move($filePathDir, $fileName);
                return $shortPath . '/'.  $fileName;
            } else {
                return;
            }    
        }
        else {
            return;
        }        
    }

    function format_dependent_dropdown_plugin($data, $default_id) {
        /* format output
        $json_output = {
            output: [
                {id: 'id-1', name: 'name-1'],
                {id: 'id-2', name: 'name-2'],
                {id: 'id-3', name: 'name-3']
            ],
            selected: 'default_id'
        };
        */

        $array_data = [];

        foreach ($data as $key => $value) {
            $array_data['output'][] = ['id' => $key, 'name' => $value];
        }

        if ($default_id) {
            $array_data['selected'] = $default_id;
        }

        return json_encode($array_data); 
    }

    /**
    * Returna uma string com acento em uma expressão REGEX para encontrar todas as variantes
    * em formato não-sensitivo ao acento.
    *
    * @param string $text O texto.
    * @return string O texto em REGEX.
    */
    
    function accentToRegex($text) {

        $from = str_split(utf8_decode(self::ACCENT_STRINGS));
        $to   = str_split(strtolower(self::NO_ACCENT_STRINGS));
        $text = utf8_decode($text);
        $regex = array();
        foreach ($to as $key => $value) {
            if (isset($regex[$value])) {
                $regex[$value] .= $from[$key];
            } else {
                $regex[$value] = $value;
            }
        }
        foreach ($regex as $rg_key => $rg) {
            $text = preg_replace("/[$rg]/", "_{$rg_key}_", $text);
        }
        
        foreach ($regex as $rg_key => $rg) {
            $text = preg_replace("/_{$rg_key}_/", "[$rg]", $text);
        }

        return utf8_encode($text);        
    } 

    /*
    *Funções de Gerenciamento de Uploads
    */

    function file_upload_max_size() {
    
        static $original_max_size = -1;
        
        if ($original_max_size < 0) {

            $original_max_size = ini_get('post_max_size');            
            $max_size = self::parse_size($original_max_size);
            
            $original_max_size_upload = ini_get('upload_max_filesize');
            $upload_max = self::parse_size($original_max_size_upload);
            if ($upload_max > 0 && $upload_max < $max_size) {
                $original_max_size = $original_max_size_upload;
            }
        }
        return $original_max_size;
    }

    // Retorna em bytes o tamanho limite para upload de arquivo baseado em PHP upload_max_filesize
    // and post_max_size
    function file_upload_max_size_parse() {
    
        static $max_size = -1;
        
        if ($max_size < 0) {
            // Start with post_max_size.
            $max_size = self::parse_size(ini_get('post_max_size'));
            
            // If upload_max_size is less, then reduce. Except if upload_max_size is
            // zero, which indicates no limit.
            $upload_max = self::parse_size(ini_get('upload_max_filesize'));
            if ($upload_max > 0 && $upload_max < $max_size) {
                $max_size = $upload_max;
            }
        }
        return $max_size;
    }

    function parse_size($size) {
        
        $unit = preg_replace('/[^bkmgtpezy]/i', '', $size); // Remove the non-unit characters from the size.
        $size = preg_replace('/[^0-9\.]/', '', $size); // Remove the non-numeric characters from the size.
        if ($unit) {
            // Find the position of the unit in the ordered string which is the power of magnitude to multiply a kilobyte by.
            return round($size * pow(1024, stripos('bkmgtpezy', $unit[0])));
        }
        else {
            return round($size);
        }
    }    

    function clear_text( $text ) {

        return preg_replace( '/[`^~\'"]/', null, iconv( 'UTF-8', 'ASCII//TRANSLIT', $text ) ); 
    }    

    function add_tenant_user($data, $subdomain=null) {

        if (is_null($subdomain)) {
            $subdomain = Session::get('subdomain');
        }    

        $tenant = Tenant::where('subdomain', '=', $subdomain)->first(); 

        if (is_null($tenant)) {
            return;
        }        
        if ( !isset($data['name']) ) {
            $data['name'] = '';
        }

        $data['confirmation_code'] = str_random(30);
        $password                  = str_random(6);  
        $search_term               = Helpers::clear_text($data['name']);       
        $data['search']            = strtolower($search_term);          
        $data['admin']             = true;                              
        $data['confirmed']         = false;  
        $data['password']          = bcrypt($password);

        $keys = array('email' => $data['email']);

        $database = new DynamicDB(['database' => $subdomain, 'driver' => 'mongodb']);                                

        //Insere dados em outro database, se necessário.
        $result = DB::connection($subdomain)->collection('users')->raw(function($collection)  use ($keys, $data) {
            return $collection->update(
                    $keys,                    
                    $data,
                    ['upsert' => true]
                );
        });

        $data['subdomain'] = $subdomain;
        $data['password_origem'] = $password;
        self::send_confirmation($data);

    }

    function send_confirmation($data) {
        
        $base = $_SERVER["HTTP_HOST"];
        $path = '/register/verify/'. $data['confirmation_code'];
        $url = url($path);

        $start = starts_with($base, $data['subdomain']);
        if ($start == false) {
            $sub_base = $data['subdomain'] .'.'. $base;
            $url = str_replace($base, $sub_base, $url);            
        };

        $data['url'] = $url;

        Mail::send('emails.welcome', $data, function($message) use ($data) {
            $message->from('no-reply@geovisao.com', "Geovisão");
            $message->subject("Bem-vindo ao Geovisão");
            $message->to($data['email']);
        });

    }

    function get_current_tenant_info() {

        $subdomain = Session::get('subdomain');
        $tenant = Tenant::where('subdomain', '=', $subdomain)->first(); 

        if (is_null($tenant)) {
            abort(404);
        }        

        return $tenant;
    }

    function valid_filename($filename) {
        //primeiro substitui espaços por underscore
        $new_filename = str_replace(' ', '_', $filename);            
        //mantém apenas letras e numeros
        $new_filename = preg_replace('/[^\w]/', '', $new_filename);

        return $new_filename;
    }
