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

$id_camp_plantilla = $_REQUEST["id_camp_plantilla"];
 
$tabla = [];    //Generando arreglo, que despues se convertira en matriz de arreglos

//Consulta para saber el total de correos
if($result_total_correos = $mysqli->query("SELECT count(id_camp_correo)  AS total_correos   
                                     FROM campaña_correo
                                     WHERE fk_id_camp_plantilla = ".$id_camp_plantilla."
                                    "))
{   
	while($total_correos = $result_total_correos->fetch_assoc())   //Filas de cada consulta se almacenan como arreglo en el arreglo tabla (arreglo de arreglos)
		
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

}else{    //Si consulta a la BD falla
    $tabla[] = "error";
} 

echo json_encode($tabla);     //Matriz de arreglo codificado como Json para devolverlo
?>