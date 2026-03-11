+++
title = "kawari"
description = "Diffs privats i compartibles. Sense backend; tot emmagatzemat a la URL."
weight = 3

[taxonomies]
tags = ["JavaScript", "privadesa", "web app", "PWA"]

[extra]
remote_image = "https://cdn.jsdelivr.net/gh/welpo/kawari@main/app/logo.png"
social_media_card = "blog/kawari-diff-in-the-url/social_cards/kawari.jpg"
+++

kawari és una aplicació web que genera diffs localment i et permet compartir-los codificant-ho tot a la URL. Sense servidor, comptes ni seguiment. El nom ve de la paraula japonesa per a "canvi" (<ruby>変<rt>ka</rt></ruby><ruby>わ<rt>wa</rt></ruby><ruby>り<rt>ri</rt></ruby>).

#### [Prova-la ara](https://diff.osc.garden) • [GitHub](https://github.com/welpo/kawari) • [Article](@/blog/kawari-diff-in-the-url/index.md) {.centered-text}

{% wide_container() %}
<a href="https://diff.osc.garden/#zZJvS8MwEMa_ypkXukEVcYpYRBBloDDfTPSFlZG2tzaQXkaSTsYo-CH8hH4Ss7bbLJaBfzGvktwdzz13vznjzGdIeQZDTDIkC_OAwJ2hogTmYIWV6MP2jrHcigiM1R5wbYWxzV8ovLpQSKQIXa3BSFFsfMh7B6vwQJGSKsmx876666JFQAGNCSS3OCKRpHY00SrRPOt0YfcM7jA6rZs8W3Y5xWjrobqW2lXY96vu14HFqa0E7AanqGGAnGzAvGbS0lrAzjPUIuIEfaVsyKVs5BZem-pH67399tT1GJr6AbtNEULkuZ2BGoN1r3IWkPEYIRUZGB43Wum2trJpAH3nRlCywfx1LhHhQufCYKvvx3JfzGPhv-GnLF78KLq6_F26VioOk7FdwCTiakuvzy9wcrzXg_4gYJ_fzF-ieXj0FTSNyiUIAylyiTGEMwerYwmehE0hSoWMNdI3-Vzo3CstYxhOBJkf4ZQcp_ViWPEG">
{{ dual_theme_image(light_src="img/screenshot_light.png", dark_src="img/screenshot_dark.png", alt="Captura de pantalla de kawari mostrant un diff costat a costat d'un programa en Rust, amb addicions en verd i eliminacions en vermell") }}
</a>
{% end %}

## Característiques

- Privat: els textos mai surten del teu navegador
- Compartible: el diff complet es comprimeix i s'emmagatzema a la URL
- Vistes de diff costat a costat i unificada
- Mini-mapa per navegar per diffs grans
- Navegació amb teclat tipus vim (<kbd>j</kbd>/<kbd>k</kbd>)
- Opcions per ignorar diferències d'espais en blanc i estils de cometes
- Service workers per no bloquejar el navegador en diffs grans
- Instal·lable com a PWA per a funcionalitat offline completa
- Sense dependències: JavaScript, HTML i CSS vanilla
