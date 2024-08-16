+++
title = "La paleta poètica d'Ichiko Aoba: aprenent japonès a través de l'anàlisi morfològica"
date = 2024-06-20
description = "Una exploració de les lletres d'Ichiko Aoba basada en dades. Amb anàlisi morfològica, núvols de paraules i un toc de màgia 言霊 (kotodama)."

[taxonomies]
tags = ["ciència de dades", "anàlisi de dades", "visualització de dades", "música", "processament de llenguatge natural", "lingüística", "japonès"]

[extra]
stylesheets = ["blog/ichiko-aoba-lyrics-japanese-morphology/css/lyrics.min.css"]
social_media_card = "/img/social_cards/ca_blog_ichiko_aoba_lyrics_japanese_morphology.jpg"
+++

Fa poc que he començat a aprendre japonès. Crec que la immersió és necessària per adquirir un idioma; així és com els nens aprenen la seva llengua materna. Com que el procés requereix milers d'hores, intento fer-ho divertit amb bones pel·lícules i música.

Fa gairebé quatre anys em vaig enamorar de les tendres melodies de la cantautora japonesa [Ichiko Aoba (<ruby>青葉市子</ruby>)](https://ichikoaoba.com/) a través del seu màgic àlbum <nobr><ruby>アダンの風</ruby></nobr> (Windswept Adan). No podia entendre la lletra, però, com ella mateixa diu:

{{ multilingual_quote(original="言葉が通じないところでも音楽は通じていくものだ", translated="La música transcendeix les barreres del llenguatge, arribant a llocs on les paraules no poden.", author="<ruby>青葉市子</ruby> (Ichiko Aoba)") }}

Havent sentit la seva música, vaig decidir intentar entendre la lletra. És difícil; conec molt poc vocabulari. Estic aprenent les paraules més comunes de l'idioma, però per donar-li més propòsit a l'aprenentatge, vaig decidir esbrinar quines paraules apareixen amb més freqüència a les seves lletres, i estudiar-les —tot i que puguin ser menys comunes.

{{ admonition(type="tip", text="Per què no escoltar la seva música mentre llegeixes aquest article? Aquí tens [una bona recopilació](https://www.youtube.com/watch?v=ZezziAruUwg).") }}

## Comptant paraules

Aconseguir les paraules més usades en un text en castellà és senzill:

1. Divideixes el text en paraules
2. Comptes quantes vegades apareix cadascuna
3. Ordenes les paraules per freqüència

Hi ha dos problemes, però. Primer, el japonès no fa servir espais, cosa que complica la divisió en paraules. Segon, fins i tot si fes servir espais, vull agrupar les paraules per la seva arrel; no m'importa si trobo «veia» X vegades, «veig» Y vegades i «veurem» Z vegades. Vull «veure» amb un recompte de X+Y+Z.

Una sola eina resol ambdós problemes: l'anàlisi morfològica. La morfologia examina com es construeixen les paraules a partir de les unitats significatives més petites d'un idioma: els morfemes. Per exemple, «desconsolar» té tres morfemes: «des-», «consol» i «-ar». Un analitzador morfològic dividirà la paraula en aquests components.

Vaig trobar [una col·lecció d'eines de processament de llenguatge natural per a japonès](https://github.com/taishi-i/awesome-japanese-nlp-resources) que inclou eines d'anàlisi morfològica. Donat un text, un analitzador morfològic el dividirà en paraules i mostrarà atributs com la seva «forma de diccionari» (per exemple, no «vaig cantar», sinó «cantar»).

El meu pla: descarregar totes les lletres d'Aoba, processar-les amb un analitzador morfològic i comptar quantes vegades apareix cada paraula.

## Descarregant les lletres

Si alguna vegada has buscat la lletra d'una cançó, probablement has acabat a Genius.com. Aquest lloc té la majoria de les lletres d'Ichiko Aoba. Per descarregar-les, vaig fer servir [LyricsGenius](https://github.com/xathon/LyricsGenius).

<details>
<summary>Fes clic per veure el codi</summary>

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

Vaig corregir alguns errors i vaig afegir lletres per a cançons que no les tenien.

La [lletra](https://genius.com/Ichiko-aoba-chi-no-kaze-lyrics) de [<ruby>血の風</ruby> (Chi no kaze)](https://www.youtube.com/watch?v=inTS9P7yHfA) està en la [llengua d'Okinawa](https://ca.wikipedia.org/wiki/Llengua_d%27Okinawa) i només vaig trobar una [traducció parcial](https://note.com/24k/n/n3ab88f856fa0); la vaig eliminar.

Després de provar diverses llibreries de Python, vaig decidir fer servir [Janome](https://github.com/mocobeta/janome) per a l'anàlisi morfològica. Vaig escanejar les lletres de cada àlbum, comptant quantes vegades apareixia cada paraula (en la seva «forma de diccionari»).

<details>
<summary>Fes clic per veure el codi</summary>

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

Ara tenia una llista de totes les paraules a les lletres d'Ichiko Aoba i la seva freqüència: [aquí està](assets/counts.txt). Amb les dades a punt, no vaig poder resistir-me a visualitzar-les.

## Núvols de paraules

{{ admonition(type="info", text="En un núvol de paraules, la mida de cada paraula és proporcional a la seva freqüència.") }}

Vaig fer servir el paquet de Python [word_cloud](https://github.com/amueller/word_cloud/), i les APIs de [Jisho](https://jisho.org/) i de [DeepL](https://www.deepl.com/) per obtenir traduccions aproximades.

<details>
<summary>Fes clic per veure el codi</summary>

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

def translate_to_spanish(english_concepts):
    auth_key = "my_auth_key"
    translator = deepl.Translator(auth_key)
    spanish_translations = {}

    manual_overrides = {
        "you": "tú",
        "which": "cuál",
        "that": "ese",
        "who": "quién",
        "nonexistent": "inexistente",
        "to permit": "permitir",
        "to permit": "permitir",
        "to embrace": "abrazar",
    }

    for concept in english_concepts:
        if concept in manual_overrides:
            print(f"Skipping DeepL for {concept}, using {manual_overrides[concept]}.")
            spanish_translations[concept] = manual_overrides[word]
        else:
            print(f"Translating {concept}…")
            # Some words have context in parentheses. We use the entire input as context, but ask only to translate the word.
            result = translator.translate_text(
                concept,
                source_lang="EN",
                target_lang="ES",
                formality="prefer_less",
            )
            print(f"Translation: {word} = {result.text}")
            spanish_translations[word] = result.text
    return spanish_translations


spanish_translation_map = translate_to_spanish(translated_total_frequencies.keys())

translated_total_frequencies_es = translate_counter(
    translated_total_frequencies, spanish_translation_map
)

translated_album_frequencies_es = {
    album: translate_counter(freq, spanish_translation_map)
    for album, freq in translated_album_frequencies.items()
}

for album in album_frequencies.keys():
    generate_wordcloud(
        counter=translated_album_frequencies_es[album],
        album_name="(ES) " + album,
        output_dir="img/wordclouds/masks",
        font="Georgia",
    )

generate_wordcloud(
    counter=translated_total_frequencies_es,
    album_name="(ES) total",
    output_dir="img/wordclouds/masks",
    font="Georgia",
)
```

</details>

Aquí està el núvol de paraules creat amb totes les cançons juntes. Fes clic a la imatge per traduir-la a l'espanyol:

{{ image_toggler(default_src="img/total wordcloud (JP).webp", toggled_src="img/total wordcloud (ES).webp", default_alt="Núvol de paraules en japonès mostrant les paraules a les lletres d'Ichiko Aoba", toggled_alt="Núvol de paraules en castellà mostrant les paraules a les lletres d'Ichiko Aoba", full_width=true) }}

---

Vaig repetir el procés per a cada àlbum utilitzant el núvol de paraules com a màscara i la portada com a fons. De nou, fes clic per veure la traducció:

<div class="gallery full-width">
<div class="item">
<div class="caption"><ruby>剃刀乙女<rt>Razorblade Girl</rt></ruby> <span class="year">(2010)</span></div>
{{ image_toggler(default_src="img/剃刀乙女 (Kamisori otome) wordcloud (JP).png", toggled_src="img/剃刀乙女 (Kamisori otome) wordcloud (ES).png", default_alt="Núvol de paraules en japonès mostrant les paraules a Noia navalla", toggled_alt="Núvol de paraules en castellà mostrant les paraules a Razorblade Girl", lazy_loading=false) }}
</div>

<div class="item">
<div class="caption"><ruby>檻髪<rt>Origami</rt></ruby> <span class="year">(2011)</span></div>
{{ image_toggler(default_src="img/檻髪 (Origami) wordcloud (JP).png", toggled_src="img/檻髪 (Origami) wordcloud (ES).png", default_alt="Núvol de paraules en japonès mostrant les paraules a Origami", toggled_alt="Núvol de paraules en castellà mostrant les paraules a Origami", lazy_loading=false) }}
</div>

<div class="item">
<div class="caption"><ruby>うたびこ<rt>Utabiko</rt></ruby> <span class="year">(2012)</span></div>
{{ image_toggler(default_src="img/うたびこ (Utabiko) wordcloud (JP).png", toggled_src="img/うたびこ (Utabiko) wordcloud (ES).png", default_alt="Núvol de paraules en japonès mostrant les paraules a Utabiko", toggled_alt="Núvol de paraules en castellà mostrant les paraules a Utabiko", lazy_loading=false) }}
</div>

<div class="item">
<div class="caption">0 <span class="year">(2013)</span></div>
{{ image_toggler(default_src="img/0 wordcloud (JP).webp", toggled_src="img/0 wordcloud (ES).webp", default_alt="Núvol de paraules en japonès mostrant les paraules a 0", toggled_alt="Núvol de paraules en castellà mostrant les paraules a 0", lazy_loading=false) }}
</div>

<div class="item">
<div class="caption"><ruby>マホロボシヤ<rt>Mahoroboshiya</rt></ruby> <span class="year">(2017)</span></div>
{{ image_toggler(default_src="img/マホロボシヤ (Mahoroboshiya) wordcloud (JP).webp", toggled_src="img/マホロボシヤ (Mahoroboshiya) wordcloud (ES).webp", default_alt="Núvol de paraules en japonès mostrant les paraules a Mahoroboshiya", toggled_alt="Núvol de paraules en castellà mostrant les paraules a Mahoroboshiya", lazy_loading=false) }}
</div>

<div class="item">
<div class="caption">qp <span class="year">(2018)</span></div>
{{ image_toggler(default_src="img/qp wordcloud (JP).png", toggled_src="img/qp wordcloud (ES).png", default_alt="Núvol de paraules en japonès mostrant les paraules a qp", toggled_alt="Núvol de paraules en castellà mostrant les paraules a qp", lazy_loading=false) }}
</div>

<div class="item">
<div class="caption"><ruby>アダンの風<rt>Windswept Adan</rt></ruby> <span class="year">(2020)</span></div>
{{ image_toggler(default_src="img/アダンの風 (Windswept Adan) wordcloud (JP).webp", toggled_src="img/アダンの風 (Windswept Adan) wordcloud (ES).webp", default_alt="Núvol de paraules en japonès mostrant les paraules a El vent d'Adan", toggled_alt="Núvol de paraules en castellà mostrant les paraules a El vent d'Adan", lazy_loading=false) }}
</div>
</div>

<div id="right-click-tip">
{{ admonition(type="tip", text='Per veure una imatge en mida completa, fes clic dret i selecciona "Obrir imatge en una pestanya nova".') }}
</div>

Algunes observacions:

- Moltes de les paraules més grans estan relacionades amb la natura: <ruby>風<rt>かぜ</rt></ruby> (vent), <ruby>光<rt>ひかり</rt></ruby> (llum), <ruby>星<rt>ほし</rt></ruby> (estrella), <ruby>海<rt>うみ</rt></ruby> (mar), <ruby>空<rt>そら</rt></ruby> (cel)… Aquestes, juntament amb altres com <ruby>静<rt>しず</rt>か</ruby> (tranquil), <ruby>夢<rt>ゆめ</rt></ruby> (somni), <ruby>消<rt>き</rt>える<rt>える</rt></ruby> (desaparèixer) i <ruby>ふわり</ruby> (suaument), encaixen amb les emocions que evoca la seva música.
- Més del 60% de les paraules extretes apareixen només una vegada. Aquests són [hàpax legòmena](https://ca.wikipedia.org/wiki/H%C3%A0pax): paraules que ocorren només una vegada en un context. Això coincideix amb la [llei de Zipf](https://ca.wikipedia.org/wiki/Llei_de_Zipf), que prediu que un petit nombre de paraules seran comunes, mentre que la majoria de les paraules rarament apareixeran.
- <ruby>言霊<rt>ことだま</rt></ruby> ([kotodama](https://blog.oup.com/2014/05/kotodama-japanese-spirit-of-language/)) és un dels hàpax legòmenon. El seu significat literal és «esperit/ànima de la paraula», i es refereix al poder espiritual que es diu que posseeixen les paraules. Al Japó antic, es creia que les paraules tenien la mateixa essència que els objectes físics.

---

Per aprendre aquest vocabulari, crearé flashcards amb les paraules més freqüents i intentaré reconèixer-les quan escolti japonès.

Lent però segur (<ruby>じわ<rt>jiwa</rt>じわ<rt>jiwa</rt></ruby>), seré capaç d'entendre les lletres d'Ichiko Aoba —o les paraules que empra, si més no.
