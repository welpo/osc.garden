+++
title = "I Fixed My Sleep Schedule With Code"
date = 2025-02-02
description = "I copied Apple's UI/UX to gradually adjust my sleep schedule while handling every time zone quirk in the world (including that one island with 30-minute DST)."
[taxonomies]
tags = ["code", "javascript", "web app", "sleep"]

[extra]
stylesheets = ["/css/nemui.css"]
social_media_card = "img/social_cards/blog_nemui_sleep_schedule_web_app.jpg"
+++

Recently I had to shift my sleep schedule to wake up earlier. In the past, I did this abruptly (and suffered the consequences).

Sleep science recommends slowly shifting one’s sleep schedule. I had a deadline to adopt the new schedule, so I created [nemui](https://nemui.osc.garden/), an app to plan a progressive transition.

## The interface and user experience

I schedule my sleep through the iOS Health app. It allows me to set a sleep goal (hours of sleep I need), bedtime and wake up hours. It looks like this:

{{ dual_theme_image(light_src="img/apple-light.webp", dark_src="img/apple-dark.webp" alt="Apple Health Sleep interface") }}

I wanted to replicate the UI: it’s a good design and user experience, I’m used to it, and I liked the challenge.

This took 60% of the time spent on the project. Here, have fun dragging the handles around:

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

It’s not pixel perfect, but it’s almost identical to Apple’s. In fact, it’s better! You can click/tap on the bedtime and wake up time to enter the number directly, something you can’t do on iOS.

Once you’ve set the current and desired schedules, you need to choose the target date. It suggests a day based on sleep research data (15 min shift per day), but you can change it. You’ll see a warning if the change is too aggressive:

{{ dual_theme_image(light_src="img/warning-light.webp", dark_src="img/warning-dark.webp" alt="Warning when shifting too many minutes per day") }}

Finally, you get the daily plan:

{{ dual_theme_image(light_src="img/plan-light.webp", dark_src="img/plan-dark.webp" alt="Daily sleep schedule plan") }}

Clicking on “Add to calendar” downloads a Calendar (.ics) file with one event per day. These events show when to sleep and wake up each day, and include a reminder 30 minutes before bedtime to start winding down.

If you revisit the site, it’ll show you the plan for the upcoming nights (all data is stored locally).

I named it nemui: <ruby>眠<rt>nemu</rt></ruby> (sleep) and <ruby>移<rt>i</rt></ruby> (transition), reading as <ruby>眠い<rt>nemui</rt></ruby> (sleepy) in Japanese.

I was about to consider the project done when I remembered about Daylight saving time (DST).

## Daylight saving time

More than a third of the world’s countries use DST. I **had** to support it, said my perfectionism.

And I listened.

nemui supports DST for two use cases. First, if you’re adjusting your schedule through a DST change, it warns you and adjusts the times:

{{ dual_theme_image(light_src="img/transition-light.gif", dark_src="img/transition-dark.gif" alt="Warning crossing DST") }}

Second—and this is my favourite—, a few days before DST starts, you can set identical current and desired schedules to slowly adjust the timing (you’ll go to bed and wake up a bit earlier every day) and avoid abruptly losing an hour of sleep.

{% aside(position="right") %}
Did you know? The transition into DST increases [suicide rates](https://doi.org/10.1111/j.1479-8425.2007.00331.x), and the risk of [heart attacks](https://www.nejm.org/doi/full/10.1056/NEJMc0807104) and [fatal traffic accidents](https://www.cell.com/current-biology/fulltext/S0960-9822(19)31678-1).
{% end %}

Supporting DST was not easy.

First, vanilla JavaScript is not great with dates. It doesn't support timezones and "calculations across DST are notoriously difficult to work with" ([Temporal](https://developer.mozilla.org/blog/javascript-temporal-is-coming/) can't come soon enough!).

Second, DST is weird.

Countries start/end DST on the first, second, or last Sunday of a given month, or the last Thursday/Friday. Or the Friday before the last Sunday.

Naturally, the hour of transition varies too: it can be at 00:00, 01, 02, 03… Even at 24:00! (thanks, Chile!)

And there’s one more thing! You’d think all regions shift by an hour, right? Wrong.

There’s a group of islands between Australia and New Zealand, called [Lord Howe Island](https://en.wikipedia.org/wiki/Lord_Howe_Island), with 30-minute DST transitions. That’s right. On the first Sunday of April at 02:00, clocks will be turned backwards to 01:30. And the change will be reversed on the 5th of October.

Even though fewer than 400 people live there, I made sure my app is compatible with this shift. I **had** to.

## The verdict

I’m happy to report that my schedule was smoothly and almost painlessly shifted. My body successfully adapted to the new schedule, unlike the times I did this abruptly. I plan on using [nemui](https://nemui.osc.garden/) again when DST start approaches.

---

## Extra: mini-project

Before creating nemui, I made a little web-app to check when the next DST change is (inspired by a [Claude artifact created by Simon Willison](https://tools.simonwillison.net/california-clock-change)), based on your device timezone. Here’s a screenshot:

<a href="https://dst.osc.garden">
{{ dual_theme_image(light_src="img/dst-light.webp", dark_src="img/dst-dark.webp" alt="Apple Health Sleep interface") }}
</a>

Visit [dst.osc.garden](https://dst.osc.garden/) to see when the next DST change is in your timezone.
