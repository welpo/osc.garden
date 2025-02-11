+++
title = "Self-hosting ntfy on Debian with nginx"
date = 2023-07-22
description = "A guide to self-hosting ntfy, a simple HTTP-based pub-sub notification service, on Debian with nginx."

[extra]
toc = true
toc_ignore_pattern = "^Docs.*"
+++

> ntfy (pronounced *notify*) is a simple HTTP-based [pub-sub](https://en.wikipedia.org/wiki/Publish%E2%80%93subscribe_pattern) notification service. It allows you to send notifications to your phone or desktop via scripts from any computer, and/or using a REST API. It's infinitely flexible, and 100% free software.

#### [Docs](https://docs.ntfy.sh/) • [GitHub](https://github.com/binwiederhier/ntfy) {.centered-text}

## Prerequisites

1. Add DNS records for your subdomain
2. Set up Let's Encrypt SSL certificates

## Installation

{% admonition(type="info") %}
This guide is for Debian-based systems using nginx. For other distributions, refer to the [official installation guide](https://docs.ntfy.sh/install/).
{% end %}

Check the [ntfy releases page](https://github.com/binwiederhier/ntfy/releases) for the latest version. Replace `v2.11.0` in the following commands with the current version:

```bash
wget https://github.com/binwiederhier/ntfy/releases/download/v2.11.0/ntfy\_2.11.0\_linux\_amd64.deb
sudo dpkg -i ntfy\_\*.deb
sudo systemctl enable ntfy
sudo systemctl start ntfy
```

For more installation options, refer to the [official installation guide](https://docs.ntfy.sh/install/).

## Configuration

Edit the config file:

```bash
sudo $EDITOR /etc/ntfy/server.yml
```

Add the following configuration (adjust as needed):

{% admonition(type="warning") %}
Replace `$PORT` and `$USERNAME` with your actual values.
{% end %}

```yml
base-url: "https://ntfy.osc.garden"
listen-http: "127.0.0.1:$PORT"
behind-proxy: true

# For iOS instant notifications.
upstream-base-url: "https://ntfy.sh"

# Persist messages on restart.
cache-file: "/var/cache/ntfy/cache.db"
cache-duration: "12h"

# For a private instance.
auth-file: "/var/lib/ntfy/user.db"
auth-default-access: "deny-all"
```

For a detailed explanation of these configuration options, see the [server configuration documentation](https://docs.ntfy.sh/config/).

Start the ntfy server:

```bash
sudo ntfy serve
```

While serving, add an admin user:

```bash
sudo ntfy user add --role=admin $USERNAME
```

## Nginx configuration

Add this server block to your Nginx configuration:

```
# ntfy notifications
server {
    listen 443 ssl http2;
    include /etc/nginx/include.d/all-common;
    server_name ntfy.osc.garden;
    location / {
        proxy_pass http://localhost:$PORT;
        proxy_http_version 1.1;

        proxy_set_header Host $http_host;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;

        proxy_connect_timeout 3m;
        proxy_send_timeout 3m;
        proxy_read_timeout 3m;

        client_max_body_size 0; # Stream request body to backend
    }
}
```

This configuration is based on the [recommended Nginx setup](https://docs.ntfy.sh/config/#nginx) in the ntfy documentation.

Test and reload Nginx:

```bash
sudo nginx -t
sudo systemctl reload nginx
```

## Access tokens

Create [access tokens](https://docs.ntfy.sh/config/#access-tokens) for different uses:

```bash
ntfy token add osc
```

Use these tokens to authenticate when [publishing messages](https://docs.ntfy.sh/publish/#access-tokens).

## Troubleshooting

- Check ntfy logs: `journalctl -u ntfy`
- Verify ntfy status: `systemctl status ntfy`
- Test ntfy directly: `curl http://localhost:$PORT/health`

For more advanced troubleshooting, consult the [ntfy server documentation](https://docs.ntfy.sh/server/).
