+++
title = "Notes sobre notes: analitzant set anys de dades de streaming de música"
date = 2024-03-15
updated = 2024-04-18
description = "D'un teclat d'una octava a ser escoltat a més de 170 països. He analitzat i visualitzat set anys de dades de royalties per veure com s'ha escoltat la meva música, quant paguen realment per stream Spotify, Apple Music, TikTok, Instagram, etc., i molt més"

[taxonomies]
tags = ["ciència de dades", "anàlisi de dades", "visualització de dades", "música", "interactiu", "javascript", "python"]

[extra]
pinned = true
stylesheets = ["blog/data-analysis-music-streaming/css/music.min.css"]
social_media_card = "/img/social_cards/ca_blog_data_analysis_music_streaming.jpg"
enable_csp = false
+++

<script type="text/javascript" src="https://cdn.jsdelivr.net/npm/vega@5" defer></script>
<script type="text/javascript" src="https://cdn.jsdelivr.net/npm/vega-embed@6" defer></script>
<script type="text/javascript" src="js/embedCharts.ca.min.js" defer></script>

{{ admonition(type="note", title="Punts clau", text="• La meva música ha arribat a més de [170 països](#en-quants-paisos-s-ha-escoltat-la-meva-musica) i ha acumulat [més de 137 milions de reproduccions](#quantes-vegades-s-ha-reproduit-la-meva-musica) (!)<br>• Necessito [més de 200.000 reproduccions](#quants-streams-necessito-per-aconseguir-un-dolar) a Instagram/Facebook per guanyar un dòlar.<br>• Amazon Unlimited i Tidal ofereixen les millors taxes de pagament.<br>• El sistema de royalties “modernitzat” de Spotify [perjudicarà els artistes emergents](#quant-hauria-perdut-amb-el-nou-sistema-de-royalties-de-spotify).") }}

Els meus pares em van regalar el meu primer teclat de piano quan tenia quatre anys. Era petit, d'una sola octava, però va ser suficient perquè comencés a crear.

Anys més tard vaig descobrir que podia improvisar. Estava intentant tocar d'oïda la introducció de *Lose Yourself*, d'Eminem, quan em vaig adonar que podia continuar tocant els acords amb la mà esquerra i donar llibertat a la dreta.

Vaig començar a gravar aquestes improvisacions i les vaig compartir amb amics propers i familiars. La meva àvia, molt seriosa, em va dir que «seria molt egoista no compartir el meu talent amb el món».

