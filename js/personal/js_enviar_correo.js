     //Resetea la variable de session contador de envio de correos
     function reset_contador_enviados(){
        $.ajax({
            method:"GET",
            url: "../class/reset_contador_correos.php",  
            success: function(data){  //RESPUESTA DE SERVIDOR 
                var incognito = 0;
                //alert(data);
            }
        })
    }

function envio_correos(servicio, user, pass, id_plant_camp) {

    $(".loader.espera_envio").css("display", "list-item");     //Mostrando ventana de loader completa
    $("#msje_loader_1").removeClass("d-none");                 //Mostrando mensaje de loader 1
    $("#msje_loader_2").removeClass("d-none");                 //Mostrando mensaje de loader 2
    
    //Ajax
    $.ajax({
        method:"GET",
        url: "../class/enviar_correos.php", 
        data:{
            mail_service: servicio,
            user_mail: user,
            password: pass,
            id_camp_plantilla: id_plant_camp
            },  
        success: function(data){  //RESPUESTA DE SERVIDOR 
            //alert("Envio correo devuelve - "+ data);
            if(data.indexOf("correos_enviados") != -1 || data.indexOf("error_envio") != -1){   //Validando si envia cadena o arreglo que contenga texto "correos_enviados" o "error", si no entonces devuelve una cedna muy grande de error de phpmailer por ingresar incorrectamente el coreo o contraseñas o por bloqueo de envio de correos por exceder limite de envio
                var datos = JSON.parse(data);    //Parseando data (arreglo)
                
                $("#msje_loader_1").addClass("d-none");                //Ocultando mensaje de loader 1
                $("#msje_loader_2").addClass("d-none");                //Mostrando mensaje de loader 2
                $(".loader.espera_envio").css("display", "none");      //Ocultado loader por completo
                //alert("TODAS -> "+datos+" POS_1 -> "+datos[0]+" POS_2 -> "+datos[1]);
                
                if(datos[1] == "correos_enviados"){
                    Swal.fire({
                        icon: 'success',
                        title: 'Se enviaron "'+ datos[0] +'" correos de forma exitosa.',
                        showConfirmButton: true,
                        confirmButtonText: "Aceptar",
                        confirmButtonColor: "#28a745",
        
                    }).then((result) => {
                        if (result.isConfirmed) {          //Si usuario confirma envio de correos exitoso
                            reset_contador_enviados();     //Reseteando el contador de correos enviados
                            $(location).attr('href','seleccion_plantilla_correo.php');
                        }
                    });             
                    
                    //Si hubo falla al consultar la BD o en el envio de correos
                }else if(datos[1] == "error_envio"){ 
                    Swal.fire({
                        icon: 'error',
                        title: 'Error de envío de correos.',
                        text: 'Se enviaron "'+ datos[0] +'" correos, favor de intentarlo más tarde.',
                        confirmButtonText: 'Aceptar',
                        confirmButtonColor: '#CB383B'
                    }).then((result) => {
                        if (result.isConfirmed) { //Si usuario confirma error de envio de correos
                            reset_contador_enviados();      //Reseteando el contador de correos enviados
                            $(location).attr('href','seleccion_plantilla_correo.php');
                        }
                    }); 
                }
                 
            }else{   //Si "data" no es arreglo, entonces es cadena de error y muestra mensaje de error al usuario (Puede ser por usuario y/o contraseña incorrecto o por bañear la cuenta).
                $("#msje_loader_1").addClass("d-none");                 //Ocultando mensaje de loader 1
                $("#msje_loader_2").addClass("d-none");                 //Ocultando mensaje de loader 2
                $(".loader.espera_envio").css("display", "none");      //Ocultado loader por completo
                
                var correos_enviados = contador_enviados();       //Obteniendo el contador de correos enviados para mostrar en notificaciones

                if(correos_enviados > 0){    //Si la variable de session es un numero, indidca que a enviado correos y se notifica a usuario la cantidad donde se ah quedado en enviar los correos
                    Swal.fire({    
                        icon: 'warning',
                        title: 'Envio de correos pendientes.',
                        text: 'Se enviaron "' + correos_enviados + '" correos exitosamente, favor de registrar nuevamente correo y contraseña para continuar con el envío de correos pendientes.',
                        showConfirmButton: true,
                        confirmButtonText: "Aceptar",
                        confirmButtonColor: "#28a745",
                    }).then((result) => {
                        if (result.isConfirmed) { //Si usuario confirma error de envio de correos
                            reset_contador_enviados();     //Reseteando el contador de correos enviados
                            $(location).attr('href','enviar_correos.php');
                        }
                    });  

                }else{    //La variable de session indefinidad, indica que entonces el usuario o contraseña del correo es incorrecta

                    $("#msje_loader_1").addClass("d-none");                 //Ocultando mensaje de loader 1
                    $("#msje_loader_2").addClass("d-none");                 //Ocultando mensaje de loader 2
                    $(".loader.espera_envio").css("display", "none");      //Ocultado loader por completo
                    Swal.fire({    
                        icon: 'error',
                        title: 'Usuario o contraseña incorrectos <br><br>o <br><br>límite de envío de correos excedido.<br>',
                        text: 'Favor de verificarlo.',
                        confirmButtonText: 'Aceptar',
                        confirmButtonColor: '#CB383B'
                    }).then((result) => {
                        if (result.isConfirmed) { //Si usuario confirma error de envio de correos      
                            reset_contador_enviados();     //Reseteando el contador de correos enviados
                            $(location).attr('href','enviar_correos.php');
                        }
                    }); 
                } 
            }

        },
        error: function(xhr, status, error) {   //Cuando servidor envia error pero por que falla en proceso
            $("#msje_loader_1").addClass("d-none");                 //Ocultando mensaje de loader 1
            $("#msje_loader_2").addClass("d-none");                 //Ocultando mensaje de loader 2
            $(".loader.espera_envio").css("display", "none");      //Ocultado loader por completo
            Swal.fire({    
                icon: 'error',
                title: 'Error de envío de correos.',
                text: 'Verificar si no ha excedido el límite de envío de correos o intentar el envío más tarde.',
                confirmButtonText: 'Aceptar',
                confirmButtonColor: '#CB383B'
            }).then((result) => {
                if (result.isConfirmed) { //Si usuario confirma error de envio de correos
                    reset_contador_enviados();     //Reseteando el contador de correos enviados
                    
                }
            }); 
        }
    });//Fin Ajax

                            
}

