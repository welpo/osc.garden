+++
title = "Streaming Royalties Calculator"
updated = 2024-03-15
description = "See how much Spotify, Apple Music, TikTok, Instagram, Facebook, Tidal, etc. pay per stream. Or calculate how many streams you need on each platform to earn a specific amount. Based on my own royalties data from 2023."
path = "royalties-calculator"

[extra]
stylesheets = ["css/royalty_calculator.min.css"]
show_reading_time = false
+++

<noscript>
This calculator requires JavaScript to function. Please enable JavaScript in your browser and reload the page.
</noscript>

<form id="calculator" class="js">
    <div class="mode-selection">
        <input type="radio" id="calculateStreams" name="mode" value="CalculateStreams" checked>
        <label for="calculateStreams">Streams to reach $</label>
        <input type="radio" id="calculateEarnings" name="mode" value="CalculateEarnings">
        <label for="calculateEarnings">Earnings from streams</label>
    </div>
    <div id="calculator-content">
        <div id="question">How many streams are necessary to earn <div class="target-amount">
            <input type="number" id="target-amount" min="1" title="target amount to calculate streams necessary" inputmode="numeric" value=1250>
        </div> USD?</div>
        <div id="earnings-results" class="hidden">Total earnings: <span id="earnings-amount">0</span></div>
        <div id="results" class="results-grid"></div>
        <div>
            Base calculations on
            <select id="calculation-type" class="dropdown" name="calculation-type">
                <option value="Mean" selected>mean</option>
                <option value="Median">median</option>
                <option value="Min">minimum</option>
                <option value="Max">maximum</option>
            </select>
            pay rate.
        </div>
    </div>
<script src="/js/streamsMonthCalculator.min.js"></script>
</form>

---

## Where do you get the data from?

The pay rate of each service is comes from [an analysis of my own royalties data](/blog/data-analysis-music-streaming/), filtered to the last year (2023).

## How accurate is this calculator?

The calculator is based on real streaming royalty payments. As many factors affect the pay rate, this is an approximation.

Since it’s based on my data, it’s accurate for me. My average pay rate appears to be lower than other reports I’ve seen; consider this a pessimistic calculator.

**Note**: I don’t have as much data from Tidal or Deezer compared to Meta or Spotify. Calculations for those services might be less accurate.

## Why is the pay rate different for each service?

Many factors affect the pay rate, including:

- decisions made by top executives
- a user's subscription type: paid subscriptions yield more money per stream than free users
- the country where users are located: countries have different subscription prices (which translates to different royalties)
- the volume of streams in a month: the more streams, the less money each stream gets

These factors change over time.

## How much does Spotify pay per stream?

In 2023, Spotify paid me between $0.0025 and $0.0072 per stream. The mean was $0.0025 and the median $0.0023.
