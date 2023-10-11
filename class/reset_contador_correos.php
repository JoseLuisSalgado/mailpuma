<?php
require 'var_sesion.php';

//session_start(); // incio de uso de sesiones.
global $id_user;
global $nom_user;
global $rol_user;
global $mysqli;

if($id_user == null || $id_user == '' || $nom_user == null || $nom_user == '' || $rol_user == null || $rol_user == ''){  //Validacion de sesion si es null o vacio
    header("Location: index.php");                     //Direccionando a index
    die();                                             //Muere proceso
}

//Activar notificaciones de error de PHP
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

$_SESSION['total_enviados'] = 0;
if($_SESSION['total_enviados'] == 0){
    echo "contador_reseteado";
}else{
    echo "error";
}
?>