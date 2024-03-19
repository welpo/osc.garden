+++
title = "Calculadora de royalties de streams"
updated = 2024-03-18
description = "Descubre cuánto pagan por stream Spotify, Apple Music, TikTok, Instagram, Facebook, Tidal, etc. O calcula cuántos streams necesitas en cada plataforma para ganar una cantidad específica. Basado en mis propios datos de royalties de streaming de 2023"
path = "/es/royalties-calculator"

[extra]
stylesheets = ["css/royalty_calculator.min.css"]
show_reading_time = false
+++

<noscript>
Esta calculadora requiere JavaScript para funcionar. Por favor, activa JavaScript en tu navegador y recarga la página.
</noscript>

<form id="calculator" class="js">
    <div class="mode-selection">
        <input type="radio" id="calculateStreams" name="mode" value="CalculateStreams" checked>
        <label for="calculateStreams">Streams para obtener $</label>
        <input type="radio" id="calculateEarnings" name="mode" value="CalculateEarnings">
        <label for="calculateEarnings">Ganancias por streams</label>
    </div>
    <div id="calculator-content">
        <div id="question">¿Cuántos streams son necesarios para alcanzar <div class="target-amount">
            <input type="number" id="target-amount" min="1" title="Monto objetivo de ganancias en dólares estadounidenses" inputmode="numeric" value=1250>
        </div> USD?</div>
        <div id="earnings-results" class="hidden">Ganancias totales: <span id="earnings-amount" aria-live="polite">0</span></div>
        <div id="results" class="results-grid"></div>
        <div>
            Basar los cálculos en la tasa de pago
            <select id="calculation-type" class="dropdown" name="calculation-type">
                <option value="Mean" selected>media</option>
                <option value="Median">mediana</option>
                <option value="Min">mínima</option>
                <option value="Max">máxima</option>
            </select>
        </div>
    </div>
<script src="js/streamsMonthCalculator.min.js"></script>
</form>

---

## ¿De dónde salen los datos?

Las tasas de pago de cada servicio vienen de [un análisis de mis propios datos de royalties](/blog/data-analysis-music-streaming/), filtrados al último año (2023).

## ¿Es precisa esta calculadora?

La calculadora se basa en pagos reales de derechos de streaming. Muchos factores afectan la tasa de pago, por lo que se trata de una aproximación.

Como se basa en mis datos, es precisa para mí. Mi tasa media de pago parece ser inferior a la de otras personas; considérala una calculadora pesimista.

**Nota**: No tengo tantos datos de Tidal o Deezer como de Meta o Spotify. Los cálculos para esos servicios podrían ser menos precisos.

## ¿Por qué varía la tasa de pago es diferente por servicio?

Hay muchos factores que influyen en la remuneración, entre ellos:
- las decisiones tomadas por altos ejecutivos
- el tipo de suscripción del usuario: las suscripciones de pago generan más dinero por stream que las gratuitas
- el país en el que se encuentran los usuarios: los precios de los abonos varían de un país a otro (lo que se traduce en diferentes ingresos por stream)
- el volumen de streams en un mes: cuantos más streams, menos dinero recibe cada stream

Estos factores cambian con el tiempo.

## ¿Cuánto paga Spotify por transmisión?

Durante 2023, Spotify me pagó entre 0,000003 y 0,0072 dólares por stream. La media fue de 0,0025$ y la mediana de 0,0023$.
