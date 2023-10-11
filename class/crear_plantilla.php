<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

//Desactiva todos las notificaciones de error de PHP
//error_reporting(0);

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

global $mysqli;
$resp = ""; 

//Obteniendo datos enviados de jquery(JSON)
$nom_plantilla = $_REQUEST["namePlantilla"];
$asunto = $_REQUEST["asunto"];     
$mensaje = $_REQUEST["box_mensaje"];

//Query para buscar nombre de plantilla en BD
$stmt = $mysqli->prepare("SELECT nom_plantilla FROM plantillas WHERE nom_plantilla = ? AND fk_id_usuario = ?");
$stmt->bind_param("ss", $nom_plantilla, $id_user);
$stmt->execute();
$stmt->store_result();
$num = $stmt->num_rows;
$stmt->close();

//Si nombre de plantilla no existe en BD, se INSERTA en BD
if ($num < 1){
	
	//Preparando Query para registrar plantilla en BD
	$stmt = $mysqli->prepare("INSERT INTO plantillas (fk_id_usuario , nom_plantilla, asunto, mensaje) VALUES(?,?,?,?)");
	$stmt->bind_param('ssss', $id_user, $nom_plantilla, $asunto, $mensaje);
		
		if ($stmt->execute()){              //Ejecutando Query y validando respuesta
			if($mysqli->insert_id > 0){    //Validando si se inserto la plantilla en BD por ID, en caso contrario devuelve error
				$resp = "plantilla_agregada";
			}else{
				$resp = "error";
			} 
			$stmt->close();
		} else { //Respuesta de Query fue erronea 
            $stmt->close();
			$resp = "error";	

		}	

} else { //Cuando nombre de plantilla ya existe en BD
	$resp = "nom_plant_existe";
}

echo $resp; 


?>