+++
title = "kawari"
description = "Diffs privados y compartibles. Sin backend; todo almacenado en la URL."
weight = 3

[taxonomies]
tags = ["JavaScript", "privacidad", "web app", "PWA"]

[extra]
remote_image = "https://cdn.jsdelivr.net/gh/welpo/kawari@main/app/logo.png"
social_media_card = "blog/kawari-diff-in-the-url/social_cards/kawari.jpg"
+++

kawari es una aplicación web que genera diffs localmente y te permite compartirlos codificando todo en la URL. Sin servidor, cuentas ni seguimiento. Su nombre viene de la palabra japonesa para "cambio" (<ruby>変<rt>ka</rt></ruby><ruby>わ<rt>wa</rt></ruby><ruby>り<rt>ri</rt></ruby>).

#### [Pruébala ahora](https://diff.osc.garden) • [GitHub](https://github.com/welpo/kawari) • [Artículo](@/blog/kawari-diff-in-the-url/index.md) {.centered-text}

{% wide_container() %}
<a href="https://diff.osc.garden/#zZJvS8MwEMa_ypkXukEVcYpYRBBloDDfTPSFlZG2tzaQXkaSTsYo-CH8hH4Ss7bbLJaBfzGvktwdzz13vznjzGdIeQZDTDIkC_OAwJ2hogTmYIWV6MP2jrHcigiM1R5wbYWxzV8ovLpQSKQIXa3BSFFsfMh7B6vwQJGSKsmx876666JFQAGNCSS3OCKRpHY00SrRPOt0YfcM7jA6rZs8W3Y5xWjrobqW2lXY96vu14HFqa0E7AanqGGAnGzAvGbS0lrAzjPUIuIEfaVsyKVs5BZem-pH67399tT1GJr6AbtNEULkuZ2BGoN1r3IWkPEYIRUZGB43Wum2trJpAH3nRlCywfx1LhHhQufCYKvvx3JfzGPhv-GnLF78KLq6_F26VioOk7FdwCTiakuvzy9wcrzXg_4gYJ_fzF-ieXj0FTSNyiUIAylyiTGEMwerYwmehE0hSoWMNdI3-Vzo3CstYxhOBJkf4ZQcp_ViWPEG">
{{ dual_theme_image(light_src="img/screenshot_light.png", dark_src="img/screenshot_dark.png", alt="Captura de pantalla de kawari mostrando un diff lado a lado de un programa en Rust, con adiciones en verde y eliminaciones en rojo") }}
</a>
{% end %}

## Características

- Privado: los textos nunca salen de tu navegador
- Compartible: el diff completo se comprime y almacena en la URL
- Vistas de diff lado a lado y unificada
- Mini-mapa para navegar por diffs grandes
- Navegación con teclado tipo vim (<kbd>j</kbd>/<kbd>k</kbd>)
- Opciones para ignorar diferencias de espacios en blanco y estilos de comillas
- Service workers para no bloquear el navegador en diffs grandes
- Instalable como PWA para funcionalidad offline completa
- Sin dependencias: JavaScript, HTML y CSS vanilla
