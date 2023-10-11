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
$usuario = $_REQUEST["user"];
$pass_hash = hashPassword($_REQUEST["password"]);       //Encriptando password
$correo = $_REQUEST["email"];
$entidad = $_REQUEST["entidad"];

//Query para buscar usuario en BD
$stmt = $mysqli->prepare("SELECT id_usuario FROM usuarios WHERE usuario = ? LIMIT 1");
$stmt->bind_param("s", $usuario);
$stmt->execute();
$stmt->store_result();
$num = $stmt->num_rows;
$stmt->close();
 
//Si usuario no existe en BD, se INSERTA en BD
if ($num == 0){

	$tipo = 2;      //Variables para definir tipo de usuario, 1 = administrador, 2 = usuario
	
	//Preparando Query para registrar usuario en BD
	$stmt = $mysqli->prepare("INSERT INTO usuarios (usuario, contrasena, correo, entidad, tipo_usuario) VALUES(?,?,?,?,?)");
	$stmt->bind_param('sssss', $usuario, $pass_hash, $correo, $entidad, $tipo);
		
		if ($stmt->execute()){              //Ejecutando Query y validando respuesta
			if($mysqli->insert_id > 0){    //Validando si se inserto el usuario en BD por ID, en caso contrario devuelve error
				$stmt->close();
				$resp = "user_agregado";
			}else{
				$stmt->close();
				$resp = "error";
			} 
			
		} else { //Respuesta de Query fue erronea 
			$resp = "error";	
		}	

} else { //Cuando usuario ya existe en BD
	$resp = "user_existe";
}

echo $resp; 

?>