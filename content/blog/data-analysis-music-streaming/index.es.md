+++
title = "Notas sobre notas: analizando siete años de datos de streaming de música"
date = 2024-03-15
updated = 2024-04-18
description = "De un teclado de una octava a ser escuchado en más de 170 países. He analizado y visualizado siete años de datos de royalties para ver cómo se ha escuchado mi música, cuánto pagan realmente por stream Spotify, Apple Music, TikTok, Instagram, etc., y mucho más."

[taxonomies]
tags = ["ciencia de datos", "análisis de datos", "visualización de datos", "música", "interactivo", "javascript", "python"]

[extra]
pinned = true
stylesheets = ["blog/data-analysis-music-streaming/css/music.min.css"]
social_media_card = "/img/social_cards/es_blog_data_analysis_music_streaming.jpg"
enable_csp = false
+++

<script type="text/javascript" src="https://cdn.jsdelivr.net/npm/vega@5" defer></script>
<script type="text/javascript" src="https://cdn.jsdelivr.net/npm/vega-embed@6" defer></script>
<script type="text/javascript" src="js/embedCharts.es.min.js" defer></script>

{{ admonition(type="note", title="Puntos clave", text="• Mi música ha llegado a más de [170 países](#en-cuantos-paises-se-ha-escuchado-mi-musica) y ha acumulado [más de 137 millones de reproducciones](#cuantas-veces-se-ha-reproducido-mi-musica) (!)<br>• Necesito [más de 200.000 reproducciones](#cuantos-streams-necesito-para-conseguir-un-dolar) en Instagram/Facebook para ganar un dólar.<br>• Amazon Unlimited y Tidal ofrecen las tarifas de pago por stream más altas.<br>• El sistema de royalties “modernizado” de Spotify [perjudicará a los artistas emergentes](#cuanto-habria-perdido-con-el-nuevo-modelo-de-pago-de-spotify).") }}

Mis padres me regalaron mi primer teclado de piano cuando tenía cuatro años. Era pequeño, de una sola octava, pero fue suficiente para que empezara a crear.

Años más tarde, descubrí que podía improvisar. Estaba intentando tocar de oído la introducción de *Lose Yourself*, de Eminem, cuando me di cuenta de que podía seguir tocando los acordes con la mano izquierda y dar libertad a la derecha.

Empecé a grabar estas improvisaciones y las compartí con amigos cercanos y familiares. Mi abuela, muy seria, me dijo que «sería muy egoísta no compartir mi talento con el mundo».

