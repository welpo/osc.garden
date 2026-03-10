+++
title = "Creando una aplicación web minimalista de gestión del tiempo"
date = 2024-12-04
description = "He creado una aplicación web para planificar mis sesiones de estudio. Incluye utilidades como la visualización de tareas completadas en el pasado o un temporizador pomodoro."

[taxonomies]
tags = ["código", "javascript", "productividad", "web app", "PWA"]

[extra]
tldr = "He creado [<ruby>ずつ<rt>zutsu</rt></ruby>](https://zutsu.osc.garden), una aplicación de planificación de tareas completamente offline. [Repositorio](https://github.com/welpo/zutsu) y [demostración en vídeo](#demo)."
stylesheets = ["/css/ruby_sans_serif.css"]
copy_button = true
social_media_card = "img/social_cards/es_blog_zutsu_offline_task_planner_web_app.jpg"
+++

Las tardes que aprendo japonés, tengo un conjunto de tareas que quiero hacer: aprender gramática, practicar números con [<ruby>ラ<rt>ra</rt>ム<rt>mu</rt></ruby>](https://ramu.osc.garden/), repasar mis flashcards, leer, ver una película…

Hasta hace unos días, le pedía a Claude que me generara eventos de calendario:

```txt
- Tarea 1 (X min)
- Tarea 2 (Y min)
- …

---

1. Crea un archivo de calendario en formato iCalendar (.ics).
2. Utiliza GMT+2 (TZID:Europe/Madrid) para todos los eventos.
3. Incluye pausas de 1-8 minutos (aleatorias) entre cada actividad (no listes las pausas como eventos separados).
4. Añade URLs como campo URL separado para los eventos que las tengan.
5. Para cada evento, incluye los campos SUMMARY, DTSTART, DTEND y DESCRIPTION. No utilices campos innecesarios como RRULE.
6. Formatea las fechas y horas en formato UTC (por ejemplo, 20000101T153000 para el 1 de enero de 2000, 15:30:00).

Los eventos empiezan el [fecha y hora].
```

En un buen día, completaba todas las tareas en orden, sin interrupciones. La aplicación nativa del calendario me avisaba cuando tocaba cambiar de tarea.

Pero la mayoría de días tenía que ajustar los eventos (por ejemplo, para comer). En realidad, incluso los buenos días tenían problemas: ¡podía ocurrir que el repaso de flashcards durara menos de lo previsto! Esto implicaba seleccionar todos los eventos restantes en el calendario y moverlos arriba o abajo. La mayoría de días planeaba unas 12 tareas, algunas de corta duración —difíciles de seleccionar—, así que era un poco molesto.

Me gustaba la idea del [time blocking](https://en.wikipedia.org/wiki/Timeblocking), pero no necesitaba planificar días o semanas, solo mis tardes. Quería:

- Crear una lista de tareas
- Pausar/reanudar
- Completar tareas antes de tiempo (moviendo las tareas restantes)
- Recibir una notificación con sonido cuando fuera hora de cambiar de tarea
- Repetir fácilmente sesiones anteriores
- Tener todos los datos almacenados y procesados localmente

No quería compartir mis datos del calendario ni utilizar una aplicación de terceros. Me parecía que una pequeña aplicación web así debería existir. ¡Así que la creé!

Después de discutir los requisitos con Claude y compartir el [código completo](https://github.com/welpo/ramu) de [mi última aplicación web](@/blog/ramu-japanese-numbers-practice-web-app/index.es.md), propuso este diseño:

{{ dual_theme_image(light_src="img/first_prototype_light.webp", dark_src="img/first_prototype_dark.webp" alt="Primer prototipo de interfaz de Claude") }}

¡No es un mal punto de partida!

Pasé unas horas trabajando en:

- Una forma fácil de añadir tareas con un tiempo predeterminado y control por teclado
- Exportación e importación de tareas (JSON)
- Poder reordenar las tareas
- Mostrar todas las tareas en lista: completadas, actual y pendientes
- Estilo + diseño responsive
- Accesibilidad (por ejemplo, navegación por teclado al calendario de actividades)
- Y, mi favorito, unas pequeñas utilidades:
  - Calendario de actividad, similar al de GitHub, muestras tareas completadas en los últimos 30 días
  - Cronómetro —«¿cuánto me llevará esta subtarea?»
  - Espacio para tomar notas
  - Contador simple —«¿cuántas palabras he aprendido en esta sesión?»
  - Selectores aleatorios para evitar la [fatiga de decisiones](https://en.wikipedia.org/wiki/Decision_fatigue) —«¿debería usar subtítulos?»; «¿cuántas definiciones busco como máximo durante la inmersión?»
  - Temporizador Pomodoro que pausa la tarea principal durante el descanso

La idea es centrarse en una tarea a la vez, así que la llamé <ruby>ずつ<rt>zutsu</rt></ruby>, de la expresión japonesa <ruby>一つずつ<rt>hitotsu zutsu</rt></ruby> (uno por uno).

Así funciona:

<a id="demo"></a>
{% wide_container() %}
<video controls preload="none" width="1000" poster="img/video_poster.webp" title="zutsu demo" src="https://cdn.jsdelivr.net/gh/welpo/zutsu/assets/ずつ_demo.mov"></video>
{% end %}

Puedes [probarla tú mismo](https://zutsu.osc.garden) o [ver el código fuente](https://github.com/welpo/zutsu).

Ahora toca aprender japonés con las herramientas que he hecho en lugar de trabajar en las herramientas. 🙃
