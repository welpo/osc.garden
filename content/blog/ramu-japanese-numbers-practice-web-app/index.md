+++
title = "Building a Progressive Web App To Practice Japanese Numbers"
date = 2024-11-05
description = "I built a web app to practice reading and listening to Japanese numbers. In the process, I learnt about testing vanilla JavaScript, creating PWAs, accessibility, browser inconsistencies, and automatic cache busting without frameworks."

[taxonomies]
tags = ["code", "japanese", "linguistics", "javascript", "web app"]

[extra]
copy_button = true
stylesheets = ["blog/ramu-japanese-numbers-practice-web-app/css/styles.css"]
tldr = "I built [<ruby>ラ<rt>ra</rt>ム<rt>mu</rt></ruby>, a web-app](https://ramu.osc.garden) to practice reading and listening to Japanese numbers. I discover browser inconsistencies, how to test vanilla JavaScript, and how to make a Progressive Web App. [Repository](https://github.com/welpo/ramu) and [video demo](https://github.com/welpo/ramu?tab=readme-ov-file#demo)."
social_media_card = "img/social_cards/blog_ramu_japanese_numbers_practice_webapp.jpg"
+++

<details>
    <summary>Table of contents</summary>
    <!-- toc -->
</details>

Numbers were one of the first things I learnt in Japanese. Learning to count from one to ten is not hard. If you know 1-10, you know 1-99: you say how many tens there are, then the unit. For example, forty-two is "<ruby>four<rt>四</rt></ruby> <ruby>ten<rt>十</rt></ruby> <ruby>two<rt>二</rt></ruby>": <ruby>四<rt>yon</rt></ruby><ruby>十<rt>juu</rt></ruby><ruby>二<rt>ni</rt></ruby>.

Beyond 99, you need to learn the name for 100 (<ruby>百<rt>hyaku</rt></ruby>), 1,000 (<ruby>千<rt>sen</rt></ruby>), and 10,000 (<ruby>万<rt>man</rt></ruby>). After 10,000, numbers are created by grouping digits into myriads (every 10,000). This means 40,000 is not "forty thousands" (<span class="strike-through"><ruby>四<rt>yon</rt></ruby><ruby>十<rt>juu</rt></ruby><ruby>千<rt>sen</rt></ruby></span>), but "four ten-thousands" (<ruby>四<rt>yon</rt></ruby><ruby>万<rt>man</rt></ruby>). 100,000 is <ruby>十<rt>juu</rt></ruby><ruby>万<rt>man</rt></ruby>: "ten ten-thousands". Every myriad gets a new unit:

<div class="container full-width" id="myriads">
<div class="number-chain">
<div class="number-unit">
<div class="reading">ichi</div>
<div class="kanji">一</div>
<div class="western" data-full="1">1</div>
</div>
<div class="number-unit">
<div class="reading">man</div>
<div class="kanji">万</div>
<div class="western" data-full="1,0000">10<sup>4</sup></div>
</div>
<div class="number-unit">
<div class="reading">oku</div>
<div class="kanji">億</div>
<div class="western" data-full="1,0000,0000">10<sup>8</sup></div>
</div>
<div class="number-unit">
<div class="reading">chō</div>
<div class="kanji">兆</div>
<div class="western" data-full="1,0000,0000,0000">10<sup>12</sup></div>
</div>
<div class="number-unit">
<div class="reading">kei</div>
<div class="kanji">京</div>
<div class="western" data-full="1,0000,0000,0000,0000">10<sup>16</sup></div>
</div>
<div class="number-unit">
<div class="reading">gai</div>
<div class="kanji">垓</div>
<div class="western" data-full="1,0000,0000,0000,0000,0000">10<sup>20</sup></div>
</div>
<div class="number-unit">
<div class="reading">shi</div>
<div class="kanji">秭</div>
<div class="western" data-full="1,0000,0000,0000,0000,0000,0000">10<sup>24</sup></div>
</div>
<div class="number-unit">
<div class="reading">jō</div>
<div class="kanji">穣</div>
<div class="western" data-full="1,0000,0000,0000,0000,0000,0000,0000">10<sup>28</sup></div>
</div>
<div class="number-unit">
<div class="reading">muryōtaisū</div>
<div class="kanji">無量大数</div>
<div class="western" data-full="1,0000,0000,0000,0000,0000,0000,0000,0000,0000,0000,0000,0000,0000,0000,0000,0000,0000">10<sup>68</sup></div>
</div>
</div>
<div class="note">Note: There are more units between <ruby>穣<rt>jō</rt></ruby> and <ruby>無量大数<rt>muryōtaisū</rt></ruby> (a number with Buddhist origins that translates to "immeasurable large number"). See <a href="https://en.wikipedia.org/wiki/Japanese_numerals#Large_numbers">Japanese numerals (Wikipedia)</a> for the complete list.</div>
</div>

