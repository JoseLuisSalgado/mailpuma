$(document).ready(function(){
    //Presionar tecla enter dentro de inputs de formulario, se validan datos
    $("#namePlantilla, #asunto, #archivos ").keypress(function(e) {
        var code = (e.keyCode ? e.keyCode : e.which); 
        if(code == 13){ 
            validar_datos_crear_plantilla();
            return false; 
        } 
    });

    //Boton Guardar plantilla, valida los datos del formulario
    $("#btn_create_plant").on("click", function(){
        validar_datos_crear_plantilla();
    });

    function validar_datos_crear_plantilla(){
        let nom_plantilla = $("#namePlantilla").val();
        let asunto = $("#asunto").val();
        let cadena_msje = $("#box_mensaje").val();
    
        if(nom_plantilla != ""){                                          //Validando campo nombre plantilla no sea vacio
            if(asunto != ""){                                          //Validando campo asunto del mensaje no sea vacio
                if(cadena_msje != ""){                                          //Validando campo mensaje no sea vacio

                    $.ajax({
                        method:"POST",
                        url: "../class/crear_plantilla.php", 
                        data:{
                            namePlantilla: nom_plantilla,
                            asunto: asunto,
                            box_mensaje: cadena_msje,
                        },  
                        success: function(data){  //Respuesta servidor
                            if(data == "plantilla_agregada"){     //Si plantilla se agrego correctamente en BD

                                Swal.fire({
                                    icon: 'success',
                                    title: 'Se ha creado la plantilla "'+ nom_plantilla +'" de forma exitosa.',
                                    confirmButtonText: 'Aceptar',
                                    showConfirmButton: true,
                                    showDenyButton: false,
                                    confirmButtonColor: '#28a745',
                                    }).then((result) => {
                                    
                                    if (result.isConfirmed) {
                                        $(location).attr('href','./menu_inicio.php');
                                    }
                                })

                            }else if(data == "nom_plant_existe"){   //Si el nombre de la plantilla ya existe en BD
                                $("#namePlantilla").focus();
                                Swal.fire({
                                    title: 'El nombre de la plantilla "'+ nom_plantilla +'" ya existe en sistema.',
                                    text: "Favor de registrar otro nombre de plantilla.",
                                    confirmButtonText: 'Aceptar',
                                    icon: 'error',
                                    confirmButtonColor: '#dc3741'
                                })
 
                            }else if(data = "error"){   //Si hubo error al intentar registrar en BD
                                Swal.fire({
                                    title: 'ERROR, se ha producido un error en el sistema, favor de intentarlo más tarde.',
                                    confirmButtonText: 'Aceptar',
                                    icon: 'error',
                                    confirmButtonColor: '#CB383B'
                                })
                            }
                        }
                    })  //Fin ajax
                    
                }else{   //Campo mensaje es vacio
                    $("#box_mensaje").focus();
                    Swal.fire({
                        title: 'El campo "Mensaje" está vacío.',
                        text: "Favor de escribir el mensaje del correo.",
                        confirmButtonText: 'Aceptar',
                        icon: 'warning',
                        confirmButtonColor: '#dc3741'
                    })
                }   //Fin validacion campo mensaje vacio

            }else{   //Campo asunto mensaje es vacio
                $("#asunto").focus();
                Swal.fire({
                    title: 'El campo "Asunto" está vacío.',
                    text: "Favor de escribir el asunto del mensaje.",
                    confirmButtonText: 'Aceptar',
                    icon: 'warning',
                    confirmButtonColor: '#dc3741'
                })
            }   //Fin validacion campo asunto del mensaje la vacio

        }else{   //Campo nombre plantilla es vacio
            $("#namePlantilla").focus();
            Swal.fire({
                title: 'El campo "Nombre plantilla" está vacío.',
                text: "Favor de escribir el nombre de la plantilla.",
                confirmButtonText: 'Aceptar',
                icon: 'warning',
                confirmButtonColor: '#dc3741'
            })
        }   //Fin validacion campo nombre plantilla vacio

    }  //Fin funcion validar_datos_crear_plantilla

    //Generando textarea con herramientas para diseño
    $('#box_mensaje').summernote({
        placeholder: 'Escribe tu mensaje',
        tabsize: 3,
        height: 200,
        lang: 'es-ES', 
        toolbar: [
            // [groupName, [list of button]]  botones de estilo que aparecen en la parte superior del textarea
            ['style', ['style']],
            ['style', ['bold', 'italic', 'underline', 'clear']],
            ['font', ['superscript', 'subscript', 'fontname']],
            ['fontsize', ['fontsize']],
            ['color', ['color']],
            ['height', ['height']],
            ['para', ['paragraph', 'ul', 'ol']],
            ['insert', ['link', 'picture']],
            ['view', ['undo', ,'redo', 'fullscreen', 'codeview']],
        ]
    });

    //Boton Correo de prueba
    $("#btn_email_prueba").on("click", function(){
        //Alert para solicitar email a usuario y enviar correo de prueba 
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
                    let asunto = $("#asunto").val();
                    let cadena_msje = $("#box_mensaje").val();


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
                        return 'El campo "Mensaje" del formulario está vacio';
                        }   //Fin validacion campo mensaje vacio
        
                    }else{   //Campo asunto mensaje es vacio
                        return 'El campo "Asunto" del formulario está vacio';
                    }   //Fin validacion campo asunto del mensaje la vacio
                }
            }
        })
    })   //FIN Boton correo de prueba
});   //Fin $(Document).ready(function)