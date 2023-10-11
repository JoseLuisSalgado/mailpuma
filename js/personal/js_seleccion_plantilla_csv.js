$(document).ready(function(){
    localStorage.removeItem("id_plant");           //Limpiando localstorage la variable Id de plantilla
 
    busca_plantillas();        //Muestra tabla con todas las plantillas   

    /********* TABLA DE DATOS *********/	
    //Funcion que consulta con BD y busca todas las plantillas
    function busca_plantillas(){
        var datos_tabla = "";
        $.ajax({
            method:"GET",
            url: "../class/busca_todas_plantillas_csv.php",
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
                { title: "Fecha" },
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

    //Boton "Carga CSV" 
    $(document).on('click', '#btn_carga_csv', function(){

        let id = $(this).attr('value');
        let nom_plantilla = $(this).attr('name');
        //alert("ID -> " + id + " nom_plantilla -> " + nom_plantilla);
            
    });  //FIN boton "Carga CSV"


    //Boton "Ver plantilla"
    $(document).on('click', '#btn_ver_plantilla', function(){

        let id = $(this).attr('value');    //Obteniendo id de plantilla del registro de tabla

        localStorage.setItem("id_plant",id);     //Almacenando id de plantilla en localstorage para compratirla al redirigir a pagina ediatr_plantilla.php
        $(location).attr('href','adjuntar_csv_plantilla.php'); 
        
            
    });  //FIN boton "Ver plantilla" plantilla

    
});   //Fin $(Document).ready(function)