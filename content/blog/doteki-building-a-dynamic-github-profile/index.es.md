+++
title = "Creando una herramienta para añadir contenido dinámico a mi perfil de GitHub"
date = 2024-04-30
updated = 2024-05-23
description = "Cómo construí dōteki, una herramienta basada en plugins para añadir contenido dinámico a perfiles de GitHub. Inspiración, proceso de pensamiento y planes futuros."

[taxonomies]
tags = ["código", "automatización"]

[extra]
social_media_card = "img/social_cards/projects_doteki.jpg"
+++

El perfil de GitHub de [Simon Willison](https://simonwillison.net/) me inspiró a construir una herramienta para añadir contenido dinámico a mi perfil. [Su perfil](https://github.com/simonw/simonw) se ve así:

{{ dual_theme_image(light_src="img/simonw_light.webp", dark_src="img/simonw_dark.webp", alt="Captura de pantalla del perfil de GitHub de Simon Willison, mostrando tres columnas: lanzamientos recientes, en mi blog y TIL (Hoy Aprendí).", full_width=true) }}

{{ admonition(type="tip", text="Para añadir contenido a tu perfil de GitHub, crea un repositorio con un nombre que coincida con tu nombre de usuario (por ejemplo, [github.com/welpo/welpo](https://github.com/welpo/welpo)) y añade un archivo `README.md`. Su contenido se mostrará en tu perfil.") }}

El perfil de Willison ofrece una visión general de lo que ha estado escribiendo, tanto en términos de prosa como de código. Al explorar el [contenido en bruto de su archivo `README.md`](https://raw.githubusercontent.com/simonw/simonw/main/README.md), vi estos marcadores de inicio/fin:

```txt,hl_lines=2 4
### Recent releases
<!-- recent_releases starts -->
[aquí las actualizaciones recientes]
<!-- recent_releases ends -->
```

Son comentarios HTML —invisibles pero útiles. Willison usa un [script de Python](https://github.com/simonw/simonw/blob/main/build_readme.py) para añadir sus actualizaciones recientes de software y publicaciones entre los marcadores. Una GitHub Action se encarga de que esté siempre al día.

Bastante ingenioso, ¿no? Después de ver esto tenía ganas de mostrar en mi perfil las últimas entradas de mi blog y la música que he estado escuchando.

## ¿Un proyecto de un fin de semana?

Creé un archivo Python con dos funciones, una para obtener el feed de mi blog y devolver una lista de publicaciones, y otra que llamaba a la API de Last.fm para obtener mis artistas más escuchados de la semana. Ambas funciones necesitaban:

- encontrar los marcadores HTML en mi `README.md`;
- limitar los resultados (publicaciones o artistas) a los primeros `n` elementos;
- dar formato MarkDown;
- reemplazar el contenido dentro de los marcadores.

Mi solución: crear un programa general para manejar los requisitos comunes, y módulos independientes para tareas específicas como obtener las publicaciones o mis artistas más escuchados. Llamé a estos módulos «plugins».

Aunque existe más de una herramienta para mostrar publicaciones recientes, no encontré ninguna para mostrar de forma limpia mis hábitos musicales. Además, las herramientas que añaden contenido dinámico a un perfil de GitHub usan varios métodos de configuración: archivos YAML que generan el `README` desde cero, marcadores HTML como los que hemos visto, o contenido incrustado desde aplicaciones web de Vercel. Establecer un [Estándar de Plugins](https://doteki.org/docs/developer-guide/plugin-standard) y usar un único archivo de configuración [TOML](https://doteki.org/docs/configuration/) era el enfoque óptimo.

El programa general funcionaría con dos archivos: el `README.md` del perfil y un archivo de configuración TOML. En el `README.md` añadiría los comentarios HTML para marcar dónde debe ir el contenido dinámico. Por ejemplo:

```markdown
He estado escuchando a <!-- music start --><!-- music end -->.
```

El archivo de configuración definiría qué hacer en cada par de marcadores (una sección). Es decir: ¿cuál es el identificador de la sección? ¿Qué plugin necesitamos ejecutar? ¿Con qué configuración? Por ejemplo:

```toml
[sections.music]
plugin = "lastfm"
username = "welpo"
```

Esto buscará el par de marcadores identificados con «`music`» y ejecutará el plugin `lastfm` con mi nombre de usuario. El resultado del plugin se colocará entre los marcadores: `<!-- music start -->[Aquí]<!-- music end -->`.

El programa principal, dōteki («dinámico» en japonés), maneja las siguientes tareas:

- Procesar el archivo de configuración TOML y los argumentos de línea de comandos.
- Leer el contenido del archivo `README.md`.
- Encontrar los marcadores para cada sección del archivo de configuración.
- Por cada sección:
  - Llamar a la función `run` del plugin especificado, pasando la configuración correspondiente.
  - Formatear la salida del plugin. Por ejemplo, convirtiéndola en una lista separada por comas, o en una lista de MarkDown (como esta).
  - Reemplazar el contenido entre los marcadores con el resultado del plugin formateado.
- Guardar el archivo `README.md`.

Los plugins son archivos Python independientes que devuelven *algo*: una lista de publicaciones, canciones escuchadas recientemente, la fecha actual…

## Unos extras

Para automatizar las actualizaciones creé mi primera GitHub Action: [`doteki-action`](https://github.com/welpo/doteki-action). Sus [50 líneas](https://github.com/welpo/doteki-action/blob/main/action.yaml) configuran Python y sus dependencias, ejecutan dōteki con el archivo de configuración en el repositorio del usuario, y guardan los cambios.

Aunque dōteki no es mi primer proyecto de Python público, es el primero que consideré digno de publicar en PyPI, el repositorio oficial de software para Python. Fue un proceso de aprendizaje con intentos y errores y algunas versiones retiradas, pero ahora el proceso de publicación está [automatizado](https://github.com/welpo/doteki/blob/main/.github/workflows/cd.yml): cuando subo un tag de Git con un número de versión a GitHub, una GitHub Action publica en [PyPI](https://pypi.org/project/doteki/), crea una [GitHub release](https://github.com/welpo/doteki/releases), y actualiza la [acción de dōteki](https://github.com/welpo/doteki-action) para usar la versión más reciente. Todo esto con [un changelog bien bonito](https://github.com/welpo/doteki/blob/main/CHANGELOG.md).

Aprendí a usar dos herramientas más: [Mend Renovate](https://www.mend.io/renovate/) para automatizar la actualización de dependencias a través de pull requests ([ejemplo](https://github.com/welpo/doteki/pull/26)), y [Docusaurus](https://docusaurus.io/) para construir [una web moderna para la documentación](https://doteki.org/).

## Compartir es aprender

Escribir la [documentación del proyecto](https://doteki.org/docs) ayudó a aclarar mis objetivos, me hizo pensar cómo presentarlo —qué destacar— y cómo facilitar la introducción para usuarios nuevos. Explicar el código a amigos sacó a la luz ineficiencias y redundancias que había pasado por alto.

Uno de estos amigos había recomendado el libro [Clean Code, de Robert C. Martin](https://www.oreilly.com/library/view/clean-code-a/9780136083238/) (¡buena lectura!). Escribir dōteki me dio la oportunidad de aplicar los principios del libro. Mi esperanza es que el código principal ([`cli.py`](https://github.com/welpo/doteki/blob/main/doteki/cli.py)) pueda ser entendido leyéndolo de arriba abajo.

## El futuro del proyecto

La primera versión de dōteki incluyó cuatro plugins:

- [Current Date Plugin](https://doteki.org/docs/plugins/current_date), que devuelve la fecha actual;
- [Feed Plugin](https://doteki.org/docs/plugins/feed) para buscar y formatear entradas de un feed RSS/Atom;
- [Last.fm Plugin](https://doteki.org/docs/plugins/lastfm) para mostrar los principales artistas, álbumes, pistas o etiquetas;
- [Random Choice Plugin](https://doteki.org/docs/plugins/random_choice), que devuelve un elemento aleatorio de una lista.

Me encantaría ver crecer el proyecto, tanto en términos de usuarios como de colaboradores. En cuanto a mis metas personales, planeo crear estos dos plugins:

- Recent Releases Plugin: devuelve una lista de los lanzamientos recientes de proyectos de GitHub;
- Currently Reading Plugin, para mostrar qué libro estoy leyendo, compatible con Goodreads y/o Literal.

---

No es la primera vez que un proyecto de «fin de semana» se convierte en un proyecto de varias semanas; los requisitos crecieron junto con las líneas de código. Sin embargo, ha sido una experiencia de aprendizaje divertida, y estoy orgulloso de la herramienta, su documentación y la infraestructura de CI/CD.

Si quieres saber más sobre dōteki, consulta estos enlaces:

- [Sitio web / Documentación](https://doteki.org/)
- [Repositorio en GitHub](https://github.com/welpo/doteki)
- [Mi perfil de GitHub](https://github.com/welpo) para verlo en acción.

El proyecto está abierto a todo tipo de contribuciones: solicitudes de funcionalidad, correcciones de errores, mejoras en la documentación, nuevos plugins… Si tienes una idea para un plugin o quieres compartir tus pensamientos, puedes usar los comentarios más abajo, mandarme un correo, o usar el [issue tracker](https://github.com/welpo/doteki/issues) o las [discusiones](https://github.com/welpo/doteki/discussions) del proyecto.