But that's not all. Japanese, like Korean and Chinese, has "counters": nouns added as suffix to numbers. They indicate what that number refers to: books (<ruby>冊<rt>satsu</rt></ruby>), people (<ruby>人<rt>ri/nin</rt></ruby> or <ruby>名<rt>mei</rt></ruby>), machinery (<ruby>台<rt>dai</rt></ruby>), sentences (<ruby>文<rt>bun</rt></ruby>), years of age (<ruby>歳<rt>sai</rt></ruby>), countries (<ruby>箇国<rt>kakoku</rt></ruby>), locations (<ruby>箇所<rt>kasho</rt></ruby>), cans (<ruby>缶<rt>kan</rt></ruby>)…

An example: <span class="number">three</span> is <span class="no-wrap"><ruby class="number">三<rt>san</rt></ruby></span>. <span class="noun">Frog</span> is <span class="no-wrap"><ruby class="noun">カ<rt>ka</rt></ruby><ruby class="noun">エ<rt>e</rt></ruby><ruby class="noun">ル<rt>ru</rt></ruby></span>. You'd think "<span class="number">three</span> <span class="noun">frogs</span>" is <span class="no-wrap"><ruby class="number">三<rt>san</rt></ruby><ruby class="noun">カ<rt>ka</rt></ruby><ruby class="noun">エ<rt>e</rt></ruby><ruby class="noun">ル<rt>ru</rt></ruby></span> or <span class="no-wrap"><ruby class="noun">カ<rt>ka</rt></ruby><ruby class="noun">エ<rt>e</rt></ruby><ruby class="noun">ル<rt>ru</rt></ruby><ruby class="number">三<rt>san</rt></ruby></span>. But that's not right; you're missing the counter (and the possessive <ruby>の<rt>no</rt></ruby>). In this case, we'd use the counter for small animals: <ruby class="counter">匹<rt>hiki</rt></ruby>. "<span class="number">Three</span> <span class="noun">frogs</span>" becomes "<span class="number">three</span> <span class="counter">small-animal</span>'s <span class="noun">frog</span>": <span class="phrase"><ruby class="number">三<rt>san</rt></ruby><ruby class="counter">匹<rt>biki</rt></ruby><ruby>の<rt>no</rt></ruby><ruby class="noun">カ<rt>ka</rt></ruby><ruby class="noun">エ<rt>e</rt></ruby><ruby class="noun">ル<rt>ru</rt></ruby></span>. ("<ruby class="counter">hiki<rt>ひき</rt></ruby>" becomes "<ruby class="counter">biki<rt>びき</rt></ruby>" through <a href="https://en.wikipedia.org/wiki/Rendaku"><ruby>連<rt>ren</rt></ruby><ruby>濁<rt>daku</rt></ruby> or sequential voicing</a>.)

