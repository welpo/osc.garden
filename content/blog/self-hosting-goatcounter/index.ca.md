+++
title = "Autoallotjament de GoatCounter amb un proxy invers nginx i SSL"
date = 2023-12-14
updated = 2025-12-26
description = "Aprèn a autoallotjar GoatCounter —una eina d'anàlisi web lleugera i respectuosa amb la privadesa— amb un proxy invers nginx i un certificat SSL."

[taxonomies]
tags = ["aprenentatge del dia", "guia"]

[extra]
social_media_card = "img/social_cards/ca_blog_self_hosting_goatcounter.jpg"
+++

Tenia curiositat sobre el trànsit d'aquest lloc i de la [demo de tabi](https://welpo.github.io/tabi/), així que vaig explorar eines d'anàlisi web ètiques. El meu objectiu era satisfer la meva curiositat sense comprometre la privadesa dels visitants; estic en contra del seguiment i no vull contribuir al capitalisme de vigilància.

Vaig descobrir [GoatCounter](https://www.goatcounter.com/), una eina d'anàlisi web lleugera, de codi obert i que preserva la privadesa. És un fitxer únic i es pot autoallotjar. Una opció perfecta!

Les instruccions d'autoallotjament per a GoatCounter són escasses. Hi ha [aquest script](https://actually.fyi/posts/goatcounter-vps/) que descarrega i configura automàticament GoatCounter. No obstant això, no em sento còmode executant scripts sense examinar-los abans, especialment si s'executen com a root.

La guia que segueix es basa en l'script, amb passos addicionals per a un proxy invers nginx amb certificats SSL. Si utilitzes una distribució Linux amb systemd (Debian, Arch, Ubuntu…), et serà útil.

Al final d'aquest article, tindràs un panell com [stats.osc.garden](https://stats.osc.garden/) o [tabi-stats.osc.garden](https://tabi-stats.osc.garden/) (tu tries si fer-lo públic).

Comencem!

## Descàrrega i instal·lació

Necessitarem permisos de root per a tot el que farem, així que iniciem una shell de root:

```bash
sudo -i
```

Descarrega el binari de GoatCounter. Obtingues l'URL per al teu sistema des de la [pàgina de llançaments de GoatCounter a GitHub](https://github.com/arp242/goatcounter/releases).

Jo vaig utilitzar:

```bash
wget https://github.com/arp242/goatcounter/releases/download/v2.7.0/goatcounter-v2.7.0-linux-amd64.gz
```

Si no estàs segur de quin sistema tens, pots executar la comanda `arch`. Si veus `x86_64`, necessitaràs el paquet `amd64`, com jo.

Descomprimeix l'arxiu:

```bash
gunzip *goatcounter*gz
```

Mou-lo a `/usr/local/bin/` i estableix els permisos adequats:

```bash
mv goatcounter* /usr/local/bin/goatcounter
chmod +x /usr/local/bin/goatcounter
```

Creem un usuari específic per a executar GoatCounter, per aïllament de seguretat:

```bash
useradd goatcounter --system --user-group --shell /sbin/nologin \
--comment "Anàlisi web GoatCounter" --create-home \
--home-dir /var/lib/goatcounter
```

Ara executa `goatcounter` per a configurar el nostre usuari i credencials. Assegura't d'usar el teu correu electrònic real i URL (on viurà el panell, no el lloc del qual vols obtenir les analítiques):

```bash
cd /var/lib/goatcounter/
sudo -u goatcounter /usr/local/bin/goatcounter db create site \
-createdb -user.email correu@example.com -vhost stats.example.com
```

Això demanarà una contrasenya per al panell de GoatCounter.

## Configuració de nginx amb SSL

Primer necessitaràs configurar el teu DNS per al teu URL (`stats.example.com`) i obtenir el certificat TLS. Jo vaig utilitzar `certbot` de [Let's Encrypt](https://letsencrypt.org/) per a obtenir el certificat.

Ara és moment de configurar el proxy invers de nginx. La configuració del lloc hauria de ser així:

```conf
server {
    if ($host = stats.example.com) {
        return 301 https://$host$request_uri;
    }

    listen 80;
    server_name stats.example.com;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name stats.example.com;

    ssl_certificate /etc/letsencrypt/live/stats.example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/stats.example.com/privkey.pem;

    location / {
        proxy_pass http://127.0.0.1:8091;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Modifica `$host`/`server_name` i les rutes `ssl_certificate`/`ssl_certificate_key` perquè coincideixin amb el teu URL i les rutes del teu certificat.

A la directiva `proxy_pass`, estableix el teu port preferit i utilitza'l per als propers passos.

## Iniciant GoatCounter

Verifica que la configuració de nginx no tingui problemes i recarrega-la:

```bash
nginx -t && systemctl reload nginx
```

Veurem si `goatcounter` funciona:

```bash
/usr/local/bin/goatcounter serve -listen :8091 -tls none
```

Hauries de veure:

```text
Dec  14 13:18:47 INFO: ready; serving 1 sites on ":8091"; dev=false; sites: stats.example.com
```

I hauries de poder iniciar sessió al panell de control a l'URL que has triat.

Si tot funciona bé, bona feina! Ara és moment de configurar un fitxer de servei systemd. Això ens ajudarà a iniciar/detenir fàcilment `goatcounter` i automatitzarà el seu (re)inici en l'arrencada o en cas d'error.

## Fitxer de servei systemd

Encara des de la shell de root, creem el fitxer amb:

```bash
$EDITOR /etc/systemd/system/goatcounter.service
```

Aquí tens un bon punt de partida per a aquest fitxer. Per a la línia `ExecStart=`, utilitza el mateix comandament que acabem de provar:

```conf
[Unit]
Description=Anàlisi web GoatCounter

[Service]
Type=simple
# Reiniciar en cas de fallada.
Restart=always
# Directori de treball al directori d'inici de l'usuari.
WorkingDirectory=/var/lib/goatcounter
# Executable per al servei.
ExecStart=/usr/local/bin/goatcounter serve -listen :8091 -tls none

# Seguretat.
User=goatcounter
Group=goatcounter
CapabilityBoundingSet=
PrivateTmp=true
NoNewPrivileges=true
PrivateDevices=true
DevicePolicy=closed

[Install]
WantedBy=multi-user.target
```

Desa el fitxer i surt de l'editor.

## Iniciant el servei

Ara recarreguem systemd i iniciem el servei:

```bash
systemctl daemon-reload
systemctl start goatcounter
```

En aquest punt, hauries de poder accedir al teu panell de control a l'URL que has triat. Pots verificar l'estat del servei amb `systemctl status goatcounter`. Per veure els registres, utilitza `journalctl -fu goatcounter`.

Només queda configurar el servei perquè s'iniciï automàticament en l'arrencada:

```bash
systemctl enable goatcounter
```

Això és tot! Ara `goatcounter` s'iniciarà en l'arrencada i es reiniciarà en cas de fallada.

---

Si vols donar suport al projecte GoatCounter, pots patrocinar Martin Tournoij, el seu creador i mantenidor, a [GitHub Sponsors](https://github.com/sponsors/arp242).
