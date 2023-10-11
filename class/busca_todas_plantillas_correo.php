<?php
//Activa las notificaciones de error de php
/*
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
*/

//Desactiva todos las notificaciones de error de PHP
error_reporting(0);
 
require 'conexion.php';
require 'funciones.php';
require 'var_sesion.php';

global $id_user;
global $nom_user;
global $rol_user;
 
global $mysqli;

if($id_user == null || $id_user == '' || $nom_user == null || $nom_user == '' || $rol_user == null || $rol_user == ''){  //Validacion de sesion si es null o vacio
	header("Location: index.php");                     //Direccionando a index
	die();                                             //Muere proceso
}

$tabla = [];    //Generando arreglo, que despues se convertira en matriz de arreglos

if($result_plantilla = $mysqli->query(" SELECT AP.id_camp_plantilla, AP.nom_plantilla, AP.asunto, date_format(AP.fecha_creacion, '%d-%m-%Y') AS fecha, time(AP.fecha_creacion) AS hora,
                                        CASE WHEN CC.fk_id_camp_plantilla = AP.id_camp_plantilla THEN SUM(CC.enviado) ELSE '0' END AS pendientes_enviar
                                        FROM campaña_plantilla AP 
                                        INNER JOIN usuarios US ON US.id_usuario = AP.fk_id_usuario
                                        INNER JOIN campaña_correo CC ON AP.id_camp_plantilla = CC.fk_id_camp_plantilla  
                                        WHERE US.id_usuario = '".$id_user."' AND CC.enviado = 1
                                        GROUP BY AP.id_camp_plantilla
                                      ")) 
{   
	 
	while($fila = $result_plantilla->fetch_assoc()){   //Filas de cada consulta se almacenan como arreglo en el arreglo tabla (arreglo de arreglos)
		$tabla[] = [$fila["pendientes_enviar"], $fila["nom_plantilla"], $fila["asunto"], $fila["fecha"]." - ".$fila["hora"],
                '<button class="button clr-ver-plant btn_sombra" type="button" id="btn_enviar_correo" value="'.$fila["id_camp_plantilla"].'">Enviar</button>'
                ];
	}

}else{    //Si consulta a la BD falla
	$tabla = 0;
} 
	
echo json_encode($tabla);     //Matriz de arreglo codificado como Json para devolverlo
?>