<?php
session_start();
session_unset();    //libera todas las variables de sesión actualmente registradas.
session_destroy();  //Destruye toda la información registrada de una sesión
header("location: ../index.php");
?>