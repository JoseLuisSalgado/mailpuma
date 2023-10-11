$(document).ready(function(){
    localStorage.removeItem("id_plant_camp");           //Limpiando localstorage la variable Id de plantilla

    busca_plantillas();        //Muestra tabla con todas las plantillas   

    /********* TABLA DE DATOS *********/	
    //Funcion que consulta con BD y busca todas las plantillas
    function busca_plantillas(){
        var datos_tabla = "";
        $.ajax({
            method:"GET",
            url: "../class/busca_todas_plantillas_correo.php",
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
                { title: "Correos pendientes" },
                { title: "Nombre plantilla" },
                { title: "Asunto" },
                { title: "Fecha creación" },
                { title: " " }
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


    //Boton "Enviar correos"
    $(document).on('click', '#btn_enviar_correo', function(){

        let id = $(this).attr('value');    //Obteniendo id de plantilla del registro de tabla

        localStorage.setItem("id_plant_camp",id);     //Almacenando id de plantilla campaña en localstorage para compratirla al redirigir a pagina enviar_correos.php
        $(location).attr('href','enviar_correos.php'); 
        
            
    });  //FIN boton "Enviar" correos

    
});   //Fin $(Document).ready(function)