There are [over 300 counters](https://www.tofugu.com/japanese/japanese-counters-list/), though you can get by with a couple dozen.

All that to say: to master Japanese numbers, you need to know the name/writing of all units, be able think in groups of 10,000 instead of 1,000, and know the right counters. That takes practice.

## The idea

I thought: what would the ideal practice system look like? For reading:

- I see a random number, either in Arabic (e.g., 40) or kanji (<ruby>四<rt>yon</rt></ruby><ruby>十<rt>juu</rt></ruby>) numerals, and try to read it. Optionally, with a counter
- Shortly after, I hear the right answer, while seeing the number, reinforcing the association
- Repeat

For listening, I hear a number and try to understand it. The answer is revealed after a few seconds, visually, while I hear the number again.

I did not want to spend more than a few hours on this; I tend to keep adding requirements to my projects, turning weekend projects into multi-month ones. I asked [Claude](https://claude.ai/) 3.5 Sonnet (New) for help creating a web-app using HTML, CSS, and vanilla JavaScript —using frameworks I’m not familiar with would be a time-sink.

The first prototype was decent and supported Arabic numerals, but I wanted more. It was me against my perfectionism. I decided to add support for kanji numerals. I hadn't yet learnt about the 10,000 grouping and the names for the units, so I underestimated how long this would take. I didn’t want to add dependencies, which meant writing the functions myself —or guide Claude into writing them

I wanted to test the `number → kanji` function. Was it getting the right kanji, in the right order, with the right prefix?

## Testing vanilla JavaScript

Manual testing was a hassle. I was tempted to give up on vanilla everything and use [Astro](https://astro.build/), but I asked Claude if there was a way to add tests to my vanilla JavaScript. It came up with this snippet:

```js
if (new URLSearchParams(window.location.search).has("test")) {
  const script = document.createElement("script");
  script.src = "tests.js";
  document.head.appendChild(script);
}
```

With this, visiting the main page with `?test` at the end would run [`tests.js`](https://github.com/welpo/ramu/blob/main/app/tests.js). The results of the (>100) tests would be shown on the browser’s console:

```txt
running kanji conversion tests…
✅ Passed: 0 → 零
✅ Passed: 1 → 一
✅ Passed: 5 → 五
✅ Passed: 1000 → 千
✅ Passed: 2036521801 → 二十億三千六百五十二万千八百一
✅ Passed: 100000000000000000000 → 一垓
✅ Passed: 1e+24 → 一秭
✅ Passed: 1e+68 → 一無量大数
✅ Passed: -1 → -1
✅ Passed: NaN → NaN
```

Pretty neat! Now I could update the main script, reload the browser with the `?test` flag, and see whether the changes fixed the failing tests.

Determining what the expected output should be took a significant amount of time and learning. After some reading and code iterations, all tests were passing.

## Accessibility

The original code was passably accessible: it used semantic HTML. I added:

- Keyboard navigation
- Aria attributes with dynamic updates where needed (e.g. pause button toggle)
- Screen reader compatibility

This last one was hard. First, I needed to decide how to adapt the practice flow for people with vision impairment. I used a big font and strong contrast. For Arabic numerals practice, I added screen reader support through [`aria-live`](https://developer.mozilla.org/docs/Web/Accessibility/ARIA/Attributes/aria-live): updates to a hidden element would be announced by screen readers:

```html
<div
  id="screen-reader-announcement"
  class="visually-hidden"
  aria-live="polite"
  aria-atomic="true">
</div>
```

The app has two modes: reading and listening practice. In reading practice, you’re shown a number for a few seconds. You need to say/think of the Japanese pronunciation before the answer is heard. For screen reader users, I ensured the “reading” part was read aloud, whilst letting the Japanese text-to-speech (TTS) handle the answer part. This is what it sounds like:

<div class="audio-container">
  <audio controls src="/blog/ramu-japanese-numbers-practice-web-app/media/voiceover_demo.mp3" title="Screen reader demo"></audio>
  <span class="audio-note">(the speed of the voices can be adjusted)</span>
</div>

For the “listening” practice, the flow is inverted. In this case, since JavaScript can’t detect screen reader usage, I can’t silence the TTS for the answer. This means the Japanese voice and the answer (in the user’s language) overlap. Since voice-over has priority, it’s louder. While not ideal, it’s usable enough.

## Browser inconsistencies

I expected there would be one (1) way to get the voices from the system, with consistent results across browsers.

Nope. Chrome initialises voices differently than Firefox/Safari. On the same system with two Japanese voices installed, Firefox gets both voices, Chrome gets four voices, and Safari gets one —lower quality— voice (well, two, but they sound identical).

Safari requires user interaction shortly before allowing a TTS utterance, but only on mobile. I worked around this by uttering “<ruby>あ<rt>a</rt></ruby>” at 0 volume right after pressing "start" in reading mode on iOS devices.

### Debugging on mobile

I couldn’t get the Android emulator to find the Japanese voices. Since I had no access to the browser’s console, I asked Claude:

> How can we debug without access to console? Maybe create a div and populate it through appending paragraphs?

It returned code to create a styled div and a function to log to it:

```javascript
const debugPanel = document.createElement('div');
debugPanel.id = 'debug-panel';
debugPanel.style.cssText = 'position: fixed; bottom: 10px; left: 10px; background: rgba(0,0,0,0.8); color: white; padding: 10px; max-height: 200px; overflow-y: auto; font-family: monospace; font-size: 12px; z-index: 9999;';
document.body.appendChild(debugPanel);

function debugLog(message) {
  const time = new Date().toLocaleTimeString();
  const p = document.createElement('p');
  p.style.margin = '2px 0';
  p.textContent = `${time}: ${message}`;
  debugPanel.insertBefore(p, debugPanel.firstChild);
  console.log(`${time}: ${message}`);
}
```

And it updated the TTS initialisation function to log to the debug panel:

{{ dual_theme_image(light_src="media/debug_light.webp", dark_src="media/debug_dark.webp" alt="Debug panel with messages" ) }}

Except I didn’t see this at first. What was going on? Nothing I tried made a difference. The reason: cache. Even though I was forcing a reload on the HTML, the JavaScript file was cached.

## Cache busting

One way to ignore cache is to append a question mark and text/numbers after a URL: `example.com/?hello`.

I was doing this to ensure the HTML was updated, but if the HTML itself contains a plain reference to `app.js`, and that file is cached, you’re out of luck.

The solution is to bust the cache by appending the [file hash](https://simple.wikipedia.org/wiki/Cryptographic_hash_function) —or part of it— to the URL you’re loading:

```diff
- <script src="/app.js" defer></script>
+ <script src="/app.js?h=0158eccd" defer></script>
```

If I used Astro or a similar framework, this would not be an issue. Not wanting to complicate things, I updated the [pre-commit hook](https://github.com/welpo/ramu/blob/main/.githooks/pre-commit) —a script that runs every time I commit changes. It checks if I've modified a file that needs to be cache busted. If so, it updates the hash in the HTML and includes the changes in the commit.

Easy! And without any dependencies.

## Progressive Web App

I wanted the app to work offline. All processing is done locally, including the voice generation; the only problem would be accessing the URL in an area without connectivity.

The solution: turning it into a Progressive Web App (PWA). This makes it possibel to install the app operate offline, using the whole screen. PWAs feel like a proper app.

Being unfamiliar with their implementation, I used the [Microsoft documentation on PWAs](https://learn.microsoft.com/microsoft-edge/progressive-web-apps-chromium/how-to/) and Claude’s help to turn my HTML+CSS+JS into a PWA.

This didn’t take long. The main hurdle was testing whether the PWA worked correctly without deploying it. Python’s HTTP server (`python3 -m http.server`) was not enough, but [`http-server`](https://www.npmjs.com/package/http-server) with local OpenSSL keys worked.

### Respectful user prompts

I dislike when, shortly after I visit a website for the first time, I’m interrupted with a prompt: “Please subscribe to our newsletter” or “Can we show you notifications?”. No.

I wanted users to know they could install the PWA, as I don’t think it’s a popular technology. My first idea was “wait two seconds after first visit on iOS” (Chrome suggests PWA installation by default, and I don’t think it makes much sense to suggest an install on non-mobile devices). This felt too aggressive: the user hasn’t even tested the app. It may not even work on their device! (It should, though.)

I settled for “show the prompt to iOS users after they complete their session”. It’s a small prompt with simple instructions:

<div id="pwa-prompt">
{{ dual_theme_image(light_src="media/pwa_prompt_light.webp", dark_src="media/pwa_prompt_dark.webp", alt="Prompt to install the PWA") }}
</div>

To make it easier to dismiss, I added padding to the close button for a larger click target (visually offset by a negative margin). If the prompt is dismissed, it's never shown again.

---

A majority of the time was spent figuring out browser inconsistencies, accessibility, and the number-to-kanji function. Other than that, I worked on styling, responsiveness (made it look good at various resolutions), logo creation, documentation, and error catching. For example, if the script can’t find a Japanese voice, it shows a warning with a clear explanation of what went wrong, including OS-specific steps on how to install a voice.

My goal was to finish this project in an afternoon, including this write-up. I did not succeed. In the end, I spent a few hours —not a few months!— spread over less than a week. Not bad! Though I was tempted to add multiple modes (specific month practice or reading the time), I exercised restraint.

I’m calling this a victory. I learnt about Japanese numerals, PWAs, accessibility, testing vanilla JS, browser API details… and I got a cute, responsive, fun —as fun as these drills can be—, and useful little web app!

Want to try it? [Here’s the link](https://ramu.osc.garden). The [source code is on GitHub](https://github.com/welpo/ramu). <ruby>がんばってください！</ruby>