Uns mesos després de la seva mort, vaig publicar [el meu primer àlbum](https://oskerwyld.com/I). La dotzena pista, [tólfta (fyrir ömmu)](https://soundcloud.com/oskerwyld/impromptu-for-my-grandma?in=oskerwyld/sets/ii_album), és una improvisació que vaig gravar per a ella quan estava a l'hospital.

Avui fa set anys ja. Set anys de dades: xifres de streaming, royalties, oients… Tenia curiositat: a quants països ha arribat la meva música? Quantes vegades s'ha reproduït cada cançó i d'on venen els meus ingressos? I quant paguen Spotify, Apple Music, TikTok i Instagram per cada stream?

<details>
    <summary>Fes clic per veure l'índex</summary>
    <!-- toc -->
</details>

## Les dades

La meva música està disponible pràcticament a tot arreu, des de serveis de streaming regionals com JioSaavn (Índia) o NetEase Cloud Music (Xina) fins a [Amazon Music](https://music.amazon.com/artists/B06W9JTC4G/osker-wyld), [Apple Music](https://itunes.apple.com/artist/osker-wyld/id1206134590?mt=1&app=music), [Spotify](https://open.spotify.com/artist/5Hv2bYBhMp1lUHFri06xkE), [Tidal](https://tidal.com/browse/artist/8522682)... Fins i tot es pot afegir a vídeos de TikTok i Instagram/Facebook.

Distribueixo la meva música a través de [DistroKid](https://distrokid.com/vip/seven/648434) (enllaç de referral), que em permet quedar-me amb el 100% dels pagaments.

Cada dos o tres mesos, els serveis (Spotify, Amazon Music…) envien un «informe de guanys» al distribuïdor. Després de set anys, comptava amb 29.551 files com aquestes:

{% wide_container() %}

| Mes d'Informe | Mes de Venda | Botiga             | Artista    | Títol              | Quantitat | Cançó/Àlbum | País de Venda | Guanys (USD)    |
|---------------|--------------|--------------------|------------|--------------------|-----------|-------------|---------------|-----------------|
| Març 2024     | Gen 2024     | Instagram/Facebook | osker wyld | krakkar            | 704       | Cançó       | OU            | 0.007483664425   |
| Març 2024     | Gen 2024     | Instagram/Facebook | osker wyld | fimmtánda          | 9,608     | Cançó       | OU            | 0.102135011213   |
| Març 2024     | Gen 2024     | Tidal              | osker wyld | tólfta (fyrir ömmu)| 27        | Cançó       | MY            | 0.121330264483   |
| Març 2024     | Des 2023     | iTunes Match       | osker wyld | fyrir Olivia       | 1         | Cançó       | TW            | 0.000313712922   |

{% end %}

## Les eines

El meu primer instint va ser utilitzar Python amb un parell de llibreries: [pandas](https://pandas.pydata.org/) per processar les dades i [seaborn](https://seaborn.pydata.org/) o [Plotly](https://plotly.com/python/) per visualitzar-les.

Però tenia ganes de provar [polars](https://pola.rs/), una «llibreria de dataframes increïblement ràpida» (puc confirmar-ho). Tanmateix, buscant [programari lliure](https://www.gnu.org/philosophy/free-sw.ca.html) per crear visualitzacions interactives, vaig trobar [Vega-Altair](https://altair-viz.github.io/), una llibreria de visualització declarativa basada en [Vega-Lite](https://vega.github.io/vega-lite/).

## Preparant les dades

Les dades estaven netes! Vaig poder passar directament a la preparació de les dades per a l'anàlisi.

Vaig eliminar i renombrar columnes, vaig ajustar el nom d'algunes botigues, i vaig indicar el tipus de dades de cada columna.

<details>
    <summary>Fes clic per veure el codi</summary>

```python
df = pl.read_csv("data/distrokid.tsv", separator="\t", encoding="ISO-8859-1")

# Drop columns.
df = df.drop(
    ["Artist", "ISRC", "UPC", "Team Percentage", "Songwriter Royalties Withheld"]
)
# I'm only interested in streams, so I'll drop all "Album" rows…
df = df.filter(col("Song/Album") != "Album")
# …and all Stores matching "iTunes*" (iTunes, iTunes Match and iTunes Songs).
df = df.filter(~col("Store").str.contains("iTunes"))
# Now we can drop the "Song/Album" column.
df = df.drop(["Song/Album"])

# Rename columns.
countries = countries.rename({"Numeric code": "Country numeric code"})
df = df.rename(
    {
        "Sale Month": "Sale",
        "Reporting Date": "Reported",
        "Country of Sale": "Country code",
        "Earnings (USD)": "Earnings",
        "Title": "Song",
    }
)

# Rename stores.
print(f"Before: {df["Store"].unique().to_list()}")
# Rename "Amazon $SERVICE (Streaming)" to "Amazon $SERVICE"
df = df.with_columns(col("Store").str.replace(" (Streaming)", "", literal=True))
# Rename Facebook to Meta (as it's really FB and IG).
df = df.with_columns(col("Store").str.replace("Facebook", "Meta"))
# More renaming…
df = df.with_columns(col("Store").str.replace("Google Play All Access", "Google Play Music"))

# Set the proper data types.
df = df.with_columns(
    col("Sale").str.to_datetime("%Y-%m"),
    col("Reported").str.to_datetime("%Y-%m-%d"),
)
```

</details>

Vaig eliminar les files que pertanyien a serveis pels quals tenia menys de 20 registres.

<details>
<summary>Fes clic per veure el codi</summary>

```python
store_datapoints = df.group_by("Store").len().sort("len")
min_n = 20
stores_to_drop = list(
    store_datapoints.filter(col("len") < 20).select("Store").to_series()
)
df = df.filter(~col("Store").is_in(stores_to_drop))
```

</details>

En termes d'enginyeria de característiques —crear variables noves a partir de dades existents—, vaig afegir la columna «Any», vaig recuperar els codis de país d'un altre conjunt de dades i vaig calcular els ingressos per stream.

<details>
<summary>Fes clic per veure el codi</summary>

```python
# Country from country code.
countries = pl.read_csv("data/country_codes.csv")
# DistroKid (or Facebook?) uses "OU" for "Outside the United States".
missing_codes = pl.DataFrame(
    {
        "Country": ["Outside the United States"],
        "Alpha-2": ["OU"],
        "Alpha-3": [""],
        "Country numeric code": [None],
    }
)
countries = countries.vstack(missing_codes)
df = df.join(countries, how="left", left_on="Country code", right_on="Alpha-2")

# Year when the streams happened.
df = df.with_columns(col("Sale").dt.year().alias("Year"))

# Earnings per unit (stream).
df = df.with_columns((col("Earnings") / col("Quantity")).alias("USD per stream"))

# Earnings per second (of full track length).
df = df.with_columns((col("USD per stream") / col("Duration")).alias("USD per second"))
```

</details>

Tot a punt! Hora d'obtenir respostes.

## Quantes vegades s'ha reproduït la meva música?

Aquesta és la primera pregunta que em va sorgir. Per respondre-la, vaig sumar la columna «Quantitat» (reproduccions).

<details>
<summary>Fes clic per veure el codi</summary>

```python
df.select(pl.sum("Quantity")).item()
```

</details>

137.053.871. Cent trenta-set milions cinquanta-tres mil vuit-cents setanta-un.

Vaig haver de comprovar diverses vegades el resultat; no m'ho creia. No soc famós i gairebé no he promocionat la meva música. En ordenar les dades vaig trobar la resposta:

| Servei | Quantitat |     Cançó     |
|-------|----------|--------------|
| Meta  | 8.171.864  | [áttunda](https://soundcloud.com/oskerwyld/attunda?in=oskerwyld/sets/ii_album)    |
| Meta  | 6.448.952  | [nostalgía](https://soundcloud.com/oskerwyld/nostalgia?in=oskerwyld/sets/ii_album)  |
| Meta  | 6.310.620  | [áttunda](https://soundcloud.com/oskerwyld/attunda?in=oskerwyld/sets/ii_album)    |
| Meta  | 3.086.232  | [þriðja](https://soundcloud.com/oskerwyld/pridja?in=oskerwyld/sets/ii_album)     |
| Meta  | 2.573.362  | [hvítur](https://soundcloud.com/oskerwyld/hvitur?in=oskerwyld/sets/ii_album)     |

La meva música s'ha utilitzat en vídeos d'Instagram i Facebook (tots dos propietat de <span class="service Meta">Meta</span>) amb milions de reproduccions. Encara no m'ho crec —els pocs vídeos on he escoltat la meva música ni s'apropaven al milió de reproduccions.

## Quantes hores (o dies) és això?

<details>
<summary>Fes clic per veure el codi</summary>

```python
# Somewhat conservative approach: 30 seconds per stream
# It's the minimum required by Spotify/Apple Music, and average length of TikTok videos and probably Instagram reels.
from datetime import datetime, timedelta
from dateutil.relativedelta import relativedelta

seconds_per_stream = 30

start_date = datetime(1, 1, 1)
end_date = start_date + timedelta(seconds=total_quantity * seconds_per_stream)

relativedelta(end_date, start_date)
```

</details>

Si considerem que cada reproducció equival a 30 segons d'una persona escoltant la meva música, obtenim un temps total d'escolta de més de 130 anys. Wow.

30 segons és el temps mínim que Spotify o Apple Music exigeixen abans de comptabilitzar una reproducció. No obstant això, què passa amb Facebook/Instagram o TikTok? Pot ser que no hi hagi un temps mínim. De fet, pot ser que els usuaris tinguin el mòbil en silenci!

Si cada reproducció equival a deu segons d'escolta, totes les reproduccions sumen 43 anys. Segueixo al·lucinant.

## En quants països s'ha escoltat la meva música?

<details>
<summary>Fes clic per veure el codi</summary>

```python
# DistroKid (or Meta?) uses "OU" for "Outside the United States".
df.filter(col("Country code") != "OU").select(col("Country")).n_unique()
```

</details>

En total, 171. És a dir, més del 85% de tots els paísos! Com ha crecut aquesta xifra?

<details>
<summary>Fes clic per veure el codi</summary>

```python
# Barplot with year/number of countries.
width = "container"
height = 350

# HTML slider to control the year.
year_slider = alt.binding_range(
    name="Year ",
    min=df["Year"].min(),
    max=df["Year"].max(),
    step=1,
)

# Selecting a year through slider/clicking on the bars will update the map.
year_selection = alt.selection_point(
    fields=["Year"],
    value=df["Year"].max(),
    empty=True,  # Upon reset shows all countries (though with the Quantity of their first appearance)
    on="click, touchend",
    bind=year_slider,
)

# Hovering over a bar will add a stroke.
hover = alt.selection_point(
    empty=False,
    on="mouseover",
    clear="mouseout",
    fields=["Countries"],
)

# The actual barplot.
num_countries_per_year = (
    alt.Chart(unique_countries_per_year)
    .mark_bar(color="teal", cursor="pointer")
    .encode(
        x=alt.X("Year:O", title=None, axis=alt.Axis(labelAngle=0)),
        y=alt.Y("Countries:Q", axis=None, scale=alt.Scale(domain=[0, 800])),
        opacity=alt.condition(year_selection, alt.value(1), alt.value(0.5)),
        strokeWidth=alt.condition(hover, alt.value(2), alt.value(0)),
        stroke=alt.condition(hover, alt.value("black"), alt.value(None)),
    )
    .properties(width="container")
    .add_params(year_selection, hover)
)

# Add text with the number of countries at the end of the bars.
text_num_countries_per_year = num_countries_per_year.mark_text(
    align="center",
    baseline="middle",
    dy=-10,
    fontSize=20,
    font="Monospace",
    fontWeight="bold",
    color="teal",
    strokeOpacity=0,
).encode(text="Countries:Q")

bars_with_numbers = num_countries_per_year + text_num_countries_per_year

# Background for the bars for map layer.
unique_years = unique_countries_per_year["Year"].unique()
background_data = {"Year": unique_years, "Value": [120] * len(unique_years)}
background_df = pl.DataFrame(background_data)
background_white_bars = (
    alt.Chart(background_df)
    .mark_area(color="white")
    .encode(
        x=alt.X("Year:O", title=None, axis=None, scale=alt.Scale(padding=0)),
        y=alt.Y("Value:Q", title=None, axis=None, scale=alt.Scale(domain=[0, 800])),
    )
    .properties(width="container")
)

num_countries_chart = alt.layer(background_white_bars, bars_with_numbers).resolve_scale(
    x="independent"
)

plays_per_year_country = (
    df.group_by(["Country numeric code", "Country", "Year"])
    .agg(col("Quantity").sum())
    .sort("Quantity", descending=True)
)

hover_country = alt.selection_point(on="mouseover", empty=False, fields=["Country"])

source = alt.topo_feature(data.world_110m.url, "countries")
projection = "equirectangular"

base = (
    alt.Chart(source)
    .mark_geoshape(fill="lightgray", stroke="white", strokeWidth=0.5)
    .properties(width="container", height=height)
    .project(projection)
)

color_scale = alt.Scale(
    domain=(
        0,
        # Not using `max()` for protection against outliers.
        plays_per_year_country["Quantity"].quantile(0.98),
    ),
    scheme="teals",
    type="linear",
)

legend = alt.Legend(
    title=None,
    titleFontSize=14,
    labelFontSize=12,
    orient="none",
    gradientLength=height / 3,
    gradientThickness=10,
    direction="vertical",
    fillColor="white",
    legendX=0,
    legendY=130,
    format="0,.0~s",
    tickCount=1,
)

choropleth = (
    alt.Chart(plays_per_year_country)
    .mark_geoshape(stroke="white")
    .encode(
        color=alt.Color("Quantity:Q", scale=color_scale, legend=legend),
        tooltip=[
            alt.Tooltip("Country:N", title="Country"),
            alt.Tooltip("Quantity:Q", title="Plays", format=",.0s"),
        ],
        strokeWidth=alt.condition(hover_country, alt.value(2), alt.value(0.5)),
    )
    .transform_filter(year_selection)
    .transform_lookup(
        lookup="Country numeric code",
        from_=alt.LookupData(source, "id", ["type", "properties", "geometry"]),
    )
    .project(type=projection)
    .properties(width="container", height=height)
    .add_params(hover_country)
)

map_with_bars = base + choropleth + num_countries_chart

map_with_bars = configure_chart(
    chart=map_with_bars,
)

map_with_bars.display()
```

</details>

<div class="full-width">
    <div class="graph-title">Evolució de streams per país al llarg del temps</div>
    <div class="graph-subtitle">
        <p>Les barres interactives mostren el nombre de paísos amb oients per any.</p>
    </div>
</div>
<div class="vega-chart full-width">
    <div id="worldmap">Carregant visualització…</div>
</div>

És un mapa molt més colorit del que esperava. M'agrada imaginar a una persona de cada país escoltant la meva música, encara que sigui durant uns pocs segons. Ni de broma esperava que la meva música arribés a un públic tan ampli.

## Quin és el servei que paga millor? I pitjor?

{{ admonition(type="note", title="NOTA", text="Pot ser que les meves dades no siguin representatives de tot el sector del streaming. Tot i que un dels principals factors a l'hora de determinar la retribució són les decisions preses per alts executius, també influeixen altres variables, com el país, el nombre d'usuaris de pagament i el nombre total de streams durant un mes. A més, disposo de dades limitades de serveis com <span class='service Tidal'>Tidal</span>, <span class='service Snapchat'>Snapchat</span>, o <span class='service Amazon'>Amazon Prime</span>. En l'últim gràfic es detallen els streams per servei.") }}

<details>
<summary>Fes clic per veure el codi</summary>

```python
mean_usd_per_service.select(["USD per stream", "Store"])

# Function to round to the first two non-zero decimal numbers.
def round_to_n_non_zero_decimal(input_float: float, n: float = 2) -> float:
    input_str = f"{input_float:.10f}"  # Use scientific notation to handle very small or large numbers.
    split_number = re.split("\\.", input_str)

    # If there's no decimal part or it's all zeros, return the input as it's already rounded.
    if len(split_number) == 1 or not split_number[1].strip("0"):
        return input_float

    integer, decimals = split_number
    n_decimal_zeroes = re.search("[1-9]", decimals).start()
    non_zero_decimals = decimals[n_decimal_zeroes:]
    scaled_decimal_for_rounding = int(non_zero_decimals) / 10 ** (
        len(non_zero_decimals) - n
    )
    new_non_zero_decimals_float = round(scaled_decimal_for_rounding, n)
    new_non_zero_decimals_str = str(new_non_zero_decimals_float).split(".")[0]
    new_zeroes = "".join((["0"] * n_decimal_zeroes))[
        len(new_non_zero_decimals_str) - n :
    ]
    new_decimals = new_zeroes + new_non_zero_decimals_str
    rounded_number_str = integer + "." + new_decimals
    return float(rounded_number_str)

# Apply rounding to USD per stream.
mean_usd_per_service = mean_usd_per_service.with_columns(
    col("USD per stream")
    .map_elements(round_to_n_non_zero_decimal)
    .alias("Rounded USD per stream")
)

# Graph.
bar_chart = (
    alt.Chart(mean_usd_per_service)
    .mark_bar(cornerRadiusTopRight=15, cornerRadiusBottomRight=15)
    .encode(
        x=alt.X(
            "USD per stream:Q",
            axis=alt.Axis(
                title=None,
                tickCount=5,
                labelExpr="datum.value === 0 ? '$0' : format(datum.value, '0,.5~f')",
            ),
            scale=alt.Scale(
                type="linear",
            ),
        ),
        y=alt.Y("Store:N", axis=alt.Axis(title=None), sort="-x"),
        color=alt.Color(
            "Store:N",
            scale=alt.Scale(domain=domain, range=range_),  # Use custom colours.
            legend=None,
        ),
    )
)

# Add total number next to the bar.
text_chart = bar_chart.mark_text(
    align="left",
    baseline="middle",
    dx=5,  # Move the text a bit to the right.
    fontSize=20,
    font="Monospace",
    fontWeight="bold",
    color="white",
).encode(text=alt.Text("Rounded USD per stream:Q", format=","))

average_pay_per_stream = bar_chart + text_chart

year_credits_text = create_year_credits_text(x=-170, y=570)
average_pay_per_stream = alt.layer(average_pay_per_stream, year_credits_text)

average_pay_per_stream = configure_chart(
    chart=average_pay_per_stream,
).properties(
    width="container",
    height=550,
    padding={"left": 0, "top": 0, "right": 30, "bottom": 0},
)

average_pay_per_stream.display()
```

</details>

<div class="vega-chart full-width">
    <div class="graph-title">Pagament mitjà per stream</div>
    <div class="graph-subtitle">
        <p>Xifres arrodonides al primer parell de decimals diferents de zero.</p>
    </div>
    <div id="average_pay_per_stream">Carregant visualització…</div>
</div>

Uns quants zeros.

Esperava a <span class="service Tidal">Tidal</span> al capdamunt, però no a <span class="service Amazon">Amazon Unlimited</span>.

És interessant la diferència entre els usuaris de pagament d'Amazon Music (<span class="service Amazon">Amazon Unlimited</span>) i els usuaris «gratuïts» (<span class="service Amazon">Amazon Prime</span>). «Gratuït» entre cometes, perquè Amazon Prime no és gratis, però els usuaris no paguen extra per accedir a Amazon Music. Seria interessant comparar entre els usuaris de pagament i els usuaris gratuïts de <span class="service Spotify">Spotify</span>, però no tinc accés a aquestes dades.

Em va sorprendre veure a <span class="service Snapchat">Snapchat</span> a la meitat superior. Esperava que <span class="service TikTok">TikTok</span> i <span class="service Meta">Meta</span> no paguessin gaire: és més fàcil obtenir reproduccions, i els ingressos es comparteixen entre els autors dels vídeos i els músics. Tot i això, tinc la impressió que hi ha zeros de més en el cas de <span class="service Meta">Meta</span>, no?

Amb tants decimals, no és fàcil entendre les diferències. Vegem-ho d'una altra manera.

## Quants streams necessito per aconseguir un dòlar?

<details>
<summary>Fes clic per veure el codi</summary>

```python
# Melt is used to allow selecting mean/median in Vega-Altair.
streams_for_a_dollar = (
    df.group_by("Store")
    .agg(
        [
            streams_for_one_usd(pl.mean("USD per stream")).alias("mean"),
            streams_for_one_usd(pl.median("USD per stream")).alias("median"),
        ]
    )
    .melt(
        id_vars=["Store"],
        value_vars=["mean", "median"],
        value_name="Value",
        variable_name="Metric",
    )
)

# Graph.
metric_radio = alt.binding_radio(
    options=["mean", "median"], name="Calculation based on"
)
metric_select = alt.selection_point(fields=["Metric"], bind=metric_radio, value="mean")

bar_chart = (
    alt.Chart(streams_for_a_dollar)
    .mark_bar(cornerRadiusTopRight=15, cornerRadiusBottomRight=15)
    .encode(
        x=alt.X(
            "Value:Q",
            title="Streams to reach $1",
            axis=alt.Axis(title=None, format="s"),
            scale=alt.Scale(type="log"),
        ),
        y=alt.Y(
            "Store:N",
            title=None,
            sort=alt.EncodingSortField(field="Value", op="median", order="ascending"),
        ),
        opacity=alt.condition(metric_select, alt.value(1), alt.value(0)),
        color=alt.Color(
            "Store:N",
            scale=alt.Scale(domain=domain, range=range_),
            legend=None,
        ),
    )
    .add_params(metric_select)
)

# Add total number next to the bar.
text_chart = bar_chart.mark_text(
    align="left",
    baseline="middle",
    dx=5,
    fontSize=20,
    font="Monospace",
    fontWeight="bold",
).encode(
    text=alt.Text("Value:Q", format=","),
)

plays_for_one_dollar = bar_chart + text_chart

year_credits_text = create_year_credits_text(x=-170, y=570)
plays_for_one_dollar = alt.layer(plays_for_one_dollar, year_credits_text)

plays_for_one_dollar = configure_chart(
    chart=plays_for_one_dollar,
).properties(width=789, height=550)

plays_for_one_dollar.display()
```

</details>

<div class="vega-chart full-width">
    <div class="graph-title">Reproduccions necessàries per aconseguir 1 $</div>
    <div class="graph-subtitle">
        <p>Escala logarítmica.</p>
    </div>
    <div id="plays_for_one_dollar">Carregant visualització…</div>
</div>

Molt més clar.

L'eix horitzontal està en escala logarítmica per facilitar la comparació. En un gràfic lineal, les reproduccions de <span class="service Meta">Meta</span> farien desaparèixer les altres barres. En una escala logarítmica, la diferència entre 10 reproduccions i 100 reproduccions té la mateixa distància visual que la diferència entre 100 i 1.000 reproduccions.

Un dòlar per 100-400 reproduccions no sona gaire bé. En el pitjor dels casos, usant la taxa de pagament mitjana, necessitem gairebé tres milions de reproduccions en <span class="service Meta">Meta</span> per obtenir un dòlar estatunidenc.

Vols saber quantes reproduccions es necessiten per aconseguir el salari mínim? O un milió de dòlars? Amb aquestes dades he creat una [calculadora de royalties de streams](/ca/royalties-calculator/). Aquí tens una captura de pantalla:

<a href="/ca/royalties-calculator/" target="_blank">
    {{ dual_theme_image(light_src="img/calculator_light.ca.webp", dark_src="img/calculator_dark.ca.webp", alt="Captura de pantalla de la calculadora de royalties per streaming") }}
</a>

## Distribució de pagaments per servei

Les plataformes de streaming no tenen una tarifa fixa. Factors com la ubicació geogràfica de l’usuari, el tipus de subscripció (de pagament o no) i el volum general de streaming de la regió afecten la taxa pagament.

Per tant, la mitjana no ho diu tot: vegem la dispersió dels pagaments al voltant d'aquesta mitjana. Varia en funció del servei?

<details>
<summary>Fes clic per veure el codi</summary>

```python
store_payments = df.select(["Store", "USD per stream"])

# Drop top and bottom 1% of pay rate per store.
lower_quantile = 0.01
upper_quantile = 0.99
percentiles = df.group_by("Store").agg(
    [
        pl.col("USD per stream").quantile(lower_quantile).alias("lower_threshold"),
        pl.col("USD per stream").quantile(upper_quantile).alias("upper_threshold"),
    ]
)

trimmed_df = (
    df.join(percentiles, on="Store", how="left")
    .filter(
        (pl.col("USD per stream") >= pl.col("lower_threshold"))
        & (pl.col("USD per stream") <= pl.col("upper_threshold"))
    )
    .drop(["lower_threshold", "upper_threshold"])
)

jittered_scatter_plot = (
    alt.Chart(trimmed_df)
    .mark_circle(size=60, opacity=0.2)
    .encode(
        x=alt.X(
            "USD per stream:Q",
            axis=alt.Axis(
                title=None,
                labelExpr="datum.value === 0 ? '$0' : format(datum.value, '0,.5~f')",
            ),
        ),
        y=alt.Y(
            "Store:N",
            sort=alt.EncodingSortField(
                field="USD per stream", op="median", order="descending"
            ),
            axis=alt.Axis(title=None),
        ),
        color=alt.Color(
            "Store:N",
            scale=alt.Scale(domain=domain, range=range_),  # Use custom colours.
            legend=None,
        ),
        yOffset=alt.Y("jitter:Q", title=None),
    )
    .transform_calculate(jitter="sqrt(-2*log(random()))*cos(2*PI*random())")
)

# Add indicators for each store's median.
median_dots = (
    alt.Chart(trimmed_df)
    .mark_point(opacity=1, shape="diamond", filled=False, size=120)
    .encode(
        x="median(USD per stream):Q",
        y=alt.Y(
            "Store:N",
            sort=alt.EncodingSortField(
                field="USD per stream", op="median", order="descending"
            ),
            axis=None,
        ),
        color=alt.value("black"),
        tooltip=[
            alt.Tooltip("Store", title="Service"),
            alt.Tooltip("median(USD per stream)", title="Median pay rate"),
        ],
    )
)

final_plot_with_jitter = alt.layer(jittered_scatter_plot, median_dots).resolve_scale(
    y="independent"
)

year_credits_text = create_year_credits_text(x=-170, y=570)
final_plot_with_jitter = alt.layer(final_plot_with_jitter, year_credits_text)

final_plot_with_jitter = configure_chart(
    chart=final_plot_with_jitter,
).properties(width="container", height=550)

final_plot_with_jitter.display()
```

</details>

<div class="vega-chart full-width">
    <div class="graph-title">Distribució de pagaments per servei</div>
    <div class="graph-subtitle">
        <p>Cada cercle representa un únic pagament. El rombe indica la mediana.</p>
        <p>El gràfic exclou l'1% superior i inferior dels pagaments per servei per centrar-se en les dades més representatives.</p>
    </div>
    <div id="pay-per-stream-distribution">Carregant visualització…</div>
</div>

Els rangs d'<span class="service Amazon">Amazon Unlimited</span> i <span class="service AppleMusic">Apple Music</span> són enormes; inclouen la mediana de més de la meitat dels serveis.

<span class="service Spotify">Spotify</span>, <span class="service Saavn">Saavn</span> i <span class="service Meta">Meta</span> tenen molts pagaments propers a zero dòlars per reproducció. D'aquests tres, <span class="service Spotify">Spotify</span> destaca en assolir pagaments de més de mig cèntim.

Pensant-ho bé, processant les dades vaig eliminar algunes (72) instàncies de <span class="service Spotify">Spotify</span> i <span class="service Meta">Meta</span> (38) on pagaven infinits dòlars per reproducció. Eren entrades amb 0 reproduccions però ingressos no nuls —probablement ajustos de pagaments anteriors. En qualsevol cas, <span class="service Spotify">Spotify</span> i <span class="service Meta">Meta</span> guanyen la medalla del rang més gran —infinit.

## Comparació de la distribució de parells de serveis

He fet aquest petit gràfic interactiu per comparar la distribució de les taxes de pagament entre serveis:

<details>
<summary>Fes clic per veure el codi</summary>

```python
# Prepare the data.
store_usd_per_stream = trimmed_df.select(["Store", "USD per stream"])

# Graph.
dropdown_store_1 = alt.binding_select(options=unique_stores, name="Service B ")
dropdown_store_2 = alt.binding_select(options=unique_stores, name="Service A ")
selection_store_1 = alt.selection_point(
    fields=["Store"], bind=dropdown_store_1, value="Spotify"
)
selection_store_2 = alt.selection_point(
    fields=["Store"], bind=dropdown_store_2, value="Apple Music"
)

min_usd_per_stream = trimmed_df["USD per stream"].min()
max_usd_per_stream = trimmed_df["USD per stream"].max()

base_density_chart = alt.Chart(store_usd_per_stream).transform_density(
    density="USD per stream",
    bandwidth=0.0004,
    extent=[min_usd_per_stream, max_usd_per_stream],
    groupby=["Store"],
    as_=["USD per stream", "Density"],
)

density_plot_1 = (
    base_density_chart.transform_filter(selection_store_1)
    .mark_area(opacity=0.6)
    .encode(
        x=alt.X(
            "USD per stream:Q",
            title=None,
            axis=alt.Axis(
                grid=False,
                labelExpr="datum.value === 0 ? '$0' : format(datum.value, '0,.5~f')",
            ),
        ),
        y=alt.Y("Density:Q", title=None, axis=None),
        color=alt.Color(
            "Store:N", legend=None, scale=alt.Scale(domain=domain, range=range_)
        ),
        tooltip=[alt.Tooltip("Store", title="Service")],
    )
    .add_params(selection_store_1)
)
density_plot_2 = (
    base_density_chart.transform_filter(selection_store_2)
    .mark_area(opacity=0.6)
    .encode(
        x=alt.X("USD per stream:Q", title=None),
        y=alt.Y("Density:Q", title=None, axis=None),
        color=alt.Color(
            "Store:N", legend=None, scale=alt.Scale(domain=domain, range=range_)
        ),
        tooltip=[alt.Tooltip("Store", title="Service")],
    )
    .add_params(selection_store_2)
)

overlaid_density_plots = alt.layer(density_plot_1, density_plot_2)

compare_distributions = configure_chart(
    chart=overlaid_density_plots,
).properties(width="container", height=200)

compare_distributions.display()
```

</details>

<div class="vega-chart">
    <div id="compare_distributions">Carregant visualització…</div>
</div>

Aquesta visualització utilitza l'[estimació de densitat kernel](https://en.wikipedia.org/wiki/Kernel_density_estimation) per aproximar la distribució de pagaments per reproducció. És com un [histograma](https://es.wikipedia.org/wiki/Histograma) suavitzat.

Els pics indiquen la concentració de les dades al voltant d'aquest valor.

Selecciona alguns serveis per comparar la dispersió, les superposicions i divergències, i el gruix de les cues (la [curtosi](https://ca.wikipedia.org/wiki/Curtosi)). Pots esbrinar alguna política de pagaments?

## Paga Apple Music 0,01 $ per stream?

El 2021, [Apple va informar](https://artists.apple.com/support/1124-apple-music-insights-royalty-rate) que pagaven, de mitjana, un cèntim de dòlar per reproducció.

Els gràfics anteriors mostren que la meva taxa mitjana de pagament d'Apple Music no s'apropa a un cèntim per stream. Està més a prop de mig cèntim.

<details>
<summary>Fes clic per veure el codi</summary>

```python
apple_music_df = df.filter(col("Store") == "Apple Music")
# Percentiles y otras estadísticas.
apple_music_df.select("USD per stream").describe()

total_apple_music_streams = apple_music_df.count().select("Quantity").item()
streams_over_80_percent_apple_music = (
    apple_music_df.filter(col("USD per stream") > 0.008)
    .count()
    .select("Quantity")
    .item()
)
```

</details>

Observant la totalitat de les dades (2017 a 2023) em vaig adonar que:

- Tres quarts de totes les reproduccions van tenir una taxa de pagament per sota de 0,006 $ (el percentil 75);
- Menys del 15% dels meus pagaments superen 0,008 $ (80% d'un cèntim).

En el meu cas, la resposta és «no». No obstant això, una mitjana reportada no és una promesa; hi haurà altres artistes amb una taxa de pagament promig superior a 0,01 $.

## Quant hauria perdut amb el nou sistema de royalties de Spotify?

A partir d'aquest any, [el sistema de royalties «modernitzat» de Spotify pagarà 0 $ per cançons amb menys de mil reproduccions a l'any](https://artists.spotify.com/en/blog/modernizing-our-royalty-system).

Si aquest model s'hagués implementat fa set anys, estic segur que hauria perdut una gran part dels pagaments de Spotify.

<details>
<summary>Fes clic per veure el codi</summary>

```python
spotify_df = df.filter(col("Store") == "Spotify")
grouped_spotify = (
    spotify_df.group_by(["Year", "Song"])
    .sum()
    .select(["Year", "Song", "Quantity", "Earnings"])
    .sort("Quantity", descending=False)
)

spotify_per_year = (
    grouped_spotify.group_by("Year")
    .sum()
    .select(["Year", "Quantity", "Earnings"])
    .sort("Year")
)

unpaid_streams = grouped_spotify.filter(col("Quantity") < 1000)
unpaid_streams_per_year = (
    unpaid_streams.group_by("Year")
    .sum()
    .select(["Year", "Quantity", "Earnings"])
    .sort("Year")
)

spotify_yearly_earnings = spotify_per_year.join(
    other=unpaid_streams_per_year,
    on="Year",
    how="left",
    suffix="_unpaid",
)

unpaid_spotify = spotify_yearly_earnings.with_columns(
    (col("Quantity_unpaid") / col("Quantity") * 100).alias("Unpaid streams %"),
    (col("Earnings_unpaid") / col("Earnings") * 100).alias("Unpaid USD %"),
)

unpaid_spotify_dollars = unpaid_spotify.select(pl.sum("Earnings_unpaid")).item()
print(
    f'Had the "modernized" royalty system been applied for the last {spotify_per_year.height} years, I would\'ve missed out on USD {round(unpaid_spotify_dollars, 2)},'
)
print(
    f"which represents {round(unpaid_spotify_dollars / spotify_per_year.select(pl.sum('Earnings')).item() * 100, 2)}% of my Spotify earnings."
)
```

</details>

Efectivament. El nou sistema m'hauria privat de 112,01 dòlars. Això és el 78,7% dels meus pagaments de Spotify.

Aquests ingressos —generats per les meves cançons— en lloc d'arribar-me a mi, s'haurien distribuït entre els altres «tracks elegibles».

## Les cançons més llargues paguen més?

<details>
<summary>Fes clic per veure el codi</summary>

```python
# Spearman correlation.
df.select(pl.corr("Duration", "USD per stream", method="spearman"))
# Returns -0.013554

# Pearson correlation.
df.select(pl.corr("Duration", "USD per stream", method="pearson"))
# Returns 0.011586
```

</details>

No. En les meves dades, la durada de la cançó no té correlació amb la taxa de pagament per stream.

{{ admonition(type="warning", title="CONSIDERACIÓ", text='Totes les meves improvisacions són més aviat breus; no hi ha gaire rang en termes de durada. La meva cançó més curta, [tíunda](https://soundcloud.com/oskerwyld/tiunda?in=oskerwyld/sets/ii_album), dura 44 segons. La més «llarga», [sextánda](https://soundcloud.com/oskerwyld/improvisation-27-march-2016?in=oskerwyld/sets/ii_album), dura 3 minuts i 19 segons.') }}

## Existeix una relació entre el nombre de reproduccions i la taxa de pagament, a les xarxes socials?

Recordo llegir que el model de pagament de TikTok recompensava més generosament l'ús d'una cançó en diversos vídeos que un únic vídeo amb moltes reproduccions.

Per comprovar si això era així en TikTok i Meta, vaig calcular la correlació entre dos parells de variables: nombre de reproduccions i taxa de pagament, i nombre de reproduccions i ingressos totals.

Si el que vaig llegir és cert, l'esperable és que la taxa de pagament decreixi a mesura que augmenta el nombre de visualitzacions (correlació negativa), i que hi hagi una baixa correlació entre el total de reproduccions i els ingressos.

<details>
<summary>Fes clic per veure el codi and correlation coefficients</summary>

```python
metrics_pairs = [("Quantity", "USD per stream"), ("Quantity", "Earnings")]
stores = ["Meta", "TikTok"]

correlation_results = {}

for store in stores:
    filtered_data = df.filter(pl.col("Store") == store)
    for metrics_pair in metrics_pairs:
        # Calculate Pearson correlation.
        pearson_corr = filtered_data.select(
            pl.corr(metrics_pair[0], metrics_pair[1], method="pearson")
        ).item()
        # Calculate Spearman correlation.
        spearman_corr = filtered_data.select(
            pl.corr(metrics_pair[0], metrics_pair[1], method="spearman")
        ).item()

        # Store the results.
        correlation_results[f"{store} {metrics_pair[0]}-{metrics_pair[1]} Pearson"] = (
            pearson_corr
        )
        correlation_results[f"{store} {metrics_pair[0]}-{metrics_pair[1]} Spearman"] = (
            spearman_corr
        )

for key, value in correlation_results.items():
    print(f"{key}: {round(value, 2)}")

# Returns:
# Meta Quantity-USD per stream Pearson: -0.01
# Meta Quantity-USD per stream Spearman: 0.5
# Meta Quantity-Earnings Pearson: 0.43
# Meta Quantity-Earnings Spearman: 0.93
# TikTok Quantity-USD per stream Pearson: 0.02
# TikTok Quantity-USD per stream Spearman: -0.06
# TikTok Quantity-Earnings Pearson: 0.98
# TikTok Quantity-Earnings Spearman: 0.85
```

</details>

En el cas de TikTok, com més reproduccions, més grans són els ingressos totals (correlació lineal positiva molt forta). En el cas de Meta, també existeix una correlació robusta, però menys lineal.

La taxa de pagament de TikTok sembla ser independent del nombre de reproduccions. En el cas de Meta, sembla haver-hi una correlació no lineal moderada.

En conclusió, el nombre total de reproduccions és el factor rellevant a l'hora de determinar els ingressos, per sobre del nombre de vídeos que utilitzen una cançó.

## Quins són els països amb la taxa de pagament més alta i més baixa?

<details>
<summary>Fes clic per veure el codi</summary>

```python
n = 5
col_of_interest = "Country"

mean_usd_per_stream_per_country = (
    df.group_by(col_of_interest)
    .mean()
    .select(["USD per stream", col_of_interest])
    .with_columns(
        streams_for_one_usd(col("USD per stream")).alias("Streams to reach $1")
    )
    .sort("USD per stream", descending=True)
)

print(f"Top {n} best paying countries:")
display(mean_usd_per_stream_per_country.head(n))
print(f"Top {n} worst paying countries:")
display(mean_usd_per_stream_per_country.tail(n).reverse())
```

</details>

Cinc països amb el **millor** pagament mitjà:

| País             | Streams per aconseguir 1 $ |
|------------------|------------------------------|
| 🇲🇴 Macau         | 212                          |
| 🇯🇵 Japó          | 220                          |
| 🇬🇧 Regne Unit    | 237                          |
| 🇱🇺 Luxemburg     | 237                          |
| 🇨🇭 Suïssa        | 241                          |

Cinc països amb el **pitjor** pagament mitjà:

| País               | Streams per aconseguir 1 $ |
|--------------------|------------------------------|
| 🇸🇨 Seychelles     | 4.064.268                    |
| 🇱🇸 Lesotho        | 4.037.200                    |
| 🇫🇷 Guaiana Francesa| 3.804.970                  |
| 🇱🇮 Liechtenstein  | 3.799.514                    |
| 🇲🇨 Mònaco         | 3.799.196                    |

Altres factors com el servei podrien estar afectant els resultats: i si la majoria dels usuaris dels països amb millor taxa de pagament resulten estar usant un servei que paga millor, i viceversa?

Seria interessant construir un [model lineal jeràrquic](https://ca.wikipedia.org/wiki/Model_multinivell) per estudiar la variabilitat de cada nivell (servei i país). Idea per un altre dia.

Per ara, l'estratificació ens servirà. Vaig agrupar les dades per servei **i** país, obtenint les cinc combinacions de país-servei amb taxes de pagament més altes i baixes.

<details>
<summary>Fes clic per veure el codi</summary>

```python
mean_usd_per_stream_per_country_service = (
    df.group_by(["Country", "Store"])
    .mean()
    .select(["USD per stream", "Country", "Store"])
    .with_columns(
        streams_for_one_usd(col("USD per stream")).alias("Streams to reach $1")
    )
    .sort("USD per stream", descending=True)
)

print(f"Top {n} best paying countries and services:")
display(mean_usd_per_stream_per_country_service.head(n))

print(f"Top {n} worst paying countries and services:")
display(mean_usd_per_stream_per_country_service.tail(n).reverse())
```

</details>

Cinc combinacions de país-servei amb el **millor** pagament mitjà:

| País            | Servei            | Streams per aconseguir 1 $ |
|-----------------|-------------------|------------------------------|
| 🇬🇧 Regne Unit  | Amazon Unlimited  | 60                           |
| 🇮🇸 Islàndia     | Apple Music       | 67                           |
| 🇺🇸 Estats Units | Tidal             | 69                           |
| 🇺🇸 Estats Units | Amazon Unlimited  | 79                           |
| 🇳🇱 Països Baixos | Apple Music       | 84                           |

Cinc combinacions de país-servei amb el **pitjor** pagament mitjà:

| País               | Servei | Streams per aconseguir 1 $ |
|--------------------|--------|------------------------------|
| 🇸🇨 Seychelles     | Meta   | 4.064.268                    |
| 🇱🇸 Lesotho        | Meta   | 4.037.200                    |
| 🇮🇸 Islàndia       | Meta   | 3.997.995                    |
| 🇫🇷 Guaiana Francesa| Meta  | 3.804.970                    |
| 🇱🇮 Liechtenstein  | Meta   | 3.799.514                    |

Que la taxa de pagament de Meta sigui pràcticament zero no ajuda. Si filtrem aquest servei, obtenim:

| País         | Servei  | Streams per aconseguir 1 $ |
|--------------|---------|------------------------------|
| 🇬🇭 Ghana     | Spotify | 1.000.000                    |
| 🇪🇸 Espanya   | Deezer  | 652.153                      |
| 🇸🇻 El Salvador | Deezer | 283.041                      |
| 🇰🇿 Kazakhstan | Spotify | 124.572                      |
| 🇪🇬 Egipte    | Spotify | 20.833                       |

És important notar que el preu de la subscripció a serveis com Spotify és diferent en cada país. Spotify Premium costa ~1,30 $ a Ghana i uns 16 $ a Dinamarca.

En un món menys desigual, aquesta comparació tindria menys sentit.

## Com ha canviat la distribució de streams i ingressos entre serveis al llarg del temps?

<details>
<summary>Fes clic per veure el codi</summary>

```python
width = 896
height = 200
mouseover_highlight = alt.selection_point(
    fields=["Store"],
    on="mouseover",
    clear="mouseout",
)
filter_selection = alt.selection_point(
    fields=["Store"],
    bind="legend",
    toggle="true",
)
# To hide non-music-streaming services.
music_streaming_checkbox = alt.binding_checkbox(name=filter_social_media_label)
checkbox_selection = alt.selection_point(
    bind=music_streaming_checkbox, fields=["IsMusicStreaming"], value=False
)

# First and last date, to keep the X axis fixed when filtering.
min_sale, max_sale = map(str, (df["Sale"].min(), df["Sale"].max()))

base_chart = (
    alt.Chart(sales_per_store_time)
    .transform_filter(
        filter_selection & (checkbox_selection | (alt.datum.IsMusicStreaming == True))
    )
    .transform_joinaggregate(
        TotalQuantity="sum(Quantity)", TotalEarnings="sum(Earnings)", groupby=["Sale"]
    )
    .transform_calculate(
        PercentageQuantity="datum.Quantity / datum.TotalQuantity",
        PercentageEarnings="datum.Earnings / datum.TotalEarnings",
    )
    .add_params(filter_selection, mouseover_highlight, checkbox_selection)
)

areachart_quantity = (
    base_chart.mark_area()
    .encode(
        x=alt.X(
            "yearmonth(Sale):T", axis=None, scale=alt.Scale(domain=(min_sale, max_sale))
        ),
        y=alt.Y(
            "PercentageQuantity:Q",
            stack="center",
            axis=alt.Axis(
                title="Streams",
                labelExpr="datum.value === 1 ? format(datum.value * 100, '') + '%' : format(datum.value * 100, '')",
                titleFontSize=16,
                titlePadding=15,
                titleColor="gray",
            ),
        ),
        color=alt.Color("Store:N", scale=alt.Scale(domain=domain, range=range_)),
        fillOpacity=alt.condition(mouseover_highlight, alt.value(1), alt.value(0.4)),
        tooltip=[
            alt.Tooltip("Store:N", title="Service"),
            alt.Tooltip("yearmonth(Sale):T", title="Date", format="%B %Y"),
            alt.Tooltip("PercentageQuantity:Q", title="% of streams", format=".2%"),
            alt.Tooltip("PercentageEarnings:Q", title="% of payments", format=".2%"),
        ],
    )
    .properties(width=width, height=height)
)

areachart_earnings = (
    base_chart.mark_area()
    .encode(
        x=alt.X(
            "yearmonth(Sale):T",
            axis=alt.Axis(
                domain=False, format="%Y", tickSize=0, tickCount="year", title=None
            ),
            scale=alt.Scale(domain=(min_sale, max_sale)),
        ),
        y=alt.Y(
            "PercentageEarnings:Q",
            stack="center",
            axis=alt.Axis(
                title="Earnings",
                labelExpr="datum.value === 1 ? format(datum.value * 100, '') + '%' : format(datum.value * 100, '')",
                tickCount=4,
                titleFontSize=16,
                titlePadding=15,
                titleColor="gray",
            ),
        ),
        color=alt.Color("Store:N", scale=alt.Scale(domain=domain, range=range_)),
        fillOpacity=alt.condition(mouseover_highlight, alt.value(1), alt.value(0.4)),
        tooltip=[
            alt.Tooltip("Store:N", title="Service"),
            alt.Tooltip("yearmonth(Sale):T", title="Date", format="%B %Y"),
            alt.Tooltip("PercentageQuantity:Q", title="% of streams", format=".2%"),
            alt.Tooltip("PercentageEarnings:Q", title="% of payments", format=".2%"),
        ],
    )
    .properties(width=width, height=height)
)

combined_areachart = alt.vconcat(
    areachart_quantity, areachart_earnings, spacing=10
).resolve_scale(x="shared")

combined_areachart = configure_chart(
    chart=combined_areachart,
    legend_position="top",
    legend_columns=7,
)

combined_areachart.display()
```

</details>

<div class="vega-chart full-width">
    <div class="graph-title">Percentatge de streams i ingressos per servei al llarg del temps</div>
    <div id="combined_areachart">Carregant visualització…</div>
</div>

Quants colors! Pots filtrar els serveis fent clic a la llegenda. En passar el ratolí sobre un color, veuràs més detalls com el servei que representa, la data i el percentatge de reproduccions i ingressos associats.

Em sembla interessant que, a partir de juliol de 2019, <span class="service Meta">Meta</span> comença a dominar en termes de streams, però no en ingressos. Durant uns mesos, malgrat representar consistentment més del 97% dels streams, genera menys del 5% dels ingressos. No és fins a abril de 2022 que comença a equilibrar-se.

En filtrar les dades de xarxes socials (<span class="service Meta">Facebook</span>, <span class="service Meta">Instagram</span>, <span class="service TikTok">TikTok</span> i <span class="service Snapchat">Snapchat</span>) usant la casella sota els gràfics, veiem un patró similar però menys obvi amb <span class="service NetEase">NetEase</span> a partir de mitjans de 2020.

## Com han evolucionat les reproduccions i ingressos totals per servei al llarg del temps?

Centrem-nos ara en els nombres bruts. Aquí tenim un parell de gràfics de barres clàssics anàlegs als gràfics d'àrees de la secció anterior.

<details>
<summary>Fes clic per veure el codi</summary>

```python
height = 200
width = 893

base_chart = (
    alt.Chart(sales_per_store_time)
    .transform_filter(
        filter_selection & (checkbox_selection | (alt.datum.IsMusicStreaming == True))
    )
    .transform_filter(filter_selection)
    .transform_window(
        TotalQuantity="sum(Quantity)", TotalEarnings="sum(Earnings)", groupby=["Sale"]
    )
    .transform_calculate(
        USD_per_Stream="datum.Earnings / datum.Quantity",
        PercentOfStreams="datum.Quantity / datum.TotalQuantity",
        PercentOfEarnings="datum.Earnings / datum.TotalEarnings",
    )
)

quantity_bar_chart = (
    base_chart.mark_bar()
    .encode(
        x=alt.X(
            "yearmonth(Sale):T", axis=None, scale=alt.Scale(domain=(min_sale, max_sale))
        ),
        y=alt.Y(
            "Quantity:Q",
            axis=alt.Axis(
                format="0,.2~s",
                title="Streams",
                tickCount=4,
                titleFontSize=16,
                titlePadding=15,
                titleColor="gray",
            ),
        ),
        color=alt.Color("Store:N", scale=alt.Scale(domain=domain, range=range_)),
        opacity=alt.condition(mouseover_highlight, alt.value(1), alt.value(0.4)),
        tooltip=[
            alt.Tooltip("Store:N", title="Service"),
            alt.Tooltip("yearmonth(Sale):T", title="Date", format="%B %Y"),
            alt.Tooltip("Quantity:Q", title="Streams", format="0,.2~f"),
            alt.Tooltip("Earnings:Q", title="Earnings", format="$0,.2~f"),
            alt.Tooltip("USD_per_Stream:Q", title="$ per stream", format="$,.2r"),
            alt.Tooltip("PercentOfStreams:Q", title="% of streams", format=".2%"),
            alt.Tooltip("PercentOfEarnings:Q", title="% of payments", format=".2%"),
        ],
    )
    .add_params(filter_selection, mouseover_highlight, checkbox_selection)
)

earnings_bar_chart = (
    base_chart.mark_bar()
    .encode(
        x=alt.X(
            "yearmonth(Sale):T",
            axis=alt.Axis(
                format="%Y", tickCount=alt.TimeInterval("year"), title=None, grid=False
            ),
            scale=alt.Scale(domain=(min_sale, max_sale)),
        ),
        y=alt.Y(
            "Earnings:Q",
            axis=alt.Axis(
                format="0,.2~f",
                title="Earnings (USD)",
                tickCount=4,
                titleFontSize=16,
                titlePadding=15,
                titleColor="gray",
            ),
        ),
        color=alt.Color("Store:N", scale=alt.Scale(domain=domain, range=range_)),
        opacity=alt.condition(mouseover_highlight, alt.value(1), alt.value(0.4)),
        tooltip=[
            alt.Tooltip("Store:N", title="Service"),
            alt.Tooltip("yearmonth(Sale):T", title="Date", format="%B %Y"),
            alt.Tooltip("Quantity:Q", title="Streams", format="0,.2~f"),
            alt.Tooltip("Earnings", title="Paid", format="$0,.2~f"),
            alt.Tooltip("USD_per_Stream:Q", title="$ per stream", format="$,.2r"),
            alt.Tooltip("PercentOfStreams:Q", title="% of streams", format=".2%"),
            alt.Tooltip("PercentOfEarnings:Q", title="% of payments", format=".2%"),
        ],
    )
    .add_params(filter_selection, mouseover_highlight, checkbox_selection)
)

# Set dimensions.
quantity_bar_chart = quantity_bar_chart.properties(
    height=height,
    width=width,
)
earnings_bar_chart = earnings_bar_chart.properties(
    height=height,
    width=width,
)

# Join the graphs.
streams_and_earnings_by_service_over_time = alt.vconcat(
    quantity_bar_chart,
    earnings_bar_chart,
    spacing=20,
)

streams_and_earnings_by_service_over_time = configure_chart(
    chart=streams_and_earnings_by_service_over_time,
    legend_position="top",
    legend_columns=7,
)

streams_and_earnings_by_service_over_time.display()
```

</details>

<div class="vega-chart full-width">
    <div class="graph-title">Streams i ingressos totals per servei al llarg del temps</div>
    <div class="graph-subtitle">
        <p>Fes clic a la llegenda per mostrar/ocultar serveis específics.</p>
    </div>
    <div id="streams_and_earnings_by_service_over_time">Carregant visualització…</div>
</div>

De nou es fa evident la divergència entre reproduccions i ingressos de <span class="service Meta">Meta</span>.

La magnitud dels números provinents d'<span class="service Meta">Instagram/Facebook</span> fa que sembli que hi hagi zero reproduccions abans de juliol de 2019. Excloure les dades de xarxes socials actualitza l'eix vertical i canvia la història.

Aquests gràfics mostren una cosa que no podíem veure abans: el creixement brut.

El febrer de 2022 vaig llançar [el meu segon àlbum, II](https://oskerwyld.com/II). Poc després, les reproduccions a <span class="service Meta">Meta</span> es van disparar; una de les improvisacions d'aquest àlbum, [hvítur](https://soundcloud.com/oskerwyld/hvitur?in=oskerwyld/sets/ii_album), va guanyar popularitat allà.

L'augment de reproduccions després del llançament de l'àlbum és menys evident en els serveis de streaming de música.

## Com és la distribució de reproduccions i ingressos entre les cançons?

Potser unes poques pistes obtenen la majoria de les reproduccions? Coincideix el rànquing de reproduccions i ingressos?

<details>
<summary>Fes clic per veure el codi</summary>

```python
# Prepare the data for the graph.
song_quantity_per_store = (
    df.group_by(["Song", "Store"])
    .agg(col("Quantity").sum(), col("IsMusicStreaming").first())
    .sort("Quantity", descending=True)
)

default_show_n = 10
num_unique_songs = len(df["Song"].unique())

element_slider = alt.binding_range(
    min=1, max=num_unique_songs, step=1, name="Show only top "
)
slider_selection = alt.selection_point(
    fields=["N"], bind=element_slider, value=default_show_n
)

song_streams_chart = (
    alt.Chart(song_quantity_per_store)
    .mark_bar()
    .transform_filter(
        filter_selection & (checkbox_selection | (alt.datum.IsMusicStreaming == True))
    )
    .transform_joinaggregate(TotalStreamsPerSong="sum(Quantity)", groupby=["Song"])
    .transform_window(
        rank="dense_rank()",
        sort=[alt.SortField("TotalStreamsPerSong", order="descending")],
    )
    .transform_filter(alt.datum.rank <= slider_selection.N)
    .encode(
        x=alt.X(
            "Song:N",
            sort="-y",
            axis=alt.Axis(title=None, labelLimit=85),
        ),
        y=alt.Y(
            "sum(Quantity):Q",
            axis=alt.Axis(
                format="0,.2~s",
                title="Streams",
                tickCount=4,
                titleFontSize=16,
                titlePadding=15,
                titleColor="gray",
            ),
        ),
        color=alt.Color("Store:N", scale=alt.Scale(domain=domain, range=range_)),
        tooltip=[
            alt.Tooltip("Song:N", title="Song"),
            alt.Tooltip("TotalStreamsPerSong:Q", title="Total plays", format="0,.4~s"),
            alt.Tooltip("Store:N", title="Service"),
            alt.Tooltip("sum(Quantity):Q", title="Service plays", format="0,.4~s"),
        ],
    )
    .add_params(filter_selection, checkbox_selection, slider_selection)
)

# Prepare the data.
song_earnings_per_store = (
    df.group_by(["Song", "Store"])
    .agg(col("Earnings").sum(), col("IsMusicStreaming").first())
    .sort("Earnings", descending=True)
)
song_earnings_per_store.head(2)

song_earnings_chart = (
    alt.Chart(song_earnings_per_store)
    .mark_bar()
    .transform_filter(
        filter_selection & (checkbox_selection | (alt.datum.IsMusicStreaming == True))
    )
    .transform_joinaggregate(TotalStreamsPerSong="sum(Earnings)", groupby=["Song"])
    .transform_window(
        rank="dense_rank()",
        sort=[alt.SortField("TotalStreamsPerSong", order="descending")],
    )
    .transform_filter(alt.datum.rank <= slider_selection.N)
    .encode(
        x=alt.X(
            "Song:N",
            sort="-y",
            axis=alt.Axis(title=None, labelLimit=85),
        ),
        y=alt.Y(
            "sum(Earnings):Q",
            axis=alt.Axis(
                title="Earnings (USD)",
                tickCount=4,
                titleFontSize=16,
                titlePadding=15,
                titleColor="gray",
            ),
        ),
        color=alt.Color("Store:N", scale=alt.Scale(domain=domain, range=range_)),
        tooltip=[
            alt.Tooltip("Song:N", title="Song"),
            alt.Tooltip(
                "TotalStreamsPerSong:Q", title="Total earnings", format="$0,.2~f"
            ),
            alt.Tooltip("Store:N", title="Service"),
            alt.Tooltip("sum(Earnings):Q", title="Service earnings", format="$0,.2~f"),
        ],
    )
    .add_params(filter_selection, checkbox_selection, slider_selection)
)

# Stack 'em.
width = 905
height = 200
song_streams_chart = song_streams_chart.properties(width=width, height=height)
song_earnings_chart = song_earnings_chart.properties(width=width, height=height)
total_song_earnings_streams_chart = alt.vconcat(song_streams_chart, song_earnings_chart)

total_song_earnings_streams_chart = configure_chart(
    chart=total_song_earnings_streams_chart,
    legend_position="top",
    legend_columns=7,
)

total_song_earnings_streams_chart.display()
```

</details>

<div class="vega-chart full-width">
    <div class="graph-title">Total de streams i ingressos per cançó</div>
    <div id="total_song_earnings_streams">Carregant visualització…</div>
</div>

Per a mi, aquesta és una de les visualitzacions més interessants; està plena d'informació.

- Només dues de les cinc cançons més reproduïdes coincideixen entre les dades de xarxes socials i els serveis de streaming de música.
- [hvítur](https://soundcloud.com/oskerwyld/hvitur?in=oskerwyld/sets/ii_album), la cançó amb més de reproduccions (més de 34 milions!) és número u gràcies a <span class="service Meta">Meta</span>. Si filtrem les reproduccions de xarxes socials, ni tan sols està al top 20.
- El rànquing de reproduccions no encaixa consistentment amb el rànquing d'ingressos. Com a exemple clar, la cinquena cançó més reproduïda, [We Don’t](https://soundcloud.com/oskerwyld/we-dont-feat-bradycardia) —una col·laboració amb [Avstånd](https://soundcloud.com/a_vstand) (anteriorment Bradycardia)— es troba a prop del final en termes d'ingressos.
- El color de les barres ajuda a explicar aquesta divergència en reproduccions i ingressos. A més, mostra que la popularitat de les improvisacions difereix per servei.

Explorem més de prop els colors (els serveis).

## Un petit nombre de serveis és responsable de la majoria dels ingressos i reproduccions?

<details>
<summary>Fes clic per veure el codi</summary>

```python
# Prepare the data for plotting (and pareto checking).
store_earnings = (
    df.group_by("Store").agg(col("Earnings").sum()).sort("Earnings", descending=True)
)
total_earnings = store_earnings["Earnings"].sum()
store_earnings_cumulative_percentage = store_earnings.with_columns(
    (col("Earnings").cum_sum() / total_earnings).alias("Cumulative percentage")
)
store_earnings_cumulative_percentage.head()

# Explicit sort order for the plots.
sort_order = list(store_earnings_cumulative_percentage["Store"])

num_unique_stores = len(df["Store"].unique())
element_slider = alt.binding_range(
    min=1, max=num_unique_stores, step=1, name="Show only top "
)
slider_selection = alt.selection_point(fields=["N"], bind=element_slider, value=5)

# Show/hide pareto part of the chart.
pareto_checkbox = alt.binding_checkbox(name="Pareto chart")
show_hide_pareto = alt.param(name="show_pareto", bind=pareto_checkbox, value=False)
pareto_elements_opacity = alt.condition(show_hide_pareto, alt.value(1), alt.value(0))

# Filter data for the charts.
filtered_data = (
    alt.Chart(store_earnings_cumulative_percentage)
    .transform_window(
        rank="dense_rank()",
        sort=[alt.SortField("Earnings", order="descending")],
    )
    .transform_filter((alt.datum.rank <= slider_selection.N))
    .encode(
        x=alt.X(
            "Store:N",
            sort=sort_order,
            axis=alt.Axis(
                title=None,
            ),
        )
    )
    .add_params(slider_selection)
)

# Bar chart.
earnings_per_store = filtered_data.mark_bar().encode(
    y=alt.Y(
        "Earnings:Q",
        axis=alt.Axis(
            title="Earnings (USD)",
            format="0,.2~f",
            tickCount=2,
            titleFontSize=16,
            titlePadding=15,
            titleColor="gray",
        ),
        scale=alt.Scale(type="log"),
    ),
    color=alt.Color(
        "Store:N", scale=alt.Scale(domain=domain, range=range_), legend=None
    ),
)

# Create the text labels based on the filtered data.
bars_text = earnings_per_store.mark_text(
    align="center",
    baseline="bottom",
    dy=-5,
    fontSize=20,
    font="Monospace",
    fontWeight="bold",
).encode(text=alt.Text("Earnings:Q", format="$,.2f"))

# Combine the bar chart with the text labels.
earnings_per_store_with_labels = earnings_per_store + bars_text

# Pareto line.
pareto_colour = "#1e2933"
cumulative_percentage_line = filtered_data.mark_line(
    color=pareto_colour, size=3
).encode(
    y=alt.Y(
        "Cumulative percentage:Q",
        axis=None,
        scale=alt.Scale(domain=[0, 1]),
    ),
    opacity=pareto_elements_opacity,
)

cumulative_percentage_points = filtered_data.mark_circle(
    size=42, color=pareto_colour
).encode(y=alt.Y("Cumulative percentage:Q", axis=None), opacity=pareto_elements_opacity)

pareto_text = filtered_data.mark_text(
    align="center",
    baseline="bottom",
    dy=-12,
    fontSize=18,
    font="Monospace",
    fontWeight="bold",
    color=pareto_colour,
).encode(
    y=alt.Y("Cumulative percentage:Q", title=None),
    text=alt.Text("Cumulative percentage:Q", format=".1%"),
    opacity=pareto_elements_opacity,
)

pareto_plot = alt.layer(
    cumulative_percentage_line,
    cumulative_percentage_points,
    pareto_text,
)

# Combine charts.
earnings_per_store_pareto = (
    alt.layer(earnings_per_store_with_labels, pareto_plot)
    .resolve_scale(y="independent")
    .add_params(show_hide_pareto)
)

# Prepare the data for plotting (and pareto checking).
store_quantity = (
    df.group_by("Store").agg(col("Quantity").sum()).sort("Quantity", descending=True)
)
total_quantity = store_quantity["Quantity"].sum()
store_quantity_cumulative_percentage = store_quantity.with_columns(
    (col("Quantity").cum_sum() / total_quantity).alias("Cumulative percentage")
)
store_quantity_cumulative_percentage.head()

# Explicit sort order for the plots.
sort_order = list(store_quantity_cumulative_percentage["Store"])

# Filter data for the charts.
filtered_data = (
    alt.Chart(store_quantity_cumulative_percentage)
    .transform_window(
        rank="dense_rank()",
        sort=[alt.SortField("Quantity", order="descending")],
    )
    .transform_filter((alt.datum.rank <= slider_selection.N))
    .encode(x=alt.X("Store:N", sort=sort_order, title=None))
    .add_params(slider_selection)
)

# Bar chart.
quantity_per_store = filtered_data.mark_bar().encode(
    y=alt.Y(
        "Quantity:Q",
        axis=alt.Axis(
            title="Streams",
            format="s",
            tickCount=4,
            labelLimit=85,
            titleFontSize=16,
            titlePadding=15,
            titleColor="gray",
        ),
        scale=alt.Scale(type="log"),
    ),
    color=alt.Color(
        "Store:N", scale=alt.Scale(domain=domain, range=range_), legend=None
    ),
)

# Create the text labels based on the filtered data.
bars_text = quantity_per_store.mark_text(
    align="center",
    baseline="bottom",
    dy=-5,
    fontSize=20,
    font="Monospace",
    fontWeight="bold",
).encode(text=alt.Text("Quantity:Q", format="0,.2~f"))

# Combine the bar chart with the text labels.
quantity_per_store_with_labels = quantity_per_store + bars_text

# Pareto line.
pareto_colour = "#1e2933"
cumulative_percentage_line = filtered_data.mark_line(
    color=pareto_colour, size=3
).encode(
    y=alt.Y(
        "Cumulative percentage:Q",
        title=None,
        scale=alt.Scale(domain=[0, 1]),
    ),
    opacity=pareto_elements_opacity,
)

cumulative_percentage_points = filtered_data.mark_circle(
    size=42, color=pareto_colour
).encode(y=alt.Y("Cumulative percentage:Q", axis=None), opacity=pareto_elements_opacity)

pareto_text = filtered_data.mark_text(
    align="center",
    baseline="bottom",
    dy=-12,
    fontSize=18,
    font="Monospace",
    fontWeight="bold",
    color=pareto_colour,
).encode(
    y=alt.Y("Cumulative percentage:Q", title=None),
    text=alt.Text("Cumulative percentage:Q", format=".1%"),
    opacity=pareto_elements_opacity,
)

pareto_plot = alt.layer(
    cumulative_percentage_line,
    cumulative_percentage_points,
    pareto_text,
)

# Combine charts.
streams_per_store_pareto = (
    alt.layer(quantity_per_store_with_labels, pareto_plot)
    .resolve_scale(y="independent")
    .add_params(show_hide_pareto)
)

# Stack the two plots.
width = 896
height = 200

earnings_per_store_pareto = earnings_per_store_pareto.properties(
    width=width, height=height
)
streams_per_store_pareto = streams_per_store_pareto.properties(
    width=width, height=height
)

total_streams_earnings_pareto_stacked = alt.vconcat(
    streams_per_store_pareto, earnings_per_store_pareto
)

total_streams_earnings_pareto_stacked = configure_chart(
    chart=total_streams_earnings_pareto_stacked,
)

total_streams_earnings_pareto_stacked.display()
```

</details>

<div class="vega-chart full-width">
    <div class="graph-title">Distribució de reproduccions i ingressos: una anàlisi de Pareto</div>
    <div class="graph-subtitle">
        <p>Escala logarítmica.</p>
    </div>
    <div id="total_streams_earnings_pareto">Carregant visualització…</div>
</div>

Marcar la casella de "Diagrama de Pareto" superposa línies corresponents al percentatge acumulat de reproduccions i ingressos totals. Això ens permet veure quins serveis generen la majoria dels resultats.

Les visualitzacions anteriors ens donaven una pista, però aquesta reforça el desequilibri entre les taxes de pagament. Malgrat estar en primera posició en ambdós gràfics, <span class="service Meta">Meta</span> té un avantatge importantíssim en termes de nombre de reproduccions (>99%), però no en pagaments (~52%). En contraposició, <span class="service AppleMusic">Apple Music</span> ocupa el quart lloc en reproduccions, però el segon en ingressos.

Un únic servei, <span class="service Meta">Meta</span>, és responsable de més del 99% de les reproduccions. En termes de pagaments, aproximadament el 20% de les botigues (<span class="service Meta">Meta</span>, <span class="service AppleMusic">Apple Music</span> i <span class="service Spotify">Spotify</span>) generen aproximadament el 90% dels ingressos, acostant-se més al [principi de Pareto o regla dels «pocs vitals, molts trivials»](https://es.wikipedia.org/wiki/Principio_de_Pareto).

---

## Creixement i gratitud

He après molt amb aquesta anàlisi. He gaudit jugant amb polars i Vega-Altair. polars ha brillat pel seu rendiment i per la claredat de la seva sintaxi. Vega-Alair m'ha permès crear visualitzacions atractives que expliquen la història darrere les xifres, revelant l'abast global de la meva música alhora que il·luminava una mica l'economia de la indústria del streaming.

Ara ja tinc una resposta concreta per quan els meus amics em preguntin «quant paga Spotify?». «Necessites 400 streams per guanyar un dòlar», respondré.

Més enllà de l'aprenentatge adquirit, em sento profundament agraït.

D'un teclat d'una sola octava a descobrir que podia improvisar, a set anys compartint la meva música en més de 170 països i acumulant més de 130 milions de reproduccions.

Si, set anys enrera, algú m'hagués dit que la meva música arribaria a tantes persones, no l'hauria cregut.

La meva àvia potser sí.
