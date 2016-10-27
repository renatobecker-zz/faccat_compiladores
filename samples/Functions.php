<?php
function makecoffee($type = "cappuccino")
{
    return "Making a cup of $type.\n";
}

echo makecoffee();
echo makecoffee(null);
echo makecoffee("espresso");

//Comentário

function addFunction($num1, $num2) {
    $sum = $num1 + $num2;
    echo "Sum of the two numbers is : $sum";
}
         
addFunction(10, 20);