+++
title = "Self-hosting ntfy on Debian with nginx"
date = 2023-07-22
updated = 2025-08-06
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

Check the [ntfy releases page](https://github.com/binwiederhier/ntfy/releases) for the latest version. Replace `v2.14.0` in the following commands with the current version:

```bash
wget https://github.com/binwiederhier/ntfy/releases/download/v2.14.0/ntfy_2.14.0_linux_amd64.deb
sudo dpkg -i ntfy_*.deb
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

## Updating ntfy

{% admonition(type="tip") %}
Review the [release notes](https://github.com/binwiederhier/ntfy/releases) before updating to check for any breaking changes or new configuration options.
{% end %}

To update ntfy to a newer version, the process is similar to the initial installation:

1. **Check for the latest version** on the [ntfy releases page](https://github.com/binwiederhier/ntfy/releases)

2. **Download and install the new version:**

   ```bash
   wget https://github.com/binwiederhier/ntfy/releases/download/v2.14.0/ntfy_2.14.0_linux_amd64.deb
   sudo dpkg -i ntfy_*.deb
   ```

3. **Handle configuration file conflicts:** You'll be prompted about the configuration file if you've made changes:

   ```
   Configuration file '/etc/ntfy/server.yml'
    ==> Modified (by you or by a script) since installation.
    ==> Package distributor has shipped an updated version.
      What would you like to do about it ?  Your options are:
       Y or I  : install the package maintainer's version
       N or O  : keep your currently-installed version
         D     : show the differences between the versions
         Z     : start a shell to examine the situation
   ```

    After making your choice —I recommend `N` after reviewing with `D`—, ntfy should restart.

4. **Verify the update:**

   ```bash
   ntfy --version
   sudo systemctl status ntfy
   ```

## Troubleshooting

- Check ntfy logs: `journalctl -u ntfy`
- Verify ntfy status: `systemctl status ntfy`
- Test ntfy directly: `curl http://localhost:$PORT/health`

For more advanced troubleshooting, consult the [ntfy server documentation](https://docs.ntfy.sh/server/).
