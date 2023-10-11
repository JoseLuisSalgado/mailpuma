<?php
require 'conexion.php';
require 'funciones.php';
require 'var_sesion.php';
require("../libs/PHPMailer-master/src/PHPMailer.php");
require("../libs/PHPMailer-master/src/SMTP.php");
require("../libs/vendor/autoload.php");

global $id_user; 
global $nom_user;
global $rol_user;

if($id_user == null || $id_user == '' || $nom_user == null || $nom_user == '' || $rol_user == null || $rol_user == ''){  //Validacion de sesion si es null o vacio
    header("Location: index.php");                     //Direccionando a index
    die();                                             //Muere proceso
}

//Activar notificaciones de error de PHP
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

//Desactiva todos las notificaciones de error de PHP
//error_reporting(0);

global $mysqli;

$servicio_mail = $_REQUEST["mail_service"];
$usuario_correo = $_REQUEST["user_mail"];
$contraseña = $_REQUEST["password"];
$id_camp_plantilla = $_REQUEST["id_camp_plantilla"];
 
$tabla = [];                      //Generando arreglo, que despues se convertira en matriz de arreglos
$tabla[0] = 0;                    //Posicion de contador de envio de correos
$tabla[1] = "";                   //Posicion para indicar estatus de envio de correos
 
/*
$tabla[] = $servicio_mail;
$tabla[] = $usuario_correo;
$tabla[] = $contraseña;
$tabla[] = $id_camp_plantilla;
*/

//Consulta para saber cuantos correos no han sido enviados
if($result_pendientes_correos = $mysqli->query("SELECT CC.id_camp_correo, CC.correo, CP.asunto, CP.mensaje, CC.dato1, CC.dato2, CC.dato3, CC.dato4, CC.dato5
                                                FROM campaña_plantilla CP 
                                                LEFT JOIN campaña_correo CC ON CC.fk_id_camp_plantilla = CP.id_camp_plantilla
                                                WHERE CC.enviado = 1 AND CP.id_camp_plantilla = ".$id_camp_plantilla." limit 1450
                                            "))
{   
    while($pendientes_envio = $result_pendientes_correos->fetch_assoc()){   //Filas de cada consulta se almacenan como arreglo en el arreglo tabla (arreglo de arreglos)
        /*
        $tabla[] = $pendientes_envio["id_camp_correo"];
        $tabla[] = $pendientes_envio["correo"];
        $tabla[] = $pendientes_envio["asunto"];
        $tabla[] = $pendientes_envio["mensaje"];
        $tabla[] = $pendientes_envio["dato1"];
        $tabla[] = $pendientes_envio["dato2"];
        $tabla[] = $pendientes_envio["dato3"];
        $tabla[] = $pendientes_envio["dato4"];
        $tabla[] = $pendientes_envio["dato5"];
        */
          
        $mail = new PHPMailer\PHPMailer\PHPMailer();
        $mail->isSMTP();
        $mail->SMTPAuth = true;
        $mail->SMTPSecure = 'ssl';
        $mail->Host = 'smtp.gmail.com';
        $mail->Port = 465;
        $mail->IsHTML(true);
          
        $mail->Username = $usuario_correo;
        $mail->Password = $contraseña;
        $mail->SetFrom($usuario_correo);
    
        //$mail->setFrom('miemail@dominio.com', 'Sistema de Usuarios');
        $mail->Subject = $pendientes_envio["asunto"];
        $mail->Body    = $pendientes_envio["mensaje"];
    
        $mail->addAddress($pendientes_envio["correo"]);
        $mail->CharSet = 'UTF-8';
        $enviado = $mail->Send();

        if($enviado){ 
            
            //Preparando Query para actualizar estaus de envio de correo en BD
            $stmt = $mysqli->prepare("UPDATE campaña_correo SET enviado = '0' WHERE id_camp_correo = ?");
            $stmt->bind_param("s", $pendientes_envio["id_camp_correo"]);    
                
            if ($stmt->execute()){                 //Ejecutando Query y validando respuesta
                $stmt->close();
                $tabla[0] = $tabla[0] + 1;         //Incrementando contador de envio de correos
                $tabla[1] = "correos_enviados";    //Aignado estatus de envio de correos

            } else { //Respuesta de Query fue erronea 
                $stmt->close();	
                $tabla[1] = "error";    //Aignado estatus de envio de correos
            }
        }
    }

}else{    //Si consulta a la BD falla
    $tabla[1] = "error";                //
} 

echo json_encode($tabla);     //Matriz de arreglo codificado como Json para devolverlo
?>