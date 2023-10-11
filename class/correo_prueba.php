<?php  
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require 'conexion.php';
require 'funciones.php';
require 'var_sesion.php';
require("../libs/PHPMailer-master/src/PHPMailer.php");
require("../libs/PHPMailer-master/src/SMTP.php");
require("../libs/PHPMailer-master/src/Exception.php");
require("../libs/vendor/autoload.php");

global $id_user;
global $nom_user;
global $rol_user;

if($id_user == null || $id_user == '' || $nom_user == null || $nom_user == '' || $rol_user == null || $rol_user == ''){  //Validacion de sesion si es null o vacio
    header("Location: index.php");                     //Direccionando a index
    die();                                             //Muere proceso
  }


$correo = $_REQUEST['email'];                //Para quien se enviará
$asunto = $_REQUEST['asunto'];               //Asunto
$mensaje = $_REQUEST['box_mensaje'];         //Cuerpo del mensaje

        $mail = new PHPMailer\PHPMailer\PHPMailer();
        $mail->IsSMTP();                                  // enable SMTP
        $mail->SMTPAuth = true;                           // authentication enabled
        $mail->SMTPSecure = 'ssl';                        // secure transfer enabled REQUIRED 
        $mail->Host = "smtp.gmail.com";
        $mail->Port = 465;                                // or 587    
        $mail->IsHTML(true);
        $mail->Username = 'mailpuma@cuaieed.unam.mx';    // Nombre de usuario o email de donde se envia
        $mail->Password = 'jgjiceyehvrbqpwe';             // Contraseña
        $mail->SetFrom('mailpuma@cuaieed.unam.mx');      //Cuenta de correo de donde se envia

        $mail->Subject = $asunto;                       //Asunto del correo
        $mail->Body = $mensaje;                         //cuerpo del correo
            
        $mail->AddAddress($correo);                         //Direccion destino
        // $archivo = 'pendientes_PODCAST.txt';                //Adjuntar archivo 1
        // $archivo_2 = 'pasos_configuracion.docx';            //Adjuntr archivo 2
        // $mail->AddAttachment($archivo);
        // $mail->AddAttachment($archivo_2);
        $mail->CharSet = 'UTF-8';
        $resp = $mail->Send();
            
        if ($resp){      //Ejecutando Query y validando respuesta
            echo "correo_enviado";       
                    
        } else {       //Respuesta de Query fue erronea
            echo "error";
        }

?>