+++
title = "kawari"
description = "Private yet shareable diffs. No backend; everything stored in the URL."
weight = 3

[taxonomies]
tags = ["JavaScript", "privacy", "web app", "PWA"]

[extra]
remote_image = "https://cdn.jsdelivr.net/gh/welpo/kawari@main/app/logo.png"
social_media_card = "blog/kawari-diff-in-the-url/social_cards/kawari.jpg"
+++

kawari is a web app that generates diffs locally and lets you share them by encoding everything in the URL. No server, accounts, or tracking. Named after the Japanese word for "change" (<ruby>変<rt>ka</rt></ruby><ruby>わ<rt>wa</rt></ruby><ruby>り<rt>ri</rt></ruby>).

#### [Try it now](https://diff.osc.garden) • [GitHub](https://github.com/welpo/kawari) • [Blog post](@/blog/kawari-diff-in-the-url/index.md) {.centered-text}

{% wide_container() %}
<a href="https://diff.osc.garden/#zZJvS8MwEMa_ypkXukEVcYpYRBBloDDfTPSFlZG2tzaQXkaSTsYo-CH8hH4Ss7bbLJaBfzGvktwdzz13vznjzGdIeQZDTDIkC_OAwJ2hogTmYIWV6MP2jrHcigiM1R5wbYWxzV8ovLpQSKQIXa3BSFFsfMh7B6vwQJGSKsmx876666JFQAGNCSS3OCKRpHY00SrRPOt0YfcM7jA6rZs8W3Y5xWjrobqW2lXY96vu14HFqa0E7AanqGGAnGzAvGbS0lrAzjPUIuIEfaVsyKVs5BZem-pH67399tT1GJr6AbtNEULkuZ2BGoN1r3IWkPEYIRUZGB43Wum2trJpAH3nRlCywfx1LhHhQufCYKvvx3JfzGPhv-GnLF78KLq6_F26VioOk7FdwCTiakuvzy9wcrzXg_4gYJ_fzF-ieXj0FTSNyiUIAylyiTGEMwerYwmehE0hSoWMNdI3-Vzo3CstYxhOBJkf4ZQcp_ViWPEG">
{{ dual_theme_image(light_src="img/screenshot_light.png", dark_src="img/screenshot_dark.png", alt="Screenshot of kawari showing a side-by-side diff of a Rust program, with additions in green and removals in red") }}
</a>
{% end %}

## Features

- Private: texts never leave your browser
- Shareable: the entire diff is compressed and stored in the URL
- Side-by-side and unified diff views
- Mini-map for navigating large diffs
- Vim-like keyboard navigation (<kbd>j</kbd>/<kbd>k</kbd>)
- Ignore options for whitespace and quote style differences
- Service workers to avoid locking the browser on large diffs
- Installable as a PWA for full offline functionality
- No dependencies: vanilla JavaScript, HTML, and CSS
