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
global $mysqli;

if($id_user == null || $id_user == '' || $nom_user == null || $nom_user == '' || $rol_user == null || $rol_user == ''){  //Validacion de sesion si es null o vacio
	header("Location: index.php");                     //Direccionando a index
	die();                                             //Muere proceso
}

$id_plantilla_campaña = $_POST["id_plant"];

$tabla = [];    //Generando arreglo, que despues se convertira en matriz de arreglos

$stmt = $mysqli->prepare("SELECT fk_id_usuario, nom_plantilla, asunto, mensaje FROM campaña_plantilla WHERE id_camp_plantilla = ?");
$stmt->bind_param("s", $id_plantilla_campaña);

if ($stmt->execute()){              //Ejecutando Query y validando sea correcto su ejecucion
    $stmt->store_result();
    $stmt->bind_result($fk_id_usuario, $nom_plantilla, $asunto, $mensaje); //Renombrando variables extraidas de bd
    $stmt->fetch();

    $tabla[] = $fk_id_usuario;
    $tabla[] = $nom_plantilla;
    $tabla[] = $asunto;
    $tabla[] = str_replace("&quot;", "'", $mensaje);      //Encontrando &quot; en la cadena y reemplanzado por " comillas
    $tabla[] = $id_plantilla_campaña;


    $stmt->close();
    //$resp = "plantilla_eliminada";    
} else {                            //Hubo algun problema con la ejecucion del Query
    $stmt->close();
    $tabla[] = "error";	
}

echo json_encode($tabla);     //Matriz de arreglo codificado como Json para devolverlo
?>