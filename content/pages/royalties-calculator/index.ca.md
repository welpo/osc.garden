+++
title = "Calculadora de royalties de streams"
updated = 2024-03-18
description = "Descobreix quant paguen per stream Spotify, Apple Music, TikTok, Instagram, Facebook, Tidal, etc. O calcula quants streams necessites a cada plataforma per guanyar una quantitat específica. Basat en les meves pròpies dades de royalties de streaming de 2023."
path = "/ca/royalties-calculator"

[extra]
stylesheets = ["css/royalty_calculator.min.css"]
show_reading_time = false
+++

<noscript>
Aquesta calculadora requereix JavaScript per funcionar. Si us plau, activa JavaScript al teu navegador i recarrega la pàgina.
</noscript>

<form id="calculator" class="js">
    <div class="mode-selection">
        <input type="radio" id="calculateStreams" name="mode" value="CalculateStreams" checked>
        <label for="calculateStreams">Streams per ingressos</label>
        <input type="radio" id="calculateEarnings" name="mode" value="CalculateEarnings">
        <label for="calculateEarnings">Ingressos per streams</label>
    </div>
    <div id="calculator-content">
        <div id="question">Quants streams son necessaris per aconseguir <div class="target-amount">
            <input type="number" id="target-amount" min="1" title="Quantitat objectiu de guanys en dòlars estatunidencs" inputmode="numeric" value=1250>
        </div> USD?</div>
        <div id="earnings-results" class="hidden">Guany total: <span id="earnings-amount" aria-live="polite">0</span></div>
        <div id="results" class="results-grid"></div>
        <div>
            Basar els càlculs en la taxa de pagament
            <select id="calculation-type" class="dropdown" name="calculation-type">
                <option value="Mean" selected>mitjana</option>
                <option value="Median">mediana</option>
                <option value="Min">mínima</option>
                <option value="Max">màxima</option>
            </select>
        </div>
    </div>
<script src="js/streamsMonthCalculator.min.js"></script>
</form>

---

## D'on surten les dades?

Les taxes de pagament de cada servei provenen d'[una anàlisi de les meves pròpies dades de royalties](/ca/blog/data-analysis-music-streaming/), filtrades a l'últim any (2023).

## És precisa aquesta calculadora?

La calculadora es basa en pagaments reals de drets de streaming. Molts factors afecten la taxa de pagament, per tant, es tracta d'una aproximació.

Com que es basa en les meves dades, és precisa per a mi. La meva taxa mitjana de pagament sembla ser inferior a la d'altres persones; considera-la una calculadora pessimista.

**Nota**: No tinc tants de dades de Tidal o Deezer com de Meta o Spotify. Els càlculs per aquests serveis podrien ser menys precisos.

## Per què varia la taxa de pagament segons el servei?

Hi ha molts factors que influeixen en la remuneració, entre ells:

- les decisions d'alts executius
- el tipus de subscripció de l'usuari: les subscripcions de pagament generen més diners per stream que les gratuïtes
- el país on es troben els usuaris: els preus dels abonaments varien d'un país a un altre (el que es tradueix en diferents ingressos per stream)
- el volum de streams en un mes: com més streams, menys diners rep cada stream

Aquests factors canvien amb el temps.

## Quant paga Spotify per stream?

Durant 2023, Spotify em va pagar entre 0,000003 i 0,0072 dòlars per stream. La mitjana va ser de 0,0025 $ i la mediana de 0,0023 $.
