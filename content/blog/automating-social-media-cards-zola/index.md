+++
title = "From Bashful to Social Butterfly: Automating Link Previews for Zola Sites"
date = 2023-09-06
updated = 2024-05-23
description = "In a quest to make Zola websites more social media-friendly, I've cracked the code for automating the creation of social media cards."

[taxonomies]
tags = ["TIL", "Zola", "automation"]

[extra]
copy_button = true
footnote_backlinks = true
social_media_card = "img/social_cards/blog_automating_social_media_cards_zola.jpg"
+++

Ever wondered how apps like WhatsApp, Telegram, or Mastodon show a link preview? Below is a plain WhatsApp link. Click to reveal its preview-enhanced version:

{{ image_toggler(default_src="img/without_social_media_card.webp", toggled_src="img/with_social_media_card.webp", default_alt="Sharing a link without social media cards", toggled_alt="Sharing a link with social media cards") }}

Much better, no? These images, called **social media cards**, are retrieved from HTML tags, namely `og:image` and `twitter:image`. You can set them to any image you like.

While working on this site's theme—[tabi](https://github.com/welpo/tabi)—I stumbled upon [a post by Simon Willison](https://til.simonwillison.net/shot-scraper/social-media-cards) explaining how to use his tool [`shot-scraper`](https://shot-scraper.datasette.io/en/stable/) to generate these images.

