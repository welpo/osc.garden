+++
title = "Automatitzant les vistes prèvies dels enllaços per Zola"
date = 2023-09-06
updated = 2024-05-23
description = "Desenvolupament d'un script de Bash per crear previsualitzacions d'enllaços per a xarxes socials."

[taxonomies]
tags = ["aprenentatge del dia", "Zola", "automatització"]

[extra]
copy_button = true
social_media_card = "img/social_cards/ca_blog_automating_social_media_cards_zola.jpg"
+++

T'has preguntat alguna vegada com aplicacions com WhatsApp, Telegram o Mastodon mostren una vista prèvia d'un enllaç? A continuació, trobaràs la captura de pantalla d'un link compartit a WhatsApp sense vista prèvia. Fes clic a la imatge per veure com canvia en afegir la imatge:

{{ image_toggler(default_src="img/without_social_media_card.webp", toggled_src="img/with_social_media_card.webp", default_alt="Enllaç sense miniatura", toggled_alt="Enllaç amb miniatura") }}

Molt millor, oi? Aquestes imatges s'obtenen d'etiquetes HTML, concretament `og:image` i `twitter:image`. Pots assignar qualsevol imatge a aquestes etiquetes.

Mentre desenvolupava el tema del meu lloc web —[tabi](https://github.com/welpo/tabi)—, em vaig topar amb [un article de Simon Willison](https://til.simonwillison.net/shot-scraper/social-media-cards) que explica com utilitzar la seva eina [`shot-scraper`](https://shot-scraper.datasette.io/en/stable/) per generar aquestes imatges.

Vaig decidir explorar si podia seguir una enfocament similar per crear les miniatures per a tots els articles d'aquest lloc, així com els de [la demo de tabi](https://welpo.github.io/tabi/). I, encara més divertit, intentar automatitzar el procés per a futures publicacions.

## Context

Aquest lloc està construït amb [Zola](https://www.getzola.org/), que utilitza [el front matter de TOML](https://www.getzola.org/documentation/content/page/#front-matter) per emmagatzemar metadades (per exemple, títol, data, etiquetes…). Per defecte, Zola no gestiona aquestes imatges.

No obstant això, és possible afegir variables personalitzades a la secció `[extra]`, així que vaig decidir afegir una clau `social_media_card` a tabi ([PR 130](https://github.com/welpo/tabi/pull/130)).

Ara, qualsevol lloc que utilitzi tabi pot afegir `social_media_card = path/to/img.jpg` a un fitxer. Quan la publicació es comparteixi a les xarxes socials, aquesta imatge es mostrarà com a vista prèvia.

## Primer pas: aconseguir una bona imatge

Vaig començar a experimentar amb `shot-scraper`, intentant trobar la comanda perfecta. Després d'algunes proves[^1], vaig acabar amb:

```bash
shot-scraper 127.0.0.1:1111 -w 700 -h 400 --retina --quality 60
```

Aquesta comanda crea una captura de pantalla JPEG de 1400 per 800 amb un factor de qualitat de 60. Crec que funciona bé per a les proporcions del tema:

{{ dual_theme_image(light_src="img/social_cards/index.jpg", dark_src="img/dark_index_screenshot.jpg" alt="Una captura de pantalla de la pàgina principal de osc.garden") }}

La qualitat no és excel·lent, però és prou bona™ per a l'ús que se'n farà.

## Triant el nom dels fitxers

La documentació per a desenvolupadors de Meta [diu](https://developers.facebook.com/docs/sharing/webmasters/#images):

{{ multilingual_quote(original="[Social media card] Images are cached based on the URL and won't be updated unless the URL changes.", translated="Les imatges per a miniatures s'emmagatzemen en memòria cau en base a l'URL i no s'actualitzaran a menys que l'URL canviï.") }}

Això significa que si actualitzem una publicació, la URL de la imatge també ha de canviar.

Primer vaig pensar a utilitzar el hash truncat [SHA-1](https://simple.wikipedia.org/wiki/SHA-1) de la captura de pantalla com a prefix per al nom. Si la imatge era diferent, el nom també ho seria.

Després vaig recordar que simplement podia afegir el mecanisme de «cache busting» de Zola a tabi, que afegeix `?h=<sha256>` al final de l'URL. Això simplifica força el procés, especialment quan es tracta d'actualitzar les metadades de l'article.

## La lògica

Donat un fitxer Markdown (un article) hem de:

1. Fer una captura de pantalla de la pàgina en viu
2. Guardar-la a la ruta adequada (per exemple, `static/img/social_cards`)
3. Actualitzar el front matter (metadades) del fitxer `.md` amb la ruta `social_media_card`

Així és com vaig aconseguir els dos primers passos utilitzant Bash:

```bash
base_url="http://127.0.0.1:1111"  # Interfície/port predeterminats de Zola.
output_path="static/img/social_cards"
post="$1"  # El primer argument que es proporcioni a l'script.

post_name="${post%.md}"  # Elimina l'extensió.
url="${post_name#content/}"  # Elimina el prefix "content/"; el directori pare del contingut de Zola.

# Arxiu temporal per a la captura de pantalla.
temp_file=$(mktemp /tmp/social-cards-zola.XXXXXX)
trap 'rm -f "$temp_file"' EXIT  # Elimina l'arxiu temporal en sortir.

# Genera la captura de pantalla a l'arxiu temporal.
shot-scraper --silent "${base_url}/${url}" -w 700 -h 400 --retina --quality 60 -o "$temp_file"

# Neteja el nom de l'arxiu.
safe_filename=$(echo "${url##*/}" | sed 's/[^a-zA-Z0-9]/_/g')  # Slugify.
image_filename="${output_path}/${safe_filename}.jpg"

# Mou la captura de pantalla al directori de sortida.
mv "$temp_file" "$image_filename"
```

¡Fàcil! Vaig guardar l'script com a `social-cards-zola`.

## Comencen els problemes

### Què passa amb els idiomes?

En aquest punt, amb l'script bàsic fet, em vaig trobar amb un problema: els noms d'arxiu no sempre coincideixen amb les URL.

Una publicació en un altre idioma, per exemple, `mi-primer-post.es.md`, no estarà disponible a `base_url/mi-primer-post.es`, sinó a `base_url/es/mi-primer-post`.

Afegim una mica de lògica per extreure el codi d'idioma i construir l'URL adequada. Utilitzant l'[expansió de paràmetres](https://mywiki.wooledge.org/BashGuide/Parameters#Parameter_Expansion) de Bash, obtenim:

```bash
# Elimina l'extensió i el prefix "content/".
post_name="${post%.md}"
url="${post_name#content/}"
# Intenta capturar el codi d'idioma.
lang_code="${url##*.}"

if [[ "$lang_code" == "$url" ]]; then
    # No hi havia codi d'idioma.
    lang_code=""
else
    # Elimina el codi d'idioma de l'URL.
    url="${url%.*}"
fi

url="${lang_code}/${url}"
```

Llest.

### I les seccions?

Ja hem aconseguit que les articles tinguin una captura de pantalla, però què passa amb l'índex principal o la pàgina d'arxiu? A Zola, no són [pàgines](https://www.getzola.org/documentation/content/page/), sinó [seccions](https://www.getzola.org/documentation/content/section/), i la seva URL correspon al nom del directori. Per exemple, `content/archive/_index.fr.md` està disponible a `base_url/fr/archive/`.

Podem adaptar la lògica anterior per a eliminar la part `_index` del nom del fitxer:

```bash, hl_lines=17-20
function convert_filename_to_url() {
    # Eliminem l'extensió.
    local post_name="${1%.md}"

    # Eliminem el prefix "content/".
    local url="${post_name#content/}"

    # Extraiem el codi d'idioma, si existeix.
    local lang_code="${url##*.}"
    if [[ "$lang_code" == "$url" ]]; then
        lang_code=""  # No hi ha codi d'idioma.
    else
        lang_code="${lang_code}/"  # Afegir una barra al final.
        url="${url%.*}"  # Eliminar el codi d'idioma de l'URL.
    fi

    # Eliminem el sufix "_index".
    if [[ "$url" == *"_index"* ]]; then
        url="${url%%_index*}"
    fi

    # Retornem l'URL completa amb una barra al final.
    full_url="${lang_code}${url}"
    echo "${full_url%/}/"
}
```

Així és com `convert_filename_to_url` gestiona diferents fitxers:

{% wide_container() %}

| Entrada                        | Sortida             |
| ------------------------------ | --------------------|
| `content/_index.es.md`         | `es/`               |
| `content/blog/markdown.fr.md`  | `fr/blog/markdown/` |
| `content/blog/comments.md`     | `blog/comments/`    |
| `content/archive/_index.md`    | `archive/`          |
| `content/archive/_index.ca.md` | `ca/archive/`       |

{% end %}

Si afegim l'URL base abans de cada sortida, obtenim l'enllaç complet.

## Modificant les metadades

Ara puc generar fàcilment les captures de pantalla per a les entrades, però encara necessito associar les imatges amb els fitxers Markdown.

Per a actualitzar les metadades, vaig utilitzar [`awk`](https://ca.wikipedia.org/wiki/AWK) per a trobar on comença el front matter, localitzar o crear la secció `[extra]`, i afegir o actualitzar la clau `social_media_card`:

```awk
# Inicialitzar les variables per al seguiment de l'estat.
BEGIN { in_extra=done=front_matter=0; }

# Funció per a inserir la ruta de la miniatura.
function insert_card() { print "social_media_card = \"" card_path "\""; done=1; }

{
    # Si la miniatura s'ha inserit, simplement mostra les línies restants.
    if (done) { print; next; }

    # Canviar la bandera front_matter a l'inici, denotat per +++
    if (/^\+\+\+/ && front_matter == 0) {
        front_matter = 1;
        print "+++";
        next;
    }

    # Detectar secció [extra] i establir la bandera extra_exists.
    if (/^\[extra\]/) { in_extra=1; extra_exists=1; print; next; }

    # Actualitzar la miniatura existent per a xarxes socials.
    if (in_extra && /^social_media_card =/) { insert_card(); in_extra=0; next; }

    # Fi del front matter o inici d'una nova secció.
    if (in_extra && (/^\[[a-zA-Z_-]+\]/ || (/^\+\+\+/ && front_matter == 1))) {
        insert_card();  # Afegir la miniatura faltant per a xarxes socials.
        in_extra=0;
    }

    # Inserir la secció [extra] faltant.
    if (/^\+\+\+/ && front_matter == 1 && in_extra == 0 && extra_exists == 0) {
        print "\n[extra]";
        insert_card();
        in_extra=0;
        front_matter = 0;
        print "+++";
        next;
    }

    # Mostrar totes les altres línies tal com són.
    print;
}
```

Vaig afegir aquesta funció a `social-cards-zola`, que s'activa amb l'opció `-u` o `--update-front-matter`.

## Concurrència

Volia crear les imatges per a totes les entrades alhora, així que vaig utilitzar [GNU parallel](https://www.gnu.org/software/parallel/) per processar tots els arxius Markdown de forma concurrent:

```bash
find content -type f -name '*.md' | parallel -j 8 'social-cards-zola \
    -o static/img/social_cards -b https://osc.garden -u -p -i {}'
```

Uns segons després, ja tenia un munt de captures de pantalla i arxius Markdown actualitzats. 🎉

## Automatització del procés

Naturalment, el pas següent va ser afegir aquest procés al meu ganxo pre-commit de Git, que ja estava [actualitzant les dates de les publicacions i optimitzant arxius PNG](https://osc.garden/es/blog/zola-date-git-hook/).

Cada vegada que faig un commit d'arxius Markdown (nous o modificats), genero la captura de pantalla i actualitzo la metadada de la publicació o de la secció:

```bash
function generate_and_commit_card {
    local arxiu=$1

    # Generar la miniatura per a xarxes socials i actualitzar la metadada.
    miniatura_xarxes_socials=$(social-cards-zola -o static/img/social_cards\
        -b http://127.0.0.1:1025 -u -p -i "$arxiu")

    # Fer commit dels canvis.
    git add "$miniatura_xarxes_socials"
    git add "$arxiu"
}

export -f generate_and_commit_card

# Crear/actualitzar la miniatura per a xarxes socials per a cada arxiu Markdown modificat.
arxius_md_modificats=$(git diff --cached --name-only | grep '\.md$')
if [[ -n "$arxius_md_modificats" ]]; then
    echo "$arxius_md_modificats" | parallel -j 8 generate_and_commit_card
fi
```

Pots veure com queda integrat en el [ganxo pre-commit complet](https://github.com/welpo/osc.garden/blob/main/.githooks/pre-commit).

L'script complet de `social-cards-zola`, amb més ajustos (com l'ús d'una clau de front matter diferent), està disponible [al repositori d'aquest lloc](https://github.com/welpo/osc.garden/blob/main/static/code/social-cards-zola).

## Fi?

L'script funciona, però és força fràgil: falla si l'uses fora de la ruta arrel del lloc, requereix `parallel` per gestionar la concurrència, i probablement donarà problemes si intentes actualitzar molts arxius Markdown alhora (Zola reconstrueix el lloc després de cada modificació, retornant errors 404 breument).

Estic content d'haver resolt el problema, però també ho veig com una oportunitat per convertir aquest script prou bo™ en un petit però sòlid programa en Rust —un bon primer projecte en Rust, no?

Així que… continuarà, potser.

---

[^1]: Inicialment, estava convertint les captures de pantalla PNG a WebP, ja que són significativament més petites (~40KB) que les JPEG d'aspecte similar (~100KB). Tanmateix, en intentar fer la captura per a la primera imatge de l'article, em vaig adonar que WhatsApp no admet miniatures per a xarxes socials en format WebP. Llàstima.
