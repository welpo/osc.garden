+++
title = "Aprendiendo japonés con música: analizando las letras de Ichiko Aoba"
date = 2024-06-20
description = "Explorando las letras de Ichiko Aoba. Incluye análisis morfológico, nubes de palabras y una pizca de magia 言霊 (kotodama)."

[taxonomies]
tags = ["ciencia de datos", "análisis de datos", "visualización de datos", "música", "procesamiento de lenguaje natural", "lingüística", "japonés"]

[extra]
stylesheets = ["blog/ichiko-aoba-lyrics-japanese-morphology/css/lyrics.min.css"]
social_media_card = "/img/social_cards/es_blog_ichiko_aoba_lyrics_japanese_morphology.jpg"
+++

Hace poco empecé a aprender japonés. Creo que la inmersión es necesaria para adquirir un idioma; así es como los niños aprenden su lengua materna. Como el proceso requiere miles de horas, intento hacerlo divertido con buenas películas y música.

Hace casi cuatro años me enamoré de las tiernas melodías de la cantautora japonesa [Ichiko Aoba (<ruby>青葉市子</ruby>)](https://ichikoaoba.com/) a través de su mágico álbum <nobr><ruby>アダンの風</ruby></nobr> (Windswept Adan). No podía entender la letra, pero, como ella misma dice:

{{ multilingual_quote(original="言葉が通じないところでも音楽は通じていくものだ", translated="La música trasciende las barreras del lenguaje, llegando a lugares donde las palabras no pueden.", author="<ruby>青葉市子</ruby> (Ichiko Aoba)") }}

Habiendo sentido su música, decidí intentar entender la letra. Es difícil; conozco muy poco vocabulario. Estoy aprendiendo las palabras más comunes del idioma, pero para darle más propósito al aprendizaje, decidí averiguar qué palabras aparecen con mayor frecuencia en sus letras, y estudiarlas —aunque sean menos comunes.

{{ admonition(type="tip", text="¿Por qué no escuchas su música mientras lees este artículo? Aquí tienes [una buena recopilación](https://www.youtube.com/watch?v=ZezziAruUwg).") }}

## Contando palabras

Conseguir las palabras más usadas en un texto en español es sencillo:

1. Divides el texto en palabras
2. Cuentas cuántas veces aparece cada una
3. Ordenas las palabras por frecuencia

Sin embargo, hay dos problemas. Primero, el japonés no usa espacios, lo que complica la divisón en palabras. Segundo, incluso si usara espacios, quiero agrupar las palabras por su raíz; no me importa si encuentro «veía» X veces, «veo» Y veces y «veremos» Z veces. Quiero «ver» con un conteo de X+Y+Z.

Una sola herramienta resuelve ambos problemas: el análisis morfológico. La morfología examina cómo se construyen las palabras a partir de las unidades significativas más pequeñas de un idioma: los morfemas. Por ejemplo, «descontento» tiene tres morfemas: «des-», «content» y «-o». Un analizador morfológico dividirá la palabra en estos componentes.

Encontré [una colección de herramientas de procesamiento de lenguaje natural para japonés](https://github.com/taishi-i/awesome-japanese-nlp-resources) que incluye herramientas de análisis morfológico. Dado un texto, un analizador morfológico lo dividirá en palabras y mostrará atributos como su «forma de diccionario» (por ejemplo, no «canté», sino «cantar»).

Mi plan: descargar todas las letras de Aoba, procesarlas con un analizador morfológico y contar cuántas veces aparece cada palabra.

## Descargando las letras

Si alguna vez has buscado la letra de una canción, probablemente hayas terminado en Genius.com. Ese sitio tiene la mayoría de las letras de Ichiko Aoba. Para descargarlas, usé [LyricsGenius](https://github.com/xathon/LyricsGenius).

<details>
<summary>Haz clic para ver el código</summary>

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

Corregí algunos errores y añadí letras para canciones que no las tenían.

La [letra](https://genius.com/Ichiko-aoba-chi-no-kaze-lyrics) de [<ruby>血の風</ruby> (Chi no kaze)](https://www.youtube.com/watch?v=inTS9P7yHfA) está en [idioma okinawense](https://es.wikipedia.org/wiki/Idioma_okinawense) y sólo encontré una [traducción parcial](https://note.com/24k/n/n3ab88f856fa0); la eliminé.

Después de probar varias librerías de Python, decidí usar [Janome](https://github.com/mocobeta/janome) para el análisis morfológico. Escaneé las letras de cada álbum, contando cuántas veces aparecía cada palabra (en su «forma de diccionario»).

<details>
<summary>Haz clic para ver el código</summary>

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

Ahora tenía una lista de todas las palabras en las letras de Ichiko Aoba y su frecuencia: [aquí está](assets/counts.txt). Con los datos listos, no pude resistirme a visualizarlos.

## Nubes de palabras

{{ admonition(type="info", text="En una nube de palabras, el tamaño de cada palabra es proporcional a su frecuencia.") }}

Usé el paquete de Python [word_cloud](https://github.com/amueller/word_cloud/), y las API de [Jisho](https://jisho.org/) y de [DeepL](https://www.deepl.com/) para obtener traducciones aproximadas.

<details>
<summary>Haz clic para ver el código</summary>

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

Aquí está la nube de palabras creada con todas las canciones juntas. Haz clic en la imagen para traducirla:

{{ image_toggler(default_src="img/total wordcloud (JP).webp", toggled_src="img/total wordcloud (ES).webp", default_alt="Nube de palabras en japonés mostrando las palabras en las letras de Ichiko Aoba", toggled_alt="Nube de palabras en español mostrando las palabras en las letras de Ichiko Aoba", full_width=true) }}

---

Repetí el proceso para cada álbum utilizando la nube de palabras como máscara y la portada como fondo. De nuevo, haz clic para ver la traducción:

<div class="gallery full-width">
<div class="item">
<div class="caption"><ruby>剃刀乙女<rt>Razorblade Girl</rt></ruby> <span class="year">(2010)</span></div>
{{ image_toggler(default_src="img/剃刀乙女 (Kamisori otome) wordcloud (JP).png", toggled_src="img/剃刀乙女 (Kamisori otome) wordcloud (ES).png", default_alt="Nube de palabras en japonés mostrando las palabras en Chica navaja", toggled_alt="Nube de palabras en español mostrando las palabras en Razorblade Girl", lazy_loading=false) }}
</div>

<div class="item">
<div class="caption"><ruby>檻髪<rt>Origami</rt></ruby> <span class="year">(2011)</span></div>
{{ image_toggler(default_src="img/檻髪 (Origami) wordcloud (JP).png", toggled_src="img/檻髪 (Origami) wordcloud (ES).png", default_alt="Nube de palabras en japonés mostrando las palabras en Origami", toggled_alt="Nube de palabras en español mostrando las palabras en Origami", lazy_loading=false) }}
</div>

<div class="item">
<div class="caption"><ruby>うたびこ<rt>Utabiko</rt></ruby> <span class="year">(2012)</span></div>
{{ image_toggler(default_src="img/うたびこ (Utabiko) wordcloud (JP).png", toggled_src="img/うたびこ (Utabiko) wordcloud (ES).png", default_alt="Nube de palabras en japonés mostrando las palabras en Utabiko", toggled_alt="Nube de palabras en español mostrando las palabras en Utabiko", lazy_loading=false) }}
</div>

<div class="item">
<div class="caption">0 <span class="year">(2013)</span></div>
{{ image_toggler(default_src="img/0 wordcloud (JP).webp", toggled_src="img/0 wordcloud (ES).webp", default_alt="Nube de palabras en japonés mostrando las palabras en 0", toggled_alt="Nube de palabras en español mostrando las palabras en 0", lazy_loading=false) }}
</div>

<div class="item">
<div class="caption"><ruby>マホロボシヤ<rt>Mahoroboshiya</rt></ruby> <span class="year">(2017)</span></div>
{{ image_toggler(default_src="img/マホロボシヤ (Mahoroboshiya) wordcloud (JP).webp", toggled_src="img/マホロボシヤ (Mahoroboshiya) wordcloud (ES).webp", default_alt="Nube de palabras en japonés mostrando las palabras en Mahoroboshiya", toggled_alt="Nube de palabras en español mostrando las palabras en Mahoroboshiya", lazy_loading=false) }}
</div>

<div class="item">
<div class="caption">qp <span class="year">(2018)</span></div>
{{ image_toggler(default_src="img/qp wordcloud (JP).png", toggled_src="img/qp wordcloud (ES).png", default_alt="Nube de palabras en japonés mostrando las palabras en qp", toggled_alt="Nube de palabras en español mostrando las palabras en qp", lazy_loading=false) }}
</div>

<div class="item">
<div class="caption"><ruby>アダンの風<rt>Windswept Adan</rt></ruby> <span class="year">(2020)</span></div>
{{ image_toggler(default_src="img/アダンの風 (Windswept Adan) wordcloud (JP).webp", toggled_src="img/アダンの風 (Windswept Adan) wordcloud (ES).webp", default_alt="Nube de palabras en japonés mostrando las palabras en El viento de Adan", toggled_alt="Nube de palabras en español mostrando las palabras en El viento de Adan", lazy_loading=false) }}
</div>
</div>

<div id="right-click-tip">
{{ admonition(type="tip", text='Para ver una imagen en tamaño completo, haz clic derecho en ella y selecciona "Abrir imagen en una nueva pestaña".') }}
</div>

Algunas observaciones:

- Muchas de las palabras más grandes están relacionadas con la naturaleza: <ruby>風<rt>かぜ</rt></ruby> (viento), <ruby>光<rt>ひかり</rt></ruby> (luz), <ruby>星<rt>ほし</rt></ruby> (estrella), <ruby>海<rt>うみ</rt></ruby> (mar), <ruby>空<rt>そら</rt></ruby> (cielo)... Estas, junto con otras como <ruby>静<rt>しず</rt>か</ruby> (tranquilo), <ruby>夢<rt>ゆめ</rt></ruby> (sueño), <ruby>消<rt>き</rt>える<rt>える</rt></ruby> (desaparecer) y <ruby>ふわり</ruby> (suavemente), encajan con las emociones que evoca su música.
- Más del 60% de las palabras extraídas aparecen solo una vez. Estos son [hápax legómena](https://es.wikipedia.org/wiki/H%C3%A1pax): palabras que ocurren solo una vez en un contexto. Esto coincide con la [ley de Zipf](https://es.wikipedia.org/wiki/Ley_de_Zipf), que predice que un pequeño número de palabras serán comunes, mientras que la mayoría de las palabras raramenre aparecerán.
- <ruby>言霊<rt>ことだま</rt></ruby> ([kotodama](https://blog.oup.com/2014/05/kotodama-japanese-spirit-of-language/)) es uno de los hápax legómenon. Su significado literal es «espíritu/alma de la palabra», y se refiere al poder espiritual que se dice que poseen las palabras. En el Japón antiguo, se creía que las palabras tenían la misma esencia que los objetos físicos.

---

Para aprender este vocabulario, crearé flashcards con las palabras más frecuentes e intentaré reconocerlas cuando escuche japonés.

Lento pero seguro (<ruby>じわ<rt>jiwa</rt>じわ<rt>jiwa</rt></ruby>), seré capaz de entender las letras de Ichiko Aoba —o las palabras que usa, cuanto menos.
