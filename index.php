<!doctype html>
<html lang="en">
<head>
    <!-- Required meta tags -->
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <link href="https://fonts.googleapis.com/css?family=Montserrat:400,500,600,700" rel="stylesheet">
    <title>Hello, world!</title>
</head>

<body>

    <!-- HOMEBANNER -->
    <section class="banner" style="background: url(img/banner.png); background-size: cover; background-position: center top;">

        <div class="container">
            <div class="row contact-row">
                <div class="col-md-3">
                    <div class="contact-box phone">
                        <span>Zadzwoń do nas:</span>
                        <p>+48 509 33 00 32</p>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="contact-box mail">
                        <span>Wyślij nam wiadomość:</span>
                        <p>info@rimart.pl</p>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="contact-box localization">
                        <span>Odwiedź nas:</span>
                        <p>Łącko 476, 33-390 Łącko</p>
                    </div>
                </div>
                <div class="col-md-3">
                     <ul class="lang-switch">
                         <li class="list-item pl">
                             <a class="active" href="#">PL</a>
                         </li>
                         <li class="list-item en">
                             <a href="#">EN</a>
                         </li>
                     </ul>
                </div>
            </div>

            <div class="welcome-box">
                <div class="inner">
                    <img src="img/brand.png" alt="rimart.pl" class="logo">
                    <h2>najwyższej jakości</h2>
                    <h1>FELGI ALUMINIOWE & STALOWE</h1>
                    <button class="btn btn-primary btn-red-border">Poznaj nas</button>
                </div>
            </div>
        </div>

        <nav class="navbar navbar-expand-lg">
            <div class="container">
                <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul class="navbar-nav mr-auto">
                        <li class="nav-item">
                            <a class="nav-link active" href="#">Start</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="#">O Firmie</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="#">Galeria</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="#">Kontakt</a>
                        </li>
                    </ul>
                    <div class="pull-right">
                        <a href="#" class="btn btn-primary">Kup na allegro!</a>
                        <a href="#" class="btn btn-primary">Kup na e-bay!</a>
                        <a href="#" class="btn btn-primary fb-style">Facebook</a>
                    </div>
                </div>
            </div>
        </nav>

    </section>
    <!-- END --------->

    <!-- ABOUT -->
    <section class="about section">
        <div class="headline">
            <h3>O Firmie</h3>
        </div>
    </section>
    <!-- END --------->

    <!-- GALLERY -->
    <section class="gallery section">

        <div class="headline">
            <h3>Galeria</h3>
        </div>

    </section>
    <!-- END --------->

    <!-- MAP -->
    <section class="map">

    </section>
    <!-- END --------->

    <!-- CONTACT -->
    <section class="contact section">

        <div class="headline">
            <h3>Kontakt</h3>
        </div>

    </section>
    <!-- END --------->

    <!-- FOOTER -->
    <section class="footer">

    </section>
    <!-- END --------->

<script type="text/javascript">
    !function(e){"use strict";var t=function(t,n,o){function i(e){return d.body?e():void setTimeout(function(){i(e)})}
        var r,d=e.document,a=d.createElement("link"),l=o||"all";if(n)r=n;else{var f=(d.body||d.getElementsByTagName("head")[0]).childNodes;r=f[f.length-1]}
        var s=d.styleSheets;a.rel="stylesheet",a.href=t,a.media="only x",i(function(){r.parentNode.insertBefore(a,n?r:r.nextSibling)});var u=function(e){for(var t=a.href,n=s.length;n--;)if(s[n].href===t)return e();setTimeout(function(){u(e)})};return a.addEventListener&&a.addEventListener("load",function(){this.media=l}),a.onloadcssdefined=u,u(function(){a.media!==l&&(a.media=l)}),a};"undefined"!=typeof exports?exports.loadCSS=t:e.loadCSS=t}("undefined"!=typeof global?global:this),function(e){var t=function(t,n){"use strict";var o=e.document.getElementsByTagName("script")[0],i=e.document.createElement("script");return i.src=t,i.async=!0,o.parentNode.insertBefore(i,o),n&&"function"==typeof n&&(i.onload=n),i};"undefined"!=typeof module?module.exports=t:e.loadJS=t}("undefined"!=typeof global?global:this);
        loadCSS("http://localhost:3000/rimart/css/mian.css");
        lsoadJS("http://localhost:3000/rimart/js/mian.js");
</script>

</body>
</html>