+++
title = "Self-Hosting GoatCounter with an nginx Reverse Proxy and SSL"
date = 2023-12-14
updated = 2025-12-26
description = "How to self-host GoatCounter —a lightweight, privacy-friendly web analytics tool— with an nginx reverse proxy and an SSL certificate."

[taxonomies]
tags = ["TIL", "guide"]

[extra]
social_media_card = "img/social_cards/blog_self_hosting_goatcounter.jpg"
+++

Being curious about the traffic on this site and the [tabi demo](https://welpo.github.io/tabi/), I researched ethical analytics tools. My goal was to satisfy my curiosity without compromising the privacy of visitors; I'm against tracking and I don't want to contribute to surveillance capitalism.

I found [GoatCounter](https://www.goatcounter.com/), a lightweight, open-source, privacy-friendly web analytics tool. It's a single binary and it can be self-hosted. A perfect fit!

The self-hosting instructions for GoatCounter are sparse. There's [this script](https://actually.fyi/posts/goatcounter-vps/) that automatically downloads and sets up GoatCounter. However, I'm not comfortable running scripts without examining them first, particularly when they're run as root.

The guide that follows is based on the script, with extra steps for an nginx reverse proxy with SSL certificates. If you're on a systemd Linux distribution (Debian, Arch, Ubuntu…), you should be able to follow along.

By the end of this article, you'll have a dashboard like [stats.osc.garden](https://stats.osc.garden/) or [tabi-stats.osc.garden](https://tabi-stats.osc.garden/) (it's up to you whether to make it public).

Let's begin!

## Download and Install

We'll need root permissions for everything we're about to do, so let's start a root shell:

```bash
sudo -i
```

Download the GoatCounter binary. Get the URL for your system from the [GoatCounter GitHub releases page](https://github.com/arp242/goatcounter/releases).

I used:

```bash
wget https://github.com/arp242/goatcounter/releases/download/v2.7.0/goatcounter-v2.7.0-linux-amd64.gz
```

If you're unsure about which system you're on, you can run the `arch` command. If you get `x86_64`, you'll need the `amd64` package, like me.

Unzip the file:

```bash
gunzip *goatcounter*gz
```

Move it to `/usr/local/bin/` and set the appropriate permissions:

```bash
mv goatcounter* /usr/local/bin/goatcounter
chmod +x /usr/local/bin/goatcounter
```

Let's create a specific user to run GoatCounter, for security isolation:

```bash
useradd goatcounter --system --user-group --shell /sbin/nologin \
--comment "GoatCounter web analytics" --create-home \
--home-dir /var/lib/goatcounter
```

Now run `goatcounter` to set up our user and credentials. Make sure to use your actual e-mail and URL (where the dashboard will live, not the site you want to track):

```bash
cd /var/lib/goatcounter/
sudo -u goatcounter /usr/local/bin/goatcounter db create site \
-createdb -user.email email@example.com -vhost stats.example.com
```

This will ask for a password for the GoatCounter dashboard.

## nginx Setup with SSL

First you'll need to configure your DNS for your URL (`stats.example.com`) and get the TLS certificate. I used [Let's Encrypt](https://letsencrypt.org/)'s `certbot` for the certificate.

Now it's time to set up the nginx reverse proxy. Here's what the site config should look like:

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

Modify the `$host`/`server_name` and `ssl_certificate`/`ssl_certificate_key` paths to match your URL and certificate paths.

In the `proxy_pass` directive, set your preferred port and use it for the next steps.

## Starting GoatCounter

Check the nginx config has no issues and reload it:

```bash
nginx -t && systemctl reload nginx
```

Let's see if `goatcounter` works:

```bash
/usr/local/bin/goatcounter serve -listen :8091 -tls none
```

You should see:

```text
Dec  14 13:18:47 INFO: ready; serving 1 sites on ":8091"; dev=false; sites: stats.example.com
```

And you should be able to log in to the dashboard on the URL you chose.

If everything's working, good job! Now it's time to set up a systemd service file. This will help us easily start/stop `goatcounter` and automate its (re)start on boot/failure.

## systemd Service File

Still from the root shell, we create the file with:

```bash
$EDITOR /etc/systemd/system/goatcounter.service
```

Here's a good starting point for this file. For the `ExecStart=` line, use the same command we just tested:

```conf
[Unit]
Description=GoatCounter web analytics

[Service]
Type=simple
# Restart on failure.
Restart=always
# Set the working directory to the user's home directory.
WorkingDirectory=/var/lib/goatcounter
# Specify the executable for the service.
ExecStart=/usr/local/bin/goatcounter serve -listen :8091 -tls none

# Security.
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

Save the file and exit the editor.

## Starting the Service

Now we'll reload systemd and start the service:

```bash
systemctl daemon-reload
systemctl start goatcounter
```

At this point, you should be able to access your dashboard on the URL you chose. You can check the service status with `systemctl status goatcounter`. To see the logs, use `journalctl -fu goatcounter`.

Finally, enable the service to start on boot:

```bash
systemctl enable goatcounter
```

That's it! Now `goatcounter` will start on boot and restart if it fails. Happy analytics!

---

If you want to support the GoatCounter project, you can sponsor Martin Tournoij, its creator and maintainer, on [GitHub Sponsors](https://github.com/sponsors/arp242).
