+++
title = "Zola Git Pre-Commit Hook: Updating Post Dates"
date = 2023-04-17
updated = 2024-07-11
description = "In order to keep the 'Last updated' field of posts always accurate, I automated its modification with a custom Git pre-commit hook."

[taxonomies]
tags = ["TIL", "Zola", "automation", "Git"]

[extra]
copy_button = true
social_media_card = "img/social_cards/blog_zola_date_git_hook.jpg"
+++

In order to keep the "Last updated" field of posts always accurate, I automated its modification with a custom Git pre-commit hook.

A Git pre-commit hook is a script that runs automatically before each commit. It can perform custom actions, such as validating code, running tests, or, in this case, updating post dates.

## The Hook

This Bash script creates or modifies the `updated` field in the front matter of committed Markdown files with their last modified date.

Here's the code (also available on [gist](https://gist.github.com/welpo/6594765f5640982cb5886c9e9459ef5b)):

```bash
#!/usr/bin/env bash
# Requires Bash 4.0 or newer.

# This script updates the 'updated' field in the front matter of modified .md
# files setting it to their last modified date.

# Function to exit the script with an error message.
function error_exit() {
    echo "ERROR: $1" >&2
    exit "${2:-1}"
}

# Function to extract the date from the front matter.
function extract_date() {
    local file="$1"
    local field="$2"
    grep -m 1 "^$field =" "$file" | sed -e "s/$field = //" -e 's/ *$//'
}

# Get the modified .md files, ignoring "_index.md" files.
mapfile -t modified_md_files < <(git diff --cached --name-only --diff-filter=M | grep -Ei '\.md$' | grep -v '_index.md$')

# Loop through each modified .md file.
for file in "${modified_md_files[@]}"; do
    # Get the last modified date from the filesystem.
    last_modified_date=$(date -r "$file" +'%Y-%m-%d')

    # Extract the "date" field from the front matter.
    date_value=$(extract_date "$file" "date")

    # Skip the file if the last modified date is the same as the "date" field.
    if [[ "$last_modified_date" == "$date_value" ]]; then
        continue
    fi

    # Update the "updated" field with the last modified date.
    # If the "updated" field doesn't exist, create it below the "date" field.
    awk -v date_line="$last_modified_date" 'BEGIN{FS=OFS=" = "; first = 1} { if (/^date =/ && first) { print; getline; if (!/^updated =/) print "updated" OFS date_line; first=0 } if (/^updated =/ && !first) gsub(/[^ ]*$/, date_line, $2); print }' "$file" > "${file}.tmp" && mv "${file}.tmp" "$file" || error_exit "Failed to update file $file"

    # Stage the changes.
    git add "$file"
done
```

## Setup

After setting up your Zola project and Git repository:

1. Create or update the `pre-commit` file inside `.git/hooks` (in your project's root directory) with the script above.

2. Make the script executable with `chmod +x .git/hooks/pre-commit`.

It's that simple.

Now, whenever you commit Markdown files with a `date` field, the `updated` field will be created or updated with the file's last modification date in [ISO 8601 format](https://en.wikipedia.org/wiki/ISO_8601) (e.g. 2027-08-29).

## Extra: Losslessly Compressing PNGs

To speed things up, I love (losslessly) compressing files. For that purpose, I updated the script to include PNG compression with either [oxipng](https://github.com/shssoichiro/oxipng) or [optipng](https://optipng.sourceforge.net/).

Since you can't have more than one pre-commit hook[^1], I added the compression functionality to the previous script by appending these lines ([gist with the full script](https://gist.github.com/welpo/f5563c3b82fe247ed0e473d940a005b7)):

```bash
# Check if oxipng or optipng are installed.
if command -v oxipng &> /dev/null; then
    png_compressor="oxipng -o max"
elif command -v optipng &> /dev/null; then
    png_compressor="optipng -o 7"
fi

# If either compressor is installed…
if [[ -n "$png_compressor" ]]; then
    # Get the modified or added png files.
    mapfile -t png_files < <(git diff --cached --name-only --diff-filter=d | grep -Ei '\.png$')

    # Loop through each png file.
    for file in "${png_files[@]}"; do
        # Compress the png file.
        $png_compressor -- "$file" || error_exit "Failed to compress file $file"

        # Stage the changes.
        git add -- "$file"
    done
fi
```

With these extra lines, if a PNG compressor is installed, the script will look through the commited PNG files and losslessly compress them.

Now I can easily maintain accurate "Last updated" dates for Zola posts and optimise PNG images for faster loading times.

Over time, I've added other features like preventing commits of drafts and files that include "TODO", and running optimisation scripts. You can take a look at the hook I'm currently using [here](https://github.com/welpo/osc.garden/blob/main/.githooks/pre-commit).

---

[^1]: If you prefer to maintain separate functionality and use multiple files for your pre-commit scripts, you can create a `pre-commit` file that invokes all the other scripts (which you could put inside a `pre-commit.d` directory, for example).
