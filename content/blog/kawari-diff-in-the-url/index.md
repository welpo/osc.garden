+++
title = "Developing a Web App to Generate Private yet Shareable Diffs"
date = 2026-03-11
description = "I built a web app to generate private, shareable diffs by storing the diff in the URL."

[taxonomies]
tags = ["code", "JavaScript", "privacy", "web app", "PWA"]

[extra]
social_media_card = "social_cards/kawari.jpg"
tldr = "I built [a web app](https://diff.osc.garden) to generate private yet shareable diffs without backend."

+++

Every now and then I need to do a quick diff —compare two pieces of text/code for differences— outside a Git environment.

There are websites where you can paste the two texts, and you get a diff. Are the texts being sent to a server, though? I don’t like that.

To avoid using these sites, I use [a snippet to start vim in diff mode with a `bash` alias](@/notes/vimdiff-without-files.md). It (mostly) works, but I often want to share the diff. A screenshot is not convenient for the receiver; they can’t copy or edit it.

Recently I learnt browsers can handle big URLs. At a minimum, they’re [supposed to support 8,000 characters](https://www.rfc-editor.org/rfc/rfc9110#section-4.1-5). In practice:

- Firefox: configurable default of [1MB](https://github.com/mozilla-firefox/firefox/blob/27f4694604d9b56a237fe533d36ea385384e0e32/toolkit/components/extensions/test/xpcshell/test_ext_dnr_webrequest.js#L216), ~1 million characters
- Safari: no limit (there may be a [2GB (~2 billion characters) limit on iOS](https://github.com/swiftlang/swift-corelibs-foundation/blob/swift-DEVELOPMENT-SNAPSHOT-2025-12-19-a/Sources/CoreFoundation/CFURLComponents_URIParser.c#L719))
- Chrome: [up to 2MB](https://chromium.googlesource.com/chromium/src/+/HEAD/docs/security/url_display_guidelines/url_display_guidelines.md#url-length), ~2 million characters

After seeing a [notes app that stores everything on the URL](https://textarea.my/#JYwxDsIwEAR7XrFKbfEOKioayiO54JNsX3Q-W6LLI2jyvbyEKHSzI-0Mj8hYTF-JM6TCI3kA-QGMzvbBxLwgcecUTmlMo4sW6Hzu2DIVZCkTXLEkptqMj1bZ181RyaXO_0uA-CErRqMu5Y1ZDVmNrwP29Ytn65RwV4q4kZHJ5Qc=) ([HN discussion](https://news.ycombinator.com/item?id=46378554)), I came up with the idea for a web app that generates diffs locally with the ability to share them by encoding everything in the URL.

I used Claude and Gemini to code it. I didn’t want any dependencies: I trusted vanilla JavaScript, HTML, and CSS would be enough.

The main trick was to store the entire two texts, compressed with `deflate-raw` ([see spec](https://compression.spec.whatwg.org/)), in the URL. That and having an algorithm to generate the diff.

## Diff algorithms

It wasn’t my goal, but I ended up learning about diff algorithms.

For a snippet like this:

```rust
fn load_config() {
    // ...
}

fn initialize_logger() {
    // ...
}

fn start_server() {
    // ...
}
```

If you change the order so as to define `start_server()` first, would you expect this diff?

{{ dual_theme_image(light_src="img/myers_light.png", dark_src="img/myers_dark.png", alt="Side-by-side Myers diff of reordered Rust functions. initialize_logger and start_server are marked as deleted on the left; load_config and initialize_logger as added on the right. The identical body lines are matched across different functions, making it look like functions were renamed rather than moved.") }}

or this?

{{ dual_theme_image(light_src="img/patience_light.png", dark_src="img/patience_dark.png", alt="Side-by-side Patience diff of the same reordering. Only start_server is shown as removed from the bottom and added at the top. load_config and initialize_logger remain matched in place, clearly showing a block move.") }}

The first is the result of the [Myers diff algorithm](https://nathaniel.ai/myers-diff/), by Eugene W. Myers. The second diff uses [Patience Diff](https://bramcohen.livejournal.com/73318.html?thread=1081702), by Bram Cohen. Myers tries to find the smallest set of line removals/additions that changes one file into another. Patience diff tries to make diffs more human-readable by avoiding confusing matches.

## Less is less

I tried to get even shorter URLs than `deflate-raw` was providing when storing full “Original” and “Modified” inputs. Deduplicating common lines helped, but it gave me less than a 5% decrease in URL length. I dropped this change in favour of simplicity.

## Cool stuff

LLMs + me = feature creep. That said, I’m glad I added:

### The mini-map

<video class="img-light full-width" autoplay loop muted playsinline width="1000" title="Mini-map navigation demo" preload="none" src="img/minimap_light.mov"></video>
<video class="img-dark full-width" autoplay loop muted playsinline width="1000" title="Mini-map navigation demo" preload="none" src="img/minimap_dark.mov"></video>

Inspired by VSCode. Useful for navigating through the diff. At first I had buttons to jump to next/previous change; this is way more convenient.

### More

- It uses service workers to avoid locking the browser on large diffs.
- Can be installed as PWA for full offline functionality.
- Keyboard shortcuts for faster input/editing, and vim-like navigation (move up/down the diff with <kbd>j</kbd> and <kbd>k</kbd>).
- Includes “Ignore” options for whitespace differences and quote styles.
- It’s not necessary to build the app, but I use `node` to run tests on the code. The [tests](https://github.com/welpo/kawari/tree/main/tests) verify the patches generated by the tool are (1) valid and when applied to the original text (2) generate the expected result.

---

I was worried about the practicality of long URLs. I tested them in Slack, and noticed they get visually truncated, but the content is preserved. Plus, you can always link a specific word instead of pasting the raw URL.

If you want to play around with it, visit [diff.osc.garden](https://diff.osc.garden). The source code is [on GitHub](https://github.com/welpo/kawari). I named it `kawari` for “change” in Japanese.

---

## Extra: more URL-abusing projects

A few cool projects storing data in the URL, from [the Hacker News discussion](https://news.ycombinator.com/item?id=46378554):

- [Map drawings](https://nyman.re/mapdraw/#l=35.503832%2C-224.253455&z=17&d=VVO9ahtBEJ51nHq9t7fXjzeNTtcdAne6CO4NotUjmIS8gKvEgRCCiSEBl36AYFKlSBVMOr-ASeHSlTEc7t34m9mTbLPamW9-dv5utLW9Vx6fDPz3Yrg0q67vVov9tJ_evjky74_MR_PVpFPzyfwChOYU7CAdpFVadrHiaq-6-D7w1R-8dRP3muezD-2h6X-a_sws_5n-3PSgl6bF77-J54bPTDwx7tDw0s15QqH9_OLu28D31whBpSOqqHKlFVq5WmTg0kEWvXBbAjUOVL1EIldvpEbejFb1xwXP1vxeaKx5ITL0dUQmqhgxrXirH5BExhH_rIUOmcaagHO9GeMES1GpoyjUu8CQHYlGuVc_siHiAkFW2_qVSozXokcsYPUnEm-dje2cnESdTW4BVNuGatQnV_uwXea5c8ia2_kxlkbKXPLlnFJvHLNpTY-VbfiTXp7bNtrs89jJOqdSzEK6Rha5mmG0Qm5HOxP7Xrj6xFGn3LfwasVXpGzx2gHwLDByxSAes9AqzhOU7jGLjpIczO0dbsLsMEHIDZWY33rD9NuOVE5ZUOEL2qEigIZXofC7gsMukGiA_U4gZJB9wa5gl7iJpWt4vUW6Jcplm_K3nKL7qZ2Az93ETkmQJ1SMSJjm763jHwPf3uAv8eXlsP0A)
- [Spreadsheets](https://gabrielsroka.github.io/webpages/calc.htm#b1:=(a1+1);a1:6)
- [Guitar tabs](https://github.com/planbnet/guitartabs)
- [Conversion between SQL dialects](https://sqlscope.netlify.app/?inputDialect=redshift&outputDialect=databricks&inputSql=H4sIAAAAAAAAAwt29XF1DuFSAAKlkoxUhcLSzORshaSi/PI8JaCojkJafgWY9nH1cw/x0HB2DA7RUDI0MlZScAxWCHMMcvZwDNLwdYzQ1NTkcgvy91XIKs0tKOby9PNzDVLw8vf0U8gvSy2KB5rN5R8aAhPLSayqRFaTkp8OAAjU9p6KAAAA)
