<?php
	$mysqli=new mysqli("localhost","root","root","mail_puma");
	//$mysqli=new mysqli("localhost","admin","MmUZ9Hy6RbG4Czgj","mail_puma");
	
	if(mysqli_connect_errno()){
		echo 'Conexion Fallid: ', mysqli_connect_error();
		exit();
	}
?> 