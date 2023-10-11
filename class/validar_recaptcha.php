<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

//Desactiva todos las notificaciones de error de PHP
//error_reporting(0);

 
$respuesta = "";    

$ip = $_SERVER["REMOTE_ADDR"];
$captcha = $_POST['respuesta'];
$secretKey = '6Ld95L8iAAAAAAZgqX3ZI4RH5WzhLUu3O8csgsCI';

$response = file_get_contents("https://www.google.com/recaptcha/api/siteverify?secret={$secretKey}&response={$captcha}&remoteip={$ip}");

$atributos = json_decode($response, TRUE);

if ($atributos['success']) {
    $respuesta = "@&G_dT64c=rdWas%RsT85";   //Recaptcha valido
}else{
    $respuesta = "#F4_57dEc9T&39cTd=u2H";   //Recaptcha no valido
}

echo json_encode($respuesta);     //Devolviendo respuestas
?>

