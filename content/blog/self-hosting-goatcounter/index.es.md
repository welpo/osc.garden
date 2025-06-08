+++
title = "Autoalojamiento de GoatCounter con un proxy inverso nginx y SSL"
date = 2023-12-14
updated = 2025-06-08
description = "Aprende a autoalojar GoatCounter —una herramienta de análisis web ligera y respetuosa con la privacidad— con un proxy inverso nginx y un certificado SSL."

[taxonomies]
tags = ["aprendizaje del día", "guía"]

[extra]
social_media_card = "img/social_cards/es_blog_self_hosting_goatcounter.jpg"
+++

Tenía curiosidad sobre el tráfico de este sitio y de la [demo de tabi](https://welpo.github.io/tabi/), así que exploré herramientas de análisis web éticas. Mi objetivo era satisfacer mi curiosidad sin comprometer la privacidad de los visitantes; estoy en contra del seguimiento y no quiero contribuir al capitalismo de vigilancia.

Descubrí [GoatCounter](https://www.goatcounter.com/), una herramienta de análisis web ligera, de código abierto y que preserva la privacidad. Es un archivo único y se puede autoalojar. ¡Una opción perfecta!

Las instrucciones de autoalojamiento para GoatCounter son escasas. Hay [este script](https://actually.fyi/posts/goatcounter-vps/) que descarga y configura automáticamente GoatCounter. Sin embargo, no me siento cómodo ejecutando scripts sin examinarlos antes, especialmente si se ejecutan como root.

La guía que sigue se basa en el script, con pasos adicionales para un proxy inverso nginx con certificados SSL. Si usas una distribución Linux con systemd (Debian, Arch, Ubuntu…), te debería servir.

Al final de este artículo, tendrás un panel como [stats.osc.garden](https://stats.osc.garden/) o [tabi-stats.osc.garden](https://tabi-stats.osc.garden/) (tú eliges hacerlo público o no).

¡Empecemos!

## Descarga e instalación

Necesitaremos permisos de root para todo lo que vamos a hacer, así que iniciemos una shell de root:

```bash
sudo -i
```

Descarga el binario de GoatCounter. Obtén la URL para tu sistema desde la [página de lanzamientos de GoatCounter en GitHub](https://github.com/arp242/goatcounter/releases).

Yo utilicé:

```bash
wget https://github.com/arp242/goatcounter/releases/download/v2.6.0/goatcounter-v2.6.0-linux-amd64.gz
```

Si no estás seguro de qué sistema tienes, puedes ejecutar el comando `arch`. Si ves `x86_64`, necesitarás el paquete `amd64`, como yo.

Descomprime el archivo:

```bash
gunzip *goatcounter*gz
```

Muévelo a `/usr/local/bin/` y establece los permisos adecuados:

```bash
mv goatcounter* /usr/local/bin/goatcounter
chmod +x /usr/local/bin/goatcounter
```

Creemos un usuario específico para ejecutar GoatCounter, por aislamiento de seguridad:

```bash
useradd goatcounter --system --user-group --shell /sbin/nologin \
--comment "Análisis web GoatCounter" --create-home \
--home-dir /var/lib/goatcounter
```

Ahora ejecuta `goatcounter` para configurar nuestro usuario y credenciales. Asegúrate de usar tu correo electrónico real y URL (donde vivirá el panel, no el sitio del que quieres obtener las analíticas):

```bash
cd /var/lib/goatcounter/
sudo -u goatcounter /usr/local/bin/goatcounter db create site \
-createdb -user.email correo@example.com -vhost stats.example.com
```

Esto pedirá una contraseña para el panel de GoatCounter.

## Configuración de nginx con SSL

Primero necesitarás configurar tu DNS para tu URL (`stats.example.com`) y obtener el certificado TLS. Yo utilicé `certbot` de [Let's Encrypt](https://letsencrypt.org/) para obtener el certificado.

Ahora es momento de configurar el proxy inverso de nginx. Así es como debería lucir la configuración del sitio:

```conf
server {
    if ($host = stats.example.com) {
        return 301 https://$host$request_uri;
    }

    listen 80;
    server_name stats

.example.com;
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

Modifica `$host`/`server_name` y las rutas `ssl_certificate`/`ssl_certificate_key` para que coincidan con tu URL y las rutas de tu certificado.

En la directiva `proxy_pass`, establece tu puerto preferido y úsalo para los próximos pasos.

## Iniciando GoatCounter

Verifica que la configuración de nginx no tenga problemas y recárgala:

```bash
nginx -t && systemctl reload nginx
```

Veamos si `goatcounter` funciona:

```bash
/usr/local/bin/goatcounter serve -listen :8091 -tls none
```

Deberías ver:

```text
Dec  14 13:18:47 INFO: ready; serving 1 sites on ":8091"; dev=false; sites: stats.example.com
```

Y deberías poder iniciar sesión en el panel en la URL que elegiste.

Si todo está funcionando, ¡buen trabajo! Ahora es momento de configurar un archivo de servicio systemd. Esto nos ayudará a iniciar/detener fácilmente `goatcounter` y automatizar su (re)inicio al arrancar/fallar.

Continuing with the translation of your blog post into Spanish:

## Archivo de servicio systemd

Seguimos desde la shell de root y creamos el archivo con:

```bash
$EDITOR /etc/systemd/system/goatcounter.service
```

Aquí tienes un buen punto de partida para este archivo. Para la línea `ExecStart=`, usa el mismo comando que acabamos de probar:

```conf
[Unit]
Description=Análisis web GoatCounter

[Service]
Type=simple
# Reiniciar en caso de fallo.
Restart=always
# Directorio de trabajo en el directorio home del usuario.
WorkingDirectory=/var/lib/goatcounter
# Ejecutable para el servicio.
ExecStart=/usr/local/bin/goatcounter serve -listen :8091 -tls none

# Seguridad.
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

Guarda el archivo y sal del editor.

## Iniciando el servicio

Recargamos systemd e iniciamos el servicio:

```bash
systemctl daemon-reload
systemctl start goatcounter
```

En este punto, deberías poder acceder a tu panel en la URL que elegiste. Puedes verificar el estado del servicio con `systemctl status goatcounter`. Para ver los registros, usa `journalctl -fu goatcounter`.

Sólo falta hacer que el servicio se inicie automáticamente al arrancar:

```bash
systemctl enable goatcounter
```

¡Eso es todo! Ahora `goatcounter` se iniciará al arrancar y se reiniciará si falla.

---

Si quieres apoyar el proyecto GoatCounter, puedes patrocinar a Martin Tournoij, su creador y mantenedor, en [GitHub Sponsors](https://github.com/sponsors/arp242).
