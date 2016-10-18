Boolean Keywords

<? 
/* 
BEGIN FUNCTION DEFINITIONS 
*/ 

/* 
  This function takes in an array and flushes all null values from the array. 
  It returns the array - all null values. 
*/ 
function flush_alt($alts) { 
    for($idx=0,$max=count($alts); $idx<$max; $idx  ) { 
        if ($alts[$idx]!="") { 
            $alts2[]=$alts[$idx]; 
            } 
        } 
    return($alts2); 
    } 
/* 
  This takes in an array and eliminates all duplicate values within the array. 
*/ 

function flush_dupes($package) { 

    for ( $count=0,$top=count($package); $count<$top; $count   ) { 
        if ($package[$count]!="" && ( $package[$count] != $package[$count 1] ) ) { 
            $pack2[] = $package[$count]; 
            } 
        } 
    return($pack2); 

    } 

/* 
  This function takes in two arrays.     
  It eliminates all the values in the first array from the second array. 
  It then returns the corrected second array. 
*/ 

function rank_arrays ( $array1, $array2 ) { 
    /* Takes all of the values in $array1 out of $array2. */ 
    for ( $j=0,$max1=count($array1); $j<$max1; $j   ) { 
        for ( $h=0,$max2=count($array2); $h<$max2; $h  ) { 
            if ( ( $array2[$h] == $array1[$j] ) && ( $array1[$j] != "" ) ) { 
                $array2[$h] = ""; 
                } 
            } 
        } 

    $array2 = flush_alt($array2); 
    return($array2); 
    } 

/* 
END FUNCTION DEFINITIONS 
*/ 

if ( !$keywords ) { 
    $temp=array(); 
    $tpl ="final_search_table"; 

    $temp["session_id"] = "session_id"; 
    $temp["uid"]        = "userid"; 
    $temp["error"]      = "error"; 

    include "includes/function_PrintPage.php"; 
    PrintPage( $tpl, $temp); 
    exit; 
    } 
