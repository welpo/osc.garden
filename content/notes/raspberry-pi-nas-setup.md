+++
title = "Setting up a NAS with Raspberry Pi"
date = 2024-08-02
description = "Setting up a Network Attached Storage (NAS) system using a Raspberry Pi and Samba."

[extra]
toc = true
+++

## 1. Install Samba

```bash
sudo apt update
sudo apt install samba samba-common-bin
```

## 2. Mount Storage Drive

```bash
sudo mkdir -p /mnt/nas
sudo mount /dev/sda2 /mnt/nas
df -h  # Verify mount
```

## 3. Configure Automatic Mounting

Edit the fstab file:

```bash
sudo $EDITOR /etc/fstab
```

Add this line:

{% admonition(type="warning") %}
Replace the `uid` and `gid` with your user's. You can find these values by running `id -u` and `id -g`.
{% end %}

```
/dev/sda2  /mnt/nas  exfat  defaults,auto,nofail,umask=000,dmask=000,fmask=000,uid=1000,gid=1000  0  0
```

Apply changes:

```bash
sudo mount -a
```

## 4. Configure Samba

Edit Samba configuration:

```bash
sudo $EDITOR /etc/samba/smb.conf
```

Add this section:

{% admonition(type="tip") %}
Replace `your_username` with your actual Raspberry Pi username in the following configuration.
{% end %}

```ini
[NAS]
    path = /mnt/nas
    writeable = yes
    create mask = 0777
    directory mask = 0777
    force user = your_username
    force group = your_username
    public = no
```

{% admonition(type="danger") %}
These permissions (0777) grant full access to all users. Consider reading about [Linux file permissions](https://www.redhat.com/en/blog/linux-file-permissions-explained).
{% end %}

## 5. Create Samba User

```bash
sudo smbpasswd -a your_username
```

## 6. Restart Services and Configure Firewall

```bash
sudo systemctl restart smbd
sudo ufw allow samba
```

## 7. Connect from macOS

1. In Finder, select Go > Connect to Server
2. Enter: `smb://your_pi_ip/NAS`
3. Enter your Samba credentials

## 8. Optional: Add to Finder Sidebar

Drag the mounted NAS icon to your Finder sidebar for quick access
