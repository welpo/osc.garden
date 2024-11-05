+++
title = "Creant una aplicació web progressiva per practicar nombres japonesos"
date = 2024-11-05
description = "He desenvolupat una aplicació web per practicar els nombres en japonès. Durant el procés, vaig aprendre com testejar JavaScript vanilla, crear PWAs, accessibilitat, inconsistències entre navegadors i l'eliminació automàtica de memòria cau sense frameworks."

[taxonomies]
tags = ["codi", "japonès", "lingüística", "javascript"]

[extra]
copy_button = true
stylesheets = ["blog/ramu-japanese-numbers-practice-web-app/css/styles.css"]
tldr = "He desenvolupat [<ruby>ラ<rt>ra</rt>ム<rt>mu</rt></ruby>, una aplicació web](https://ramu.osc.garden) per practicar els nombres en japonès. Descobreixo inconsistències entre navegadors, com testejar JavaScript vanilla i com crear una aplicació web progressiva. [Repositori](https://github.com/welpo/ramu) i [vídeo demo](https://github.com/welpo/ramu?tab=readme-ov-file#demo)."
social_media_card = "img/social_cards/ca_blog_ramu_japanese_numbers_practice_webapp.jpg"
+++

<details>
    <summary>Taula de contingut</summary>
    <!-- toc -->
</details>

Els nombres van ser una de les primeres coses que vaig aprendre en japonès. Aprendre a comptar de l'u al deu no és difícil. Si saps comptar de l'1 al 10, saps comptar de l'1 al 99: dius quantes desenes hi ha i després la unitat. Per exemple, quaranta-dos és «<ruby>quatre<rt>四</rt></ruby> <ruby>deu<rt>十</rt></ruby> <ruby>dos<rt>二</rt></ruby>»: <ruby>四<rt>yon</rt></ruby><ruby>十<rt>juu</rt></ruby><ruby>二<rt>ni</rt></ruby>.

Més enllà del 99, necessites aprendre el nom per a 100 (<ruby>百<rt>hyaku</rt></ruby>), 1.000 (<ruby>千<rt>sen</rt></ruby>) i 10.000 (<ruby>万<rt>man</rt></ruby>). Després de 10.000, els nombres es creen agrupant dígits en miríades (cada 10.000). Això significa que 40.000 no és «quaranta mils» (<span class="strike-through"><ruby>四<rt>yon</rt></ruby><ruby>十<rt>juu</rt></ruby><ruby>千<rt>sen</rt></ruby></span>), sinó «quatre deu-mils» (<ruby>四<rt>yon</rt></ruby><ruby>万<rt>man</rt></ruby>). 100.000 és <ruby>十<rt>juu</rt></ruby><ruby>万<rt>man</rt></ruby>: «deu deu-mils». Cada miríada té una nova unitat:

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
<div class="note">Nota: Hi ha més unitats entre <ruby>穣<rt>jō</rt></ruby> i <ruby>無量大数<rt>muryōtaisū</rt></ruby> (un nombre amb orígens budistes que es tradueix com a «nombre immensurable»). Consulta <a href="https://ca.wikipedia.org/wiki/Numeraci%C3%B3_japonesa#Pot%C3%A8ncies_de_10">Numeració japonesa (Viquipèdia)</a> per veure la llista completa.</div>
</div>

Però això no és tot. El japonès, igual que el coreà i el xinès, té «comptadors»: substantius que s'afegeixen com a sufix als nombres. Indiquen a què es refereix aquest nombre: llibres (<ruby>冊<rt>satsu</rt></ruby>), persones (<ruby>人<rt>ri/nin</rt></ruby> o <ruby>名<rt>mei</rt></ruby>), maquinària (<ruby>台<rt>dai</rt></ruby>), oracions (<ruby>文<rt>bun</rt></ruby>), anys d'edat (<ruby>歳<rt>sai</rt></ruby>), països (<ruby>箇国<rt>kakoku</rt></ruby>), ubicacions (<ruby>箇所<rt>kasho</rt></ruby>), llaunes (<ruby>缶<rt>kan</rt></ruby>)…

