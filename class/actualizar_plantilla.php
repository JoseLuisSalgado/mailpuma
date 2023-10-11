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

if($id_user == null || $id_user == '' || $nom_user == null || $nom_user == '' || $rol_user == null || $rol_user == ''){  //Validacion de sesion si es null o vacio
	header("Location: index.php");                     //Direccionando a index
	die();                                             //Muere proceso
}

global $mysqli;
$resp = "";
$actualizar_plantilla = false;    //Bandera para actulizar plantilla

//Obteniendo datos enviados de jquery(JSON)
$id_plantilla = $_REQUEST["id_plantilla"];
$nom_plantilla = $_REQUEST["namePlantilla"];
$asunto = $_REQUEST["asunto"];      
$mensaje = $_REQUEST["box_mensaje"];

//Query para buscar nombre de plantilla en BD
$stmt = $mysqli->prepare("SELECT id_plantilla FROM plantillas WHERE nom_plantilla = ? AND fk_id_usuario = ? LIMIT 1 ");
$stmt->bind_param("ss", $nom_plantilla, $id_user);
$stmt->execute();
$stmt->store_result();
$num = $stmt->num_rows;
$stmt->bind_result($id_plantilla_bd);    //Obteniendo y renombrando variable id_diplomado de BD
$stmt->fetch();
$stmt->close();

//Si nombre de plantilla no existe en BD, se ACTUALIZA en BD
if($num == 0){
    $actualizar_plantilla = true;
}else{
    if($num == 1){   //Si nombre de plantilla existe, entonces verificar si el registro es el mismo del que se desea actualizar la plantilla
        if($id_plantilla == $id_plantilla_bd){   //Id de plantilla de BD es igual al id de actualizacion de plantilla, entonces se procede con actualizacion
            $actualizar_plantilla = true;
        }else{   //Id de plantillas no coinciden, por lo tanto el nombre de plantilla le pertenece a otra plantilla y no es posible actualizacion
            $actualizar_plantilla = false;
            $resp = "nom_plant_existe";
        }
    }
}

if($actualizar_plantilla == true){      
        //Preparando Query para actualizar plantilla en BD
        $stmt = $mysqli->prepare("UPDATE plantillas SET nom_plantilla = ?, asunto = ?, mensaje = ? WHERE id_plantilla = ?");
        $stmt->bind_param("ssss", $nom_plantilla, $asunto, $mensaje, $id_plantilla);    
            
        if ($stmt->execute()){              //Ejecutando Query y validando respuesta
            $stmt->close();
            $resp = "plantilla_actualizada";
        } else { //Respuesta de Query fue erronea 
            $stmt->close();
            $resp = "error";	
        }	
}




echo $resp; 

?>