I decided to explore if I could follow a similar approach to create the social media cards for all the articles in this site as well as in [tabi's demo](https://welpo.github.io/tabi/). And, even more fun, try to automate the process for new and modified posts.

## Context

This site is built with [Zola](https://www.getzola.org/), which uses the [TOML front matter](https://www.getzola.org/documentation/content/page/#front-matter) to store metadata (e.g. title, date, tags…). By default, Zola does not handle these images.

However, it's possible to add custom variables to the `[extra]` section, so I decided to add a `social_media_card` key to tabi ([PR 130](https://github.com/welpo/tabi/pull/130)).

Now, any site using tabi can add `social_media_card = path/to/img.jpg` to a file. When the post is shared on social media, that image will be shown as a preview.

## First Step: Get a Nice Image

I started tinkering with `shot-scraper`, trying to find the perfect command. After some trial and error[^1], I ended up with:

```bash
shot-scraper 127.0.0.1:1111 -w 700 -h 400 --retina --quality 60
```

This creates a 1400 by 800 JPEG screenshot with a quality factor of 60. I find it works well for the theme's proportions:

{{ dual_theme_image(light_src="img/social_cards/index.jpg", dark_src="img/dark_index_screenshot.jpg" alt="A screenshot of osc.garden homepage") }}

The quality is not great if you look up close, but it's good enough™ for social media cards.

## Choosing a Filename

The Meta for Developers documentation [says](https://developers.facebook.com/docs/sharing/webmasters/#images):

> "[Social media card] Images are cached based on the URL and won't be updated unless the URL changes."

This means that if we update a post, its social media card URL needs to change too.

At first I thought of using the truncated [SHA-1](https://simple.wikipedia.org/wiki/SHA-1) hash of the screenshot as a prefix to its name. If the image was different, so would its name.

Then I remembered I could just add Zola's built in cache busting mechanism to tabi, which appends `?h=<sha256>` to the end of a URL. This greatly simplifies the process, particularly when it comes to updating an article's metadata.

## The Logic

Given a Markdown file (an article) we need to:

1. Take a screenshot of the live page
2. Save it to the proper path (e.g. `static/img/social_cards`)
3. Update the `.md` file's front matter (metadata) with the `social_media_card` path

Here's how I achieved the first two steps using Bash:

```bash
base_url="http://127.0.0.1:1111"  # Zola's default interface/port.
output_path="static/img/social_cards"
post="$1"  # The first argument provided to the script.

post_name="${post%.md}"  # Remove the extension.
url="${post_name#content/}"  # Remove the 'content/' part; the parent directory of Zola's content.

# Temp file for the screenshot.
temp_file=$(mktemp /tmp/social-cards-zola.XXXXXX)
trap 'rm -f "$temp_file"' EXIT  # Ensure its deletion.

# Save the screenshot on the temp file.
shot-scraper --silent "${base_url}/${url}" -w 700 -h 400 --retina --quality 60 -o "$temp_file"

# Clean the filename.
safe_filename=$(echo "${url##*/}" | sed 's/[^a-zA-Z0-9]/_/g')  # Slugify.
image_filename="${output_path}/${safe_filename}.jpg"

# Move the screenshot to the output directory.
mv "$temp_file" "$image_filename"
```

Simple enough. I saved the script above as `social-cards-zola`.

## Problems Arise

### Multilingual Sites

At this point, with the basic script done, I encountered a problem: filenames don't always match to URLs.

A post in another language, say, `my-first-post.es.md`, will not be available at `base_url/my-first-post.es`, but rather at `base_url/es/my-first-post`.

Let's add the logic to extract the language code to build the proper URL. Using Bash's [parameter expansion](https://mywiki.wooledge.org/BashGuide/Parameters#Parameter_Expansion), we get:

```bash
# Remove the extension and "content/" prefix.
post_name="${post%.md}"
url="${post_name#content/}"
# Try to get the language code.
lang_code="${url##*.}"

if [[ "$lang_code" == "$url" ]]; then
    # There was no language code.
    lang_code=""
else
    # Drop the language code from the URL.
    url="${url%.*}"
fi

url="${lang_code}/${url}"
```

Easy!

### What About Sections?

Having a screenshot for a post is great, but how about the main index? Or the archive page? In Zola, these are not [pages](https://www.getzola.org/documentation/content/page/), but [sections](https://www.getzola.org/documentation/content/section/), and their URL corresponds to the directory name. For example, `content/archive/_index.fr.md` is available at `base_url/fr/archive/`.

We can adapt the logic above to remove the `_index` part of the filename:

```bash, hl_lines=17-20
function convert_filename_to_url() {
    # Remove .md extension.
    local post_name="${1%.md}"

    # Remove "content/" prefix.
    local url="${post_name#content/}"

    # Extract language code.
    local lang_code="${url##*.}"
    if [[ "$lang_code" == "$url" ]]; then
        lang_code=""  # No language code.
    else
        lang_code="${lang_code}/"  # Add trailing slash.
        url="${url%.*}"  # Remove the language code from the URL.
    fi

    # Remove "_index" suffix.
    if [[ "$url" == *"_index"* ]]; then
        url="${url%%_index*}"
    fi

    # Return the final URL with a single trailing slash.
    full_url="${lang_code}${url}"
    echo "${full_url%/}/"
}
```

Here's how `convert_filename_to_url` handles different files:

{% wide_container() %}

| Input                          | Output              |
| ------------------------------ | --------------------|
| `content/_index.es.md`         | `es/`               |
| `content/blog/markdown.fr.md`  | `fr/blog/markdown/` |
| `content/blog/comments.md`     | `blog/comments/`    |
| `content/archive/_index.md`    | `archive/`          |
| `content/archive/_index.ca.md` | `ca/archive/`       |

{% end %}

In each case, if we prepend the base URL to the output, we get the complete link.

## Modifying the Front Matter

Now I can easily generate the screenshots for the posts, but I still need to associate the images with the Markdown files.

To update the metadata, I used [`awk`](https://en.wikipedia.org/wiki/AWK) to find where the front matter begins, locate or create the `[extra]` section, and add or update the `social_media_card` key:

```awk
# Initialize flags for tracking state.
BEGIN { in_extra=done=front_matter=0; }

# Function to insert the social_media_card path.
function insert_card() { print "social_media_card = \"" card_path "\""; done=1; }

{
    # If card has been inserted, simply output remaining lines.
    if (done) { print; next; }

    # Toggle front_matter flag at its start, denoted by +++
    if (/^\+\+\+/ && front_matter == 0) {
        front_matter = 1;
        print "+++";
        next;
    }

    # Detect [extra] section and set extra_exists flag.
    if (/^\[extra\]/) { in_extra=1; extra_exists=1; print; next; }

    # Update existing social_media_card.
    if (in_extra && /^social_media_card =/) { insert_card(); in_extra=0; next; }

    # End of front matter or start of new section.
    if (in_extra && (/^\[[a-zA-Z_-]+\]/ || (/^\+\+\+/ && front_matter == 1))) {
        insert_card();  # Add the missing social_media_card.
        in_extra=0;
    }

    # Insert missing [extra] section.
    if (/^\+\+\+/ && front_matter == 1 && in_extra == 0 && extra_exists == 0) {
        print "\n[extra]";
        insert_card();
        in_extra=0;
        front_matter = 0;
        print "+++";
        next;
    }

    # Print all other lines as-is.
    print;
}
```

I added this function to `social-cards-zola`, which gets triggered with the `-u` or `--update-front-matter` flag.

## Concurrency

I wanted to create the images for all posts at once, so I used [GNU parallel](https://www.gnu.org/software/parallel/) to concurrently process all Markdown files:

```bash
find content -type f -name '*.md' | parallel -j 8 'social-cards-zola \
    -o static/img/social_cards -b https://osc.garden -u -p -i {}'
```

A few seconds later, I had a bunch of screenshots and updated Markdown files. Awesome!

## Automating the Process

Naturally, the next step was adding this process to my Git pre-commit hook, which was already [updating post dates and optimising PNG files](https://osc.garden/blog/zola-date-git-hook/).

Whenever I commit Markdown files (new or modified), I generate the screenshot and update the front matter of the post or section:

```bash
function generate_and_commit_card {
    local file=$1

    # Generate the social media card and update the front matter.
    social_media_card=$(social-cards-zola -o static/img/social_cards\
        -b http://127.0.0.1:1025 -u -p -i "$file")

    # Commit the changes.
    git add "$social_media_card"
    git add "$file"
}

export -f generate_and_commit_card

# Create/update the social media card for each modified Markdown file.
changed_md_files=$(git diff --cached --name-only | grep '\.md$')
if [[ -n "$changed_md_files" ]]; then
    echo "$changed_md_files" | parallel -j 8 generate_and_commit_card
fi
```

You can see how this is integrated in the [full pre-commit hook](https://github.com/welpo/osc.garden/blob/main/.githooks/pre-commit).

The full `social-cards-zola` script, with more settings (like using a different front matter key) is available [on this site's repository](https://github.com/welpo/osc.garden/blob/main/static/code/social-cards-zola).

## The End?

The script works, but it's quite fragile: it breaks if you use it outside the site's root path, requires `parallel` to handle concurrency, and will probably fail if you try to update many Markdown files at once (Zola rebuilds the site after each modification, returning 404s for a bit).

I'm happy to have worked out the problem, but I also see this as an opportunity to turn this good enough™ script into a small but solid Rust program—a good first Rust project, no?

So… to be continued, maybe.

---

[^1]: Initially, I was converting the PNG screenshots to WebP, as these are significantly smaller (~40KB) than similar looking JPEGs (~100KB). However, as I tried to take the screenshot for the first image of the article, I realised WhatsApp doesn't support WebP social media cards. Unfortunate.