Un exemple: <span class="number">tres</span> és <span class="no-wrap"><ruby class="number">三<rt>san</rt></ruby></span>. <span class="noun">Granota</span> és <span class="no-wrap"><ruby class="noun">カ<rt>ka</rt></ruby><ruby class="noun">エ<rt>e</rt></ruby><ruby class="noun">ル<rt>ru</rt></ruby></span>. Podries pensar que «<span class="number">tres</span> <span class="noun">granotes</span>» és <span class="no-wrap"><ruby class="number">三<rt>san</rt></ruby><ruby class="noun">カ<rt>ka</rt></ruby><ruby class="noun">エ<rt>e</rt></ruby><ruby class="noun">ル<rt>ru</rt></ruby></span> o <span class="no-wrap"><ruby class="noun">カ<rt>ka</rt></ruby><ruby class="noun">エ<rt>e</rt></ruby><ruby class="noun">ル<rt>ru</rt></ruby><ruby class="number">三<rt>san</rt></ruby></span>. Però no; falta el comptador (i el possessiu <ruby>の<rt>no</rt></ruby>). En aquest cas, faríem servir el comptador per a animals petits: <ruby class="counter">匹<rt>hiki</rt></ruby>. «<span class="number">Tres</span> <span class="noun">granotes</span>» es converteix en «<span class="number">tres</span> <span class="counter">animal-petit</span> de <span class="noun">granota</span>»: <span class="phrase"><ruby class="number">三<rt>san</rt></ruby><ruby class="counter">匹<rt>biki</rt></ruby><ruby>の<rt>no</rt></ruby><ruby class="noun">カ<rt>ka</rt></ruby><ruby class="noun">エ<rt>e</rt></ruby><ruby class="noun">ル<rt>ru</rt></ruby></span>. («<ruby class="counter">hiki<rt>ひき</rt></ruby>» es converteix en «<ruby class="counter">biki<rt>びき</rt></ruby>» mitjançant <a href="https://es.wikipedia.org/wiki/Rendaku"><ruby>連<rt>ren</rt></ruby><ruby>濁<rt>daku</rt></ruby> o sonorització seqüencial</a>.)

