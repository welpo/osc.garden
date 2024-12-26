+++
title = "Condensant multimèdia per a l'aprenentatge d'idiomes amb shuku"
date = 2024-12-24
updated = 2024-12-26
description = "He creat una eina que converteix una pel·lícula de 3 hores en un recurs d'aprenentatge de 45 minuts. Conserva el diàleg, descarta la resta!"
[taxonomies]
tags = ["codi", "python", "lingüística", "multimèdia"]

[extra]
stylesheets = ["css/shuku.css"]
social_media_card = "img/social_cards/ca_blog_shuku_condensed_media_language_learning.jpg"
+++

He creat [shuku](https://github.com/welpo/shuku) per condensar pel·lícules i sèries conservant només els diàlegs:

<div id="animation-container">
  <noscript>
    <video class="invertible-image" controls muted width="1000" loop="true" autoplay="autoplay" title="demo de shuku" src="https://cdn.jsdelivr.net/gh/welpo/shuku/assets/animation_demo/shuku_demo.mov"></video>
  </noscript>
</div>

<script defer src="js/d3.min.js"></script>
<script defer src="js/generated_data.js"></script>
<script defer src="js/script.js"></script>

## Per què?

Com més temps passes immers en un idioma, més ràpid l'adquireixes.

Escolto podcasts en japonès mentre faig exercici o surto a caminar. Com a principiant, la comprensió és difícil. Sense context, només puc entendre paraules individuals i frases curtes.

Una manera d'augmentar massivament el context és repetir contingut. Escoltar la pista d'àudio d'una pel·lícula que has vist abans et permet entendre més que la primera vegada. Saps el que està passant i com acabarà tot!

La idea és veure una pel·lícula o un episodi d'una sèrie, i després escoltar la versió condensada per augmentar la comprensió.

Com es veu a dalt, algunes pel·lícules tenen més silenci que d'altres. Si algú vol fer servir Blade Runner 2049 per aprendre anglès, en lloc d'escoltar les 2 hores i 43 minuts complets, pot fer servir shuku per obtenir la versió només amb diàlegs en 55 minuts. Molt més eficient!

## Com?

Els arxius de subtítols contenen tota la informació que necessitem: totes les frases de la pel·lícula amb el seu temps d'inici i fi. Un fragment de Blade Runner 2049:

```srt
78
00:14:46,094 --> 00:14:49,184
Do you feel that there's a part of you
that's missing? Interlinked.

79
00:14:49,348 --> 00:14:51,768
-Within cells interlinked.
-Within cells interlinked.
```

shuku fa servir aquests temps per condensar el contingut. Un resum del procés:

1. S'executa shuku amb un arxiu de vídeo com `Blade.Runner.2049.2017.2160p.UHD.BluRay.TrueHD.7.1.HDR.x265.mkv`
2. Si està habilitat, busca subtítols coincidents (si no, fa servir els interns)
3. Filtra els subtítols no desitjats (veure més avall)
4. Crea una llista de segments de veu (temps d'inici/fi dels subtítols)
5. Extreu els segments a un directori temporal
6. Uneix els segments en un arxiu d'àudio amb metadades i un nom net: `Blade Runner 2049 (2017) (condensed).mp3`

## Com es veu?

Aquí tens un clip de Blade Runner 2049. L'àudio prové de la versió condensada:

{{ aside(text="L'ús principal de shuku és l'àudio condensat, no el vídeo.") }}

<video controls preload="none" width="800" poster="media/blade_runner_2049_poster.webp" title="Blade Runner 2049 original vs clip condensat" src="media/blade_runner_2049_original_vs_condensed.mp4"></video>

{{ admonition(type="info", text="Per defecte, shuku [afegeix mig segon al principi i final de cada línia](https://github.com/welpo/shuku?tab=readme-ov-file#padding) per evitar talls bruscos.") }}

Com pots veure, els fragments de diàleg són gairebé idèntics, excepte que hi ha menys silenci a la versió condensada. La principal diferència és que ens saltem la lluita i el viatge.

## Origen de la idea

No he inventat jo la idea de «multimèdia condensada»; existeixen almenys dos programes que poden fer això: [`impd`](https://github.com/Ajatt-Tools/impd) (per a GNU+Linux) i [`condenser`](https://github.com/ercanserteli/condenser) (per a Windows).

Vaig crear shuku perquè ni `impd` ni `condenser` funcionaven a macOS. El meu primer enfocament va ser crear un fork de `condenser` per reemplaçar les parts específiques de Windows. Ràpidament em vaig adonar que volia implementar més canvis.

Així que em vaig proposar crear el millor condensador, amb suport multiplataforma, 100% de cobertura de codi i àmplia personalització.

El repositori de shuku inclou una [taula comparant les tres eines](https://github.com/welpo/shuku?tab=readme-ov-file#comparison-with-similar-tools).

## Reptes

### Fuzzy matching

Donat un arxiu de vídeo `Blade Runner 2049.mkv`, shuku pot emparellar-lo amb el seu arxiu de subtítols `Blade Runner 2049 (1080p).srt`, fins i tot si els noms no coincideixen al 100%.

Per aconseguir-ho, shuku neteja tant el nom de l'arxiu d'entrada com tots els subtítols potencials. Per exemple:

- `Old_Movie_1950_Remastered_2023.mp4` → `old movie remastered 1950 2023`
- `Movie.Without.Year.1080p.BluRay.x264-GROUP.mkv` → `movie without year bluray`
- `TV.Show.S01E01.2021.720p.WEB-DL.x264.srt` → `tv show s01e01 web-dl 2021`

El nom net del vídeo (input) es compara amb tots els noms nets dels arxius de subtítols.

Per trobar la coincidència més propera, la meva primera idea va ser fer servir la [distància de Hamming](https://ca.wikipedia.org/wiki/Dist%C3%A0ncia_de_Hamming). Funcionava, però era massa sensible a petits canvis (com l'ordre de les paraules).

Vaig provar múltiples enfocaments i vaig trobar la millor precisió amb [`SequenceMatcher`](https://docs.python.org/3/library/difflib.html) de Python. Aquesta funció es basa en [l'algoritme de Ratcliff i Obershelp anomenat Gestalt pattern matching](https://en.wikipedia.org/wiki/Gestalt_pattern_matching).

Amb la funció de neteja, el comparador de seqüències i un llindar de match ajustable, el fuzzy matching no falla.

### No totes les línies de subtítols contenen diàleg

Una línia de subtítols podria ser `[so de passes]`. No necessitem incloure-la a l'àudio condensat.

Vaig afegir una [opció de configuració](https://github.com/welpo/shuku?tab=readme-ov-file#line_skip_patterns) que per defecte omet els subtítols tancats en claudàtors o notes musicals (♪ o ♬). Això últim és útil per descartar els openings i endings de sèries.

### Seguiment de l'àudio

shuku pot generar [arxius LRC](https://ca.wikipedia.org/wiki/LRC) que coincideixen amb l'àudio condensat. Aquests són arxius amb text sincronitzat utilitzats per a lletres de cançons.

En afegir l'àudio i els subtítols condensats a una app dissenyada per seguir lletres de cançons, com [Just Player (iOS)](https://apps.apple.com/app/just-player-lrc-offine-music/id1134401407), puc consultar els subtítols mentre escolto:

<video controls preload="none" class="invertible-image" width="400" poster="media/just_player_poster.webp" title="Just Player amb Blade Runner 2049 condensat per shuku" src="media/just_player.mp4"></video>

Ara puc consultar l'escriptura de paraules que sonen familiars però no acabo d'entendre; super útil per als kanji!

## Detalls tècnics

El meu enfocament va ser fer shuku mantenible, fàcil d'[instal·lar](https://github.com/welpo/shuku?tab=readme-ov-file#installation), fàcil d'usar i fàcil de [contribuir-hi](https://github.com/welpo/shuku/blob/main/CONTRIBUTING.md).

Python pot facilitar les contribucions i em permet aprofitar [`pysubs2`](https://github.com/tkarabela/pysubs2), una fantàstica biblioteca per treballar amb subtítols.

[FFmpeg](https://ffmpeg.org/) és l'única dependència de shuku. A través del [binding `python-ffmpeg`](https://github.com/jonghwanhyeon/python-ffmpeg), FFmpeg gestiona tot el processament de mitjans: extracció i unió de segments, conversió d'àudio…

Em vaig centrar en crear codi net i una bona experiència d'usuari:

- Els type hints a tot el codi detecten problemes potencials d'hora.
- Configuració fàcil amb [TOML](https://toml.io/). Aquí està [la meva configuració](https://github.com/welpo/dotfiles/blob/main/.config/shuku/shuku.toml).
- Logging amb nivells personalitzats. Ajuda els usuaris (i a mi!) a entendre què està passant.
- 100% de cobertura de codi per a fiabilitat i mantenibilitat.
- [CI](https://github.com/welpo/shuku/blob/main/.github/workflows/ci.yml)/[CD](https://github.com/welpo/shuku/blob/main/.github/workflows/cd.yml) automatitzats i publicació de ([binaris](https://github.com/welpo/shuku/releases/) + [PyPI](https://pypi.org/project/shuku/)) per a totes les plataformes amb [atestacions](https://docs.github.com/en/actions/security-for-github-actions/using-artifact-attestations/using-artifact-attestations-to-establish-provenance-for-builds).

Així és com es fa servir shuku:

<video controls preload="none" width="800" poster="media/cli_poster.webp" title="demo de shuku" src="https://cdn.jsdelivr.net/gh/welpo/shuku/assets/cli_demo/shuku_demo.mp4"></video>

---

Si estàs aprenent un idioma per immersió, segur que trobaràs shuku útil. Fes una ullada al [repositori de GitHub](https://github.com/welpo/shuku) per començar〜
