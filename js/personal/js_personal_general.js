
    //Obtiene el nombre de la pagina html
    var rutaAbsoluta = self.location.href;   
    var posicionUltimaBarra = rutaAbsoluta.lastIndexOf("/");
    var rutaRelativa = rutaAbsoluta.substring( posicionUltimaBarra + "/".length , rutaAbsoluta.length );
    //alert(rutaRelativa);  
    //Fin obtener pagina html

    //Se ejecuta cuando finaliza de cargar la pagina html por completo
    window.addEventListener("load",function(){

        //Busca y compara los href (listas) con el nombre de la pagina para ocultarlos al usuario
        $("#listas li a").each(function(){
            var href_lista = $(this).attr("href");   //Obteniendo URL de las etiquetas a
            //alert(href_lista)
            if(href_lista != "menu_inicio.php"){     //Valida si su href es el menu inicial, ya que ese no se oculta
                if(rutaRelativa == href_lista){      //Indeitifca si la url es la misma que la pagina actualmente abierta para ocultar ese link al usuario
                    //alert("coincinden " + href_lista + " -> " + rutaRelativa);
                    $(this).addClass("d-none");      //Adjuntando clase que oculta la etiqueta a
                }
            }
        })
    })
