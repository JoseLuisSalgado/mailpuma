<?php
require 'conexion.php';
require 'funciones.php';
require 'var_sesion.php';
require("../libs/PHPMailer-master/src/PHPMailer.php");
require("../libs/PHPMailer-master/src/SMTP.php");
require("../libs/vendor/autoload.php");

//session_start(); // incio de uso de sesiones.
global $id_user;
global $nom_user;
global $rol_user;
global $mysqli;
$_SESSION["total_enviados"] = 0;



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

$servicio_mail = $_REQUEST["mail_service"];
$usuario_correo = $_REQUEST["user_mail"];
$contraseña = $_REQUEST["password"];
$id_camp_plantilla = $_REQUEST["id_camp_plantilla"];

$tabla = [];                      //Generando arreglo, que despues se convertira en matriz de arreglos
$tabla[0] = 0;                    //Posicion de contador de envio de correos
$tabla[1] = "";                   //Posicion para indicar estatus de envio de correos
$enviar_correos = false;
 
/*
$tabla[] = $servicio_mail;
$tabla[] = $usuario_correo;
$tabla[] = $contraseña;
$tabla[] = $id_camp_plantilla;
*/

      //Preguntar Existe correo
      $id_log = 0;
//Consulta para verificar si la cuenta de correo ya tiene mas de 24 hrs que envio correos
$result_total_correos = $mysqli->query("SELECT id_log_envio FROM log_envios WHERE correo = '".$usuario_correo."' AND estatus_24hrs = 1");
while($total_correos = $result_total_correos->fetch_assoc()){   //Filas de cada consulta se almacenan como arreglo en el arreglo tabla (arreglo de arreglos)
    $id_log = $total_correos["id_log_envio"];
}

if($id_log == 0){
    $stmt = $mysqli->prepare("INSERT INTO log_envios (correo, total_enviados, estatus_24hrs) VALUES ('".$usuario_correo."','0','1') ");
    $result = $stmt->execute();
    $id_log = $mysqli->insert_id;
    $stmt->close();

    if ($result){              //Ejecutando Query y validando respuesta
        $enviar_correos = true;
    } else { //Respuesta de Query fue erronea 
        $tabla[1] = "error_envio";    //Asignado estatus de envio de correos
    }
}else{
    $enviar_correos = true;
}



