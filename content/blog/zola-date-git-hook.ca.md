+++
title = "Zola Git Hook: actualitzant les dates de les publicacions"
date = 2023-04-17

[taxonomies]
tags = ["aprenentatge del dia", "Zola", "Git"]

[extra]
copy_button = true
footnote_backlinks = true
+++

Per tal de mantenir l'atribut «Última actualització» de les publicacions sempre precís, he automatitzat la seva modificació amb un hook pre-commit de Git.<!-- more -->

Un hook (ganxo) pre-commit de Git és un script que s'executa automàticament abans de cada commit. Pot realitzar accions personalitzades com validar el codi, executar proves o, en aquest cas, actualitzar les dates de les publicacions.

## El hook

Aquest script de Bash crea o modifica el camp `updated` en la front matter dels fitxers Markdown del commit amb la seva última data de modificació.

Aquí està el codi (també disponible a [gist](https://gist.github.com/welpo/6594765f5640982cb5886c9e9459ef5b)):

```bash
#!/usr/bin/env bash
# Requereix Bash 4.0 o superior.

# Aquest script actualitza el camp 'updated' en la metainformació dels fitxers .md modificats,
# establint la seva última data de modificació.

# Funció per sortir de l'script amb un missatge d'error.
function error_exit() {
    echo "ERROR: $1" >&2
    exit "${2:-1}"
}

# Funció per extreure la data de la metainformació.
function extract_date() {
    local file="$1"
    local field="$2"
    grep -m 1 "^$field =" "$file" | sed -e "s/$field = //" -e 's/ *$//'
}

# Obté els fitxers .md modificats, ignorant els fitxers "_index.md".
modified_md_files=$(git diff --cached --name-only --diff-filter=M | grep -Ei '\.md$' | grep -v '_index.md$')

# Recorre cada fitxer .md modificat.
for file in $modified_md_files; do
    # Última data de modificació.
    last_modified_date=$(date -r "$file" +'%Y-%m-%d')

    # Extreu el camp "date" de la metainformació.
    date_value=$(extract_date "$file" "date")

    # Salta el fitxer si la última data de modificació és igual al camp "date".
    if [[ "$last_modified_date" == "$date_value" ]]; then
        continue
    fi

    # Actualitza el camp "updated" amb la última data de modificació.
    # Si el camp "updated" no existeix, el crea sota el camp "date".
    awk -v date_line="$last_modified_date" 'BEGIN{FS=OFS=" = "; first = 1} { if (/^date =/ && first) { print; getline; if (!/^updated =/) print "updated" OFS date_line; first=0 } if (/^updated =/ && !first) gsub(/[^ ]*$/, date_line, $2); print }' "$file" > "${file}.tmp" && mv "${file}.tmp" "$file" || error_exit "Failed to update file $file"

    # Afegeix els canvis a staging.
    git add "$file"
done
```

## Configuració

Després de configurar el teu projecte de Zola i el repositori Git:

1. Crea o actualitza el fitxer `pre-commit` dins de `.git/hooks` (al directori arrel del projecte) amb l'script anterior.

2. Fes que l'script sigui executable amb `chmod +x .git/hooks/pre-commit`.

Així de simple.

A partir d'ara, cada vegada que facis un commit dels fitxers Markdown amb un camp `date`, el camp `updated` serà creat o actualitzat amb la data de l'última modificació del fitxer en format [ISO 8601](https://ca.wikipedia.org/wiki/ISO_8601) (p. ex., 2027-08-29).

## Extra: Compressió sense pèrdua de PNGs

Per millorar l'eficiència, m'encanta comprimir (sense pèrdua) els fitxers. Amb aquest objectiu he actualitzat l'script per incloure la compressió de PNG amb [oxipng](https://github.com/shssoichiro/oxipng) o [optipng](https://optipng.sourceforge.net/).

Ja que no es pot tenir més d'un hook pre-commit[^1], he incorporat la funcionalitat de compressió a l'script anterior afegint aquestes línies ([gist amb l'script complet](https://gist.github.com/welpo/f5563c3b82fe247ed0e473d940a005b7)):

```bash
# Comprovar si oxipng o optipng estan disponibles.
if command -v oxipng &> /dev/null; then
    png_compressor="oxipng -o max"
elif command -v optipng &> /dev/null; then
    png_compressor="optipng -o 7"
fi

# Si s'ha instal·lat algun dels compressors…
if [[ -n "$png_compressor" ]]; then
    # Obté els fitxers PNG modificats o afegits.
    mapfile -t png_files < <(git diff --cached --name-only --diff-filter=d | grep -Ei '\.png$')

    # Itera per cada fitxer PNG.
    for file in "${png_files[@]}"; do
        # Comprimeix el fitxer PNG.
        $png_compressor -- "$file" || error_exit "No s'ha pogut comprimir el fitxer $file"

        # Afegeix canvis a staging.
        git add -- "$file"
    done
fi
```

Amb aquestes línies addicionals, si s'ha instal·lat un compressor PNG, l'script recorrerà els fitxers PNG que del commit i els comprimirà sense pèrdua.

Ara pots mantenir fàcilment les dates de «Última actualització» precises per a les entrades de Zola i optimitzar les imatges PNG per a uns temps de càrrega més ràpids.

<hr>

[^1]: Si prefereixes mantenir funcionalitats separades i utilitzar diversos fitxers per als scripts pre-commit, pots crear un fitxer `pre-commit` que invoqui tots els altres scripts (que pots dins d'un directori `pre-commit.d`, per exemple).
