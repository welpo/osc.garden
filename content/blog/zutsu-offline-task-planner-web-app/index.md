+++
title = "Building a Minimal Time Management Web App"
date = 2024-12-04
description = "I built a local-first web app to plan my study sessions. Featuring utilities like past activity visualisation or a pomodoro timer."
[taxonomies]
tags = ["code", "javascript", "productivity", "web app"]

[extra]
tldr = "I built [<ruby>ずつ<rt>zutsu</rt></ruby>](https://zutsu.osc.garden), a fully offline task-planning app. [Repository](https://github.com/welpo/zutsu) and [video demo](#demo)."
stylesheets = ["/css/ruby_sans_serif.css"]
copy_button = true
social_media_card = "img/social_cards/blog_zutsu_offline_task_planner_web_app.jpg"
+++

On my Japanese-learning evenings, I have a set of tasks I want to do: learn grammar, practice numbers with [<ruby>ラ<rt>ra</rt>ム<rt>mu</rt></ruby>](https://ramu.osc.garden/), review my flashcards, read, watch a film…

Until a few days ago, I was asking Claude to generate calendar events for me:

```txt
- Task 1 (X min)
- Task 2 (Y min)
- …

---

1. Create a calendar file in iCalendar (.ics) format.
2. Use GMT+2 (TZID:Europe/Madrid) for all events.
3. Include 1-8 (random) minute breaks between each activity (do not list breaks as separate events).
4. Add URLs as a separate URL field for events where a URL is provided.
5. For each event, include SUMMARY, DTSTART, DTEND, and DESCRIPTION fields. Do not use unnecessary fields like RRULE.
6. Format dates and times in UTC format (e.g., 20000101T153000 for January 1, 2000, 15:30:00).

The events start on [date and time].
```

On a good day, I got through all the tasks in order, without interruptions. The native calendar app would notify me when I needed to switch tasks.

Most days, though, I had to adjust the events (say, to eat). In truth, even good days had problems: I may finish reviewing my flashcards earlier than expected! This meant selecting all remaining events on the calendar and shifting them up/down. Most days I would plan ~12 tasks, some with short durations —thus hard to select—, so this was a bit of a pain.

I liked the idea of [time blocking](https://en.wikipedia.org/wiki/Timeblocking), but I didn’t need to plan days or weeks, just my evenings. I wanted to be able to:

- Create a list of tasks
- Pause/unpause
- Complete tasks early (“shifting” the remaining tasks)
- Get a notification with sound when it’s time to switch tasks
- Easily repeat past sessions
- Have all data stored and processed locally

I did not want to share my calendar data or use a 3rd party app. I felt like a small web app like this should exist. So I made it!

After discussing requirements with Claude and sharing the [full code](https://github.com/welpo/ramu) of [my last web app](@/blog/ramu-japanese-numbers-practice-web-app/index.md), it came up with this design:

{{ dual_theme_image(light_src="img/first_prototype_light.webp", dark_src="img/first_prototype_dark.webp" alt="Claude's first UI prototype") }}

Not a bad start!

I spent a few hours working on:

- An easy way to add tasks with a default time and keyboard controls
- Export and import of tasks (JSON)
- Showing all tasks in list: completed, current, and upcoming
- Ability to reorder upcoming tasks
- Styling + responsive design
- Accessibility (e.g. adding keyboard navigation to the activity calendar)
- And, my favourite, adding a few utility tiles:
  - Activity calendar, similar to GitHub’s, keeps track of tasks completed in the last 30 days
  - Stopwatch—"how long will this subtask take me?"
  - Note taking space
  - Simple counter—"how many words have I learnt this session?"
  - Random selectors to avoid [decision fatigue](https://en.wikipedia.org/wiki/Decision_fatigue)—"should I use subtitles?"; "how many words should I look up during immersion?"
  - Pomodoro timer which pauses main task during rest time

The idea is to focus on one task at a time, so I named it <ruby>ずつ<rt>zutsu</rt></ruby>, from the Japanese expression <ruby>一つずつ<rt>hitotsu zutsu</rt></ruby> (one by one).

Let me show you:

<a id="demo"></a>
{% wide_container() %}
<video controls preload="none" width="1000" poster="img/video_poster.webp" title="zutsu demo" src="https://cdn.jsdelivr.net/gh/welpo/zutsu/assets/ずつ_demo.mov"></video>
{% end %}

Feel free to [try it yourself](https://zutsu.osc.garden) or [view the source code](https://github.com/welpo/zutsu).

Now it’s time to learn Japanese with the tools I’ve made instead of working on the tools. 🙃
