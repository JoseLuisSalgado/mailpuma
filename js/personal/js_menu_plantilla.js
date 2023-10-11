$(document).ready(function(){

    busca_plantillas();        //Muestra tabla con todas las plantillas   

    /********* TABLA DE DATOS *********/	
    //Funcion que consulta con BD y busca todas las plantillas
    function busca_plantillas(){
        var datos_tabla = "";
        $.ajax({
            method:"GET",
            url: "../class/busca_todas_plantillas.php",
            success: function(data){             //RESPUESTA DE SERVIDOR JSON
                datos_tabla = JSON.parse(data);   //Decodificando JSON
                genera_tabla(datos_tabla);         //Enviando 
            } 
        });
    }  //Fin busca_plantillas()

    //Funcion que genera tabla con datos de las plantillas
    function genera_tabla(datos){
        $('#plantillas').DataTable( {	
            data: datos,
            columns: [               //Título de columnas
                //{ title: "Usuario" },
                { title: "Nombre plantilla" },
                { title: "Asunto" },
                { title: "Fecha creación" },
                { title: " " },
                { title: " " },
            ],
            
            "scrollX": true,
            language: {              //Traduciendo variables de la tabla para interaccion con usuario
                "sProcessing":     "Procesando...",
                "sLengthMenu":     "Mostrar _MENU_ registros",
                "sZeroRecords":    "No se encontraron resultados",
                "sEmptyTable":     "Ningún dato disponible en esta tabla",
                "sInfo":           "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros",
                "sInfoEmpty":      "Mostrando registros del 0 al 0 de un total de 0 registros",
                "sInfoFiltered":   "(filtrado de un total de _MAX_ registros)",
                "sInfoPostFix":    "",
                "sSearch":         "Buscar:",
                "sUrl":            "",
                "sInfoThousands":  ",",
                "sLoadingRecords": "Cargando...",
                "oPaginate": {
                    "sFirst":    "Primero",
                    "sLast":     "Último",
                    "sNext":     "Siguiente",
                    "sPrevious": "Anterior"
                },
                "oAria": {
                    "sSortAscending":  ": Activar para ordenar la columna de manera ascendente",
                    "sSortDescending": ": Activar para ordenar la columna de manera descendente"
                }
            }
        });
    }	//FIN funcion genera_tabla()

    //Boton "Eliminar" plantilla
    $(document).on('click', '#btn_eliminar', function(){

        let id = $(this).attr('value');
        let nom_plantilla = $(this).attr('name');
 
        Swal.fire({  
            title: '¿Estás seguro que deseas eliminar la plantilla "' + nom_plantilla + '" ?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: "Aceptar",
            cancelButtonText: "Cancelar",
            confirmButtonColor: "#28a745",
            cancelButtonColor: "#CB383B",
        }).then((result) => {
            if (result.isConfirmed) { //Si usuario confirma eliminar plantilla
                
                $.ajax({   //AJAX eliminar plantilla en BD
                    method:"POST",
                    url: "../class/elimina_plantilla.php", 
                    data:{
                        id_plantilla: id,
                    },  
                    success: function(data){  //Respuesta servidor
                        if(data == "plantilla_eliminada"){      //Validacion de publicacion
                            Swal.fire({
                                icon: 'success',
                                title: 'Plantilla eliminada',
                                showConfirmButton: false,
                                timer: 2000
                            })
                            setTimeout(function(){       //Redirige a pagina despues de un tiempo de espera de 1000 ms
                                $(location).attr('href','menu_plantilla.php');
                            },1500)

                        }else{ //Si hubo error con BD
                            Swal.fire({
                            icon: 'error',
                            title: 'Favor de intentarlo más tarde',
                            text: 'Hubo un error en el sistema'
                            });
                        }
                    }//Fin respuesta servidor
                });//Fin Ajax
            }   // FIN if de eliminar plantilla
            
        });  //Fin alerta de publicacion de comentarios
            
    });  //FIN boton "Eliminar" plantilla


    //Boton "Editar" plantilla
    $(document).on('click', '#btn_editar', function(){

        let id = $(this).attr('value');    //Obteniendo id de plantilla del registro de tabla

        localStorage.setItem("id_plant",id);     //Almacenando id de plantilla en localstorage para compratirla al redirigir a pagina ediatr_plantilla.php
        $(location).attr('href','editar_plantilla.php'); 

    });  //FIN boton "Eliminar" plantilla
    
});   //Fin $(Document).ready(function)