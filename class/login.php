<?php
//Activa los errores de php
/*ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);*/

//Desactiva todos las notificaciones de error de PHP
error_reporting(0);
	
require 'conexion.php';
require 'funciones.php';

global $mysqli;

$stmt = $mysqli->prepare("UPDATE log_envios SET estatus_24hrs = 0 WHERE fecha <= NOW() - INTERVAL 1 DAY");     //Resetea variable de estatus_24 hrs a o hrs despues de haber pasado 24hrs

if ($stmt->execute()){              //Ejecutando Query y validando respuesta
	$resp='';

	$user_temp = htmlentities($_REQUEST["usuario"]);         //Obteniendo variables REQUEST y limpiando de caracrteres especiales
	$pass_temp = htmlentities($_REQUEST["contrasena"]);
	$valid_recaptcha = $_REQUEST["captcha"];               //Valor de recaptcha para evitar valido, asi eviatr ataque directo en este archivo

	$usuario = filter_var($user_temp, FILTER_SANITIZE_STRING);
	$pass = filter_var($pass_temp, FILTER_SANITIZE_STRING);
	
	if($valid_recaptcha == "@&G_dT64c=rdWas%RsT85"){   //Validando que clave de recaptcha sea valido
 
		//Query para buscar usuario en BD por usuario de formulario 
		$stmt = $mysqli->prepare("SELECT id_usuario, usuario, contrasena, correo, tipo_usuario FROM usuarios WHERE usuario = ? LIMIT 1");
		$stmt->bind_param("s", $usuario);
		$stmt->execute();
		$stmt->store_result();
		$rows = $stmt->num_rows; 
 
		if($rows > 0) {   //Si usuario existe en BD
			
			$stmt->bind_result($id_usuario, $usuario, $pass_bd, $correo, $tipo_usuario); //Renombrando variables extraidas de bd
			$stmt->fetch();
			$validaPassw = password_verify($pass, $pass_bd);  //Comparando passwords si son iguales

			if($validaPassw){                       //Si password de BD es igual a password de formulario	
					
					session_start();                //Inicializando variables de session
					$_SESSION['id_usuario'] = $id_usuario;
					$_SESSION['nom_usuario'] = $usuario;
					$_SESSION['tipo_usuario'] = $tipo_usuario;
 
					$resp = '%Cp_S13&w1dx=D6bw_ERd';      //Este codigo indica que el acceso es correcto
					
			}else{                   //Password incorrecto
				$resp = 'G%s_dar!2xo#Scx_23asx';
			}
		} else {                     //Usuario no existe en BD
			$resp = 'G%s_dar!2xo#Scx_23asx';
		}
		
	}else{           //Recaptcha no es valido o no fue proporcionado por el usuario
		$resp = '!sEd_fY57Ds3&,Dr79A_2';
	}


} else { //Respuesta de Query fue erronea 
	$resp = 'G%s_dar!2xo#Scx_23asx';
}


echo $resp;


?>