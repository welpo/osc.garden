+++
title = "Arreglé mi horario de sueño con código"
date = 2025-02-02
description = "Copié la interfaz/experiencia de usuario de Apple para ajustar gradualmente mi horario de sueño mientras manejaba todas las peculiaridades de zonas horarias en el mundo (incluida esa isla con un horario de verano de 30 minutos)."
[taxonomies]
tags = ["código", "javascript", "web app", "sueño"]

[extra]
stylesheets = ["/css/nemui.css"]
social_media_card = "img/social_cards/blog_es_nemui_sleep_schedule_web_app.jpg"
+++

Hace poco tuve que cambiar mi horario de sueño para despertarme más temprano. En el pasado, había hecho el cambio de forma repentina (y sufrí las consecuencias).

La ciencia del sueño recomienda ajustar el horario de forma gradual. Como tenía una fecha límite para adoptar el nuevo horario, creé [nemui](https://nemui.osc.garden/), una app para planear una transición progresiva.

## La interfaz y la experiencia de usuario

Programo mi sueño a través de la app Salud de iOS. Me permite establecer una meta de sueño (las horas que necesito dormir), la hora de acostarme y la hora de despertar.

Quise replicar la interfaz de Apple: tiene un buen diseño y experiencia de usuario, estoy acostumbrado a ella, y me gustaba el desafío. Esto me llevó el 60% del tiempo dedicado al proyecto.

Aquí está el resultado. Prueba a jugar:

<div class="container" id="clockContainer">
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

Dar soporte al horario de verano no fue fácil.

Primero, JavaScript vanilla no es muy bueno con las fechas. No soporta zonas horarias y «los cálculos con el horario de verano son notoriamente difíciles de manejar» ([Temporal](https://developer.mozilla.org/blog/javascript-temporal-is-coming/) ayudará con esto).

Segundo, el horario de verano es raro.

Los países empiezan/terminan el horario de verano el primer, segundo o último domingo de un mes dado, o el último jueves/viernes. O el viernes antes del último domingo.

Naturalmente, la hora de transición también varía: puede ser a las 00:00, 01, 02, 03... ¡Incluso a las 24:00! (¡gracias, Chile!)

¡Y hay más! Quizás creías que todas las regiones adelantan/retrasan una (1) hora, ¿verdad? Pues no.

Hay un grupo de islas entre Australia y Nueva Zelanda, llamadas [Isla Lord Howe](https://en.wikipedia.org/wiki/Lord_Howe_Island), con transiciones de 30 minutos. Así es. El primer domingo de abril a las 02:00, los relojes se atrasan a la 01:30. El cambio se revierte el 5 de octubre.

Aunque menos de 400 personas viven allí, me aseguré de que mi app fuera compatible con este cambio. **Tenía** que hacerlo.

## El veredicto

Me alegra informar que he logrado ajustar mi horario de forma indolora. Mi cuerpo se adaptó al nuevo horario, a diferencia de las veces que lo hice de golpe. Planeo usar [nemui](https://nemui.osc.garden/) de nuevo cuando se acerque el cambio al horario de verano.

---

## Extra: mini-proyecto

Antes de crear nemui, hice una pequeña aplicación web para ver cuándo es el próximo cambio de hora (inspirada por un [artefacto de Claude creado por Simon Willison](https://tools.simonwillison.net/california-clock-change)), basada en la zona horaria de tu dispositivo. Aquí tienes una captura de pantalla:

<a href="https://dst.osc.garden">
{{ dual_theme_image(light_src="img/dst-light.webp", dark_src="img/dst-dark.webp" alt="Pantallazo del próximo cambio de hora") }}
</a>

Visita [dst.osc.garden](https://dst.osc.garden/) para ver cuándo es el próximo cambio de hora en tu zona horaria.