else { 

    $starttime = microtime(); 
    print "keywords = $keywords<br><br>\n"; 

    // Break up $keywords on whitespace. 
    $pieces = split ( "[[:space:]] ", $keywords ); 

    /* Intialize three arrays */ 

    /* $haves has all of the values that must be present */ 
    $haves    = array(); 

    /* $havenots has all of the values that must not be present */ 
    $havenots = array(); 

    /* $alternates has all of the values that can be present */ 
    $alternates = array(); 

    /* $entities has all of the individual pieces of the keyword string. 
       This includes both individual words and strings. */ 
    $objects = array(); 

    /* Initialize the $tmpstring. */ 
    $tmpstring=""; 

    /* Initialize the $flag. */ 
    $flag = ""; 

    /* ################################################# 

        This code takes the keyword string passed in 
        and breaks it into objects.  It breaks 
        everything into either individual words or 
        strings, if a block of text is quoted within 
        the keyword string. 

       ################################################# */ 

    for ( $k=0; $k<count($pieces); $k   ) { 
        /* Check individual words. */ 
        if ( ( substr($pieces[$k], -1) != '"' ) && ( substr($pieces[$k], 0, 1) != '"' ) ) { 
            $objects[] = trim($pieces[$k]); 
            } 
        else { 
            /* This means that the $piece is either the beginning or the end of a string. 
               So, we'll slurp up the $pieces and stick them together until we get to the 
               end of the string or run out of pieces. */ 
            /* Make sure the $tmpstring is empty. */ 
            $tmpstring = ""; 
            /* Add this word to the $tmpstring, starting the $tmpstring. */ 
            $tmpstring .= trim ( ereg_replace( '"', " ", $pieces[$k] ) ); 
            /* Check for one possible exception to the rule. That there is a single quoted word. */ 
            if ( substr(trim($pieces[$k]), -1 ) == '"' ) { 
                /* Turn the flag off for future iterations. */ 
                $flag = "off"; 
                /* Push the $tmpstring onto the $haves array. */ 
                $objects[] = trim($tmpstring); 
                /* Free the $tmpstring. */ 
                unset ( $tmpstring ); 
                /* Stop looking for the end of the string and move onto the next word. */ 
                continue; 
                } 
            /* Otherwise, turn on the flag to indicate no quotes have been found attached to 
               this word in the string. */ 
            $flag = "on"; 
            //print "<br>".$pieces[$k]." turned the flag $flag.<br>\n"; 
            /* Move on to the next word. */ 
            $k  ; 
            /* Keep reading until the end of the string as long as the $flag is on. */ 
            while ( $flag == "on" && ( $k < count( $pieces ) ) ) { 

                /* If the word doesn't end in double quotes, append it to the $tmpstring. */ 

                if ( substr(trim($pieces[$k]), -1) != '"' ) { 
                    /* Tack this word onto the current string entity. */ 
                    $tmpstring .= " $pieces[$k]"; 
                    /* Move on to the next word. */ 
                    $k  ; 
                    continue; 

                    } 
                /* If the $piece ends in double quotes, strip the double quotes, tack the 
                   $piece onto the tail of the string, push the $tmpstring onto the $haves, 
                   kill the $tmpstring, turn the $flag "off", and return. */ 
                else { 
                    $tmpstring .= " ".trim ( ereg_replace( '"', " ", $pieces[$k] ) ); 
                    /* Push the $tmpstring onto the array of stuff to search for. */ 
                    $objects[] = trim($tmpstring);   
                    /* Kill the $tmpstring. */ 
                    unset ( $tmpstring ); 
                    /* Turn off the flag to exit the loop. */ 
                    $flag = "off"; 
                    //print "<br>$pieces[$k] turned the flag $flag.<br>\n"; 

                    } 
                } 
            } 
        } 
    /* ################################################# 

        Objects are now defined. 

       ################################################# */ 
    /* Now we've got our objects defined. We must now determine 
       the relationships among them. By running through them and 
       picking out key words or symbols. Relationships are 
       determined by the presence of the Boolean keywords "AND", 
       "OR", and "NOT", as well as the operators " " and "-". */ 

    for ( $j=0; $j<count($objects); $j   ) { 

        /* BEGIN CHECKING THE CURRENT OBJECT */ 
        /* If the object starts in " " it goes on the haves[]. */ 
       
        if ( substr ( $objects[$j], 0, 1 ) == " " ) { 
            //echo "echoing $objects[$j]<br>\n"; 
            $haves[] = trim(ereg_replace("^\ ", " ", $objects[$j])); 
            } 
        /* If the object starts in "-" it goes on the havenots[]. */ 

        if ( substr ( $objects[$j], 0, 1 ) == "-" ) { 
            $havenots[] = trim(ereg_replace("^-", " ", $objects[$j])); 
            //$j  ; 
            } 

        /* END CHECKING THE CURRENT OBJECT */ 
        /* BEGIN CHECKING THE NEXT OBJECT */ 

        if ( $objects[$j 1] == "AND" ) { 
            /* Hop onto the "AND". */ 
            $j  ; 

            if ( ! ereg("^[\ -]", $objects[$j-1]) ) { 
                $haves[] = $objects[$j-1]; 
                } 
            else { /* Just hang tight. */ } 

            $haves[] = $objects[$j 1]; 

            while ( $objects[$j 2] == "OR" ) { 

                // Hop on top of the OR. 
                $j = $j 2; 
                $haves[] = $objects[$j 1]; 
                } 
            } 

        elseif ( $objects[$j 1] == "NOT") { 

            /* Hop on the NOT. */ 

            $j  ; 

            $alternates[] = $objects[$j-1]; 
            $havenots[]   = $objects[$j 1]; 

            while ( $objects[$j 2] == "OR" ) { 

                // Hop on top of the OR. 

                $j = $j 2; 

                $havenots[] = $objects[$j 1]; 

                } 

            } 

        elseif ( $objects[$j 1] == "OR" ) { 

            /* Hop onto the OR. */ 

            $j  ; 

            $alternates[] = $objects[$j-1]; 
            $alternates[] = $objects[$j 1]; 

            } 

        else { 

            /* It's just a regular word, throw it on the alternates. */ 

            if ( ( substr($objects[$j], 0, 1) != " " ) && ( substr($objects[$j], 0, 1) != "-" ) && ( $objects[$j-1] != "AND" ) && ( $objects[$j-1] != "NOT" ) ) { 

                $alternates[] = $objects[$j]; 

                } 

            } 

        } 

    /* END CHECKING THE NEXT OBJECT */ 

    /******** BEGIN FILTER ********/ 

    /* Sort the arrays. */ 

    sort ( $haves ); 
    sort ( $havenots ); 
    sort ( $alternates ); 

    /* End sorting. */ 

    /* Remove duplicates within each array. */ 

    $haves      = flush_dupes($haves); 
    $havenots   = flush_dupes($havenots); 
    $alternates = flush_dupes($alternates); 

    /* End removing duplicates within each array. */ 

    /* Eliminate all of the duplicated values between the haves and alternates array. */ 

    $alternates = rank_arrays ( $haves, $alternates ); 
    $alternates = rank_arrays ( $havenots, $alternates ); 
    $haves      = rank_arrays ( $havenots, $haves ); 

    /* End eliminating duplicates between arrays. */ 

    /******** END FILTER ********/ 

    /* Display the results of the search. */ 

    print "Search for:<p>\n"; 

    print "<b>Objects:</b><ul>\n"; 
    for($i=0; $i<count($objects); $i  ) { 
        print "<li>..$objects[$i]..</li>\n"; 
        } 

    print "</ul>\n\n"; 

    print "<b>Records with:</b><ul>\n"; 
    for($i=0; $i<count($haves); $i  ) { 
        print "<li>$haves[$i]</li>\n"; 
        } 

    print "</ul>\n\n"; 

    print "<b>Records without:</b><ul>\n"; 
    for($l=0; $l<count($havenots); $l  ) { 
        print "<li>$havenots[$l]</li>\n"; 
        } 

    print "</ul>\n\n"; 

    print "<b>Records that have any of the following:</b>\n<ul>\n"; 
    for($t=0; $t<count($alternates); $t  ) { 
        print "<li>$alternates[$t]</li>\n"; 
        } 
    print "</ul>\n\n"; 
    exit; 
    /*** EOF ***/ 
    } 
// Example: 
// < form action="this script" method="post" > 
?>   