if($enviar_correos){   //bandera para enviar correos
    //Consulta para saber cuantos correos no han sido enviados
    if($result_pendientes_correos = $mysqli->query("SELECT CC.id_camp_correo, CC.correo, CP.asunto, CP.mensaje, CC.dato1, CC.dato2, CC.dato3, CC.dato4, CC.dato5
                                                    FROM campaña_plantilla CP 
                                                    LEFT JOIN campaña_correo CC ON CC.fk_id_camp_plantilla = CP.id_camp_plantilla
                                                    WHERE CC.enviado = 1 AND CP.id_camp_plantilla = ".$id_camp_plantilla." limit 1500
                                                  "))
    {   

        while($pendientes_envio = $result_pendientes_correos->fetch_assoc()){   //Filas de cada consulta se almacenan como arreglo en el arreglo tabla (arreglo de arreglos)

            //Si contador es multiplo de 70, entonces hay un sleep, esto con el fin de enviar bloques de 70 correos y esperar a que la cuenta no se bloqueé
            if($tabla[0] == 70 || $tabla[0] == 140 || $tabla[0] == 210 || $tabla[0] == 280 || $tabla[0] == 350 || $tabla[0] == 420 || $tabla[0] == 490 || $tabla[0] == 560 || $tabla[0] == 630 || $tabla[0] == 700 || $tabla[0] == 770 || $tabla[0] == 840 || $tabla[0] == 910 || $tabla[0] == 980 || $tabla[0] == 1050 || $tabla[0] == 1120 || $tabla[0] == 1190 || $tabla[0] == 1260 || $tabla[0] == 1330 || $tabla[0] == 1400 || $tabla[0] == 1470 || $tabla[0] == 1540){
                sleep(180);  //Espera de 100 segundos
            }
            //$tabla[] = $pendientes_envio["id_camp_correo"];
            //$tabla[] = $pendientes_envio["correo"];
            //$tabla[] = $pendientes_envio["asunto"];
            //$tabla[] = $pendientes_envio["mensaje"];
            //$tabla[] = $pendientes_envio["dato1"];
            //$tabla[] = $pendientes_envio["dato2"];
            //$tabla[] = $pendientes_envio["dato3"];
            //$tabla[] = $pendientes_envio["dato4"];
            //$tabla[] = $pendientes_envio["dato5"];

            $mensaje = $pendientes_envio["mensaje"];        //Almacenando el mensaje de BD en variable local

            $mensaje = str_replace("{dato1}", $pendientes_envio["dato1"], $mensaje);      //Busca los datos de llaves {} y reemplaza el valor de BD asignado a dicho dato
            $mensaje = str_replace("{dato2}", $pendientes_envio["dato2"], $mensaje);
            $mensaje = str_replace("{dato3}", $pendientes_envio["dato3"], $mensaje);
            $mensaje = str_replace("{dato4}", $pendientes_envio["dato4"], $mensaje);
            $mensaje = str_replace("{dato5}", $pendientes_envio["dato5"], $mensaje);

            $tabla[2] = $mensaje;

            $mail = new PHPMailer\PHPMailer\PHPMailer();
            $mail->isSMTP();
            $mail->SMTPAuth = true;
            $servidor_correo = $servicio_mail;        //Servicio de correo que eligio usuario 
            if($servidor_correo == 1 ){               //Servidor de correo es Gmail
                $mail->SMTPSecure = 'ssl';
                $mail->Host = 'smtp.gmail.com';
                $mail->Port = 465; 
            }else if ($servidor_correo == 2){         //Servidor de correo es Outlook
                $mail->SMTPSecure = 'STARTTLS';
                $mail->Host = 'smtp.office365.com';    //smtp-mail.outlook.com
                $mail->Port = 587;
            }

            $mail->IsHTML(true);
            $mail->Username = $usuario_correo;
            $mail->Password = $contraseña;
            $mail->SetFrom($usuario_correo);

            //$mail->setFrom('miemail@dominio.com', 'Sistema de Usuarios');
            $mail->Subject = $pendientes_envio["asunto"];
            $mail->Body    = $mensaje;

            $mail->addAddress($pendientes_envio["correo"]);
            $mail->CharSet = 'UTF-8';
            $enviado = $mail->Send();

            if($enviado){ 

                //Preparando Query para actualizar estatus de envio de correo en BD
                $stmt = $mysqli->prepare("UPDATE campaña_correo SET enviado = '0' WHERE id_camp_correo = ?");
                $stmt->bind_param("s", $pendientes_envio["id_camp_correo"]);    

                if ($stmt->execute()){                 //Ejecutando Query y validando respuesta
                    $stmt->close();
                    $tabla[0] = $tabla[0] + 1;         //Incrementando contador de envio de correos
                    $tabla[1] = "correos_enviados";    //Asignado estatus de envio de correos
                    //Insertar total enviados en log_envios
                    $_SESSION["total_enviados"] = $tabla[0];     //Asignando contador de correos enviados a variable de session (será leida por la vista)

                    //Se actualiza el registro de BD de tabla log_envios con el contador de correos enviados
            
                    $stmt = $mysqli->prepare("UPDATE log_envios SET total_enviados = total_enviados + 1 WHERE id_log_envio = '".$id_log."' ");
                    $result = $stmt->execute();
                    $stmt->close();
         
                if ($result){              //Ejecutando Query y validando respuesta
                    $tabla[1] = "correos_enviados";    //Asignado estatus de envio de correos
                } else { //Respuesta de Query fue erronea 
                    $tabla[1] = "error_envio";    //Asignado estatus de envio de correos
                }
             

                } else { //Respuesta de Query fue erronea 
                    $stmt->close();	
                    $tabla[1] = "error_envio";    //Asignado estatus de envio de correos
                }
            }
        }

        }else{    //Si consulta a la BD falla
            $tabla[1] = "error_envio";               
        }
    }
    
$tabla[2] = $id_log;
echo json_encode($tabla);     //Matriz de arreglo codificado como Json para devolverlo

?>