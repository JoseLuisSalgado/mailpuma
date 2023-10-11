<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require 'conexion.php';
require 'funciones.php';
require 'var_sesion.php';
require("../libs/PHPMailer-master/src/PHPMailer.php");
require("../libs/PHPMailer-master/src/SMTP.php");
require("../libs/vendor/autoload.php");



    $cont = 0;
    

    while($cont != 100){
        echo "3";
        $mail = new PHPMailer\PHPMailer\PHPMailer();
        $mail->isSMTP();
        $mail->SMTPAuth = true;
        $mail->SMTPSecure = 'ssl';
        $mail->Host = 'smtp.gmail.com';
        $mail->Port = 465;
        $mail->IsHTML(true);
          
        $mail->Username = "no-reply2@cuaieed.unam.mx";
        $mail->Password = "tnchjifceynposue";
        $mail->SetFrom("no-reply2@cuaieed.unam.mx");
    
        //$mail->setFrom('miemail@dominio.com', 'Sistema de Usuarios');
        $mail->Subject = "hola";
        $mail->Body    = "hola";
    
        $mail->addAddress("jose_salgado@cuaieed.unam.mx");
        $mail->CharSet = 'UTF-8';
        $mail->Send();
        $cont = $cont +1;
    }

?>