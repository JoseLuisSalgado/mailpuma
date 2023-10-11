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
echo $resp = '';     

//Obteniendo datos enviados de jquery(JSON)
$id_plantilla = $_REQUEST["id_plantilla"];
	
//Preparando Query para eliminar plantilla en BD
$stmt = $mysqli->prepare("DELETE FROM plantillas WHERE id_plantilla = ?");
$stmt->bind_param('s', $id_plantilla);

if ($stmt->execute()){              //Ejecutando Query y validando sea correcto su ejecucion
    $stmt->close();
    $resp = "plantilla_eliminada";    
} else {                            //Hubo algun problema con la ejecucion del Query
    $stmt->close();
    $resp = "error";	
}

echo $resp; 

?>