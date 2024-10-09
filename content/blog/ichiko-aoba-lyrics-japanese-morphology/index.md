+++
title = "Learning Japanese Through Music: An Analysis of Ichiko Aoba's Lyrics"
date = 2024-06-20
description = "Exploring Ichiko Aoba's lyrics. Featuring morphological analysis, word clouds, and a sprinkle of 言霊 (kotodama) magic."

[taxonomies]
tags = ["data science", "data analysis", "data visualisation", "music", "natural language processing", "linguistics", "japanese"]

[extra]
stylesheets = ["blog/ichiko-aoba-lyrics-japanese-morphology/css/lyrics.min.css"]
social_media_card = "/img/social_cards/blog_ichiko_aoba_lyrics_japanese_morphology.jpg"
+++

I recently started learning Japanese. I believe immersion is necessary for language acquisition; it’s how kids learn their mother tongue. Since it’ll require thousands of hours, I’m trying to make it fun with good films and music.

Almost four years ago I fell in love with the tender melodies of Japanese songwriter [Ichiko Aoba (<ruby>青葉市子</ruby>)](https://ichikoaoba.com/) through her magical album <nobr><ruby>アダンの風</ruby></nobr> (Windswept Adan). I couldn’t understand the lyrics, but, as she puts it:

{{ multilingual_quote(original="言葉が通じないところでも音楽は通じていくものだ", translated="Music transcends language barriers, reaching places words cannot.", author="<ruby>青葉市子</ruby> (Ichiko Aoba)") }}

Having felt her music, I decided to try to understand the lyrics. It's hard—I know very little vocabulary. I am learning the most common words of the language, but to make learning more purposeful, I decided to figure out the words she uses most, and study them—even if they are rarer.

{{ admonition(type="tip", text="Why not listen to her music while reading this post? [Here's a nice compilation](https://www.youtube.com/watch?v=ZezziAruUwg).") }}

## Counting words

Getting the most used words from an English text is simple:

1. Split the text into words
2. Count the times each word appears
3. Sort the counts

There are two problems, though. First, Japanese doesn’t use spaces, complicating the word-splitting step. Second, even if it used spaces, I want to group words by their root; I don’t care if I find “see” X times, “sees” Y times and “saw” Z times. I want “see” with a count of X+Y+Z.

A single tool solves both problems: morphology analysis. Morphology examines how words are built from the smallest meaningful units of a language: morphemes. For example, “unbreakable” has three morphemes: the prefix “un-“, the root “break” and the suffix “-able”.

I found [a collection of natural language processing tools for Japanese](https://github.com/taishi-i/awesome-japanese-nlp-resources) which includes morphology analysis tools. Given a text, a morphological analyzer will split it into words and show attributes like their “dictionary form” (e.g. not “ran”, but “run”).

My plan: download all of Aoba's lyrics, process them with a morphological analyzer, and count how many times each word appears.

## Getting the lyrics

If you’ve ever looked up the lyrics to a song, you probably ended up in Genius.com. That site has most of Ichiko Aoba’s lyrics. To download them, I used [LyricsGenius](https://github.com/xathon/LyricsGenius).

<details>
<summary>Click to view code</summary>

```python
# Using a fork of LyricsGenius with a bug fix: https://github.com/xathon/LyricsGenius
# pip install git+https://github.com/xathon/LyricsGenius.git
from collections import Counter
from pathlib import Path

import dango
import deepl
import lyricsgenius
import requests
from janome.tokenizer import Tokenizer
from wordcloud import WordCloud


token = "my_genius_api_token"  # Create an account and visit https://genius.com/api-clients
genius = lyricsgenius.Genius(token)

# Configuration.
genius.remove_section_headers = True
genius.excluded_terms = ["(English Translation)"]


def get_lyrics_filename(album_name):
    return f"lyrics_{album_name}.txt"


artist_name = "青葉市子 (Ichiko Aoba)"

# All her albums except a soundtrack (Amiko) and a field recording album (鮎川のしづく [Ayukawa no shizuku]).
albums = [
    "剃刀乙女 (Kamisori otome)",  # 2010
    "檻髪 (Origami)",  # 2011
    "うたびこ (Utabiko)",  # 2012
    "0",  # 2013
    "マホロボシヤ (Mahoroboshiya)",  # 2017
    "qp",  # 2018
    "アダンの風 (Windswept Adan)",  # 2020
]

for album in albums:
    filename = get_lyrics_filename(album)
    # Avoid re-downloading.
    if Path(filename).is_file():
        continue
    album = genius.search_album(album, artist_name)
    album.save_lyrics(extension="txt", sanitize=False, filename=filename)
```

</details>

I fixed a few mistakes and added lyrics for songs that lacked them.

The [lyrics](https://genius.com/Ichiko-aoba-chi-no-kaze-lyrics) for [<ruby>血の風</ruby> (Chi no kaze)](https://www.youtube.com/watch?v=inTS9P7yHfA) are in [Okinawan language](https://simple.wikipedia.org/wiki/Okinawan_language) and I only found a [partial translation](https://note.com/24k/n/n3ab88f856fa0); I removed them.

After trying a few Python libraries, I decided to use [Janome](https://github.com/mocobeta/janome) for the morphological analysis. I scanned the lyrics of each album, counting how many times each word (in its “dictionary form”) appeared.

<details>
<summary>Click to view code</summary>

```python
def read_lyrics_from_file(filename):
    with open(filename, "r", encoding="utf-8") as file:
        album_lyrics = file.read()
    return album_lyrics


def analyse_lyrics(text):
    # docs: https://mocobeta.github.io/janome/api/janome.html#janome.tokenizer.Token
    # Each Token object has the following attributes:
    # - surface: the word as it appears in the text
    # - part_of_speech: the part of speech of the word, which can be a compound value like "動詞,自立,*,*"
    # - infl_type: the type of inflection of the word (e.g., "五段・ラ行" for a verb)
    # - infl_form: the form of inflection of the word (e.g., "連用形" for a verb in the continuous form)
    # - base_form: the word in its dictionary/base form (e.g., "行く" for the verb "行った")
    # - reading: the reading of the word in katakana
    # - phonetic: the phonetic representation of the word in katakana
    excluded_pos = [
        "助詞",  # particles
        "記号",  # symbols
        "助動詞",  # auxiliary verbs
        "接尾",  # suffixes
        "接頭詞",  # prefixes
        "非自立",  # dependent words
    ]
    words = Tokenizer().tokenize(text)
    tokens = [
        w.base_form
        for w in words
        if w.surface == clean_text(w.surface)
        and all(pos not in w.part_of_speech.split(",") for pos in excluded_pos)
    ]
    return Counter(tokens)


# Function to remove non-word characters (space, comma, newline…)
def clean_text(text):
    return "".join([c for c in text if c.isalpha()])


total_frequencies = Counter()
album_frequencies = {}

for album in albums:
    filename = get_lyrics_filename(album)
    album_lyrics = read_lyrics_from_file(filename)
    dictionary_form_counter = analyse_lyrics(album_lyrics, tokenizer="janome")
    album_frequencies[album] = dictionary_form_counter
    total_frequencies += dictionary_form_counter
```

</details>

Now I had a list of all the words in Ichiko Aoba’s lyrics and their frequency: [here it is](assets/counts.txt). Having the data ready, I couldn't resist visualising it.

## Word clouds

{{ admonition(type="info", text="In a word cloud, the size of each word is proportional to its frequency.") }}

I used the [word_cloud](https://github.com/amueller/word_cloud/) Python package and the [Jisho](https://jisho.org/) API to get approximate translations.

<details>
<summary>Click to view code</summary>

```python
def generate_wordcloud(
    counter, album_name, font="NotoSansJP-Regular", output_dir="img/wordclouds"
):
    width = 3000
    height = 3000

    wordcloud = WordCloud(
        font_path=font,
        background_color=None,
        mode="RGBA",
        margin=0,
        width=width,
        height=height,
        color_func=lambda *args, **kwargs: "black",
    ).generate_from_frequencies(counter)

    output_filename = f"{output_dir}/{album_name} WordCloud mask.svg"
    with open(output_filename, "w") as f:
        f.write(wordcloud.to_svg())


for album in albums:
    generate_wordcloud(album_frequencies[album], album)

# Overall cloud.
generate_wordcloud(
    counter=total_frequencies,
    album_name="total",
)

# It's translation time!
# Jisho provided too much context for these, or not the right meaning.
manual_overrides = {
    "ここ": "here",
    "そこ": "there",
    "いる": "to be",
    "マホロボシヤ": "Mahoroboshiya",
    "アダン": "Adan",
    "星": "star",
    "Venus": "Venus",
    "Earth": "Earth",
    "Mars": "Mars",
    "Jupiter": "Jupiter",
    "Saturnus": "Saturnus",
    "Uranus": "Uranus",
    "Neptunus": "Neptunus",
    "Mercurius": "Mercurius",
    "髪": "hair",
    "I": "I",
    "pod": "pod",
    "前": "before",
    "m": "am",
    "am": "am",
    "水": "water",
    "抱く": "to embrace",
    "手のひら": "palm",
    "踊る": "to dance",
    "降る": "to fall",
    "どれ": "which",
    "瞬き": "blink",
    "そば": "near",
    "交わす": "to exchange",
    "開ける": "to open",
    "眠れる": "to sleep",
}


def fetch_translation(word):
    print(f"Fetching translation for {word}…")
    if word in manual_overrides:
        print(f"Manual override: {word} = {manual_overrides[word]}")
        return manual_overrides[word]
    url = f"https://jisho.org/api/v1/search/words?keyword={word}"
    response = requests.get(url)
    if response.status_code == 200:
        data = response.json()
        if data["data"]:
            first_entry = data["data"][0]
            first_sense = first_entry["senses"][0]
            first_translation = first_sense["english_definitions"][0]
            print(f"Translation: {word} = {first_translation}")
            return first_translation
    print(f"Translation not found for {word}.")
    return None


def translate_counter(counter, translation_map):
    translated_counter = Counter()
    for word, frequency in counter.items():
        translation = translation_map.get(word)
        if translation:
            if translation in translated_counter:
                # Multiple words can have the same translation (e.g. "僕" & "私" = "I").
                translated_counter[translation] += frequency
            else:
                translated_counter[translation] = frequency
    return translated_counter


# Fetch translations for all words.
translation_map = {}
for word in total_frequencies.keys():
    translation = fetch_translation(word)
    if translation:
        translation_map[word] = translation

translated_total_frequencies = translate_counter(total_frequencies, translation_map)

translated_album_frequencies = {
    album: translate_counter(freq, translation_map)
    for album, freq in album_frequencies.items()
}

# Translated word clouds.
for album in albums:
    generate_wordcloud(
        counter=translated_album_frequencies[album],
        album_name=album + " translated",
        font="Georgia",
        output_dir="img/wordclouds/masks",
    )

generate_wordcloud(
    counter=translated_total_frequencies,
    album_name="total translated",
    output_dir="img/wordclouds/masks",
    font="Georgia",
)

# Note: I used the SVG masks to complete the word clouds with the album covers in Photoshop.
# I got the covers from https://ichikoaoba.com/discography/.
```

</details>

Here’s the word cloud for the aggregated lyrics. Click on the image to translate it:

{{ image_toggler(default_src="img/total wordcloud (JP).webp", toggled_src="img/total wordcloud (EN).webp", default_alt="Word cloud in Japanese showing the words in Ichiko Aoba's lyrics", toggled_alt="Word cloud in English showing the words in Ichiko Aoba's lyrics", full_width=true) }}

---

I repeated the process for each album using the word cloud as a mask and the cover art as the background. Again, clicking on them will show the translation:

<div class="gallery full-width">
<div class="item">
<div class="caption"><ruby>剃刀乙女<rt>Razorblade Girl</rt></ruby> <span class="year">(2010)</span></div>
{{ image_toggler(default_src="img/剃刀乙女 (Kamisori otome) wordcloud (JP).png", toggled_src="img/剃刀乙女 (Kamisori otome) wordcloud (EN).png", default_alt="Word cloud in Japanese showing the words in Razorblade Girl", toggled_alt="Word cloud in English showing the words in Razorblade Girl", lazy_loading=false) }}
</div>

<div class="item">
<div class="caption"><ruby>檻髪<rt>Origami</rt></ruby> <span class="year">(2011)</span></div>
{{ image_toggler(default_src="img/檻髪 (Origami) wordcloud (JP).png", toggled_src="img/檻髪 (Origami) wordcloud (EN).png", default_alt="Word cloud in Japanese showing the words in Origami", toggled_alt="Word cloud in English showing the words in Origami", lazy_loading=false) }}
</div>

<div class="item">
<div class="caption"><ruby>うたびこ<rt>Utabiko</rt></ruby> <span class="year">(2012)</span></div>
{{ image_toggler(default_src="img/うたびこ (Utabiko) wordcloud (JP).png", toggled_src="img/うたびこ (Utabiko) wordcloud (EN).png", default_alt="Word cloud in Japanese showing the words in Utabiko", toggled_alt="Word cloud in English showing the words in Utabiko", lazy_loading=false) }}
</div>

<div class="item">
<div class="caption">0 <span class="year">(2013)</span></div>
{{ image_toggler(default_src="img/0 wordcloud (JP).webp", toggled_src="img/0 wordcloud (EN).webp", default_alt="Word cloud in Japanese showing the words in 0", toggled_alt="Word cloud in English showing the words in 0", lazy_loading=false) }}
</div>

<div class="item">
<div class="caption"><ruby>マホロボシヤ<rt>Mahoroboshiya</rt></ruby> <span class="year">(2017)</span></div>
{{ image_toggler(default_src="img/マホロボシヤ (Mahoroboshiya) wordcloud (JP).webp", toggled_src="img/マホロボシヤ (Mahoroboshiya) wordcloud (EN).webp", default_alt="Word cloud in Japanese showing the words in Mahoroboshiya", toggled_alt="Word cloud in English showing the words in Mahoroboshiya", lazy_loading=false) }}
</div>

<div class="item">
<div class="caption">qp <span class="year">(2018)</span></div>
{{ image_toggler(default_src="img/qp wordcloud (JP).png", toggled_src="img/qp wordcloud (EN).png", default_alt="Word cloud in Japanese showing the words in qp", toggled_alt="Word cloud in English showing the words in qp", lazy_loading=false) }}
</div>

<div class="item">
<div class="caption"><ruby>アダンの風<rt>Windswept Adan</rt></ruby> <span class="year">(2020)</span></div>
{{ image_toggler(default_src="img/アダンの風 (Windswept Adan) wordcloud (JP).webp", toggled_src="img/アダンの風 (Windswept Adan) wordcloud (EN).webp", default_alt="Word cloud in Japanese showing the words in Windswept Adan", toggled_alt="Word cloud in English showing the words in Windswept Adan", lazy_loading=false) }}
</div>
</div>

<div id="right-click-tip">
{{ admonition(type="tip", text='To see an image in full size, right-click on it and "Open image in new tab".') }}
</div>

Some observations:

- Many of the big words are nature-related: <ruby>風<rt>かぜ</rt></ruby> (wind), <ruby>光<rt>ひかり</rt></ruby> (light), <ruby>星<rt>ほし</rt></ruby> (star), <ruby>海<rt>うみ</rt></ruby> (sea), <ruby>空<rt>そら</rt></ruby> (sky)… These, along others like <ruby>静<rt>しず</rt>か</ruby> (quiet), <ruby>夢<rt>ゆめ</rt></ruby> (dream), <ruby>消<rt>き</rt>える<rt>える</rt></ruby> (disappear), and <ruby>ふわり</ruby> (gently), match the feelings her music evokes.
- Over 60% of the extracted words only appear once. These are [hapax legomena](https://simple.wikipedia.org/wiki/Hapax_legomenon): words that only occur once in a context. This matches [Zipf’s law](https://simple.wikipedia.org/wiki/Zipf%27s_law), which predicts that a small number of words will be common, while the majority words will rarely appear.
- <ruby>言霊<rt>ことだま</rt></ruby> ([kotodama](https://blog.oup.com/2014/05/kotodama-japanese-spirit-of-language/)) is one of the hapax legomenon. Its literal meaning is “word spirit/soul”, and it refers to the spiritual power that words are said to possess. In ancient Japan words were seen as having the same essence as physical objects.

---

To learn this vocabulary, I'll create flashcards for the most frequent words and try to spot them when immersed in Japanese media.

Slowly but surely (<ruby>じわ<rt>jiwa</rt>じわ<rt>jiwa</rt></ruby>), I’ll be able to understand Ichiko Aoba’s lyrics—or the words she uses, at least.
