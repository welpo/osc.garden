+++
title = "Condensing Media for Language Learning with shuku"
date = 2024-12-24
updated = 2024-12-26
description = "I've built a tool that turns a 3-hour film into a 45-minute language learning resource. Keep the dialogue, skip the rest!"
[taxonomies]
tags = ["code", "python", "linguistics", "multimedia"]

[extra]
stylesheets = ["css/shuku.css"]
social_media_card = "img/social_cards/blog_shuku_condensed_media_language_learning.jpg"
+++

I created [shuku](https://github.com/welpo/shuku) to shrink films and TV shows to keep only the dialogue:

<div id="animation-container">
  <noscript>
    <video class="invertible-image" controls muted width="1000" loop="true" autoplay="autoplay" title="shuku demo" src="https://cdn.jsdelivr.net/gh/welpo/shuku/assets/animation_demo/shuku_demo.mov"></video>
  </noscript>
</div>

<script defer src="js/d3.min.js"></script>
<script defer src="js/generated_data.js"></script>
<script defer src="js/script.js"></script>

## Why?

The more time you spend with a language, the faster you acquire it.

I listen to Japanese podcasts while working out or going on walks. As a beginner, comprehension is hard. Without context, I can only understand individual words and short sentences.

One way to massively increase context is to re-visit content. Listening to the audio track of a film you’ve watched before allows you to understand more than on your first time. You know what’s happening and how it will all turn out!

The idea is to watch a film or a series episode, and then listen to the condensed version to increase comprehension.

As seen above, films have varying amounts of silence. If someone wants to use Blade Runner 2049 to learn English, instead of listening to the full 2 hours 43 minutes, they can use shuku to get the dialogue-only version at 55 minutes. Way more efficient!

## How?

Subtitle files contain all the information we need: a list of all voiced lines with start and end times. A snippet from Blade Runner 2049:

```srt
78
00:14:46,094 --> 00:14:49,184
Do you feel that there's a part of you
that's missing? Interlinked.

79
00:14:49,348 --> 00:14:51,768
-Within cells interlinked.
-Within cells interlinked.
```

shuku uses this timing to condense media. A summary of the process:

1. Run shuku with a video file like `Blade.Runner.2049.2017.2160p.UHD.BluRay.TrueHD.7.1.HDR.x265.mkv`
2. If enabled, finds matching subtitles (else, uses internal subs)
3. Filters out unwanted subtitles (see below)
4. Creates a list of speech segments (start/end timings from subs)
5. Extracts the segments to a temporary directory
6. Joins segments into audio file with metadata and a clean filename: `Blade Runner 2049 (2017) (condensed).mp3`

## What does it look like?

Here's a clip from Blade Runner 2049. The audio comes from the condensed version:

{{ aside(text="The main use-case for shuku is condensed audio, not video.") }}

<video controls preload="none" width="800" poster="media/blade_runner_2049_poster.webp" title="Blade Runner 2049 original vs condensed clip" src="media/blade_runner_2049_original_vs_condensed.mp4"></video>

{{ admonition(type="info", text="By default, shuku [adds half a second around each line](https://github.com/welpo/shuku?tab=readme-ov-file#padding) to avoid abrupt cuts.") }}

As you can see, the dialogue bits are almost identical, except there's less silence in the condensed version. The main difference is we skip the fighting and travelling.

## Source of the idea

I did not invent “condensed media”. It’s an old idea, and there are at least two programs that can do this: [`impd`](https://github.com/Ajatt-Tools/impd) (for GNU+Linux) and [`condenser`](https://github.com/ercanserteli/condenser) (for Windows).

I created shuku because neither `impd` nor `condenser`  worked on macOS. My first approach was to fork `condenser` to replace the Windows-specific parts. I quickly realised I wanted to implement more changes than that.

Thus, I set out on creating the best media condenser, with multi-platform support, 100% code coverage, and extensive customisation.

Here's a [table comparing the three tools](https://github.com/welpo/shuku?tab=readme-ov-file#comparison-with-similar-tools).

## Challenges

### Fuzzy matching

Given a video file `Blade Runner 2049.mkv` shuku is able to match it to its subtitle file `Blade Runner 2049 (1080p).srt`, even if the names aren't an exact match.

To achieve this, shuku cleans both the input filename and all potential subtitles:

- `Old_Movie_1950_Remastered_2023.mp4` → `old movie remastered 1950 2023`
- `Movie.Without.Year.1080p.BluRay.x264-GROUP.mkv` → `movie without year bluray`
- `TV.Show.S01E01.2021.720p.WEB-DL.x264.srt` → `tv show s01e01 web-dl 2021`

The clean video filename (input) is compared to all clean subtitle filenames.

To find the closest match, my first idea was to use the [Hamming distance](https://en.wikipedia.org/wiki/Hamming_distance). It worked, but was much too sensitive to small changes (like word order).

I tested multiple approaches and found the best accuracy with Python’s [`SequenceMatcher`](https://docs.python.org/3/library/difflib.html). This is based on [the algorithm by Ratcliff & Obershelp called Gestalt pattern matching](https://en.wikipedia.org/wiki/Gestalt_pattern_matching).

With the cleaning function, the sequence matcher, and an adjustable threshold, fuzzy matching works remarkably well.

### Not all subtitle lines contain dialogue

A subtitle line might be  `[sound of footsteps]`. We don’t need that.

I added a [configuration option](https://github.com/welpo/shuku?tab=readme-ov-file#line_skip_patterns) which defaults to skipping subtitles enclosed in brackets or musical notes (♪ or ♬). The latter is useful to skip TV show openings and endings with lyrics.

### Following along the audio

shuku can output [LRC files](https://en.wikipedia.org/wiki/LRC_(file_format)) matching the condensed audio. These are files with timed text used for song lyrics.

By adding the condensed audio+subtitles to an app designed for following song lyrics along, like [Just Player (iOS)](https://apps.apple.com/app/just-player-lrc-offine-music/id1134401407), I can reference the subtitles while listening:

<video controls preload="none" class="invertible-image" width="400" poster="media/just_player_poster.webp" title="Just Player with shuku condensed Blade Runner 2049" src="media/just_player.mp4"></video>

Now I can look up the writing of words that sound familiar but don't quite click; super useful for kanji!

## Technical details

My focus was on making shuku maintainable, easy to [install](https://github.com/welpo/shuku?tab=readme-ov-file#installation), easy to use, and easy to [contribute](https://github.com/welpo/shuku/blob/main/CONTRIBUTING.md).

Python can facilitate contributions and allows me to leverage [`pysubs2`](https://github.com/tkarabela/pysubs2), a fantastic library to work with subtitles.

[FFmpeg](https://ffmpeg.org/) is shuku's only dependency. Through the [`python-ffmpeg` binding](https://github.com/jonghwanhyeon/python-ffmpeg), FFmpeg handles all media processing: extracting and joining segments, converting audio…

I focused on clean code and great user experience:

- Type hints throughout the codebase catch potential issues early.
- User-friendly configuration with [TOML](https://toml.io/). Here's [what my config looks like](https://github.com/welpo/dotfiles/blob/main/.config/shuku/shuku.toml).
- Logging with custom levels. Helps users (and me!) understand what's happening.
- 100% code coverage for reliability and maintainability.
- Automated [CI](https://github.com/welpo/shuku/blob/main/.github/workflows/ci.yml)/[CD](https://github.com/welpo/shuku/blob/main/.github/workflows/cd.yml) and release ([binaries](https://github.com/welpo/shuku/releases/) + [PyPI](https://pypi.org/project/shuku/)) for all platforms with [attestations](https://docs.github.com/en/actions/security-for-github-actions/using-artifact-attestations/using-artifact-attestations-to-establish-provenance-for-builds).

This is what using shuku looks like:

<video controls preload="none" width="800" poster="media/cli_poster.webp" title="shuku demo" src="https://cdn.jsdelivr.net/gh/welpo/shuku/assets/cli_demo/shuku_demo.mp4"></video>

---

If you're learning a language through immersion, I'm sure you'll find shuku useful. Check out the [GitHub repository](https://github.com/welpo/shuku) to get started〜
