+++
title = "Creant una aplicació web minimalista de gestió del temps"
date = 2024-12-04
description = "He creat una aplicació web per planificar les meves sessions d'estudi. Inclou utilitats com la visualització de tasques completades en el passat o un temporitzador pomodoro."

[taxonomies]
tags = ["codi", "javascript", "productivitat", "web app"]

[extra]
tldr = "He creat [<ruby>ずつ<rt>zutsu</rt></ruby>](https://zutsu.osc.garden), una aplicació de planificació de tasques completament offline. [Repositori](https://github.com/welpo/zutsu) i [demostració en vídeo](#demo)."
stylesheets = ["/css/ruby_sans_serif.css"]
copy_button = true
social_media_card = "img/social_cards/ca_blog_zutsu_offline_task_planner_web_app.jpg"
+++

Les tardes que aprenc japonès, tinc un conjunt de tasques que vull fer: aprendre gramàtica, practicar números amb [<ruby>ラ<rt>ra</rt>ム<rt>mu</rt></ruby>](https://ramu.osc.garden/), repassar les meves flashcards, llegir, mirar una pel·lícula…

Fins fa uns dies, li demanava a Claude que em generés esdeveniments de calendari:

```txt
- Tasca 1 (X min)
- Tasca 2 (Y min)
- …

---

1. Crea un fitxer de calendari en format iCalendar (.ics).
2. Utilitza GMT+2 (TZID:Europe/Madrid) per a tots els esdeveniments.
3. Inclou pauses d'1-8 minuts (aleatòries) entre cada activitat (no llistis les pauses com a esdeveniments separats).
4. Afegeix URLs com a camp URL separat per als esdeveniments que en tinguin.
5. Per a cada esdeveniment, inclou els camps SUMMARY, DTSTART, DTEND i DESCRIPTION. No utilitzis camps innecessaris com RRULE.
6. Formata les dates i hores en format UTC (per exemple, 20000101T153000 per a l'1 de gener de 2000, 15:30:00).

Els esdeveniments comencen el [data i hora].
```

En un bon dia, completava totes les tasques en ordre, sense interrupcions. L'aplicació nativa del calendari m'avisava quan tocava canviar de tasca.

Però la majoria de dies havia d'ajustar els esdeveniments (per exemple, per menjar). Realment, fins i tot els bons dies tenien problemes: podia passar que el repàs de flashcards durés menys del previst! Això implicava seleccionar tots els esdeveniments restants al calendari i moure'ls amunt o avall. La majoria de dies planejava unes 12 tasques, algunes de curta durada —difícils de seleccionar—, així que era una mica molest.

M'agradava la idea del [time blocking](https://en.wikipedia.org/wiki/Timeblocking), però no necessitava planificar dies o setmanes, només les meves tardes. Volia:

- Crear una llista de tasques
- Pausar/reprendre
- Completar tasques abans d'hora (movent les tasques restants)
- Rebre una notificació amb so quan fos hora de canviar de tasca
- Repetir fàcilment sessions anteriors
- Tenir totes les dades emmagatzemades i processades localment

No volia compartir les meves dades del calendari ni utilitzar una aplicació de tercers. Em semblava que una petita aplicació web així hauria d'existir. Així que la vaig crear!

Després de discutir els requisits amb Claude i compartir el [codi complet](https://github.com/welpo/ramu) de [la meva última aplicació web](@/blog/ramu-japanese-numbers-practice-web-app/index.ca.md), va proposar aquest disseny:

{{ dual_theme_image(light_src="img/first_prototype_light.webp", dark_src="img/first_prototype_dark.webp" alt="Primer prototip d'interfície de Claude") }}

No és un mal punt de partida!

Vaig passar unes hores treballant en:

- Una manera fàcil d'afegir tasques amb un temps predeterminat i control per teclat
- Exportació i importació de tasques (JSON)
- Poder reordenar les tasques
- Mostrar totes les tasques en llista: completades, actual i pendents
- Estil + disseny responsive
- Accessibilitat (per exemple, navegació per teclat al calendari d'activitats)
- I, el meu preferit, unes petites utilitats:
  - Calendari d'activitat, similar al de GitHub, mostra tasques completades en els últims 30 dies
  - Cronòmetre —«quant em portarà aquesta subtasca?»
  - Espai per prendre notes
  - Comptador simple —«quantes paraules he après en aquesta sessió?»
  - Selectors aleatoris per evitar la [fatiga de decisions](https://en.wikipedia.org/wiki/Decision_fatigue) —«hauria d'utilitzar subtítols?»; «quantes definicions busco com a màxim durant la immersió?»
  - Temporitzador Pomodoro que pausa la tasca principal durant el descans

La idea és centrar-se en una tasca cada vegada, així que la vaig anomenar <ruby>ずつ<rt>zutsu</rt></ruby>, de l'expressió japonesa <ruby>一つずつ<rt>hitotsu zutsu</rt></ruby> (un per un).

Així funciona:

<a id="demo"></a>
{% wide_container() %}
<video controls preload="none" width="1000" poster="img/video_poster.webp" title="zutsu demo" src="https://cdn.jsdelivr.net/gh/welpo/zutsu/assets/ずつ_demo.mov"></video>
{% end %}

Pots [provar-la tu mateix](https://zutsu.osc.garden) o [veure el codi font](https://github.com/welpo/zutsu).

Ara toca aprendre japonès amb les eines que he fet en lloc de treballar en les eines. 🙃
