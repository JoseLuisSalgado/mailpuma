$(document).ready(function(){
    user_valido = false;;

    //Presionar tecla enter dentro de inputs de formulario, se validan datos
    $("#loginUser, #loginPass").keypress(function(e) {
        var code = (e.keyCode ? e.keyCode : e.which); 
        if(code == 13){ 
            validar_datos_login();
            return false; 
        } 
    });

    //Validacion de caracteres de usuario en tiempo real, (Lo realiza caracter por caracter al ser ingresados por usuario)
    /*
    $('#loginUser').on('keyup', function() {
        //var re = /([A-Z0-9a-z_-][^@])+?@[^$#<>?]+?\.[\w]{2,4}/.test(this.value);
        var re = /([A-Z0-9a-z_-])/.test(this.value);

        if(re) {   //Cadena es valida

            $('#user_correcto').removeClass('d-none');
            $('#user_incorrecto').addClass('d-none');
            user_valido = true;

        } else {   //Correo es valido
            $('#user_correcto').addClass('d-none');
            $('#user_incorrecto').removeClass('d-none');
            user_valido = false;
        }
        alert(user_valido);
    });  //Fin validacion correo en tiempo real
    */

    //Presionar boton "Ingresar" para validar datos de formulario
    $("#btn_ingresar").on("click", function(){
        validar_datos_login();
    });

    //Obtiene datos de inputs, valida y envia datos a backend para su verificacion de inicion de sesion de usuario
    function validar_datos_login(){
        var user = $("#loginUser").val();
        var pass = $("#loginPass").val();
   
        


        if(user != ""){                                          //Validando campo usuario no sea vacio
            if(pass != ""){                           //Validando campo contraseña no sea vacio 
                //Validando caracteres especiales en campo "Nombre de usuario"
                if(user.indexOf("@") == -1 && user.indexOf("^") == -1 && user.indexOf("+") == -1 && user.indexOf("?") == -1
                && user.indexOf("[") == -1 && user.indexOf("]") == -1 && user.indexOf("!") == -1 && user.indexOf("'") == -1
                && user.indexOf("·") == -1 && user.indexOf("$") == -1 && user.indexOf("%") == -1 && user.indexOf("&") == -1
                && user.indexOf("/") == -1 && user.indexOf("(") == -1 && user.indexOf(")") == -1 && user.indexOf("=") == -1
                && user.indexOf("¿") == -1 && user.indexOf("¡") == -1 && user.indexOf("*") == -1 && user.indexOf("{") == -1
                && user.indexOf("}") == -1 && user.indexOf(",") == -1 && user.indexOf(":") == -1 && user.indexOf(";") == -1
                && user.indexOf("#") == -1 && user.indexOf("<") == -1 && user.indexOf(">") == -1 && user.indexOf("º") == -1
                && user.indexOf('"') == -1){
                 
                    //Validando caracteres especiales en campo "Contraseña"
                    if(pass.indexOf("^") == -1 && pass.indexOf("+") == -1 && pass.indexOf('"') == -1 && pass.indexOf("º") == -1
                    && pass.indexOf("[") == -1 && pass.indexOf("]") == -1 && pass.indexOf("'") == -1 && pass.indexOf(">") == -1 
                    && pass.indexOf("·") == -1 && pass.indexOf("$") == -1 && pass.indexOf("%") == -1 && pass.indexOf("&") == -1
                    && pass.indexOf("/") == -1 && pass.indexOf("(") == -1 && pass.indexOf(")") == -1 && pass.indexOf("=") == -1
                    && pass.indexOf("*") == -1 && pass.indexOf("{") == -1 && pass.indexOf("<") == -1 && pass.indexOf("#") == -1
                    && pass.indexOf("}") == -1 && pass.indexOf(",") == -1 && pass.indexOf(":") == -1 && pass.indexOf(";") == -1
                    ){

                        
                        /***** VALIDANDO RECAPTCHA *****/
                        var response = grecaptcha.getResponse();   //Obteniendo valor del check del recaptcha
                
                        if(response != ""){      //Si el recaptcha fue palomeado
                        //if(true){
                            let valido = false;
                            /*** ajax para validar recaptcha ***/
                            $.ajax({
                                method:"POST",
                                url: "class/validar_recaptcha.php", 
                                data:{
                                    respuesta: response
                                },  
                                success: function(data){  //Respuesta servidor
                                    dato = JSON.parse(data);   //Decodificando JSON
                                    if(dato === "@&G_dT64c=rdWas%RsT85"){  //Recaptcha valido
                                    //if(true){
                            
                                        //Ajax
                                        $.ajax({
                                            method:"POST",
                                            url: "class/login.php", 
                                            data:{
                                                usuario: user,
                                                contrasena: pass,
                                                captcha: dato
                                                },   
                                            success: function(data){  //RESPUESTA DE SERVIDOR   
                                   
                                                //Si usuario y contraseña son correctos
                                                if(data == "%Cp_S13&w1dx=D6bw_ERd"){
                                                    Swal.fire({
                                                        icon: 'success',
                                                        title: 'Acceso Permitido',
                                                        showConfirmButton: false,
                                                        timer: 1500
                                                    })
                                                    setTimeout(function(){       //Redirige a pagina despues de un tiempo de espera de 1600 ms
                                                        $(location).attr('href','views/menu_inicio.php');
                                                    },1000)
                                                           
                                                    //Si usuario y/o contraseña es incorrecto
                                                }else if(data == "G%s_dar!2xo#Scx_23asx"){ 
                                                    $("#loginUser").focus();
                                                    Swal.fire({
                                                        //title: 'El usuario '+ user +' es incorrecto.',
                                                        title: 'El usuario y/o contraseña son incorrectos',
                                                        text: "Favor de verificarlo",
                                                        confirmButtonText: 'Aceptar',
                                                        icon: 'error',
                                                        confirmButtonColor: '#CB383B'
                                                    }).then((result) => {    
                                                        if (result.isConfirmed) {
                                                            $(location).attr('href','index.php');
                                                        }
                                                    })
                                                }
                                            }//RESPUESTA DE SERVIDOR
                                        });//Fin Ajax

                                    }else if(dato === "#F4_57dEc9T&39cTd=u2H"){   //Recaptcha no valido
                                        Swal.fire({
                                            title: 'Eres un robot',
                                            confirmButtonText: 'Aceptar',
                                            icon: 'error',
                                            confirmButtonColor: '#CB383B'
                                        }).then((result) => {    
                                            if (result.isConfirmed) {
                                                $(location).attr('href','../index.php');
                                            }
                                        })
                                        return valido;
                                    }
                                }
                            })   //Fin AJAX para validar recaptcha

                        }else{    //Recaptcha no fue palomeado
                            Swal.fire({
                                title: 'Verificar el recaptcha',
                                text: 'Seleccionar el recuadro "No soy un robot"',
                                confirmButtonText: 'Aceptar',
                                icon: 'error',
                                confirmButtonColor: '#CB383B'
                            })
                            return valido;
                        }
                        /******* FIN VALIDAR RECAPTCHA ********/

                    }else{    //El campo "Contraseña" contiene caracterese especiales
                        $("#loginPass").focus();
                        Swal.fire({
                            title: 'No se aceptan caracteres esepciales en el campo "Contraseña"',
                            text: "Favor de verificarlo",
                            confirmButtonText: 'Aceptar',
                            icon: 'warning',
                            confirmButtonColor: '#dc3741'
                        })
                    }   //Fin validacion de caracteres especiales campo "Contraseña"

                }else{    //El campo "nombre de usuario" contiene caracterese especiales
                    $("#loginUser").focus();
                    Swal.fire({
                        title: 'No se aceptan caracteres esepciales en el campo "Usuario"',
                        text: "Favor de verificarlo",
                        confirmButtonText: 'Aceptar',
                        icon: 'warning',
                        confirmButtonColor: '#dc3741'
                    })
                }   //Fin validacion de caracteres especiales campo "Nombre usuario"
                
            }else{    //Campo contraseña es vacio
                $("#loginPass").focus();
                Swal.fire({
                    title: 'El campo "Contraseña" está vacío',
                    text: "Favor de registrar la contraseña",
                    confirmButtonText: 'Aceptar',
                    icon: 'warning',
                    confirmButtonColor: '#dc3741'
                })
            }   //Fin Validacion campo contraseña vacio
 
        }else{    //Campo usuario es vacio
            $("#loginUser").focus();
            Swal.fire({
                title: 'El campo "Usuario" está vacío',
                text: "Favor de registrar el usuario",
                confirmButtonText: 'Aceptar',
                icon: 'warning',
                confirmButtonColor: '#dc3741'
            })
        }  //Fin Validacion campo usuario vacio
    }   //Fin funcion valida_datos_formulaio 

});   //Fin $(Document).ready(function)