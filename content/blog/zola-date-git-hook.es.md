+++
title = "Zola Git Hook: actualizando las fechas de las publicaciones"
date = 2023-04-17
updated = 2023-08-30

[taxonomies]
tags = ["aprendizaje del día", "Zola", "Git"]

[extra]
copy_button = true
footnote_backlinks = true
+++

Para que el campo «Última actualización» de las entradas sea siempre preciso, he automatizado su modificación con un hook Git pre-commit.<!-- more -->

Un hook (gancho) Git pre-commit es un script que se ejecuta automáticamente antes de cada commit. Puede realizar acciones personalizadas, como validar código, ejecutar pruebas o, en este caso, actualizar fechas de publicación.

## El hook

Este script de Bash crea o modifica el campo `updated` en el front matter de los archivos Markdown del commit con su fecha de última modificación.

Aquí está el código (también disponible en [gist](https://gist.github.com/welpo/6594765f5640982cb5886c9e9459ef5b)):

```bash
#!/usr/bin/env bash
# Requiere Bash 4.0 o superior.

# Función para salir del script con un mensaje de error.
function error_exit() {
    echo "ERROR: $1" >&2
    exit "${2:-1}"
}

# Función para extraer la fecha del front matter.
function extract_date() {
    local file="$1"
    local field="$2"
    grep -m 1 "^$field =" "$file" | sed -e "s/$field = //" -e 's/ *$//'
}

# Obtiene los archivos .md modificados, ignorando los archivos "_index.md".
modified_md_files=$(git diff --cached --name-only --diff-filter=M | grep -Ei '\.md$' | grep -v '_index.md$')

# Recorre cada archivo .md modificado.
for file in $modified_md_files; do
    # Obtiene la fecha de última modificación del sistema de archivos.
    last_modified_date=$(date -r "$file" +'%Y-%m-%d')

    # Extrae el campo "date" del front matter.
    date_value=$(extract_date "$file" "date")

    # Omite el archivo si la fecha de última modificación es igual al campo "date".
    if [[ "$last_modified_date" == "$date_value" ]]; then
        continue
    fi

    # Actualiza el campo "updated" con la fecha de última modificación.
    # Si el campo "updated" no existe, lo crea debajo del campo "date".
    awk -v date_line="$last_modified_date" 'BEGIN{FS=OFS=" = "; first = 1} { if (/^date =/ && first) { print; getline; if (!/^updated =/) print "updated" OFS date_line; first=0 } if (/^updated =/ && !first) gsub(/[^ ]*$/, date_line, $2); print }' "$file" > "${file}.tmp" && mv "${file}.tmp" "$file" || error_exit "Failed to update file $file"

    # Añade los cambios a staging.
    git add "$file"
done
```

## Configuración

Después de configurar tu proyecto Zola y repositorio Git:

1. Crea o actualiza el archivo `pre-commit` dentro de `.git/hooks` (en el directorio raíz de tu proyecto) con el script anterior.

2. Haz que el script sea ejecutable con `chmod +x .git/hooks/pre-commit`.

¡Así de simple!

Ahora, cada vez que hagas commit de archivos Markdown con un campo `date`, el campo `updated` se creará o actualizará con la última fecha de modificación del archivo en formato [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) (por ejemplo, 2027-08-29).

## Extra: Compresión sin pérdida de archivos PNG

En pos de la optimización, me encanta comprimir archivos (sin pérdida). Con ese propósito, he actualizado el script para incluir la compresión de archivos PNG utilizando [oxipng](https://github.com/shssoichiro/oxipng) o [optipng](https://optipng.sourceforge.net/).

Dado que no se pueden tener más de un hook de pre-commit[^1], he añadido la funcionalidad de compresión al script anterior agregando estas líneas ([gist con el script completo](https://gist.github.com/welpo/f5563c3b82fe247ed0e473d940a005b7)):

```bash
# Comprueba si oxipng u optipng están instalados.
if command -v oxipng &> /dev/null; then
    png_compressor="oxipng -o max"
elif command -v optipng &> /dev/null; then
    png_compressor="optipng -o 7"
fi

# Si alguno de los compresores está instalado…
if [[ -n "$png_compressor" ]]; then
    # Obtiene los archivos PNG modificados o añadidos.
    mapfile -t png_files < <(git diff --cached --name-only --diff-filter=d | grep -Ei '\.png$')

    # Recorre cada archivo PNG.
    for file in "${png_files[@]}"; do
        # Comprime el archivo PNG.
        $png_compressor -- "$file" || error_exit "Error al comprimir el archivo $file"

        # Añade los cambios a staging.
        git add -- "$file"
    done
fi
```

Con estas líneas adicionales, si un compresor de PNG está instalado, el script buscará entre los archivos PNG confirmados y los comprimirá sin pérdida de calidad.

Ahora puedo mantener al día las fechas de «Última actualización» de las entradas de Zola y optimizar las imágenes PNG para reducir los tiempos de carga.

Con el tiempo, he añadido otras funcionalidades, como evitar commits de borradores o de archivos que contengan «TODO», y ejecutar scripts de optimización. Puedes echar un vistazo al hook que estoy utilizando actualmente [aquí](https://github.com/welpo/osc.garden/blob/main/.githooks/pre-commit).

<hr>

[^1]: Si prefieres mantener las funcionalidades separadas y utilizar múltiples archivos para tus scripts de pre-commit, puedes crear un archivo `pre-commit` que invoque a todos los demás scripts (que podrías almacenar en un directorio `pre-commit.d`, por ejemplo).
