+++
title = "Automatizando la actualización de mi web con un webhook"
date = 2023-08-28
updated = 2023-12-02

[taxonomies]
tags = ["aprendizaje del día", "Zola", "automatización"]

[extra]
copy_button = true
footnote_backlinks = true
social_media_card = "img/social_cards/es_blog_updating_site_with_webhook.jpg"
+++

Como los archivos de esta web están en [GitHub](https://github.com/welpo/osc.garden/), pensé que sería buena idea actualizarla automáticamente con cada cambio en el repositorio.<!-- more -->

## Mi sistema

Esta web se sirve desde una ~~instancia ARM de la Free Tier de Oracle~~[^1] máquina virtual de Vultr barata y fiable.

La web está construida con [Zola](https://www.getzola.org/), un generador de sitios estáticos escrito en Rust. Para actualizarla, basta con sincronizar el repositorio y ejecutar `zola build`. Escribí un sencillo script en bash (`update_osc.garden`) que hace exactamente eso:

```bash
#!/usr/bin/env bash
set -eo pipefail

repo="/opt/osc.garden/repo"
out_dir="/var/www/osc.garden"

cd "$repo"
git pull
git submodule update
zola build --output-dir "$out_dir" --force
```

Hice que el archivo fuera ejecutable con `chmod +x update_osc.garden`.

Podría ejecutar este script manualmente cada vez que hiciera cambios en la web, pero automatizar las cosas es mucho más divertido.

## Opciones

Mi primera idea fue usar [`cron`](https://wiki.debian.org/cron) para programar una tarea que ejecutase el script cada pocos minutos. Bastante aburrido y poco eficiente —¿para qué reconstruir la web si no hay nada que actualizar?

Le pedí ideas a GPT-4. Sugirió: GitHub Actions, webhooks, cron, SFTP manual y servicios de «continuous deployment».

Cron ya estaba descartado. SFTP es incluso peor que cron, y no puedo usar servicios de «continuous deployment» o GitHub Actions porque alojo la web en un servidor propio.

Los webhooks sonaban a magia negra, un poco como las notificaciones push. ¡A aprender!

## Webhooks

Un webhook es una forma de decirle a un servidor «¡Hey! ¡Ha ocurrido! La cosa que te interesaba, ¡ha ocurrido! Haz lo tuyo». En otras palabras, cada vez que haga un cambio en el repositorio, GitHub le dará un toque al servidor webhook para que actualice la web.

Instalé un [servidor de webhook ligero escrito en Go](https://github.com/adnanh/webhook) con `sudo apt install webhook`.

A continuación, creé `hooks.yaml` definiendo el hook que ejecutará el script que ya tenía:

```YAML
- id: "update-osc.garden"
  execute-command: "/opt/osc.garden/update_osc.garden"
  command-working-directory: "/opt/osc.garden/repo"
```

Ahora puedo iniciar el servidor webhook con `webhook -hooks hooks.yaml -verbose`. Sin embargo, antes de poder usarlo, necesito abrir los puertos.

## Abriendo los puertos

### Cortafuegos local

Utilizo [ufw](https://wiki.debian.org/Uncomplicated%20Firewall%20(ufw)) para gestionar el cortafuegos local. Ejecuté `sudo ufw allow 9000/tcp` para permitir conexiones TCP en el puerto 9000.

Pero no bastaba con esto; Oracle tiene su propio cortafuegos. Siempre olvido cómo abrir sus puertos, así que esta vez lo apunté, para mi yo del futuro:

### Cortafuegos de Oracle

1. Inicia sesión en tu [consola de Oracle Cloud Infrastructure](https://cloud.oracle.com/sign-in).

2. Ve a Dashboard → Virtual cloud networks. Abre tu VCN.

3. Clic en el nombre de tu «subnet» (subred).

4. Clic en la lista de seguridad de tu subred.

5. Clic en «Add Ingress Rules» y rellena los campos. En este caso:

    - **Source Type**: CIDR
    - **Source CIDR**: 140.82.112.0/20 (agregué una regla por cada bloque CIDR IP de la sección `hooks` de [las IPs de GitHub](https://api.github.com/meta))
    - **Source Port Range**: All
    - **Destination Port Range**: 9000
    - **Description**: GitHub webhook

¡Listo!

## Acceso seguro

### Usando certificados SSL

HTTP es cosa del pasado. Quería usar HTTPS, así que tuve que modificar el comando para usar mis certificados:

```bash
webhook -secure -hooks hooks.yaml -verbose \
-cert /etc/letsencrypt/live/osc.garden/fullchain.pem \
-key /etc/letsencrypt/live/osc.garden/privkey.pem
```

Así puedo conectarme a `https://osc.garden:9000/hooks/update-osc.garden` para activar el script:

```bash
[webhook] 2023/08/27 12:57:40 [38c8b4] executing /opt/osc.garden/update_osc.garden (/opt/osc.garden/update_osc.garden) with arguments ["/opt/osc.garden/update_osc.garden"] and environment [] using /opt/osc.garden/repo as cwd
[webhook] 2023/08/27 12:57:41 [38c8b4] command output: Already up to date.
Building site...
Checking all internal links with anchors.
> Successfully checked 0 internal link(s) with anchors.
-> Creating 15 pages (0 orphan) and 11 sections
Done in 132ms.
```

Fantástico. Ahora toca asegurarlo y automatizarlo.

### Acceso exclusivo a GitHub

Vamos a actualizar el archivo YAML para añadir una «regla de disparo» para que sólo haga caso a las solicitudes autorizadas.

```YAML
- id: "update-osc.garden"
  execute-command: "/opt/osc.garden/update_osc.garden"
  command-working-directory: "/opt/osc.garden"
  trigger-rule:
    and:
      - match:
          type: "payload-hmac-sha256"
          secret: "my-super-secret-token"
          parameter:
            source: "header"
            name: "X-Hub-Signature-256"
```

Esta regla contiene un `secret`, que es una contraseña que he creado.

Ahora, si intento activar el webhook sin la contraseña, `webhook` se quejará: `Hook rules were not satisfied.` Genial —sólo aceptará las solicitudes que contengan el `secret` cifrado.

Es hora de configurar el webhook de GitHub.

## Configuración del webhook de GitHub

Fui a mi repositorio → Settings → Webhooks → Add webhook, e introduje:

- **Payload URL**: `https://osc.garden:9000/hooks/update-osc.garden`
- **Content type**: `application/json`
- **Secret**: `my-super-secret-token`
- **Enable SSL verification**
- **Trigger events**: «Just the `push` event».

Cliqué «Add webhook» e hice un cambio en el repositorio. ¡Funcionó! GitHub notificó a mi servidor webhook y mi web se reconstruyó con los cambios.

¡Casi está todo! Falta ejecutar el servidor webhook con un usuario que no sea root y crear un servicio para que siempre esté activo.

## Servicio del servidor de webhook

### Aislamiento y permisos

No es buena idea ejecutar el servidor webhook como root, así que creé un nuevo usuario para ejecutarlo con `sudo adduser webhookuser`. A continuación, añadí este usuario a un nuevo grupo `sslcerts`, y le di los permisos necesarios:

```bash
# Establece webhookuser como propietario de los directorios del proyecto y de la web.
sudo chown -R webhookuser:webhookuser /opt/osc.garden
sudo chown -R webhookuser:webhookuser /var/www/osc.garden

# Crea grupo sslcerts y añade a webhookuser.
sudo addgroup sslcerts
sudo usermod -aG sslcerts webhookuser

# Otorga permisos de lectura y ejecución a sslcerts para los certificados.
sudo chgrp sslcerts /etc/letsencrypt/archive /etc/letsencrypt/archive/osc.garden
sudo chmod 750 /etc/letsencrypt/archive /etc/letsencrypt/archive/osc.garden

# Habilita el recorrido de directorios para 'otros' en los directorios de certificados.
sudo chmod o+x /etc/letsencrypt /etc/letsencrypt/live /etc/letsencrypt/live/osc.garden

# Configura los permisos y el grupo para los archivos de certificados SSL.
sudo chmod 640 /etc/letsencrypt/live/osc.garden/privkey.pem
sudo chgrp sslcerts /etc/letsencrypt/live/osc.garden/privkey.pem
```

La idea es minimizar los permisos, reduciendo el daño potencial de una mala configuración o una vulnerabilidad de seguridad.

Aquí me topé con un problema al ejecutar el script como `webhookuser`: Zola intenta eliminar el directorio antes de construir el sitio —los permisos anteriores no son suficientes.

Si bien podría dar a `webhookuser` permisos en todo `/var/www`, decidí usar un directorio temporal para el comando `zola build`:

```bash,hl_lines=8 19 22
#!/usr/bin/env bash
set -eo pipefail

repo="/opt/osc.garden/repo"
live_dir="/var/www/osc.garden"

# Crea el directorio temporal.
temp_dir=$(mktemp -d)

# Garantiza la limpieza al salir (con éxito o no).
trap "rm -rf $temp_dir" EXIT

# Actualiza el repositorio y los submódulos.
cd "$repo"
git pull
git submodule update

# Construye el sitio en el directorio temporal.
zola build --output-dir "$temp_dir" --force

# Sincroniza los archivos al directorio final.
rsync -a --delete "$temp_dir/" "$live_dir/"
```

### Servicio de systemd

[Systemd](https://systemd.io/) es el primer proceso que se ejecuta en Debian, inicializando la configuración del sistema y gestionando las tareas en segundo plano («servicios» o «*daemons*»). Decidí usar un archivo de servicio de systemd para automatizar el inicio del servidor webhook, añadir registros (*logging*), controlar aún más sus privilegios y reiniciarlo en caso de que falle.

Creé el archivo de servicio con permisos mínimos con `sudo vim /etc/systemd/system/webhook.service`:

```.gitconfig
[Unit]
Description=Webhook para actualizar osc.garden
Documentation=https://github.com/adnanh/webhook/
After=network.target

[Service]
Type=simple
User=webhookuser
ExecStart=/usr/bin/webhook -secure -hooks /opt/osc.garden/hooks.yaml -cert /etc/letsencrypt/live/osc.garden/fullchain.pem -key /etc/letsencrypt/live/osc.garden/privkey.pem -verbose
Restart=on-failure
RestartSec=5s
StandardOutput=journal
StandardError=journal

# Seguridad.
ReadWritePaths=/var/www/osc.garden /opt/osc.garden/repo
ReadOnlyPaths=/etc/letsencrypt/live/osc.garden /opt/osc.garden
CapabilityBoundingSet=
PrivateTmp=true
NoNewPrivileges=true
ProtectHome=true
ProtectSystem=strict
PrivateDevices=true

[Install]
WantedBy=multi-user.target
```

Guardé el archivo, recargué el *daemon* e inicié el servicio:

```bash
sudo systemctl daemon-reload
sudo systemctl start webhook.service
```

Puedo ver cómo está funcionando el servicio con `sudo systemctl status webhook` y `sudo journalctl -fu webhook`.

Tras comprobar que funcionaba, configuré el servicio para que se iniciase automáticamente al arrancar con `sudo systemctl enable webhook.service`.

## El script final

Añadí registros, mensajes de error y mi funcionalidad preferida: notificaciones push para el móvil con [ntfy](https://ntfy.sh/):

```bash
#!/usr/bin/env bash
set -eo pipefail

repo="/opt/osc.garden/repo"
live_dir="/var/www/osc.garden"

ntfy_url="ntfy.osc.garden/builds"
ntfy_token="my-ntfy-access-token"

send_notification() {
    local tag="$1"
    local title="$2"
    local message="$3"
    ntfy pub -T "$tag" -t "$title" -m "$message" -k "$ntfy_token" "$ntfy_url"
}

trap_cleanup() {
    echo "Eliminando directorio temporal $temp_dir"
    rm -rf "$temp_dir"
    if [ "$1" == "success" ]; then
        last_commit_msg=$(git log -1 --pretty=%B)
        send_notification "seedling" "osc.garden actualizado" "Último commit: $last_commit_msg"
        echo "osc.garden actualizado."
    fi
}

notify_failure() {
    send_notification "bangbang" "osc.garden no se ha podido actualizar" "$1"
    echo "Error: $1" >&2
    exit 1
}

# Crea un directorio temporal.
temp_dir=$(mktemp -d) || notify_failure "Error al crear directorio temporal"

# Garantiza la limpieza al salir (con éxito o no).
trap 'trap_cleanup' EXIT

# Actualiza el repositorio y los submódulos.
echo "Actualizando el repositorio…"
cd "$repo"
git fetch || notify_failure "Git fetch ha fallado"
git reset --hard origin || notify_failure "Git reset ha fallado" 
git pull || notify_failure "Git pull ha fallado" 
git submodule update || notify_failure "Git submodule update ha fallado"

# Build site in temporary directory.
echo "Construyendo el sitio…"
zola build --output-dir "$temp_dir" --force || notify_failure "Zola build ha fallado"

# Sincroniza los archivos al directorio final.
echo "Sincronizando los archivos…"
rsync -a --delete "$temp_dir/" "$live_dir/" || notify_failure "rsync ha fallado"

# Elimina la trampa y muestra un mensaje de éxito.
trap - EXIT
trap_cleanup success
```

Las notificaciones se ven así (haz clic para alternar entre éxito y error):

{{ image_toggler(default_src="img/ntfy_success.webp", toggled_src="img/ntfy_fail.webp", default_alt="Notificación de éxito de ntfy", toggled_alt="Notificación de error de ntfy") }}

¡Esto es todo! Después de experimentar con nuevas herramientas, pelearme con los permisos y aprender bastante, mi web se actualiza automágicamente cada vez que el repositorio cambia. 🎉🥳

---

## Extra: Sobre las notificaciones push y los webhooks

Tras aprender sobre la magia negra de los webhooks, investigué un poco sobre las notificaciones push —efectivamente, hay similitudes. Sin embargo, en lugar de escuchar en un puerto, los teléfonos dependen de conexiones duraderas a un servicio de notificaciones. Utilizan un mecanismo de *keep-alive* para mantener la conexión abierta y cuando el servidor tiene algo que notificar, manda la notificación a través de esta conexión preexistente.

He aquí una analogía: los webhooks son como tus amigos enviándote un mensaje de texto (una nueva conexión cada vez) para decirte algo. Las notificaciones push, en contraposición, son como estar en una larga llamada de voz con un amigo —incluso cuando nadie habla, la conexión persiste. Cuando alguien tiene algo que decir, lo hace a través de la llamada existente en lugar de establecer una nueva conexión. El mecanismo de *keep-alive* —que mantiene la conexión abierta— sería como preguntar, después de unos minutos de silencio, «¿Sigues ahí?». «Sigo aquí».

---

[^1]: Oracle eliminó mi cuenta de Free Tier sin advertencia, explicación o recurso (una práctica habitual, parece). Ahora estoy alojando el sitio en una instancia de Vultr asequible y fiable que he tenido durante más de 6 años. Si quieres probar Vultr, aquí está [mi enlace de registro de referencia](https://www.vultr.com/?ref=7123709), que te da $100 en crédito, mientras yo recibo $10.
