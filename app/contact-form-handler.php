<?php 
$errors = "";
$myemail = "alex@grace6.plus.com";
if(empty($_POST["inputName"])  || 
   empty($_POST["inputCompany"]) || 
   empty($_POST["inputEmail"]) || 
   empty($_POST["inputPhone"]) || 
   empty($_POST["inputMessage"]))
{
    $errors .= "\n Error: All fields are required";
}

$name = $_POST["inputName"]; 
$company = $_POST["inputCompany"]; 
$email = $_POST["inputEmail"]; 
$phone = $_POST["inputPhone"]; 
$message = $_POST["inputMessage"];
$callback = $_POST["inputCallBack"]; 

if (!preg_match(
"/^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,3})$/i", 
$email))
{
    $errors .= "\n Error: Invalid email address";
}

if( empty($errors))
{
	$to = $myemail; 
	$email_subject = "HireAlexGrace contact: $name, $company";    
	$email_body = "Message from HireAlexGrace.com \n Name: $name \n Company: $company \n Email: $email \n Phone: $phone \n Scheduled Callback: $callback \n Message: \n $message";
	$headers = "From: $myemail\n"; 
	$headers .= "Reply-To: $email";
	
	$success =  mail($to,$email_subject,$email_body,$headers);
} 

if ($success && $errors == ""){
   $response_array['status'] = 'success';
   $error = 'false';    
}else{
    $error = 'true';
    $response_array['status'] = 'error';
}
header('Content-type: application/json');
echo json_encode($response_array);
?>