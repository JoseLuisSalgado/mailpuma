$(document).ready(function(){
    var mail_valido = false;        //Bandera para validar correo sea valido

    //Presionar tecla enter dentro de inputs de formulario, se validan datos
    $("#registerUser, #registerEmail, #registerPass, #registerPassConfirm").keypress(function(e) {
        var code = (e.keyCode ? e.keyCode : e.which); 
        if(code == 13){ 
            validar_datos_crear_cuenta();
            return false; 
        } 
    });

    //Validacion correo en tiempo real, (Lo realiza caracter por caracter al ser ingresados por usuario)
    $('#registerEmail').on('keyup', function() {
        var re = /([A-Z0-9a-z_-][^@])+?@[^$#<>?]+?\.[\w]{2,4}/.test(this.value);
        $("#msj_email").empty();
        if(!re) {   //Correo no valido
            $('#si_email').addClass('d-none');
            $('#no_email').removeClass('d-none');
            mail_valido = false;

        } else {   //Correo es valido
            $('#si_email').removeClass('d-none');
            $('#no_email').addClass('d-none');
            mail_valido = true;
        }
    });  //Fin validacion correo en tiempo real
    
    //Boton registrar usuario, valida los datos del formulari
    $("#btn_regis_user").on("click", function(){
        validar_datos_crear_cuenta();
    }); 

    //Obtiene datos de inputs, valida y envia datos a backend para su verificacion de registro de usuario (crear cuenta)
    function validar_datos_crear_cuenta(){
        let usuario = $("#registerUser").val();
        let correo = $("#registerEmail").val();
        let contraseña = $("#registerPass").val();
        let rep_contraseña = $("#registerPassConfirm").val();
        let entidad = $("#entidad").val();
        
        //Validando campos de formulario no sean vacios y tengan un minimo de caracteres
        if(usuario != ""){                                          //Validando campo usuario no sea vacio 
            if(usuario.length >= 8){                                //Validando campo usuario contengo minimo 8 caracteres
                if(correo != ""){                                   //Validando campo correo no sea vacio
                    if(contraseña != ""){                           //Validando campo contraseña no sea vacio
                        if(rep_contraseña != ""){                   //Validando campo repetir contraseña no sea vacio
                            if(contraseña.length >= 8){                     //Validando campo contraseña contenga minimo 8 caracteres
                                if(rep_contraseña.length >= 8){             //Validando campo repeticion de contraseña contenga minimo 8 caracteres
                                    if(contraseña === rep_contraseña){      //Validando campo contraseña coincidan con repeticion de contraseña
                                        
                                        //Validando caracteres especiales en campo "Nombre de usuario"
                                        if(usuario.indexOf("@") == -1 && usuario.indexOf("^") == -1 && usuario.indexOf("+") == -1 && usuario.indexOf("?") == -1
                                        && usuario.indexOf("[") == -1 && usuario.indexOf("]") == -1 && usuario.indexOf("!") == -1 && usuario.indexOf("'") == -1
                                        && usuario.indexOf("·") == -1 && usuario.indexOf("$") == -1 && usuario.indexOf("%") == -1 && usuario.indexOf("&") == -1
                                        && usuario.indexOf("/") == -1 && usuario.indexOf("(") == -1 && usuario.indexOf(")") == -1 && usuario.indexOf("=") == -1
                                        && usuario.indexOf("¿") == -1 && usuario.indexOf("¡") == -1 && usuario.indexOf("*") == -1 && usuario.indexOf("{") == -1
                                        && usuario.indexOf("}") == -1 && usuario.indexOf(",") == -1 && usuario.indexOf(":") == -1 && usuario.indexOf(";") == -1
                                        && usuario.indexOf("#") == -1 && usuario.indexOf("<") == -1 && usuario.indexOf(">") == -1 && usuario.indexOf("º") == -1
                                        && usuario.indexOf('"') == -1){
                                        
                                            //Validando caracteres especiales en campo "Contraseña"
                                            if(contraseña.indexOf("^") == -1 && contraseña.indexOf("+") == -1 && contraseña.indexOf('"') == -1 && contraseña.indexOf("º") == -1
                                            && contraseña.indexOf("[") == -1 && contraseña.indexOf("]") == -1 && contraseña.indexOf("'") == -1 && contraseña.indexOf(">") == -1 
                                            && contraseña.indexOf("·") == -1 && contraseña.indexOf("$") == -1 && contraseña.indexOf("%") == -1 && contraseña.indexOf("&") == -1
                                            && contraseña.indexOf("/") == -1 && contraseña.indexOf("(") == -1 && contraseña.indexOf(")") == -1 && contraseña.indexOf("=") == -1
                                            && contraseña.indexOf("*") == -1 && contraseña.indexOf("{") == -1 && contraseña.indexOf("<") == -1 && contraseña.indexOf("#") == -1
                                            && contraseña.indexOf("}") == -1 && contraseña.indexOf(",") == -1 && contraseña.indexOf(":") == -1 && contraseña.indexOf(";") == -1
                                            ){       
                                                if(mail_valido){                    //Validando que el email sea valido
                                                   
                                                    /*** AJAX ***/
                                                    $.ajax({
                                                        method:"POST",
                                                        url: "../class/crear_usuario.php", 
                                                        data:{ 
                                                            user: usuario,
                                                            email: correo,
                                                            password: contraseña,
                                                            entidad: entidad
                                                        },  
                                                        success: function(data){  //Respuesta servidor
                                                     
                                                            //Si usuario existe en BD, entonces notifica para captura de nuevo usuario diferente
                                                            if(data == "user_existe"){    //Usuario ya existe en sistema
                                                                $("#registerUser").focus();
                                                                Swal.fire({
                                                                    title: 'El usuario "'+ usuario +'" ya existe en sistema',
                                                                    text: "Por favor captura un usuario diferente para un registro exitoso.",
                                                                    confirmButtonText: 'Aceptar',
                                                                    icon: 'info',
                                                                    confirmButtonColor: '#dc3741'
                                                                })
                                                                        
                                                                //Si usuario se agrego en BD exitosamente
                                                            }else if(data == "user_agregado"){
                                                                Swal.fire({
                                                                    title: 'Se ha creado la cuenta de "'+ usuario +'" de forma exitosa',
                                                                    confirmButtonText: 'Aceptar',
                                                                    icon: 'success',
                                                                    confirmButtonColor: '#28a745'
                                                                })
                                                                
                                                                $('#registerUser').val("");       //Limpiando campos de texto
                                                                $('#registerEmail').val("");
                                                                $('#registerPass').val("");
                                                                $('#registerPassConfirm').val("");
                                                                
                                                                $("#si_email").addClass("d-none");    //Ocultando alerta de campo de correo
                                                                $("#no_email").addClass("d-none");
                                                                
                                                                //Si hubo error al intentar registro en BD
                                                            }else if(data == "error"){
                                                                Swal.fire({
                                                                    title: 'ERROR, se ha producido un error en el sistema, favor de intentarlo más tarde.',
                                                                    confirmButtonText: 'Aceptar',
                                                                    icon: 'error',
                                                                    confirmButtonColor: '#CB383B'
                                                                })
                                                            }
                                                        } //Fin respuesta servidor
                                                    });  //Fin ajax
                                                    
                                                }else{    //El email no es valido
                                                    $("#registerEmail").focus();
                                                    Swal.fire({
                                                        title: 'El correo no es válido',
                                                        text: 'Favor de verificar que contenga "@" y "." ',
                                                        confirmButtonText: 'Aceptar',
                                                        icon: 'error',
                                                        confirmButtonColor: '#dc3741'
                                                    })
                                                }   //Fin validacion de email valido
                                            

                                            }else{    //El campo "Contraseña" contiene caracterese especiales
                                                $("#registerPass").focus();
                                                Swal.fire({
                                                    title: 'No se aceptan caracteres esepciales en el campo "Contraseña"',
                                                    text: "Favor de verificarlo",
                                                    confirmButtonText: 'Aceptar',
                                                    icon: 'warning',
                                                    confirmButtonColor: '#dc3741'
                                                })
                                            }   //Fin validacion de caracteres especiales campo "Contraseña"
                        
                                        }else{    //El campo "nombre de usuario" contiene caracterese especiales
                                            $("#registerUser").focus();
                                            Swal.fire({
                                                title: 'No se aceptan caracteres esepciales en el campo "Usuario"',
                                                text: "Favor de verificarlo",
                                                confirmButtonText: 'Aceptar',
                                                icon: 'warning',
                                                confirmButtonColor: '#dc3741'
                                            })
                                        }   //Fin validacion de caracteres especiales campo "Nombre usuario"
                                        
                
                                    }else{   //La contraseña y la confirmacion de contraseña no coinciden
                                        $("#registerPassConfirm").focus();
                                        Swal.fire({
                                            title: 'La "Contraseña" y "Confirmación de contraseña" no coinciden',
                                            text: "Favor de registrar nuevamente las contraseñas y verificar que sean iguales.",
                                            confirmButtonText: 'Aceptar',
                                            icon: 'warning',
                                            confirmButtonColor: '#dc3741'
                                        })
                                    }   //Fin Validacion contraseñas coincidan (sean iguales)

                                }else{   //Campo repetir contraseña contiene menos de 8 caracteres
                                    $("#registerPassConfirm").focus();
                                    Swal.fire({
                                        title: 'El campo  "Confirmar Contraseña" no contiene el mínimo de caracteres',
                                        text: "Favor de confirmar la contraseña con un mínimo de 8 caracteres.",
                                        confirmButtonText: 'Aceptar',
                                        icon: 'warning',
                                        confirmButtonColor: '#dc3741'
                                    })
                                }  //Fin validacion campo repetir contraseña con menos de 8 caracteres
                            }else{   //Campo contraseña contiene menos de 8 caracteres
                                $("#registerPass").focus();
                                Swal.fire({
                                    title: 'El campo "Contraseña" no contiene el mínimo de caracteres',
                                    text: "Favor de registrar la contraseña con un mínimo de 8 caracteres.",
                                    confirmButtonText: 'Aceptar',
                                    icon: 'warning',
                                    confirmButtonColor: '#dc3741'
                                })
                            }   //Fin validacion campo contraseña con menos de 8 caracteres
                        }else{   //Campo contraseña repetida es vacio
                            $("#registerPassConfirm").focus();
                            Swal.fire({
                                title: 'El campo "Confirmar Contraseña" está vacio',
                                text: "Favor de registrar la confirmación de contraseña.",
                                confirmButtonText: 'Aceptar',
                                icon: 'warning',
                                confirmButtonColor: '#dc3741'
                            })
                        }  //Fin Validacion campo repetir contraseña vacio
                    }else{    //Campo contraseña es vacio
                        $("#registerPass").focus();
                        Swal.fire({
                            title: 'El campo "Contraseña" está vacio',
                            text: "Favor de registrar la contraseña.",
                            confirmButtonText: 'Aceptar',
                            icon: 'warning',
                            confirmButtonColor: '#dc3741'
                        })
                    }   //Fin Validacion campo contraseña vacio
                }else{    //Campo correo es vacio
                    $("#registerEmail").focus();
                    Swal.fire({
                        title: 'El campo "Correo" está vacio',
                        text: "Favor de registrar el correo.",
                        confirmButtonText: 'Aceptar',
                        icon: 'warning',
                        confirmButtonColor: '#dc3741'
                    })
                }   //Fin Validacion campo correo vacio
            }else{   //Campo usuario contiene menos de 8 caracteres
                $("#registerUser").focus();
                Swal.fire({
                    title: 'El campo "Usuario" no contiene el mínimo de caracteres',
                    text: "Favor de registrar el usuario con un mínimo de 8 caracteres.",
                    confirmButtonText: 'Aceptar',
                    icon: 'warning',
                    confirmButtonColor: '#dc3741'
                })
            }   //Fin Validacion campo usuario minimo de caracteres
        }else{    //Campo usuario es vacio
            $("#registerUser").focus();
            Swal.fire({
                title: 'El campo "Usuario" está vacio',
                text: "Favor de registrar el usuario.",
                confirmButtonText: 'Aceptar',
                icon: 'warning',
                confirmButtonColor: '#dc3741'
            })
        }  //Fin Validacion campo usuario vacio

    }   //Fin funcion validar_datos_crear_cuenta

});   //Fin $(Document).ready(function)