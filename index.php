<?php
    require 'class/conexion.php';
	require 'class/funciones.php';
    require 'class/var_sesion.php';

    global $id_user;
    global $nom_user;
    global $rol_user;

	if($rol_user == 1 || $rol_user == 2){             //Validacion, si es cualquier rol de usuario, lo redirecciona a menu inicio
		header("Location: views/menu_inicio.php");
		die();
	}
    
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <!-- Required meta tags -->
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <title>Mail Puma | Iniciar sesiòn</title>
    <link href="images/icono_unam.ico" rel="icon">
 
    <!-- include summernote css/js -->
    
    <script src="libs/jquery-351.js" crossorigin="anonymous"></script>
    <script src="libs/popper.js" integrity="sha384-Q6E9RHvbIyZFJoft+2mJbHaEWldlvI9IOYy5n3zV9zzTtmI3UksdQRVvoxMfooAo" crossorigin="anonymous"></script>
    <link href="css/bootstrap_min.css" integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh" crossorigin="anonymous" rel="stylesheet">
    <script src="js/bootstrap_4_min.js" integrity="sha384-wfSDF2E50Y2D1uUdj0O3uMBJnjuUD4Ih7YwaYd1iqfktj0Uod8GCExl3Og8ifwB6" crossorigin="anonymous"></script>
 
    <!--<link rel="stylesheet" href="css/bootstrap.min.css">-->
    <link rel="stylesheet" href="css/all.min.css">
    <link rel="stylesheet" href="css/animate.min.css">
    <link rel="stylesheet" href="css/owl.carousel.min.css">
    <link rel="stylesheet" href="css/jquery.fancybox.min.css">
    <link rel="stylesheet" href="css/tooltipster.min.css">
    <link rel="stylesheet" href="css/cubeportfolio.min.css">
    <link rel="stylesheet" href="css/revolution/navigation.css">
    <link rel="stylesheet" href="css/revolution/settings.css">
    <link rel="stylesheet" href="css/style.css">
    <!-- Personalized style -->
    <link rel="stylesheet" href="css/personal_style.css">
    <!-- SWEETALERT -->
    <!-- <script src="//cdn.jsdelivr.net/npm/sweetalert2@11"></script> -->
    <script src="libs/sweetalert/sweetalert_2_v11.js"></script>
    <!-- RECAPCHA -->
    <!--<script src="libs/recaptcha/api.js" async defer></script>-->
    <script src="https://www.google.com/recaptcha/api.js" async defer></script>
 

    <!-- RECAPCHA -->
    <!--<script src="https://www.google.com/recaptcha/api.js?render=6LdfD0AiAAAAAANkefzan9wg22kL5N_01TXKJ-hh"></script>-->

        <!-- Meta Pixel Code -->
        <script>
      !function(f,b,e,v,n,t,s)
      {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
      n.callMethod.apply(n,arguments):n.queue.push(arguments)};
      if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
      n.queue=[];t=b.createElement(e);t.async=!0;
      t.src=v;s=b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t,s)}(window, document,'script',
      'https://connect.facebook.net/en_US/fbevents.js');
      fbq('init', '1141234340148800');
      fbq('track', 'PageView');
      </script>
      <noscript><img height="1" width="1" style="display:none"
      src="https://www.facebook.com/tr?id=1141234340148800&ev=PageView&noscript=1"
      /></noscript>
      <!-- End Meta Pixel Code -->

</head>
<body> 
<!--PreLoader-->
<div class="loader">
    <div class="loader-inner">
        <div class="cssload-loader"></div>
    </div>
</div>
<!--PreLoader Ends-->
<!-- header -->
<header class="site-header">
    <nav class="navbar navbar-expand-lg padding-nav static-nav">
        <div class="container">
            <a class="navbar-brand col-12 text-center" href="#">
                <img src="images/logo_unam_dorado.png" alt="Logo UNAM" class="sm_img_tam">
            </a>
        </div>
        
    </nav>
    
</header>
<!-- header -->

<!--Page Header-->
<section id="main-banner-page" class="position-relative page-header sign-in-up-header parallax section-nav-smooth">
   <div class="container estilo_header">
     <div class="gradient-bg" style=" MARGIN-TOP: 50PX;">
      <div class="row">
        <div class="col-lg-12 col-md-12 whitecolor">
         <h1 class="text-center">Mail Puma</h1>
         <!--
         <ul class="breadcrumb top10 bottom10 float-right hoverShine">
           <li class="breadcrumb-item hover-light"><a href="menu_inicio.php">Inicio</a></li>
           <li class="breadcrumb-item hover-light"><a href="class/cerrar_sesion.php">Cerrar sesión&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</a></li>
         </ul>
        -->
       </div>
      </div>
     </div>
   </div>
</section>
<!--Page Header ends -->

