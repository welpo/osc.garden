+++
title = "Vaig arreglar el meu horari de son amb codi"
date = 2025-02-02
description = "Vaig copiar la interfície/experiència d'usuari d'Apple per ajustar gradualment el meu horari de son mentre gestionava totes les peculiaritats de zones horàries al món (inclosa aquella illa amb un horari d'estiu de 30 minuts)."
[taxonomies]
tags = ["codi", "javascript", "web app", "son"]

[extra]
stylesheets = ["/css/nemui.css"]
social_media_card = "img/social_cards/blog_ca_nemui_sleep_schedule_web_app.jpg"
+++

Fa poc vaig haver de canviar el meu horari de son per despertar-me més d'hora. En el passat, havia fet el canvi de manera sobtada (i vaig patir-ne les conseqüències).

La ciència del son recomana ajustar l'horari de manera gradual. Com que tenia una data límit per adoptar el nou horari, vaig crear [nemui](https://nemui.osc.garden/), una app per planificar una transició progressiva.

## La interfície i l'experiència d'usuari

Programo el meu son a través de l'app Salut d'iOS. Em permet establir una meta de son (les hores que necessito dormir), l'hora d'anar a dormir i l'hora de despertar-me.

Vaig voler replicar la interfície d'Apple: té un bon disseny i experiència d'usuari, hi estic acostumat, i m'agradava el repte. Això em va portar el 60% del temps dedicat al projecte.

Aquí tens el resultat. Prova de jugar-hi:

<div class="nemui-container" id="clockContainer">
<!-- Sleep Duration Input -->
<div class="sleep-goal">
<label>I want to sleep for</label>
<div class="goal-inputs">
<div class="input-group">
<input type="number" id="goalHours" min="4" max="12" value="8" inputmode="numeric" pattern="[0-9]*" class="time-input">
<span>hr</span>
</div>
<div class="input-group">
<input type="number" id="goalMinutes" min="0" max="59" value="0" step="10" inputmode="numeric" pattern="[0-9]*" class="time-input">
<span>min</span>
</div>
</div>
</div>

<!-- Clock Component -->
<div class="clock-wrapper">
<div class="time-display">
<div class="time-section">
<div class="time-label">
<span class="icon bed-icon"></span>
BEDTIME
</div>
<input type="time" class="time-value" id="sleepTime" aria-label="Bedtime"/>
</div>
<div class="time-section">
<div class="time-label">
<span class="icon alarm-icon"></span>
WAKE UP
</div>
<input type="time" class="time-value" id="wakeTime" aria-label="Wake up time"/>
</div>
</div>

<div class="outer-container" aria-hidden="true">
<div class="clock-container">
<div class="clock-face">
<div class="symbol stars">
<span class="icon stars-icon"></span>
</div>
<div class="symbol sun">
<span class="icon sun-icon"></span>
</div>
</div>
</div>

<svg class="arc-layer" viewBox="0 0 450 450">
<circle class="background-ring" cx="50%" cy="50%" r="42%" fill="none" stroke="currentColor" stroke-width="15%" />
<path class="sleep-arc" d="" />
<path class="arc-ticks" d="" />
</svg>

<div class="handles-layer">
<div class="handle sleep">
<span class="icon bed-icon"></span>
</div>
<div class="handle wake">
<span class="icon alarm-icon"></span>
</div>
</div>
</div>

<div class="sleep-info">
<div class="total-sleep"></div>
<div id="goalStatus" class="goal-status"></div>
</div>
</div>
</div>
<script defer src="js/clock.js?h=1a4a5e71"></script>

No es pixel perfect, pero es casi idéntica a la de Apple. De hecho, ¡es mejor! Puedes hacer click en la hora de dormir y despertar para introducir el número directamente, algo que no puedes hacer en iOS.

Una vez que hayas configurado los horarios actuales y deseados, necesitas elegir la fecha objetivo. La app sugiere un día basado en datos de investigación sobre el sueño (15 minutos de cambio por día), pero puedes modificarlo. Verás una advertencia si el cambio es muy agresivo:

{{ dual_theme_image(light_src="img/warning-light.webp", dark_src="img/warning-dark.webp" alt="Advertencia cuando el cambio es de muchos minutos por día") }}

Finalmente, obtienes el plan diario:

