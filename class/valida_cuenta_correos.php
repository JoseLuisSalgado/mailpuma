<?php
    require 'conexion.php';
	require 'funciones.php';
    require 'var_sesion.php';

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
 
$correo = $_REQUEST["user_mail"];

$tabla = [];    //Generando arreglo, que despues se convertira en matriz de arreglos

//Consulta para verificar si el correo ya tiene mas de 24 hrs que no ha enviado correos
if($result_total_correos = $mysqli->query("SELECT id_log_envio, total_enviados, DATE_FORMAT(DATE_ADD(fecha, INTERVAL 1 DAY),'%d/%m/%y a las %h:%i %p') AS fecha FROM log_envios WHERE correo = '".$correo."' AND estatus_24hrs = 1"))
{   
	while($total_correos = $result_total_correos->fetch_assoc())   //Filas de cada consulta se almacenan como arreglo en el arreglo tabla (arreglo de arreglos)

        if($total_correos != 0){     //Si encontraste un registros en la BD   
            $tabla[0] = "existe";
            $tabla[1] = $total_correos["total_enviados"];
            $tabla[2] = $total_correos["fecha"];
        }else{          //No encontro registro en BD
            $tabla[0] = "nulo";
        }
        
        /*
        //Consulta para saber cuantos correos no han sido enviados
        if($result_pendientes_correos = $mysqli->query("SELECT
                                                        CASE WHEN CC.fk_id_camp_plantilla = CP.id_camp_plantilla THEN SUM(CC.enviado) ELSE '0' END AS pendientes_enviar

                                                        FROM campaña_plantilla CP
                                                        LEFT JOIN campaña_correo CC ON CC.fk_id_camp_plantilla = CP.id_camp_plantilla
                                                        WHERE CP.id_camp_plantilla = ".$id_camp_plantilla."
                                                    "))
        {   
            while($total_pendientes = $result_pendientes_correos->fetch_assoc()){   //Filas de cada consulta se almacenan como arreglo en el arreglo tabla (arreglo de arreglos)
                $enviados = $total_correos["total_correos"] - $total_pendientes["pendientes_enviar"];
                $tabla[] = $total_correos["total_correos"];
                $tabla[] = $total_pendientes["pendientes_enviar"];
                $tabla[] = $enviados;
            }
        }else{    //Si consulta a la BD falla
            $tabla[] = "error";
        } 
        */
}else{    //Si consulta a la BD falla
    $tabla[0] = "error";
} 


echo json_encode($tabla);     //Matriz de arreglo codificado como Json para devolverlo
?>