$(document).ready(function(){
    var id_plant_camp = localStorage.getItem("id_plant_camp");     //Almacenando variable Id de plantilla campaña de localStorage
    var mail_valido = false;
    var bandera;

    busca_plantilla(id_plant_camp);
    calcula_correos_enviados(id_plant_camp);                         

    //Busca plantilla en BD para mostar mensaje de correo de plantilla
    function busca_plantilla(id){
        $.ajax({   //AJAX para buscar plantilla en BD
            method:"POST",
            url: "../class/busca_una_plantilla_campaña.php", 
            data:{
                id_plant: id_plant_camp,
            },  
            success: function(data){  //Respuesta servidor
                datos_tabla = JSON.parse(data);   //Decodificando JSON

                if(datos_tabla[0] == "error"){     //Si existe error en la BD
                    Swal.fire({
                        title: 'ERROR, se ha producido un error en el sistema, favor de intentarlo más tarde.',
                        confirmButtonText: 'Aceptar',
                        icon: 'error',
                        confirmButtonColor: '#CB383B'
                    })

                }else{     //Muestra los datos de la plantilla en formulario
                    insertar_mensaje(datos_tabla[3]);             //Inserta el mensaje de la plantilla en la pagina HTML
                    $("#namePlantilla").val(datos_tabla[1]);   //Se agrega nombre de plantilla en campo de formulario
                    $("#asunto").val(datos_tabla[2]);          //Se agrega asunto de plantilla en campo de formulario
                    //alert("1.- " + datos_tabla[1] + " 2.- " + datos_tabla[2] + " 3.- " + datos_tabla[3] + " 4.- " + datos_tabla[4]);
                }

            }//Fin respuesta servidor
        });//Fin Ajax
    }   //FIN funcion busca_plantilla()
    
    //Funcion que calcula correos enviados, pendientes de enviar y el total de correos por campaña
    function calcula_correos_enviados(id_plant_camp){
        $.ajax({   //AJAX para buscar plantilla en BD
            method:"POST",
            url: "../class/calcula_envios_correos.php", 
            data:{
                id_camp_plantilla: id_plant_camp,
            },  
            success: function(data){  //Respuesta servidor
                datos_tabla = JSON.parse(data);   //Decodificando JSON
                //alert("Respuesta data -> " + data + "   RESPUESTA JSON PARSE -> "+datos_tabla);
                if(datos_tabla[0] == "error"){     //Si existe error en la BD
                    Swal.fire({
                        title: 'ERROR, se ha producido un error en el sistema, favor de intentarlo más tarde. (1005)',
                        confirmButtonText: 'Aceptar',
                        icon: 'error',
                        confirmButtonColor: '#CB383B'
                    })

                }else{     //Muestra los datos contabializados de correo en etiquetas

                    $("#total_correos").text(datos_tabla[0]);               //Agregando el numero total de correos
                    $("#correos_pendientes").text(datos_tabla[1]);          //Agregando el numero total de correos pendiente por enviar
                    $("#correos_enviados").text(datos_tabla[2]);            //Agregando el numero total de correos que se han enviado
                    $("#correos_enviados").val(datos_tabla[2]);            //Agregando el numero total de correos que se han enviado
                    //alert("1.- " + datos_tabla[1] + " 2.- " + datos_tabla[2] + " 3.- " + datos_tabla[3] + " 4.- " + datos_tabla[4]);
                }
            
            }//Fin respuesta servidor
        });//Fin Ajax
    }
 
    
    //Al presionar tecla enter, se ejecuta accion de boton "Enviar correos"
    $("#form_envio_correos, #servicio_correo, #usuario_correo, #usuario_password").keypress(function(e) {
        var code = (e.keyCode ? e.keyCode : e.which); 
        if(code == 13){ 
            return false; 
        } 
    });

    //Generando DIV para insertar el mensaje de la plantilla como html
    function insertar_mensaje(mensaje){
        const div = document.createElement("div");  // Creando una etiqueta DIV
        div.innerHTML = mensaje;                    // Dengtro de la etiqueta DIV se agrega el mensaje de la plantilla 
        
        const app = document.querySelector("#result_msj"); // Seleccionando id
        app.insertAdjacentElement("beforeend", div);       //Insertando DIV con mensaje de plantilla
    }

    //Validacion correo en tiempo real, (Lo realiza caracter por caracter al ser ingresados por usuario)
    $('#usuario_correo').on('keyup', function() {
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
    

    //Boton "Enviar correos"
    $("#btn_enviar_correos").on("click", function(){
        var servicio = $("#servicio_correo option:selected").val();
        var user = $("#usuario_correo").val();
        var pass = $("#usuario_password").val();
        //alert("SERVICIO CORREO ES -> " + servicio + " USUARIO -> " + user + " PASSWORD -> " + pass + " ID_CAMP_PLANTILLA -> " + id_plant_camp);
 
        //Obtiene datos de inputs, valida y envia datos a backend para su verificacion de envio de correos
        if(servicio > 0){
            if(user != ""){                                              //Validando campo usuario no sea vacio
                if(mail_valido){                                         //Validando que el email sea valido
                    if(pass != ""){                                      //Validando campo contraseña no sea vacio 
                            //Ajax para verificar si cuenta de correo fue utlizada para enviar correos en menos de 24 hrs
                            $.ajax({
                                method:"POST",
                                url: "../class/valida_cuenta_correos.php", 
                                data:{
                                    user_mail: user
                                    },  
                                success: function(data){  //RESPUESTA DE SERVIDOR 
                                    //alert("Valida cuenta correos - "+data);
                                    var datos = JSON.parse(data);

                                    if(datos[0]== "existe"){    //Si la cuenta de correo existe en la tabla log_envio, es por que aun no han pasado 24 hrs qhe envio correos desde esa cuenta y se le notifica al usuario los correos que ha enviado totalmente
                                        //return true;
                                             
                                        Swal.fire({    
                                            icon: 'warning',
                                            title: 'Envío de correos pendientes.',
                                            text: 'Se han enviado "' + datos[1] + '" correos exitosamente de 1500 permitidos cada 24 hrs. El envío de los correos reiniciará el "' + datos[2] + '" .',
                                            showConfirmButton: true,
                                            confirmButtonText: "Aceptar",
                                            confirmButtonColor: "#28a745",
                                            showCancelButton: true,
                                            cancelButtonText: "Cancelar",
                                            cancelButtonColor: "#CB383B",
                                        }).then((result) => {
                                            if (result.isConfirmed) { //Si usuario confirma mensaje de correos pendiente de envio                             
                                                envio_correos(servicio, user, pass, id_plant_camp);
                                                //$(location).attr('href','enviar_correos.php');
                                            }
                                        }); 
                                    }else{             
                                        envio_correos(servicio, user, pass, id_plant_camp);
                                    }
                                } 
                            });    //Fin ajax
        
                    }else{    //Campo contraseña es vacio
                        $("#usuario_password").focus();
                        Swal.fire({
                            title: 'El campo "Contraseña" está vacío.',
                            text: "Favor de escribir la contraseña.",
                            confirmButtonText: 'Aceptar',
                            icon: 'warning',
                            confirmButtonColor: '#dc3741'
                        })
                    }   //Fin Validacion campo contraseña vacio
                }else{       //El email no es valido
                    $("#usuario_correo").focus();
                    Swal.fire({
                        title: 'El correo no es válido',
                        text: 'Favor de verificar que contenga "@" y "." ',
                        confirmButtonText: 'Aceptar',
                        icon: 'error',
                        confirmButtonColor: '#dc3741'
                    })
                }

            }else{    //Campo usuario es vacio
                $("#usuario_correo").focus();
                Swal.fire({
                    title: 'El campo "Usuario" está vacío.',
                    text: "Favor de escribir el usuario.",
                    confirmButtonText: 'Aceptar',
                    icon: 'warning',
                    confirmButtonColor: '#dc3741'
                })
            }  //Fin Validacion campo usuario vacio
        }else{    //Campo servicio de correo es vacio
            $("#servicio_correo").focus();
            Swal.fire({
                title: 'El campo “Servicio de correo” está vacío.',
                text: "Favor de elegir un servicio de correo.",
                confirmButtonText: 'Aceptar',
                icon: 'warning',
                confirmButtonColor: '#dc3741'
            })

        }  //Fin Validacion campo de servicio de correo  vacio
        //Fin validacion campos de cuenta de correos
        

    })   //Fin boton Enviar correos


    //Boton Correo de prueba
    $("#btn_email_prueba").on("click", function(){
        //Alerta para solicitar email a usuario y enviar correo de prueba 
        
        Swal.fire({
            title: "Escribe la cuenta donde deseas enviar el correo prueba.",
            input: "text",
            showCancelButton: true,
            confirmButtonText: "Enviar",
            cancelButtonText: "Cancelar",
            confirmButtonColor: "#28a745",
            cancelButtonColor: "#CB383B",
            inputValidator: correo => {
                // Si el valor es válido, debes regresar undefined. Si no, una cadena
                if (!correo) {                                                  //Validando campo correo no sea vacio
                    return "El correo es requerido, favor de capturarlo.";
                } else if (correo.indexOf('@', 0) == -1 || correo.indexOf('.', 0) == -1 ){         //Validando campo correo contenga @ y punto
                    return "El correo no contiene '@' o '.', favor de verificarlo.";
                } else {                                                        //Validacion de correo correcta

                    //Obteniendo valor de campos de formulario
                    let asunto = $("#asunto").val();                         //Obteniendo valor de asunto
                    let text_html = document.querySelector("#result_msj");   //Obteniendo contenido html y de mensaje de correo buscado por ID
                    let cadena_msje = text_html.outerHTML;                   //Conviertiendo en string mensaje de correo con su conytenido html
        
                    if(asunto != ""){                                          //Validando campo asunto del mensaje no sea vacio
                        if(cadena_msje != ""){                                          //Validando campo mensaje no sea vacio
                            $.ajax({
                                method:"POST",
                                url: "../class/correo_prueba.php", 
                                data:{
                                    email: correo,
                                    asunto: asunto,
                                    box_mensaje: cadena_msje,
                                },  
                                success: function(data){  //Respuesta servidor

                                    if(data == "correo_enviado"){     //Si correo fue enviado exitosamente
                                        Swal.fire({
                                            icon: 'success',
                                            title: 'Correo enviado exitosamente.',
                                            showConfirmButton: false,
                                            timer: 1500
                                        })
                                    
                                    }else if(data == "error"){   //Si hubo error al intentar registrar en BD
                                        Swal.fire({
                                            title: 'ERROR, se ha producido un error en el sistema, favor de intentarlo más tarde.',
                                            confirmButtonText: 'Aceptar',
                                            icon: 'error',
                                            confirmButtonColor: '#CB383B'
                                        })
                                    }
                                }
                            })  //Fin ajax

                            //return undefined;

                        }else{   //Campo mensaje es vacio
                        return 'El campo "Mensaje" del formulario está vacío.';
                        }   //Fin validacion campo mensaje vacio
        
                    }else{   //Campo asunto mensaje es vacio
                        return 'El campo "Asunto" del formulario está vacío.';
                    }   //Fin validacion campo asunto del mensaje la vacio
                }
            }
        })       
    })   //FIN Boton correo de prueba

}); 