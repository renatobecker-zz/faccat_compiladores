<?php 
function myrow($id, $data) { 
    return "<tr><th>$id</th><td>$data</td></tr>\n"; 
} 

$arr = get_defined_functions(); 

print_r($arr); 
?> 

Will output something along the lines of: 


Array 
( 
    [internal] => Array 
        ( 
            [0] => zend_version 
            [1] => func_num_args 
            [2] => func_get_arg 
            [3] => func_get_args 
            [4] => strlen 
            [5] => strcmp 
            [6] => strncmp 
            ... 
            [750] => bcscale 
            [751] => bccomp 
        ) 

    [user] => Array 
        ( 
            [0] => myrow 
        ) 

)