Hi ha [més de 300 comptadors](https://www.tofugu.com/japanese/japanese-counters-list/), però te'n pots ensortir amb un parell de dotzenes.

En resum: per dominar els nombres en japonès, necessites conèixer el nom i l'escriptura de les unitats, ser capaç de pensar en grups de 10.000 en lloc de 1.000, i conèixer els comptadors. Això requereix pràctica.

## La idea

Em vaig preguntar: com seria el sistema de pràctica ideal? Per a la comprensió lectora:

- Veig un nombre aleatori, ja sigui en números aràbics (per exemple, 40) o kanji (<ruby>四<rt>yon</rt></ruby><ruby>十<rt>juu</rt></ruby>), i intento llegir-lo. Opcionalment, amb un comptador
- Poc després, escolto la resposta correcta mentre veig el nombre, reforçant l'associació
- Repetir

Per a la comprensió oral, escolto un nombre i intento entendre'l. La resposta es revela després d'uns segons, visualment, mentre torno a escoltar el nombre.

La intenció era dedicar unes poques hores al projecte; tendeixo a afegir requisits, convertint projectes de cap de setmana en projectes de diversos mesos. Vaig demanar ajuda a [Claude](https://claude.ai/) 3.5 Sonnet (New) per crear una aplicació web utilitzant HTML, CSS i JavaScript vanilla —fer servir frameworks amb els quals no estic familiaritzat seria una pèrdua de temps.

El primer prototip era decent i funcionava amb números aràbics, però volia més. Jo contra el meu perfeccionisme. Vaig decidir afegir suport per a nombres en kanji. No volia afegir dependències, cosa que significava escriure les funcions jo mateix —o guiar a Claude perquè les escrivís. Com encara no havia après sobre l'agrupació en 10.000 i els noms de les unitats, vaig subestimar quant de temps portaria.

Volia provar la funció `nombre → kanji`. Estava generant els kanji correctes, en l'ordre correcte, amb el prefix correcte?

## Testejant JavaScript vanilla

Les proves manuals eren incòmodes. Estava temptat d'abandonar tot el vanilla i fer servir [Astro](https://astro.build/), però vaig preguntar a Claude si hi havia alguna manera d'afegir proves al meu JavaScript vanilla. Se li va acudir aquest fragment:

```js
if (new URLSearchParams(window.location.search).has("test")) {
  const script = document.createElement("script");
  script.src = "tests.js";
  document.head.appendChild(script);
}
```

Ara, en visitar la pàgina principal amb `?test` al final, s'executa [`tests.js`](https://github.com/welpo/ramu/blob/main/app/tests.js). Els resultats dels (>100) tests es mostren en la consola del navegador:

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

Genial! Ara podia actualitzar l'script principal, recarregar el navegador amb `?test` a l'URL, i veure si els canvis arreglaven els tests que no passaven.

Determinar quin hauria de ser el resultat esperat va requerir força temps i aprenentatge. Després d'algunes lectures i iteracions de codi, totes les proves passaven correctament.

## Accessibilitat

El codi original era acceptablement accessible: emprava HTML semàntic. Vaig afegir:

- Navegació per teclat
- Atributs Aria amb actualitzacions dinàmiques on era necessari (per exemple, alternança del botó de pausa)
- Compatibilitat amb lectors de pantalla

Aquest últim va ser difícil. Primer, necessitava decidir com adaptar el flux de pràctica per a persones amb discapacitat visual. Vaig fer servir una font gran i un contrast fort. Per a la pràctica amb números aràbics, vaig afegir suport per a lector de pantalla a través de [`aria-live`](https://developer.mozilla.org/docs/Web/Accessibility/ARIA/Attributes/aria-live): les actualitzacions en un element ocult serien anunciades pels lectors de pantalla:

```html
<div
  id="screen-reader-announcement"
  class="visually-hidden"
  aria-live="polite"
  aria-atomic="true">
</div>
```

L'aplicació té dos modes: pràctica de lectura i d'escolta. En la pràctica de lectura, es mostra un nombre durant uns segons. Has de dir/pensar la pronunciació en japonès abans d'escoltar la resposta. Per a usuaris de lector de pantalla, em vaig assegurar que la part de «lectura» es llegís en veu alta, mentre deixava que el text a veu (TTS) japonès s'encarregués de la part de la resposta:

<div class="audio-container">
 <audio controls src="/blog/ramu-japanese-numbers-practice-web-app/media/voiceover_demo.mp3" title="Demo de voiceover"></audio>
 <span class="audio-note">(la velocitat de les veus es pot ajustar)</span>
</div>

Per a la pràctica d'«escolta», el flux s'inverteix. En aquest cas, com que JavaScript no pot detectar l'ús de lectors de pantalla, no puc silenciar el TTS per a la resposta. Això significa que la veu japonesa i la resposta (en l'idioma de l'usuari) se superposen. Com que el lector de pantalla té prioritat, sona més fort. Tot i que no és ideal, és acceptable.

## Inconsistències entre navegadors

Esperava que hi hagués una (1) manera d'obtenir les veus del sistema, amb resultats consistents entre navegadors.

No va ser així. Chrome inicialitza les veus de manera diferent a Firefox/Safari. En el mateix sistema amb dues veus japoneses instal·lades, Firefox obté ambdues veus, Chrome n'obté quatre, i Safari n'obté una —de menor qualitat— (bé, dues, però sonen idèntiques).

Safari requereix interacció de l'usuari poc abans de permetre una emissió TTS, però només en mòbils. Vaig solucionar això emetent «<ruby>あ<rt>a</rt></ruby>» a volum 0 just després de prémer «inici» en mode lectura en dispositius iOS.

### Depuració en mòbil

No aconseguia que l'emulador d'Android detectés les veus japoneses. Com que no tenia accés a la consola del navegador, vaig preguntar a Claude:

{{ multilingual_quote(original="How can we debug without access to console? Maybe create a div and populate it through appending paragraphs?", translated="Com podem depurar sense accés a la consola? Potser creant un div i afegint-hi paràgrafs?") }}

Em va retornar codi per crear un div amb estils i una funció per escriure-hi:

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

I va actualitzar la funció d'inicialització de TTS per registrar al tauler de depuració:

{{ dual_theme_image(light_src="media/debug_light.webp", dark_src="media/debug_dark.webp" alt="Tauler de depuració amb missatges" ) }}

Però al principi no veia això. Què estava passant? Res del que intentava tenia efecte. La raó: la memòria cau. Tot i que estava forçant la recàrrega de l'HTML, l'arxiu JavaScript estava a la memòria cau.

## Eliminació de la memòria cau

Una manera d'ignorar la memòria cau és afegir un signe d'interrogació i text/números després d'una URL: `example.com/?hola`.

Estava fent això per assegurar-me que l'HTML s'actualitzés, però si l'HTML en si conté una referència directa a `app.js`, i aquest arxiu està a la memòria cau… bona sort.

La solució és evitar la memòria cau afegint el [hash de l'arxiu](https://ca.wikipedia.org/wiki/Funci%C3%B3_hash_criptogr%C3%A0fica) —o part d'aquest— a la URL que estàs carregant:

```diff
- <script src="/app.js" defer></script>
+ <script src="/app.js?h=0158eccd" defer></script>
```

Si hagués fet servir Astro o un altre framework similar, això no seria un problema. No volent complicar les coses, vaig actualitzar el [pre-commit hook](https://github.com/welpo/ramu/blob/main/.githooks/pre-commit) —un script que s'executa cada cop que faig canvis en un commit. El hook comprova si he modificat un arxiu que necessita trencar la memòria cau. Si és així, actualitza el hash a l'HTML i inclou els canvis al commit.

Fàcil! I sense dependències.

## Aplicació web progressiva

Volia que l'aplicació funcionés sense connexió. Tot el processament es realitza localment, incloent la generació de veu; l'únic problema seria accedir a l'URL en una zona sense connectivitat.

La solució: convertir-la en una aplicació web progressiva (PWA). Això permet instal·lar l'app i utilitzar-la sense connexió, aprofitant tota la pantalla. Les PWAs se senten com una aplicació nativa.

Com que no estava familiaritzat amb la seva implementació, vaig utilitzar la [documentació de Microsoft sobre PWAs](https://learn.microsoft.com/microsoft-edge/progressive-web-apps-chromium/how-to/) i l'ajuda de Claude per convertir el meu HTML+CSS+JS en una PWA.

No va portar gaire temps. El principal obstacle va ser provar si la PWA funcionava correctament sense fer el desplegament. El servidor HTTP de Python (`python3 -m http.server`) no va ser suficient, però [`http-server`](https://www.npmjs.com/package/http-server) amb claus locals OpenSSL va funcionar.

### Avisos respectuosos amb l'usuari

És incòmode quan, moments després de visitar un web per primera vegada, m'interrompen amb: «Subscriu-te al nostre butlletí» o «Podem mostrar-te notificacions?». No.

Volia que els usuaris sabessin que podien instal·lar la PWA, ja que no crec que sigui una tecnologia gaire coneguda. La meva primera idea va ser «esperar dos segons després de la primera visita a iOS» (Chrome suggereix la instal·lació de PWA per defecte, i no crec que tingui gaire sentit suggerir una instal·lació en dispositius no mòbils). Però em va semblar massa agressiu: ni tan sols han provat l'aplicació. Pot ser que no funcioni al seu dispositiu! (Tot i que hauria de funcionar.)

Em vaig decidir per «mostrar l'avís als usuaris d'iOS després que completin la seva sessió». És un petit avís amb instruccions senzilles:

<div id="pwa-prompt">
{{ dual_theme_image(light_src="media/pwa_prompt_light.webp", dark_src="media/pwa_prompt_dark.webp", alt="Avís per instal·lar la PWA") }}
</div>

Perquè fos fàcil tancar-lo, vaig afegir padding al botó `x`, obtenint una àrea de clic més gran (compensat visualment amb un marge negatiu). Si l'usuari tanca l'avís, no es torna a mostrar.

---

La major part del temps la vaig dedicar a resoldre inconsistències entre navegadors, accessibilitat i la funció de conversió de nombres a kanji. A més d'això, vaig treballar en el disseny (incloent que es veiés bé independentment de la resolució), la creació del logotip, la documentació i la gestió d'errors. Per exemple, si l'script no troba una veu japonesa, mostra una alerta amb una explicació clara del que ha fallat, incloent els passos per instal·lar una veu en funció del sistema operatiu.

El meu objectiu era acabar aquest projecte en una tarda, incloent aquest article. No ho vaig aconseguir. Finalment, vaig dedicar unes quantes hores —en comptes d'uns quants mesos— distribuïdes en menys d'una setmana. No està malament! Tot i que vaig estar temptat d'afegir múltiples modes (pràctica de mesos específics o lectura de l'hora), em vaig contenir.

Ho considero una victòria. He après sobre el sistema de numeració japonès, PWAs, accessibilitat, testejar JS vanilla, detalls d'API de navegador… i he creat una petita web app, bonica, divertida —tan divertida com permet el tema— i útil!

Vols provar-la? [Aquí tens l'enllaç](https://ramu.osc.garden). El [codi font és a GitHub](https://github.com/welpo/ramu). <ruby>がんばってください！</ruby>
