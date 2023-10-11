<?php
    session_start(); // incio de uso de sesiones.
    $id_user = $_SESSION['id_usuario'];
    $nom_user = $_SESSION['nom_usuario'];
    $rol_user = $_SESSION['tipo_usuario'];

?>