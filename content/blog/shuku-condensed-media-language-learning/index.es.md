+++
title = "Condensando multimedia para aprender idiomas con shuku"
date = 2024-12-24
updated = 2024-12-26
description = "He creado una herramienta que convierte una película de 3 horas en un recurso de aprendizaje de 45 minutos. ¡Conserva el diálogo, descarta el resto!"
[taxonomies]
tags = ["código", "python", "lingüística", "multimedia"]

[extra]
stylesheets = ["css/shuku.css"]
social_media_card = "img/social_cards/es_blog_shuku_condensed_media_language_learning.jpg"
+++

He creado [shuku](https://github.com/welpo/shuku) para condensar películas y series conservando solo los diálogos:

<div id="animation-container">
  <noscript>
    <video class="invertible-image" controls muted width="1000" loop="true" autoplay="autoplay" title="demo de shuku" src="https://cdn.jsdelivr.net/gh/welpo/shuku/assets/animation_demo/shuku_demo.mov"></video>
  </noscript>
</div>

<script defer src="js/d3.min.js"></script>
<script defer src="js/generated_data.js"></script>
<script defer src="js/script.js"></script>

## ¿Por qué?

Cuanto más tiempo pasas inmerso en un idioma, más rápido lo adquieres.

Escucho podcasts en japonés mientras hago ejercicio o salgo a caminar. Como principiante, la comprensión es difícil. Sin contexto, solo puedo entender palabras individuales y frases cortas.

Una forma de aumentar masivamente el contexto es repetir contenido. Escuchar la pista de audio de una película que has visto antes te permite entender más que la primera vez. ¡Sabes lo que está sucediendo y cómo terminará todo!

La idea es ver una película o un episodio de una serie, y luego escuchar la versión condensada para aumentar la comprensión.

Como se ve arriba,algunas películas tienen más silencio que otras. Si alguien quiere usar Blade Runner 2049 para aprender inglés, en lugar de escuchar las 2 horas y 43 minutos completas, puede usar shuku para obtener la versión solo con diálogos en 55 minutos. ¡Mucho más eficiente!

## ¿Cómo?

Los archivos de subtítulos contienen toda la información que necesitamos: todas las frases de la película con su tiempo de inicio y fin. Un fragmento de Blade Runner 2049:

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

shuku usa estos tiempos para condensar el contenido. Un resumen del proceso:

1. Se ejecuta shuku con un archivo de vídeo como `Blade.Runner.2049.2017.2160p.UHD.BluRay.TrueHD.7.1.HDR.x265.mkv`
2. Si está habilitado, busca subtítulos coincidentes (si no, usa los internos)
3. Filtra los subtítulos no deseados (ver más abajo)
4. Crea una lista de segmentos de voz (tiempos de inicio/fin de los subtítulos)
5. Extrae los segmentos a un directorio temporal
6. Une los segmentos en un archivo de audio con metadatos y un nombre limpio: `Blade Runner 2049 (2017) (condensed).mp3`

## ¿Cómo se ve?

Aquí tienes un clip de Blade Runner 2049. El audio es el de la versión condensada:

{{ aside(text="El uso principal de shuku es audio condensado, no video.") }}

<video controls preload="none" width="800" poster="media/blade_runner_2049_poster.webp" title="Blade Runner 2049 clip original vs condensado" src="media/blade_runner_2049_original_vs_condensed.mp4"></video>

{{ admonition(type="info", text="Por defecto, shuku [agrega medio segundo alrededor de cada línea](https://github.com/welpo/shuku?tab=readme-ov-file#padding) para evitar cortes abruptos.") }}

Como puedes ver, los fragmentos de diálogo son casi idénticos, excepto que hay menos silencio en la versión condensada. La principal diferencia es que omitimos la pelea y el viaje.

## Origen de la idea

No he inventado yo la idea de «multimedia condensada»; existen al menos dos programas que pueden hacer esto: [`impd`](https://github.com/Ajatt-Tools/impd) (para GNU+Linux) y [`condenser`](https://github.com/ercanserteli/condenser) (para Windows).

Creé shuku porque ni `impd` ni `condenser` funcionaban en macOS. Mi primer enfoque fue crear un fork de `condenser` para reemplazar las partes específicas de Windows. Rápidamente me di cuenta de que quería implementar más cambios.

Así que me propuse crear el mejor condensador, con soporte multiplataforma, 100% de cobertura de código y amplia personalización.

El repositorio de shuku incluye una [tabla comparando las tres herramientas](https://github.com/welpo/shuku?tab=readme-ov-file#comparison-with-similar-tools).

## Desafíos

### Fuzzy matching

Dado un archivo de video `Blade Runner 2049.mkv`, shuku puede emparejarlo con su archivo de subtítulos `Blade Runner 2049 (1080p).srt`, incluso si no los nombres no coinciden al 100%.

Para lograrlo, shuku limpia tanto el nombre del archivo de entrada como todos los subtítulos potenciales. Por ejemplo:

- `Old_Movie_1950_Remastered_2023.mp4` → `old movie remastered 1950 2023`
- `Movie.Without.Year.1080p.BluRay.x264-GROUP.mkv` → `movie without year bluray`
- `TV.Show.S01E01.2021.720p.WEB-DL.x264.srt` → `tv show s01e01 web-dl 2021`

El nombre limpio del video (input) se compara con todos los nombres limpios de los archivos de subtítulos.

Para encontrar la coincidencia más cercana, mi primera idea fue usar la [distancia de Hamming](https://es.wikipedia.org/wiki/Distancia_de_Hamming). Funcionaba, pero era demasiado sensible a pequeños cambios (como el orden de las palabras).

Probé múltiples enfoques y encontré la mejor precisión con [`SequenceMatcher`](https://docs.python.org/3/library/difflib.html) de Python. Esta función se basa en [el algoritmo de Ratcliff y Obershelp llamado Gestalt pattern matching](https://en.wikipedia.org/wiki/Gestalt_pattern_matching).

Con la función de limpieza, el comparador de secuencias y un umbral de match ajustable, el fuzzy matching no falla.

### No todas las líneas de subtítulos contienen diálogo

Una línea de subtítulos podría ser `[sonido de pasos]`. No necesitamos incluirla en el audio condensado.

Agregué una [opción de configuración](https://github.com/welpo/shuku?tab=readme-ov-file#line_skip_patterns) que por defecto omite los subtítulos encerrados en corchetes o notas musicales (♪ o ♬). Esto último es útil para descartas los openings y endings de series.

### Seguimiento del audio

shuku puede generar [archivos LRC](https://es.wikipedia.org/wiki/LRC) que coinciden con el audio condensado. Estos son archivos con texto sincronizado usados para letras de canciones.

Al agregar el audio y los subtítulos condensados a una app diseñada para seguir letras de canciones, como [Just Player (iOS)](https://apps.apple.com/app/just-player-lrc-offine-music/id1134401407), puedo consultar los subtítulos mientras escucho:

<video controls preload="none" class="invertible-image" width="400" poster="media/just_player_poster.webp" title="Just Player con Blade Runner 2049 condensado por shuku" src="media/just_player.mp4"></video>

Ahora puedo consultar la escritura de palabras que suenan familiares pero no acabo de entender; ¡súper útil para los kanji!

## Detalles técnicos

Mi enfoque fue hacer shuku mantenible, fácil de [instalar](https://github.com/welpo/shuku?tab=readme-ov-file#installation), fácil de usar y fácil de [contribuir](https://github.com/welpo/shuku/blob/main/CONTRIBUTING.md).

Python puede facilitar las contribuciones y me permite aprovechar [`pysubs2`](https://github.com/tkarabela/pysubs2), una fantástica biblioteca para trabajar con subtítulos.

[FFmpeg](https://ffmpeg.org/) es la única dependencia de shuku. A través del [binding `python-ffmpeg`](https://github.com/jonghwanhyeon/python-ffmpeg), FFmpeg maneja todo el procesamiento de medios: extracción y unión de segmentos, conversión de audio…

Me centré en crear código limpio y una buena experiencia de usuario:

- Los type hints en todo el código detectan problemas potenciales temprano.
- Configuración fácil con [TOML](https://toml.io/). Aquí está [mi configuración](https://github.com/welpo/dotfiles/blob/main/.config/shuku/shuku.toml).
- Logging con niveles personalizados. Ayuda a los usuarios (¡y a mí!) a entender qué está pasando.
- 100% de cobertura de código para fiabilidad y mantenibilidad.
- [CI](https://github.com/welpo/shuku/blob/main/.github/workflows/ci.yml)/[CD](https://github.com/welpo/shuku/blob/main/.github/workflows/cd.yml) automatizados y publicación de ([binarios](https://github.com/welpo/shuku/releases/) + [PyPI](https://pypi.org/project/shuku/)) para todas las plataformas con [atestaciones](https://docs.github.com/en/actions/security-for-github-actions/using-artifact-attestations/using-artifact-attestations-to-establish-provenance-for-builds).

Así es como se usa shuku:

<video controls preload="none" width="800" poster="media/cli_poster.webp" title="demo de shuku" src="https://cdn.jsdelivr.net/gh/welpo/shuku/assets/cli_demo/shuku_demo.mp4"></video>

---

Si estás aprendiendo un idioma por inmersión, seguro que encontrarás shuku útil. Echa un vistazo al [repositorio de GitHub](https://github.com/welpo/shuku) para empezar〜