{{ dual_theme_image(light_src="img/plan-light.webp", dark_src="img/plan-dark.webp" alt="Plan diario del horario de sueño") }}

Al hacer clic en «Add to calendar» se descarga un archivo de Calendario (.ics) con un evento por día. Estos eventos muestran la hora de dormir y despertar de cada día e incluyen un recordatorio 30 minutos antes de acostarte.

Si vuelves a visitar la web, te mostrará el plan para las próximas noches (todos los datos se guardan localmente).

Le puse el nombre «nemui»: <ruby>眠<rt>nemu</rt></ruby> (dormir) y <ruby>移<rt>i</rt></ruby> (transición), que se lee como <ruby>眠い<rt>nemui</rt></ruby> (somnoliento) en japonés.

Estaba a punto de dar por terminado el proyecto cuando me acordé del horario de verano (DST).

## Horario de verano

Más de un tercio de los países del mundo usa el horario de verano. **Tenía** que darle soporte, dijo mi perfeccionismo.

Y escuché.

nemui tiene soporte para el horario de verano de dos formas. Primero, si estás ajustando tu horario durante un cambio de hora, te avisa y ajusta las horas:

{{ dual_theme_image(light_src="img/transition-light.gif", dark_src="img/transition-dark.gif" alt="Aviso al cruzar el cambio de hora") }}

Segundo —y este es mi favorito—, unos días antes de que empiece el horario de verano, puedes configurar horarios actuales e ideales idénticos para ajustar gradualmente el tiempo (te irás a dormir y despertarás un poco más temprano cada día) y evitar perder una hora de sueño de golpe.

{% aside(position="right") %}
¿Lo sabías? La transición al horario de verano aumenta las [tasas de suicidio](https://doi.org/10.1111/j.1479-8425.2007.00331.x), y el riesgo de [ataques cardíacos](https://www.nejm.org/doi/full/10.1056/NEJMc0807104) y [accidentes de tráfico fatales](https://www.cell.com/current-biology/fulltext/S0960-9822(19)31678-1).
{% end %}

Donar suport a l'horari d'estiu no va ser fàcil.

Primer, JavaScript vanilla no és gaire bo amb les dates. No suporta zones horàries i «els càlculs amb l'horari d'estiu són notòriament difícils de gestionar» ([Temporal](https://developer.mozilla.org/blog/javascript-temporal-is-coming/) ajudarà amb això).

Segon, l'horari d'estiu és estrany.

Els països comencen/acaben l'horari d'estiu el primer, segon o últim diumenge d'un mes donat, o l'últim dijous/divendres. O el divendres abans de l'últim diumenge.

Naturalment, l'hora de transició també varia: pot ser a les 00:00, 01, 02, 03... Fins i tot a les 24:00! (gràcies, Xile!)

I hi ha més! Potser creies que totes les regions avancen/endarrereixen una (1) hora, oi? Doncs no.

Hi ha un grup d'illes entre Austràlia i Nova Zelanda, anomenades [Illa Lord Howe](https://en.wikipedia.org/wiki/Lord_Howe_Island), amb transicions de 30 minuts. Així és. El primer diumenge d'abril a les 02:00, els rellotges es retarden a la 01:30. El canvi es reverteix el 5 d'octubre.

Tot i que menys de 400 persones hi viuen, em vaig assegurar que la meva app fos compatible amb aquest canvi. **Havia** de fer-ho.

## El veredicte

M'alegra informar que he aconseguit ajustar el meu horari de manera indolora. El meu cos es va adaptar al nou horari, a diferència de les vegades que ho vaig fer de cop. Penso fer servir [nemui](https://nemui.osc.garden/) de nou quan s'acosti el canvi a l'horari d'estiu.

---

## Extra: mini-projecte

Abans de crear nemui, vaig fer una petita aplicació web per veure quan és el proper canvi d'hora (inspirada per un [artefacte de Claude creat per Simon Willison](https://tools.simonwillison.net/california-clock-change)), basada en la zona horària del teu dispositiu. Aquí tens una captura de pantalla:

<a href="https://dst.osc.garden">
{{ dual_theme_image(light_src="img/dst-light.webp", dark_src="img/dst-dark.webp" alt="Captura de pantalla del proper canvi d'hora") }}
</a>

Visita [dst.osc.garden](https://dst.osc.garden/) per veure quan és el proper canvi d'hora a la teva zona horària.
