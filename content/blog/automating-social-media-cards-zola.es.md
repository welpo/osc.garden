+++
title = "De reservado a rey de las redes: automatizando las vistas previas de los enlaces con Zola"
date = 2023-09-06
description = "Con el objetivo de hacer los sitios web de Zola más compatibles con las redes sociales, he descifrado el código para automatizar la generación de las previsualizaciones de enlaces."

[taxonomies]
tags = ["aprendizaje del día", "Zola", "automatización"]

[extra]
copy_button = true
footnote_backlinks = true
social_media_card = "img/social_cards/es_blog_automating_social_media_cards_zola.jpg"
+++

Las miniaturas para redes sociales añaden un toque interesante a los enlaces compartidos en WhatsApp, Telegram, Mastodon… Haz clic en la imagen para ver a qué me refiero.

{{ image_toggler(default_src="img/without_social_media_card.webp", toggled_src="img/with_social_media_card.webp", default_alt="Enlace sin miniatura", toggled_alt="Enlace con miniatura") }}

Mientras desarrollaba el tema de mi web —[tabi](https://github.com/welpo/tabi)—, me topé con [un artículo de Simon Wilson](https://til.simonwillison.net/shot-scraper/social-media-cards) que explica cómo utilizar su herramienta [`shot-scraper`](https://shot-scraper.datasette.io/en/stable/) para generar estas imágenes.

Decidí explorar si podía seguir un enfoque similar para crear las miniaturas para todos los artículos de este sitio, así como los de [la demo de tabi](https://welpo.github.io/tabi/). Y, aún más divertido, intentar automatizar el proceso para las publicaciones nuevas y modificadas.

## Contexto

Este sitio está construido con [Zola](https://www.getzola.org/), que utiliza [el front matter de TOML](https://www.getzola.org/documentation/content/page/#front-matter) para almacenar metadatos (por ejemplo, título, fecha, etiquetas…). Por defecto, Zola no gestiona estas imágenes.

Sin embargo, es posible añadir variables personalizadas a la sección `[extra]`, así que decidí añadir una clave `social_media_card` a tabi ([PR 130](https://github.com/welpo/tabi/pull/130)).

Ahora, cualquier sitio que utilice tabi puede añadir `social_media_card = path/to/img.jpg` a un archivo. Cuando la publicación se comparta en redes sociales, esa imagen se mostrará como vista previa.

## Primer paso: conseguir una buena imagen

Empecé a experimentar con `shot-scraper`, tratando de encontrar el comando perfecto. Después de algunas pruebas[^1], terminé con:

```bash
shot-scraper 127.0.0.1:1111 -w 700 -h 400 --retina --quality 60
```

Este comando crea una captura de pantalla JPEG de 1400 por 800 con un factor de calidad de 60. Creo que funciona bien para las proporciones del tema:

{{ dual_theme_image(light_src="img/social_cards/index.jpg", dark_src="img/dark_index_screenshot.jpg" alt="Una captura de pantalla de la página principal de osc.garden") }}

La calidad no es excelente, pero es suficientemente buena™ para el uso que tendrán.

## Eligiendo el nombre de los archivos

La documentación para desarrolladores de Meta [dice](https://developers.facebook.com/docs/sharing/webmasters/#images):

{{ multilingual_quote(original="[Social media card] Images are cached based on the URL and won't be updated unless the URL changes.", translated="Las imágenes para miniaturas se almacenan en caché según la URL y no se actualizarán a menos que la URL cambie.") }}

Esto significa que si actualizamos una publicación, la URL de la imagen también debe cambiar.

Primero pensé en utilizar el hash truncado [SHA-1](https://simple.wikipedia.org/wiki/SHA-1) de la captura de pantalla como prefijo para el nombre. Si la imagen era diferente, el nombre también lo sería.

Luego recordé que simplmente podía añadir el mecanismo de «cache busting» de Zola a tabi, que añade `?h=<sha256>` al final de la URL. Esto simplifica bastante el proceso, especialmente cuando se trata de actualizar los metadatos del artículo.

## La lógica

Dado un archivo Markdown (un artículo) necesitamos:

1. Tomar una captura de pantalla de la página en vivo
2. Guardarla en la ruta adecuada (por ejemplo, `static/img/social_cards`)
3. Actualizar el front matter (metadatos) del archivo `.md` con la ruta `social_media_card`

Así es como conseguí los dos primeros pasos usando Bash:

```bash
base_url="http://127.0.0.1:1111"  # Interfaz/puerto predeterminados de Zola.
output_path="static/img/social_cards"
post="$1"  # El primer argumento que se proporcione al script.

post_name="${post%.md}"  # Elimina la extensión.
url="${post_name#content/}"  # Elimina el prefijo "content/"; el directorio padre del contenido de Zola.

# Archivo temporal para la captura de pantalla.
temp_file=$(mktemp /tmp/social-cards-zola.XXXXXX)
trap 'rm -f "$temp_file"' EXIT  # Elimina el archivo temporal al salir.

# Genera la captura de pantalla en el archivo temporal.
shot-scraper --silent "${base_url}/${url}" -w 700 -h 400 --retina --quality 60 -o "$temp_file"

# Limpia el nombre del archivo.
safe_filename=$(echo "${url##*/}" | sed 's/[^a-zA-Z0-9]/_/g')  # Slugify.
image_filename="${output_path}/${safe_filename}.jpg"

# Mueve la captura de pantalla al directorio de salida.
mv "$temp_file" "$image_filename"
```

¡Fácil! Guardé el script como `social-cards-zola`.

## Empiezan los problemas

### ¿Qué pasa con los idiomas?

En este punto, con el script básico hecho, me encontré con un problema: los nombres de archivo no siempre coinciden con las URL.

Un post en otro idioma, por ejemplo, `el-meu-primer-post.ca.md`, no estará disponible en `base_url/el-meu-primer-post.ca`, sino en `base_url/ca/el-meu-primer-post`.

Añadamos un poco de lógica para extraer el código de idioma y construir la URL adecuada. Usando la [expansión de parámetros](https://mywiki.wooledge.org/BashGuide/Parameters#Parameter_Expansion) de Bash, obtenemos:

```bash
# Elimina la extensión y el prefijo "content/".
post_name="${post%.md}"
url="${post_name#content/}"
# Intenta capturar el código de idioma.
lang_code="${url##*.}"

if [[ "$lang_code" == "$url" ]]; then
    # No había código de idioma.
    lang_code=""
else
    # Elimina el código de idioma de la URL.
    url="${url%.*}"
fi

url="${lang_code}/${url}"
```

Listo.

### ¿Y las secciones?

Ya hemos conseguido que los artículos tengan una captura de pantalla, pero ¿qué hay del índice principal o la página de archivo? En Zola, no son [páginas](https://www.getzola.org/documentation/content/page/), sino [secciones](https://www.getzola.org/documentation/content/section/), y su URL corresponde al nombre del directorio. Por ejemplo, `content/archive/_index.fr.md` está disponible en `base_url/fr/archive/`.

Podemos adaptar la lógica anterior para eliminar la parte `_index` del nombre del archivo:

```bash, hl_lines=17-20
function convert_filename_to_url() {
    # Eliminamos la extensión.
    local post_name="${1%.md}"

    # Eliminamos el prefijo "content/".
    local url="${post_name#content/}"

    # Extraemos el código de idioma, si existe.
    local lang_code="${url##*.}"
    if [[ "$lang_code" == "$url" ]]; then
        lang_code=""  # No hay código de idioma.
    else
        lang_code="${lang_code}/"  # Añadir una barra al final.
        url="${url%.*}"  # Eliminar el código de idioma de la URL.
    fi

    # Eliminamos el sufijo "_index".
    if [[ "$url" == *"_index"* ]]; then
        url="${url%%_index*}"
    fi

    # Devolvemos la URL completa con una barra al final.
    full_url="${lang_code}${url}"
    echo "${full_url%/}/"
}
```

Así es como `convert_filename_to_url` maneja diferentes archivos:

{% wide_container() %}

| Entrada                        | Salida              |
| ------------------------------ | --------------------|
| `content/_index.es.md`         | `es/`               |
| `content/blog/markdown.fr.md`  | `fr/blog/markdown/` |
| `content/blog/comments.md`     | `blog/comments/`    |
| `content/archive/_index.md`    | `archive/`          |
| `content/archive/_index.ca.md` | `ca/archive/`       |

{% end %}

Si añadimos la URL base antes de cada salida, obtenemos el enlace completo.

## Modificando los metadatos

Ahora puedo generar fácilmente las capturas de pantalla para las entradas, pero aún necesito asociar las imágenes con los archivos Markdown.

Para actualizar los metadatos, utilicé [`awk`](https://es.wikipedia.org/wiki/AWK) para encontrar dónde empieza el front matter, localizar o crear la sección `[extra]`, y añadir o actualizar la clave `social_media_card`:

```awk
# Inicializar las variables para el seguimiento del estado.
BEGIN { in_extra=done=front_matter=0; }

# Función para insertar la ruta de la miniatura.
function insert_card() { print "social_media_card = \"" card_path "\""; done=1; }

{
    # Si la miniatura se ha insertado, simplemente muestra las líneas restantes.
    if (done) { print; next; }

    # Cambiar la bandera front_matter al inicio, denotado por +++
    if (/^\+\+\+/ && front_matter == 0) {
        front_matter = 1;
        print "+++";
        next;
    }

    # Detectar sección [extra] y establecer la bandera extra_exists.
    if (/^\[extra\]/) { in_extra=1; extra_exists=1; print; next; }

    # Actualizar la miniatura existente para redes sociales.
    if (in_extra && /^social_media_card =/) { insert_card(); in_extra=0; next; }

    # Fin del front matter o inicio de una nueva sección.
    if (in_extra && (/^\[[a-zA-Z_-]+\]/ || (/^\+\+\+/ && front_matter == 1))) {
        insert_card();  # Añadir la miniatura faltante para redes sociales.
        in_extra=0;
    }

    # Insertar la sección [extra] faltante.
    if (/^\+\+\+/ && front_matter == 1 && in_extra == 0 && extra_exists == 0) {
        print "\n[extra]";
        insert_card();
        in_extra=0;
        front_matter = 0;
        print "+++";
        next;
    }

    # Mostrar todas las demás líneas tal cual.
    print;
}
```

Agregué esta función a `social-cards-zola`, que se activa con la opción `-u` o `--update-front-matter`.

## Concurrencia

Quería crear las imágenes para todas las entradas a la vez, así que utilicé [GNU parallel](https://www.gnu.org/software/parallel/) para procesar todos los archivos Markdown de manera concurrente:

```bash
find content -type f -name '*.md' | parallel -j 8 'social-cards-zola \
    -o static/img/social_cards -b https://osc.garden -u -p -i {}'
```

Unos segundos después, tenía un montón de capturas de pantalla y archivos Markdown actualizados. 🎉

## Automatizando el proceso

Naturalmente, el siguiente paso fue añadir este proceso a mi gancho pre-commit de Git, que ya estaba [actualizando las fechas de las publicaciones y optimizando archivos PNG](https://osc.garden/es/blog/zola-date-git-hook/).

Cada vez que hago un commit de archivos Markdown (nuevos o modificados), genero la captura de pantalla y actualizo la metadata del post o de la sección:

```bash
function generate_and_commit_card {
    local archivo=$1

    # Generar la miniatura para redes sociales y actualizar la metadata.
    miniatura_redes_sociales=$(social-cards-zola -o static/img/social_cards\
        -b http://127.0.0.1:1025 -u -p -i "$archivo")

    # Hacer commit de los cambios.
    git add "$miniatura_redes_sociales"
    git add "$archivo"
}

export -f generate_and_commit_card

# Crear/actualizar la miniatura para redes sociales para cada archivo Markdown modificado.
archivos_md_modificados=$(git diff --cached --name-only | grep '\.md$')
echo "$archivos_md_modificados" | parallel -j 8 generate_and_commit_card
```

Puedes ver cómo queda integrado en el [gancho pre-commit completo](https://github.com/welpo/osc.garden/blob/main/.githooks/pre-commit).

El script completo de `social-cards-zola`, con más ajustes (como el uso de una clave de front matter distinta), está disponible [en el repositorio de este sitio](https://github.com/welpo/osc.garden/blob/main/static/code/social-cards-zola).

## ¿Fin?

El script funciona, pero es bastante frágil: falla si lo usas fuera de la ruta raíz del sitio, requiere `parallel` para manejar la concurrencia, y probablemente falle si intentas actualizar muchos archivos Markdown a la vez (Zola reconstruye el sitio después de cada modificación, devolviendo errores 404 brevemente).

Estoy contento de haber resuelto el problema, pero también lo veo como una oportunidad para convertir este script suficientemente bueno™ en un pequeño pero sólido programa en Rust —¿un buen primer proyecto en Rust, no?

Así que… continuará, quizás.

---

[^1]: Inicialmente, estaba convirtiendo las capturas de pantalla PNG a WebP, ya que son significativamente más pequeñas (~40KB) que las JPEG de aspecto similar (~100KB). Sin embargo, al intentar hacer la captura para la primera imagen del artículo, me di cuenta de que WhatsApp no admite miniaturas para redes sociales en formato WebP. Lástima.
