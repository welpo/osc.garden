+++
title = "Automatitzant l'actualització de la meva web amb un webhook"
date = 2023-08-28
updated = 2023-09-02

[taxonomies]
tags = ["aprenentatge del dia", "Zola"]

[extra]
copy_button = true
+++

Com que els fitxers d'aquesta web estan a [GitHub](https://github.com/welpo/osc.garden/), vaig pensar que seria bona idea actualitzar-la automàticament amb cada canvi al repositori.<!-- more -->

## El meu sistema

Aquesta web se serveix des d'una instància ARM de la [Free Tier d'Oracle](https://www.oracle.com/cloud/free/). Fa un temps vaig aconseguir instal·lar Debian des de dins d'una instància d'Ubuntu —va ser una tarda entretinguda.

La web està construïda amb [Zola](https://www.getzola.org/), un generador de llocs estàtics escrit en Rust. Per actualitzar-la, només cal sincronitzar el repositori i executar `zola build`. Vaig escriure un senzill script en bash (`update_osc.garden`) que fa exactament això:

```bash
#!/usr/bin/env bash
set -eo pipefail

repo="/opt/osc.garden/repo"
out_dir="/var/www/osc.garden"

cd "$repo"
git pull --force
git submodule update
zola build --output-dir "$out_dir" --force
```

Vaig fer que l'arxiu fos executable amb `chmod +x update_osc.garden`.

Podria executar aquest script manualment cada cop que fes canvis a la web, però automatitzar les coses és molt més divertit.

## Opcions

La meva primera idea va ser utilitzar [`cron`](https://wiki.debian.org/cron) per programar una tasca que executés l'script cada pocs minuts. Bastant avorrit i poc eficient —per què reconstruir la web si no hi ha hagut canvis?

Vaig demanar idees a GPT-4. Va suggerir: GitHub Actions, webhooks, cron, SFTP manual i serveis de «continuous deployment».

Cron ja estava descartat. SFTP és encara pitjor que cron, i no puc utilitzar serveis de «continuous deployment» o GitHub Actions perquè allotjo la web en un servidor propi.

Els webhooks sonaven a màgia negra, una mica com les notificacions push. Hora d'aprendre!

## Webhooks

Un webhook és una forma de dir-li a un servidor «Ei! Ha ocorregut! La cosa que t'interessava, ha ocorregut! Fes la teva». En altres paraules, cada cop que faci un canvi al repositori, GitHub donarà un toc al servidor webhook perquè actualitzi la web.

Vaig instal·lar un [servidor de webhook lleuger escrit en Go](https://github.com/adnanh/webhook) amb `sudo apt install webhook`.

A continuació, vaig crear `hooks.yaml` definint el hook que executarà l'script que ja tenia:

```YAML
- id: "update-osc.garden"
  execute-command: "/opt/osc.garden/update_osc.garden"
  command-working-directory: "/
```

Ara puc iniciar el servidor webhook amb `webhook -hooks hooks.yaml -verbose`. Abans de poder utilitzar-lo, però, he d'obrir els ports.

## Obrint els ports

### Tallafoc local

Utilitzo [ufw](https://wiki.debian.org/Uncomplicated%20Firewall%20(ufw)) per gestionar el tallafoc local. Vaig executar `sudo ufw allow 9000/tcp` per permetre connexions TCP al port 9000.

Però això no era prou; Oracle té el seu propi tallafoc. Sempre oblido com obrir els seus ports, així que aquesta vegada ho he apuntar, per al meu jo del futur:

### Tallafoc d'Oracle

1. Inicia sessió a la teva [consola d'Oracle Cloud Infrastructure](https://cloud.oracle.com/sign-in).

2. Ves a Dashboard → Virtual cloud networks. Obre el teu VCN.

3. Clica en el nom de la teva «subnet» (subxarxa).

4. Clica en la llista de seguretat de la teva subxarxa.

5. Clica en «Add Ingress Rules» i omple els camps. En aquest cas:

    - **Source Type**: CIDR
    - **Source CIDR**: 140.82.112.0/20 (vaig afegir una regla per cada bloc CIDR IP de la secció `hooks` de [les IPs de GitHub](https://api.github.com/meta))
    - **Source Port Range**: Tots
    - **Destination Port Range**: 9000
    - **Description**: GitHub webhook

Fet!

## Accés segur

### Utilitzant certificats SSL

HTTP és cosa del passat. Volia emprar HTTPS, així que vaig haver de modificar la comanda per utilitzar els meus certificats:

```bash
webhook -secure -hooks hooks.yaml -verbose \
-cert /etc/letsencrypt/live/osc.garden/fullchain.pem \
-key /etc/letsencrypt/live/osc.garden/privkey.pem
```

Així puc connectar-me a `https://osc.garden:9000/hooks/update-osc.garden` per activar l'script:

```bash
[webhook] 2023/08/27 12:57:40 [38c8b4] executing /opt/osc.garden/update_osc.garden (/opt/osc.garden/update_osc.garden) with arguments ["/opt/osc.garden/update_osc.garden"] and environment [] using /opt/osc.garden/repo as cwd
[webhook] 2023/08/27 12:57:41 [38c8b4] command output: Already up to date.
Building site...
Checking all internal links with anchors.
> Successfully checked 0 internal link(s) with anchors.
-> Creating 15 pages (0 orphan) and 11 sections
Done in 132ms.
```

Fantàstic. Ara toca assegurar i automatitzar.

### Accés exclusiu a GitHub

Cal actualitzar l'arxiu YAML per afegir una «regla de disparador» perquè només faci cas a les sol·licituds autoritzades.

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

Aquesta regla conté un `secret`, que és una contrasenya que he creat.

Ara, si intento activar el webhook sense la contrasenya, `webhook` es queixa: `Hook rules were not satisfied.` Genial: només acceptarà les sol·licituds que continguin el `secret` xifrat.

És hora de configurar el webhook de GitHub.

## Configuració del webhook de GitHub

Vaig anar al meu repositori → Settings → Webhooks → Add webhook, i vaig introduir:

- **Payload URL**: `https://osc.garden:9000/hooks/update-osc.garden`
- **Content type**: `application/json`
- **Secret**: `my-super-secret-token`
- **Enable SSL verification**
- **Trigger events**: «Només l'esdeveniment `push`».

Vaig clicar «Add webhook» i vaig fer un canvi en el repositori. Funciona! GitHub va notificar al meu servidor webhook i la meva web es va reconstruir amb els canvis.

Ja quasi estem. Falta executar el servidor webhook amb un usuari que no sigui root i crear un servei perquè sempre estigui actiu.

## Servei del servidor webhook

### Aïllament i permisos

No és bona idea executar el servidor webhook com a root, així que vaig crear un nou usuari per executar-lo amb `sudo adduser webhookuser`. A continuació, vaig afegir aquest usuari a un nou grup `sslcerts`, i li vaig donar els permisos necessaris:

```bash
# Estableix webhookuser com a propietari dels directoris del projecte i de la web.
sudo chown -R webhookuser:webhookuser /opt/osc.garden
sudo chown -R webhookuser:webhookuser /var/www/osc.garden

# Crea grup sslcerts i afegeix a webhookuser.
sudo addgroup sslcerts
sudo usermod -aG sslcerts webhookuser

# Atorga permisos de lectura i execució a sslcerts per als certificats.
sudo chgrp sslcerts /etc/letsencrypt/archive /etc/letsencrypt/archive/osc.garden
sudo chmod 750 /etc/letsencrypt/archive /etc/letsencrypt/archive/osc.garden

# Habilita el recorregut de directoris per a 'altres' en els directoris de certificats.
sudo chmod o+x /etc/letsencrypt /etc/letsencrypt/live /etc/letsencrypt/live/osc.garden
```

La idea és minimitzar els permisos per reduir el dany potencial d'una mala configuració o una vulnerabilitat de seguretat.

Aquí em vaig trobar amb un problema en intentar executar l'script com a `webhookuser`: Zola intenta eliminar el directori abans de construir el lloc web —els permisos anteriors no són suficients.

Podria donar a `webhookuser` permisos sobre `/var/www`, però vaig optar per utilitzar un directori temporal per `zola build`:

```bash,hl_lines=8 19 22
#!/usr/bin/env bash
set -eo pipefail

repo="/opt/osc.garden/repo"
live_dir="/var/www/osc.garden"

# Crea un directori temporal.
temp_dir=$(mktemp -d)

# Assegura la neteja en sortir (exitosament o no).
trap "rm -rf $temp_dir" EXIT

# Actualitza el repositori i els submòduls.
cd "$repo"
git pull --force
git submodule update

# Construeix el lloc al directori temporal.
zola build --output-dir "$temp_dir" --force

# Sincronitza els arxius al directori en viu.
rsync -a --delete "$temp_dir/" "$live_dir/"
```

### Servei de systemd

[Systemd](https://systemd.io/) és el primer procés que s'executa a Debian, inicialitzant la configuració del sistema i gestionant les tasques en segon pla («serveis» o «*daemons*»). Vaig decidir utilitzar un fitxer de servei de systemd per automatitzar l'inici del servidor de webhook, afegir registres (*logging*), controlar encara més els seus privilegis i reiniciar-lo en cas que falli.

Vaig crear el fitxer de servei amb permisos mínims amb `sudo vim /etc/systemd/system/webhook.service`:

```toml
[Unit]
Description=Webhook per actualitzar osc.garden
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

# Seguretat.
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

Després de desar el fitxer, vaig recarregar el *daemon* i vaig iniciar el servei:

```bash
sudo systemctl daemon-reload
sudo systemctl start webhook.service
```

Puc veure com està funcionant el servei amb `sudo systemctl status webhook` i `sudo journalctl -fu webhook`.

Després de comprovar que funcionava, vaig configurar el servei perquè s'iniciés automàticament en arrencar amb `sudo systemctl enable webhook.service`.

## L'script final

Vaig afegir registres, missatges d'error i la meva funcionalitat preferida: notificacions push pel mòbil amb [`ntfy`](https://ntfy.sh/):

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
    echo "Eliminant directori temporal $temp_dir"
    rm -rf "$temp_dir"
    if [ "$1" == "success" ]; then
        hash=$(git rev-parse --short HEAD)
        send_notification "seedling" "osc.garden actualitzat" "Últim commit: $hash"
        echo "osc.garden actualitzat."
    fi
}

notify_failure() {
    send_notification "bangbang" "osc.garden no s'ha pogut actualitzar" "$1"
    echo "Error: $1" >&2
    exit 1
}

# Crea un directori temporal.
temp_dir=$(mktemp -d) || notify_failure "Error en crear directori temporal"

# Garanteix la neteja en sortir (amb èxit o no).
trap 'trap_cleanup' EXIT

# Actualitza el repositori i els submòduls.
echo "Actualitzant el repositori…"
cd "$repo"
git pull --force || notify_failure "Git pull ha fallat"
git submodule update || notify_failure "Git submodule update ha fallat"

# Construeix el lloc en el directori temporal.
echo "Construint el lloc…"
zola build --output-dir "$temp_dir" --force || notify_failure "Zola build ha fallat"

# Sincronitza els arxius al directori final.
echo "Sincronitzant els arxius…"
rsync -a --delete "$temp_dir/" "$live_dir/" || notify_failure "rsync ha fallat"

# Elimina la trampa i mostra un missatge d'èxit.
trap - EXIT
trap_cleanup success
```

Les notificacions es veuen així (fes clic per alternar entre èxit i error):

{{ image_toggler(default_src="img/ntfy_success.webp", toggled_src="img/ntfy_fail.webp", default_alt="Notificació d'èxit de ntfy", toggled_alt="Notificació d'error de ntfy") }}

Això és tot! Després d'experimentar amb noves eines, barallar-me amb els permisos i aprendre força, la meva web s'actualitza automàgicament cada cop que el repositori canvia. 🎉🥳

---

## Extra: Sobre les notificacions push i els webhooks

Després d'aprendre sobre la màgia negra dels webhooks, vaig investigar una mica sobre les notificacions push —efectivament, hi ha similituds. Els mòbils, però, en lloc d'escoltar en un port, depenen de connexions duradores a un servei de notificacions. Utilitzen un mecanisme de *keep-alive* per mantenir la connexió oberta i quan el servidor té alguna cosa per notificar, envia la notificació a través d'aquesta connexió preexistent.

Com a analogia: els webhooks són com els teus amics enviant-te un missatge de text (una nova connexió cada cop) per dir-te alguna cosa. Les notificacions push, en contraposició, són com estar en una llarga trucada de veu amb un amic —inclús quan ningú parla, la connexió persisteix. Quan algú té alguna cosa a dir, ho fa a través de la trucada existent en lloc d'establir una nova connexió. El mecanisme de *keep-alive* —que manté la connexió oberta— seria com preguntar, després d'uns minuts de silenci, «Hi ets?». «Hi soc».