Unos meses después de su muerte, publiqué [mi primer álbum](https://oskerwyld.com/I). La doceava pista, [tólfta (fyrir ömmu)](https://soundcloud.com/oskerwyld/impromptu-for-my-grandma?in=oskerwyld/sets/ii_album), es una improvisación que grabé para ella cuando estaba en el hospital.

Hoy hace siete años ya. Siete años de datos: números de streaming, royalties, oyentes… Tenía curiosidad: ¿a cuántos países ha llegado mi música? ¿Cuántas veces se ha reproducido cada canción y de dónde vienen mis ingresos? ¿Y cuánto pagan Spotify, Apple Music, TikTok e Instagram por cada stream?

<details>
    <summary>Haz click para ver el índice</summary>
    <!-- toc -->
</details>

## Los datos

Mi música está disponible prácticamente en todas partes, desde servicios de streaming regionales como JioSaavn (India) o NetEase Cloud Music (China) hasta [Amazon Music](https://music.amazon.com/artists/B06W9JTC4G/osker-wyld), [Apple Music](https://itunes.apple.com/artist/osker-wyld/id1206134590?mt=1&app=music), [Spotify](https://open.spotify.com/artist/5Hv2bYBhMp1lUHFri06xkE), [Tidal](https://tidal.com/browse/artist/8522682)… Incluso se puede añadir a vídeos de TikTok e Instagram/Facebook.

Distribuyo mi música a través de [DistroKid](https://distrokid.com/vip/seven/648434) (enlace de referral), que me permite quedarme con el 100% de los pagos.

Cada dos o tres meses, los servicios (Spotify, Amazon Music…) mandan un «informe de ganancias» al distribuidor. Tras siete años, contaba con 29.551 filas como estas:

{% wide_container() %}

| Mes de Informe | Mes de Venta | Tienda             | Artista    | Título             | Cantidad | Canción/Álbum | País de Venta | Ganancias (USD)    |
|----------------|--------------|--------------------|------------|--------------------|----------|---------------|---------------|--------------------|
| Mar 2024       | Ene 2024     | Instagram/Facebook | osker wyld | krakkar            | 704      | Canción       | OU            | 0.007483664425    |
| Mar 2024       | Ene 2024     | Instagram/Facebook | osker wyld | fimmtánda          | 9,608    | Canción       | OU            | 0.102135011213    |
| Mar 2024       | Ene 2024     | Tidal              | osker wyld | tólfta (fyrir ömmu)| 27       | Canción       | MY            | 0.121330264483    |
| Mar 2024       | Dic 2023     | iTunes Match       | osker wyld | fyrir Olivia       | 1        | Canción       | TW            | 0.000313712922    |

{% end %}

## Las herramientas

Mi primer instinto fue usar Python con un par de librerías: [pandas](https://pandas.pydata.org/) para procesar los datos y [seaborn](https://seaborn.pydata.org/) o [Plotly](https://plotly.com/python/) para visualizarlos.

Sin embargo, tenía ganas de probar [polars](https://pola.rs/), una «librería de dataframes increíblemente rápida» (puedo confirmarlo). Asimismo, buscando [software libre](https://www.gnu.org/philosophy/free-sw.es.html) para crear visualizaciones interactivas, encontré [Vega-Altair](https://altair-viz.github.io/), una librería de visualización declarativa basada en [Vega-Lite](https://vega.github.io/vega-lite/).

## Preparando los datos

¡Los datos estaban limpios! Al no haber valores faltantes o no válidos, pude pasar directamente a la preparación de los datos para el análisis.

El conjunto de datos sufrió pequeñas transformaciones: eliminé y renombré columnas, ajusté el nombre de algunas tiendas, e indiqué el tipo de datos de cada columna.

<details>
    <summary>Haz clic para ver el código</summary>

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

Eliminé las filas pertenecientes a servicios para los que tenía menos de 20 registros.

<details>
<summary>Haz clic para ver el código</summary>

```python
store_datapoints = df.group_by("Store").len().sort("len")
min_n = 20
stores_to_drop = list(
    store_datapoints.filter(col("len") < 20).select("Store").to_series()
)
df = df.filter(~col("Store").is_in(stores_to_drop))
```

</details>

En términos de ingeniería de atributos —crear variables nuevas a partir de datos existentes—, añadí la columna «Año», recuperé los códigos de país de otro conjunto de datos y calculé los ingresos por stream.

<details>
<summary>Haz clic para ver el código</summary>

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

¡Todo listo! Hora de obtener respuestas.

## ¿Cuántas veces se ha reproducido mi música?

Esta es la primera pregunta que me surgió. Para responderla, sumé la columna de «Cantidad» (reproducciones).

<details>
<summary>Haz clic para ver el código</summary>

```python
df.select(pl.sum("Quantity")).item()
```

</details>

137.053.871. Ciento treinta y siete millones cincuenta y tres mil ochocientos setenta y uno.

Tuve que comprobar varias veces el resultado; no me lo creía. No soy famoso y apenas he promocionado mi música. Al ordenar los datos encontré la respuesta:

| Servicio | Cantidad |     Canción     |
|-------|----------|--------------|
| Meta  | 8.171.864  | [áttunda](https://soundcloud.com/oskerwyld/attunda?in=oskerwyld/sets/ii_album)    |
| Meta  | 6.448.952  | [nostalgía](https://soundcloud.com/oskerwyld/nostalgia?in=oskerwyld/sets/ii_album)  |
| Meta  | 6.310.620  | [áttunda](https://soundcloud.com/oskerwyld/attunda?in=oskerwyld/sets/ii_album)    |
| Meta  | 3.086.232  | [þriðja](https://soundcloud.com/oskerwyld/pridja?in=oskerwyld/sets/ii_album)     |
| Meta  | 2.573.362  | [hvítur](https://soundcloud.com/oskerwyld/hvitur?in=oskerwyld/sets/ii_album)     |

Mi música se ha utilizado en vídeos de Instagram y Facebook (ambos propiedad de <span class="service Meta">Meta</span>) con millones de reproducciones. Anonadado me hallo —los pocos vídeos en los que he escuchado mi música ni se acercaban al millón de reproducciones.

## ¿Cuántas horas (o días) es eso?

<details>
<summary>Haz clic para ver el código</summary>

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

Si consideramos que cada reproducción equivale a 30 segundos de una persona escuchando mi música, obtenemos un tiempo total de escucha de más de 130 años. Wow.

30 segundos es el tiempo mínimo que Spotify o Apple Music exigen antes de contabilizar una reproducción. Sin embargo, ¿qué pasa con Facebook/Instagram o TikTok? Puede que no haya un tiempo mínimo. De hecho, ¡puede que los usuarios tengan el móvil en silencio!

Si cada reproducción equivale a diez segundos de escucha, todas las reproducciones suman 43 años. Sigo alucinando.

## ¿En cuántos países se ha escuchado mi música?

<details>
<summary>Haz clic para ver el código</summary>

```python
# DistroKid (or Meta?) uses "OU" for "Outside the United States".
df.filter(col("Country code") != "OU").select(col("Country")).n_unique()
```

</details>

En total, 171. Es decir, ¡más del 85% de todos los países! ¿Cómo ha crecido este número?

<details>
<summary>Haz clic para ver el código</summary>

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
    <div class="graph-title">Evolución de streams por país a lo largo del tiempo</div>
    <div class="graph-subtitle">
        <p>Las barras interactivas muestran el número de países con oyentes por año.</p>
    </div>
</div>
<div class="vega-chart full-width">
    <div id="worldmap">Cargando visualización…</div>
</div>

Es un mapa mucho más colorido de lo que esperaba. Me gusta imaginar a una persona de cada país escuchando mi música, aunque sea durante unos pocos segundos. Para nada esperaba que mi música llegara a un público tan amplio.

## ¿Cuál es el servicio que paga mejor? ¿Y peor?

{{ admonition(type="note", title="NOTA", text='Puede que mis datos no sean representativos de todo el sector del streaming. Aunque uno de los principales factores a la hora de determinar la retribución son las decisiones tomadas por altos ejecutivos, también influyen otras variables, como el país, el número de usuarios de pago y el número total de streams durante un mes. Además, dispongo de datos limitados de servicios como <span class="service Tidal">Tidal</span>, <span class="service Snapchat">Snapchat</span>, o <span class="service Amazon">Amazon Prime</span>. En el último gráfico se detallan los streams por servicio.') }}

<details>
<summary>Haz clic para ver el código</summary>

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
    <div class="graph-title">Pago medio por stream</div>
    <div class="graph-subtitle">
        <p>Cifras redondeadas al primer par de decimales distintos de cero.</p>
    </div>
    <div id="average_pay_per_stream">Cargando visualización…</div>
</div>

Unos cuantos ceros.

Esperaba a <span class="service Tidal">Tidal</span> en el top, pero no a <span class="service Amazon">Amazon Unlimited</span>.

Es interesante la diferencia entre los usuarios de pago de Amazon Music (<span class="service Amazon">Amazon Unlimited</span>) y los usuarios «gratuitos» (<span class="service Amazon">Amazon Prime</span>). «Gratuito» entre comillas, porque Amazon Prime no es gratis, pero los usuarios no pagan extra por acceder a Amazon Music. Sería interesante comparar entre los usuarios de pago y los usuarios gratuitos de <span class="service Spotify">Spotify</span>, pero no tengo acceso a esos datos.

Me sorprendió ver a <span class="service Snapchat">Snapchat</span> en la mitad superior. Esperaba que <span class="service TikTok">TikTok</span> y <span class="service Meta">Meta</span> no pagasen mucho: es más fácil obtener reproducciones, y las ganancias se comparten entre los autores de los videos y los músicos. Sin embargo, tengo la impresión de que hay ceros de más en el caso de <span class="service Meta">Meta</span>, ¿no?

Con tantos decimales, no es fácil entender las diferencias. Veámoslo de otro modo.

## ¿Cuántos streams necesito para conseguir un dólar?

<details>
<summary>Haz clic para ver el código</summary>

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
    <div class="graph-title">Reproducciones necesarias para conseguir 1 $</div>
    <div class="graph-subtitle">
        <p>Escala logarítmica.</p>
    </div>
    <div id="plays_for_one_dollar">Cargando visualización…</div>
</div>

Mucho más claro.

El eje horizontal está en escala logarítmica para facilitar la comparación. En un gráfico lineal, las reproducciones de <span class="service Meta">Meta</span> harían desaparecer las otras barras. En una escala logarítmica, la diferencia entre 10 reproducciones y 100 reproducciones tiene la misma distancia visual que la diferencia entre 100 y 1.000 reproducciones.

Un dólar por 100-400 reproducciones no suena muy bien. En el peor de los casos, usando la tasa de pago mediana, necesitamos casi tres millones de reproducciones en <span class="service Meta">Meta</span> para obtener un dólar estadounidense.

¿Quieres saber cuántas reproducciones se necesitan para lograr un salario mínimo? ¿O un millón de dólares? Usando estos datos, he creado una [calculadora de royalties de streams](/es/royalties-calculator/). Aquí tienes un pantallazo:

<a href="/es/royalties-calculator/" target="_blank">
    {{ dual_theme_image(light_src="img/calculator_light.es.webp", dark_src="img/calculator_dark.es.webp", alt="Captura de pantalla de la calculadora de royalties por streaming") }}
</a>

## Distribución de pagos por servicio

Las plataformas de streaming no tienen una tasa fija. Factores como la ubicación geográfica del usuario, su tipo de suscripción (de pago o no) y el volumen general de streaming de la región afectan al pago por stream.

Por lo tanto, la tasa media no lo dice todo: veamos la dispersión de los pagos en torno a esta media. ¿Varía en función del servicio?

<details>
<summary>Haz clic para ver el código</summary>

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
    <div class="graph-title">Distribución de pagos por servicio</div>
    <div class="graph-subtitle">
        <p>Cada círculo representa un único pago. El rombo indica la mediana.</p>
        <p>El gráfico excluye el 1% superior e inferior de los pagos por servicio para centrarse en los datos más representativos.</p>
    </div>
    <div id="pay-per-stream-distribution">Cargando visualización…</div>
</div>

Los rangos de <span class="service Amazon">Amazon Unlimited</span> y <span class="service AppleMusic">Apple Music</span> son enormes; incluyen la mediana de más de la mitad de los servicios.

<span class="service Spotify">Spotify</span>, <span class="service Saavn">Saavn</span> y <span class="service Meta">Meta</span> tienen muchos pagos cercanos a cero dólares por reproducción. De estos tres, <span class="service Spotify">Spotify</span> destaca al alcanzar pagos de más de medio céntimo.

Pensándolo bien, procesando los datos eliminé algunas (72) instancias de <span class="service Spotify">Spotify</span> y <span class="service Meta">Meta</span> (38) donde pagaban infinitos dólares por reproducción. Eran entradas con 0 reproducciones pero ganancias no nulas —probablemente ajustes de pagos anteriores. En cualquier caso, <span class="service Spotify">Spotify</span> y <span class="service Meta">Meta</span> ganan la medalla del rango más grande —infinito.

## Comparación de la distribución de pares de servicios

He hecho este pequeño gráfico interactivo para comparar la distribución de las tasas de pago entre dos servicios cualesquiera:

<details>
<summary>Haz clic para ver el código</summary>

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
    <div id="compare_distributions">Cargando visualización…</div>
</div>

Esta visualización usa la [estimación de densidad kernel](https://en.wikipedia.org/wiki/Kernel_density_estimation) para aproximar la distribución de pagos por reproducción. Es como un [histograma](https://es.wikipedia.org/wiki/Histograma) suavizado.

Los picos indican la concentración de los datos alrededor de ese valor.

Selecciona algunos servicios para comparar la dispersión, las superposiciones y divergencias, y el grosor de las colas (la [curtosis](https://es.wikipedia.org/wiki/Curtosis)). ¿Puedes adivinar alguna política de pagos en base a estos datos?

## ¿Paga Apple Music 0,01 $ por stream?

En 2021, [Apple informó](https://artists.apple.com/support/1124-apple-music-insights-royalty-rate) que pagaban, de media, un céntimo de dólar por reproducción.

Los gráficos anteriores muestran que mi tasa media de pago de Apple Music no se acerca a un céntimo por stream. Está más cerca de medio céntimo.

<details>
<summary>Haz clic para ver el código</summary>

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

Observando la totalidad de los datos (2017 a 2023) me di cuenta de que:

- Tres cuartos de todas las reproducciones tuvieron una tasa de pago por debajo de 0,006 $ (el percentil 75);
- Menos del 15% de mis pagos superan 0,008 $ (80% de un céntimo).

En mi caso, la respuesta es «no». Sin embargo, una media reportada no es una promesa; habrá otros artistas con una tasa de pago promedio mayor a 0,01 $.

## ¿Cuánto habría perdido con el nuevo modelo de pago de Spotify?

A partir de este año, [el sistema de royalties «modernizado» de Spotify pagará 0 $ por canciones con menos de mil reproducciones al año](https://artists.spotify.com/en/blog/modernizing-our-royalty-system).

Si este modelo se hubiera implementado hace siete años, estoy seguro de que habría perdido una gran parte de los pagos de Spotify.

<details>
<summary>Haz clic para ver el código</summary>

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

Efectivamente. El nuevo sistema me habría privado de 112,01 dólares. Esto es el 78,7% de mis pagos de Spotify hasta la fecha.

Estas ganancias —generadas por mis canciones— en lugar de llegarme a mí, se habrían distribuido entre los demás «tracks elegibles».

## ¿Las canciones más largas pagan más?

<details>
<summary>Haz clic para ver el código</summary>

```python
# Spearman correlation.
df.select(pl.corr("Duration", "USD per stream", method="spearman"))
# Returns -0.013554

# Pearson correlation.
df.select(pl.corr("Duration", "USD per stream", method="pearson"))
# Returns 0.011586
```

</details>

No. En mis datos, la duración de la canción no tiene correlación con la tasa de pago por stream.

{{ admonition(type="warning", title="CONSIDERACIÓN", text='Todas mis improvisaciones son más bien breves; no hay mucho rango en términos de duración. Mi canción más corta, [tíunda](https://soundcloud.com/oskerwyld/tiunda?in=oskerwyld/sets/ii_album), dura 44 segundos. La más «larga», [sextánda](https://soundcloud.com/oskerwyld/improvisation-27-march-2016?in=oskerwyld/sets/ii_album), dura 3 minutos y 19 segundos.') }}

## ¿Existe una relación entre el número de reproducciones y la tasa de pago, en las redes sociales?

Recuerdo leer que el modelo de pago de TikTok recompensaba más generosamente el uso de una canción en varios vídeos que un único vídeo con muchas reproducciones.

Para comprobar si esto era así en TikTok y Meta, calculé la correlación entre dos pares de variables: número de reproducciones y tasa de pago, y número de reproducciones y ganancias totales.

Si lo que leí es cierto, lo esperable es que la tasa de pago decrezca a medida que aumenta el número de visualizaciones (correlación negativa), y que haya una baja correlación entre el total de reproducciones y las ganancias.

<details>
<summary>Haz clic para ver el código and correlation coefficients</summary>

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

En el caso de TikTok, contra más reproducciones, mayores son las ganancias totales (correlación lineal positiva muy fuerte). En el caso de Meta, aunque existe una correlación robusta, es menos lineal.

La tasa de pago de TikTok parece ser independiente del número de reproducciones. En el caso de Meta, parece haber una correlación no lineal moderada.

En conclusión, el número total de reproducciones es el factor relevante a la hora de determinar las ganancias, por encima del número de vídeos que utilizan una canción.

## ¿Cuáles son los países con la tasa de pago más alta y más baja?

<details>
<summary>Haz clic para ver el código</summary>

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

Cinco países con el **mayor** pago promedio:

| País             | Reproducciones para alcanzar 1 $ |
|------------------|---------------------------------|
| 🇲🇴 Macao         | 212                             |
| 🇯🇵 Japón         | 220                             |
| 🇬🇧 Reino Unido   | 237                             |
| 🇱🇺 Luxemburgo    | 237                             |
| 🇨🇭 Suiza         | 241                             |

Cinco países con el **menor** pago promedio:

| País            | Reproducciones para alcanzar 1 $ |
|-----------------|---------------------------------|
| 🇸🇨 Seychelles   | 4.064.268                       |
| 🇱🇸 Lesotho      | 4.037.200                       |
| 🇫🇷 Guayana Francesa | 3.804.970                   |
| 🇱🇮 Liechtenstein| 3.799.514                       |
| 🇲🇨 Mónaco       | 3.799.196                       |

Otros factores como el servicio podrían estar afectando los resultados: ¿y si la mayoría de los usuarios de los países con mejor tasa de pago resultan estar usando un servicio que paga mejor, y viceversa?

Sería interesante construir un [modelo lineal jerárquico](https://es.wikipedia.org/wiki/Modelo_multinivel) para estudiar la variabilidad de cada nivel (servicio y país). Idea para otro día.

Por ahora, la estratificación bastará. Agrupé los datos por servicio **y** país, obteniendo las cinco combinaciones de país-servicio con tasas de pago más altas y bajas.

<details>
<summary>Haz clic para ver el código</summary>

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

Cinco combinaciones de país-servicio con el **mayor** pago promedio:

| País            | Servicio          | Reproducciones para alcanzar 1 $ |
|-----------------|------------------|---------------------------------|
| 🇬🇧 Reino Unido  | Amazon Unlimited | 60                              |
| 🇮🇸 Islandia     | Apple Music      | 67                              |
| 🇺🇸 Estados Unidos | Tidal           | 69                              |
| 🇺🇸 Estados Unidos | Amazon Unlimited | 79                              |
| 🇳🇱 Países Bajos | Apple Music      | 84                              |

Cinco combinaciones de país-servicio con el **menor** pago promedio:

| País             | Servicio | Reproducciones para alcanzar 1 $ |
|------------------|---------|---------------------------------|
| 🇸🇨 Seychelles    | Meta    | 4.064.268                       |
| 🇱🇸 Lesotho       | Meta    | 4.037.200                       |
| 🇮🇸 Islandia      | Meta    | 3.997.995                       |
| 🇫🇷 Guayana Francesa | Meta | 3.804.970                       |
| 🇱🇮 Liechtenstein | Meta    | 3.799.514                       |

Que la tasa de pago de Meta sea prácticamente cero no ayuda. Si filtramos este servicio, obtenemos:

| País          | Servicio | Reproducciones para alcanzar 1 $ |
|---------------|---------|---------------------------------|
| 🇬🇭 Ghana       | Spotify | 1.000.000                       |
| 🇪🇸 España      | Deezer  | 652.153                         |
| 🇸🇻 El Salvador | Deezer  | 283.041                         |
| 🇰🇿 Kazajistán  | Spotify | 124.572                         |
| 🇪🇬 Egipto      | Spotify | 20.833                          |

Es importante notar que el precio de la suscripción a servicios como Spotify es diferente en cada país. Spotify Premium cuesta ~1,30 $ en Ghana y unos 16 $ en Dinamarca.

En un mundo menos desigual, esta comparación tendría menos sentido.

## ¿Cómo ha cambiado la distribución de streams e ingresos entre servicios a lo largo del tiempo?

<details>
<summary>Haz clic para ver el código</summary>

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
    <div class="graph-title">Porcentaje de streams e ingresos por servicio a lo largo del tiempo</div>
    <div id="combined_areachart">Cargando visualización…</div>
</div>

¡Cuántos colores! Puedes filtrar los servicios haciendo clic en la leyenda. Al pasar el mouse sobre un color, verás más detalles como el servicio que representa, la fecha y el porcentaje de reproducciones e ingresos asociados.

Me parece interesante que, a partir de julio de 2019, <span class="service Meta">Meta</span> empieza a dominar en términos de reproducciones, pero no en ingresos. Durante unos meses, a pesar de representar consistentemente más del 97% de las reproducciones, genera menos del 5% de los ingresos. No es hasta abril de 2022 que comienza a equilibrarse.

Al filtrar los datos de redes sociales (<span class="service Meta">Facebook</span>, <span class="service Meta">Instagram</span>, <span class="service TikTok">TikTok</span> y <span class="service Snapchat">Snapchat</span>) usando la casilla bajo los gráficos, vemos un patrón similar pero menos obvio con <span class="service NetEase">NetEase</span> a partir de mediados de 2020.

## ¿Cómo han evolucionado las reproducciones e ingresos totales por servicio a lo largo del tiempo?

Centrémonos ahora en los números brutos. Aquí tenemos un par de gráficos de barras clásicos análogos a los gráficos de área de la sección anterior.

<details>
<summary>Haz clic para ver el código</summary>

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
    <div class="graph-title">Streams e ingresos totales por servicio a lo largo del tiempo</div>
    <div class="graph-subtitle">
        <p>Haz clic en la leyenda para mostrar/ocultar servicios específicos.</p>
    </div>
    <div id="streams_and_earnings_by_service_over_time">Cargando visualización…</div>
</div>

De nuevo se hace evidente la divergencia entre reproducciones e ingresos de <span class="service Meta">Meta</span>.

La magnitud de los números provenientes de <span class="service Meta">Instagram/Facebook</span> hace que parezca que haya cero reproducciones antes de julio de 2019. Excluir los datos de redes sociales actualiza el eje vertical y cambia la historia.

Estos gráficos muestran algo que no podíamos ver antes: el crecimiento bruto.

En febrero de 2022 lancé [mi segundo álbum, II](https://oskerwyld.com/II). Poco después, las reproducciones en <span class="service Meta">Meta</span> se dispararon; una de las improvisaciones de este álbum, [hvítur](https://soundcloud.com/oskerwyld/hvitur?in=oskerwyld/sets/ii_album), ganó popularidad allí.

El aumento de reproducciones después del lanzamiento del álbum es menos evidente en los servicios de streaming de música.

## ¿Cómo es la distribución de reproducciones e ingresos entre las canciones?

¿Quizás unas pocas pistas obtienen la mayoría de las reproducciones? ¿Coincide el ranking de reproducciones e ingresos?

<details>
<summary>Haz clic para ver el código</summary>

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
    <div class="graph-title">Total de streams y ganancias por canción</div>
    <div id="total_song_earnings_streams">Cargando visualización…</div>
</div>

Para mí, esta es una de las visualizaciones más interesantes; está llena de información.

- Tan solo dos de las cinco canciones más reproducidas coinciden entre los datos de redes sociales y los servicios de streaming de música.
- [hvítur](https://soundcloud.com/oskerwyld/hvitur?in=oskerwyld/sets/ii_album), la canción con el mayor número de reproducciones (¡más de 34 millones!) es número uno gracias a <span class="service Meta">Meta</span>. Si filtramos las reproducciones de redes sociales, ni siquiera está en el top 20.
- El ranking de reproducciones no encaja consistentemente con el ranking de ingresos. Como ejemplo claro, la quinta canción más reproducida, [We Don’t](https://soundcloud.com/oskerwyld/we-dont-feat-bradycardia) —una colaboración con [Avstånd](https://soundcloud.com/a_vstand) (anteriormente Bradycardia)— se encuentra cerca del final en términos de ingresos.
- El color de las barras ayuda a explicar esta divergencia en reproducciones e ingresos. Además, muestra que la popularidad de las improvisaciones difiere por servicio.

Exploremos más de cerca los colores (los servicios).

## ¿Un pequeño número de servicios es responsable de la mayoría de los ingresos y reproducciones?

<details>
<summary>Haz clic para ver el código</summary>

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
    <div class="graph-title">Distribución de reproducciones y ganancias: un análisis de Pareto</div>
    <div class="graph-subtitle">
        <p>Escala logarítmica.</p>
    </div>
    <div id="total_streams_earnings_pareto">Cargando visualización…</div>
</div>

Marcar la casilla de "Diagrama de Pareto" superpone líneas correspondientes al porcentaje acumulado de reproducciones e ingresos totales. Esto nos permite ver qué servicios generan la mayoría de los resultados.

Las visualizaciones anteriores nos daban una pista, pero esta refuerza el desequilibrio entre las tasas de pago. Pese a estar primera posición en ambos gráficos, <span class="service Meta">Meta</span> tiene una ventaja importantísima en términos de número de reproducciones (>99%), pero no en pagos (~52%). En contraposición, <span class="service AppleMusic">Apple Music</span> ocupa el cuarto lugar en reproducciones, pero el segundo en ingresos.

Un único servicio, <span class="service Meta">Meta</span>, es responsable de más del 99% de las reproducciones. En términos de pagos, aproximadamente el 20% de las tiendas (<span class="service Meta">Meta</span>, <span class="service AppleMusic">Apple Music</span> y <span class="service Spotify">Spotify</span>) generan aproximadamente el 90% de los ingresos, acercándose más al [principio de Pareto o regla de los «pocos vitales, muchos triviales»](https://es.wikipedia.org/wiki/Principio_de_Pareto).

---

## Crecimiento y gratitud

He aprendido mucho con este análisis. He disfrutado jugando con polars y Vega-Altair. polars ha brillado por su rendimiento y por la claridad de su sintaxis. Vega-Alair me ha permitido crear visualizaciones atractivas que cuentan la historia detrás de las cifras, revelando el alcance global de mi música mientras arrojaba algo de luz sobre la economía de la industría del streaming.

Ahora ya tengo una respuesta concreta para cuando mis amigos me pregunten «¿cuánto paga Spotify?». «Necesitas 400 streams para ganar un dólar», responderé.

Más allá del aprendizaje adquirido, me siento profundamente agradecido.

De un teclado de una sola octava a descubrir que podía improvisar, a siete años compartiendo mi música en más de 170 países y acumulando más de 130 millones de reproducciones.

Si, siete años atrás, alguien me hubiese dicho que mi música llegaría a tantas personas, no le habría creído.

Mi abuela quizás sí.