<!-- Login -->
<section id="ourfaq" class="bglight position-relative pad_bt_4_5">
    <div class="container">
        <div class="row">
            <div class="col-md-12 text-center wow fadeIn" data-wow-delay="300ms">
                <h2 class="heading bottom40 darkcolor font-light2"><span class="font-normal">Iniciar sesión</span>
                    <span class="divider-center"></span>
                </h2>
                <div class="col-md-8 offset-md-2 heading_space">
                    <p></p>
                </div>
            </div>
            <div class="col-lg-3 d-none d-lg-block pl-lg-0">
            </div>
            <div class="col-lg-6 col-md-12 col-sm-12 pr-lg-0 whitebox wow fadeIn" data-wow-delay="450ms">
                <div class="widget logincontainer">
                    <h3 class="darkcolor bottom35 text-center ">Ingresar usuario y contraseña</h3>
                    <form class="getin_form border-form" id="login">
                        <div class="row">
                            <div class="col-md-12 col-sm-12">
                                <div class="form-group bottom35">
                                    <input class="form-control" type="text" placeholder="Usuario:" required id="loginUser" maxlength="20" autocomplete="off"/>
                                </div>
                            </div>
                            <div class="col-md-12 col-sm-12">
                                <div class="form-group bottom35">
                                    <label for="loginPass" class="d-none"></label>
                                    <input class="form-control" type="password" placeholder="Contraseña:" required id="loginPass" maxlength="30" autocomplete="off">
                                </div>
                            </div>
 
                            <!-- BOTON RECAPCHA -->
                            <div class="col-sm-12 text-center" style="margin-bottom: 2rem;">
                                <div class="g-recaptcha" data-sitekey="6Ld95L8iAAAAACFYS8ASkwIALBM4Wmhtwk9ayKNY" data-callback="onSubmit" data-action='submit' style="display: flex; justify-content: center;"></div>
                            </div>

                            <div class="col-sm-12 text-center">
                                <button type="button" class="button gradient-btn btn_sombra" id="btn_ingresar">Iniciar sesión</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>

            <div class="col-lg-3 d-none d-lg-block pl-lg-0">
            </div>

        </div>
    </div>
</section>
<!-- Login -->

<!--Site Footer Here-->
<footer id="site-footer" class=" bgdark padding_top">
    <div class="container">
        <div class="row">

            <div class="col-lg-3 col-md-3 col-sm-12">
                <div class="footer_panel padding_bottom_half bottom20 text-center">
                    <a href="index.php">
                        <img src="images/logo-cuaieed.svg" alt="Logo CUAIEED" id="logo_footer">
                    </a>
                </div>
            </div>
             
            <div class="col-lg-9 col-md-9 col-sm-12">
                <div class="footer_panel padding_bottom_half bottom20">
                    <h4 class="whitecolor bottom25 text-center" style="color:#a48329;">Coordinación de Universidad Abierta, Innovación Educativa y Educación a Distancia, CUAIEED, UNAM</h4>
                    <p class="whitecolor bottom25 text-center">
                        Circuito Exterior s/n, Ciudad Universitaria, Alcaldía Coyoacán, Ciudad de México, México.<br>
                        Hecho en México, Coordinación de Universidad Abierta, Innovación Educativa y Educación a Distancia-UNAM.<br>
                        Copyright © Todos los derechos reservados 2022.
                    </p>
                </div>
            </div>


        </div>
    </div>
</footer>
<!--Footer ends-->

<!-- jQuery first, then Popper.js, then Bootstrap JS -->
<!--<script src="js/jquery-3.4.1.min.js"></script>-->
<!--Bootstrap Core-->
<script src="js/propper.min.js"></script>
<!--<script src="js/bootstrap.min.js"></script>-->
<script src="js/jquery.appear.js"></script>
<!--Owl Slider-->
<script src="js/owl.carousel.min.js"></script>
<!--number counters-->
<script src="js/jquery-countTo.js"></script>
<!--Parallax Background-->
<script src="js/parallaxie.js"></script>
<!--Cubefolio Gallery-->
<script src="js/jquery.cubeportfolio.min.js"></script>
<!--Fancybox js-->
<script src="js/jquery.fancybox.min.js"></script>
<!--tooltip js-->
<script src="js/tooltipster.min.js"></script>
<!--wow js-->
<script src="js/wow.js"></script>
<!--Revolution SLider-->
<script src="js/revolution/jquery.themepunch.tools.min.js"></script>
<script src="js/revolution/jquery.themepunch.revolution.min.js"></script>
<!-- SLIDER REVOLUTION 5.0 EXTENSIONS -->
<script src="js/revolution/extensions/revolution.extension.actions.min.js"></script>
<script src="js/revolution/extensions/revolution.extension.carousel.min.js"></script>
<script src="js/revolution/extensions/revolution.extension.kenburn.min.js"></script>
<script src="js/revolution/extensions/revolution.extension.layeranimation.min.js"></script>
<script src="js/revolution/extensions/revolution.extension.migration.min.js"></script>
<script src="js/revolution/extensions/revolution.extension.navigation.min.js"></script>
<script src="js/revolution/extensions/revolution.extension.parallax.min.js"></script>
<script src="js/revolution/extensions/revolution.extension.slideanims.min.js"></script>
<script src="js/revolution/extensions/revolution.extension.video.min.js"></script>
<!--custom functions and script-->
<script src="js/functions.js"></script>
<!-- Personalized code javascript -->
<script src="js/personal/js_index.js"></script>
</body>
</html>