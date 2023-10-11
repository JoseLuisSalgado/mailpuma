$(document).ready(function(){
    var id_plant = localStorage.getItem("id_plant");     //Almacenando variable Id de plantilla de localStorage

    $("#id_plantilla").val(id_plant);                    //Asignando id_plantilla a input invisible para enviar a php por medio de post del formulario

    busca_plantilla(id_plant);                           
 
    //Busca plantilla en BD para mostar datos en formulario para su modificacion
    function busca_plantilla(id){
        $.ajax({   //AJAX para buscar plantilla en BD
            method:"POST",
            url: "../class/busca_una_plantilla.php", 
            data:{
                id_plant: id_plant,
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
                    
                }

            }//Fin respuesta servidor
        });//Fin Ajax
    }   //FIN funcion busca_plantilla()
    
    //Presionar tecla enter dentro de inputs de formulario, se validan datos
    $("#form_envio_correos").keypress(function(e) {
        var code = (e.keyCode ? e.keyCode : e.which); 
        if(code == 13){ 
            //validar_csv();
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

    /** Seccion de alertas de validacion  **/
    if($("#alerta").attr("value") != ""){
        var alerta = $("#alerta").attr("value");    //Obteniendo
        var num_fila = $("#alerta").attr("name");
        var num_columa = $("#alerta").text();

        if(alerta == "copia_csv_exitoso"){   //Alerta de falla de conexion con BD
            Swal.fire({
                icon: 'success',
                title: 'Archivo cargado exitosamente.',
                confirmButtonText: 'Aceptar',
                confirmButtonColor: '#28a745'
            }).then((result) => {
                if (result.isConfirmed) {                          //Si usuario da clic en boton Aceptar
                    localStorage.removeItem("id_plant");           //Limpiando localstorage la variable Id de plantilla
                    $(location).attr('href','menu_inicio.php');    //Redireccionando pagina
                }
            });
            
        
        }else if(alerta == "archivo_incorrecto"){   //Identifica el tipo de alerta por archivo no adjuntado o de formato no compatible
            Swal.fire({
                title: 'Archivo incorrecto.',
                text: 'El archivo no fue cargado o el formato es incorrecto, favor de verificarlo.',
                confirmButtonText: 'Aceptar', 
                icon: 'error',
                confirmButtonColor: '#dc3741'
            }).then((result) => {
                if (result.isConfirmed) {                          //Si usuario da clic en boton Aceptar
                    $(location).attr('href','adjuntar_csv_plantilla.php');    //Redireccionando pagina
                }
            });
        }else if(alerta == "correo_vacio"){   //Identifica el tipo de alerta que es por correo vacio
                    Swal.fire({
                        title: 'Campo incompleto.',
                        text: 'El campo "CORREO" ubicado en la fila '+num_fila+' del csv, está vacío, favor de verificarlo y volver a intentarlo.',
                        confirmButtonText: 'Aceptar',
                        icon: 'error',
                        confirmButtonColor: '#dc3741'
                    }).then((result) => {
                        if (result.isConfirmed) {                          //Si usuario da clic en boton Aceptar
                            $(location).attr('href','adjuntar_csv_plantilla.php');    //Redireccionando pagina
                        }
                    });
                }else if(alerta == "correo_no_valido"){   //Alerta de correo no es valido
                            Swal.fire({
                                title: 'Correo no válido',
                                text: 'El campo "CORREO" ubicado en la fila '+num_fila+' del csv, no es válido, favor de verificarlo y volver a intentarlo.',
                                confirmButtonText: 'Aceptar',
                                icon: 'error',
                                confirmButtonColor: '#dc3741'
                            }).then((result) => {
                                if (result.isConfirmed) {                          //Si usuario da clic en boton Aceptar
                                    $(location).attr('href','adjuntar_csv_plantilla.php');    //Redireccionando pagina
                                }
                            });
                        }else if(alerta == "excede_caracteres"){   //Alerta indicando que campos DATOS de CSV excede 200 caracteres
                                    Swal.fire({
                                        title: 'Campo excede caracteres.',
                                        text: 'El campo "Dato '+num_columa+'" ubicado en la fila '+num_fila+' del csv, excede más de 200 caracteres, favor de verificarlo y volver a intentarlo.',
                                        confirmButtonText: 'Aceptar',
                                        icon: 'warning',
                                        confirmButtonColor: '#dc3741'
                                    }).then((result) => {
                                        if (result.isConfirmed) {                          //Si usuario da clic en boton Aceptar
                                            $(location).attr('href','adjuntar_csv_plantilla.php');    //Redireccionando pagina
                                        }
                                    });
                                }else if(alerta == "error_conexion_bd"){   //Alerta de falla de conexion con BD
                                    Swal.fire({
                                        title: 'Falla de conexion',
                                        text: 'No fue posible cargar el archivo en este momento, favor de intentarlo más tarde. (cod-1000)',
                                        confirmButtonText: 'Aceptar',
                                        icon: 'error',
                                        confirmButtonColor: '#dc3741'
                                    }).then((result) => {
                                        if (result.isConfirmed) {                          //Si usuario da clic en boton Aceptar
                                            $(location).attr('href','adjuntar_csv_plantilla.php');    //Redireccionando pagina
                                        }
                                    });
                                }

    }   //Fin IF seccion alertas
 
    //Muestra la pantalla de loader mientras se termina de hacer el bulk copy
    $("#btn_cargar_csv").on("click", function(){
        $(".loader.espera_envio").css("display", "list-item");
        $("#msje_loader_1").removeClass("d-none");         //Mostrando mensaje de loader 1
        $("#msje_loader_2").removeClass("d-none");         //Mostrando mensaje de loader 2

    });
    $("#msje_loader_1").addClass("d-none"); 
    $("#msje_loader_2").addClass("d-none"); 
});