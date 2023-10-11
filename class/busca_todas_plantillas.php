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

$tabla = [];    //Generando arreglo, que despues se convertira en matriz de arreglos

if($result_plantilla = $mysqli->query("SELECT PL.id_plantilla, US.usuario, PL.nom_plantilla, PL.asunto, PL.mensaje, date_format(PL.fecha_creacion, '%d-%m-%Y') as fecha
                                    FROM plantillas AS PL
                                    LEFT JOIN usuarios US ON US.id_usuario = PL.fk_id_usuario
                                    WHERE PL.fk_id_usuario = '".$id_user."'                                 
                                  "))
{    
	
	while($fila = $result_plantilla->fetch_assoc()){   //Filas de cada consulta se almacenan como arreglo en el arreglo tabla (arreglo de arreglos)
		$tabla[] = [$fila["nom_plantilla"], $fila["asunto"], $fila["fecha"],
                '<button class="button clr-edit-plant btn_sombra" type="button" id="btn_editar" value="'.$fila["id_plantilla"].'" style="padding: 0.8rem 1.25rem">Ver/Editar</button>',
                '<button class="button clr-delete-plant btn_sombra" type="button" id="btn_eliminar" name="'.$fila["nom_plantilla"].'" value="'.$fila["id_plantilla"].'" style="padding: 0.8rem 1.25rem">Eliminar</button>'
                ];
	}

}else{    //Si consulta a la BD falla
	$tabla = 0;
} 
	
echo json_encode($tabla);     //Matriz de arreglo codificado como Json para devolverlo
?>