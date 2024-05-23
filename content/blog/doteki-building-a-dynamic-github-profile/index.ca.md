+++
title = "Creant una eina per afegir contingut dinàmic al meu perfil de GitHub"
date = 2024-04-30
updated = 2024-05-23
description = "Creant una Com vaig construir dōteki, una eina basada en plugins per afegir contingut dinàmic a perfils de GitHub. Inspiració, procés de pensament i plans futurs afegir contingut dinàmic al meu perfil de GitHub."

[taxonomies]
tags = ["codi", "automatització"]

[extra]
social_media_card = "img/social_cards/projects_doteki.jpg"
+++

El perfil de GitHub de Simon Willison em va inspirar a construir una eina per afegir contingut dinàmic al meu perfil. El seu perfil es veu així:

{{ dual_theme_image(light_src="img/simonw_light.webp", dark_src="img/simonw_dark.webp", alt="Captura de pantalla del perfil de GitHub de Simon Willison, mostrant tres columnes: llançaments recents, en el meu blog i TIL (Avui He Après).", full_width=true) }}

{{ admonition(type="tip", text="Per afegir contingut al teu perfil de GitHub, crea un repositori amb un nom que coincideixi amb el teu nom d'usuari (per exemple, [github.com/welpo/welpo](https://github.com/welpo/welpo)) i afegeix-hi un fitxer `README.md`. El seu contingut es mostrarà al teu perfil.") }}

El perfil de Willison ofereix una visió general del que ha estat escrivint, tant en termes de prosa com de codi. En explorar el [contingut en brut del seu fitxer `README.md`](https://raw.githubusercontent.com/simonw/simonw/main/README.md), vaig veure aquests marcadors d'inici/final:

```txt,hl_lines=2 4
### Recent releases
<!-- recent_releases starts -->
[aquí les actualitzacions recents]
<!-- recent_releases ends -->
```

Son comentaris HTML —invisibles però útils. Willison utilitza un [script de Python](https://github.com/simonw/simonw/blob/main/build_readme.py) per afegir les seves actualitzacions recents de programari i publicacions entre els marcadors. Una GitHub Action s'encarrega que estigui sempre actualitzat.

Força enginyós, no? Després de veure això, tenia ganes de mostrar en el meu perfil les últimes entrades del meu blog i la música que he estat escoltant.

## Un projecte de cap de setmana?

Vaig crear un fitxer Python amb dues funcions, una per obtenir el feed del meu blog i retornar una llista de publicacions, i una altra que cridava a l'API de Last.fm per obtenir els meus artistes més escoltats de la setmana. Ambdues funcions necessitaven:

- trobar els marcadors HTML al meu fitxer `README.md`;
- limitar els resultats (publicacions o artistes) als primers `n` elements;
- donar format Markdown;
- substituir el contingut dins dels marcadors.

La meva solució: crear un programa general per gestionar els requisits comuns, i mòduls independents per les tasques com obtenir les publicacions o els meus artistes més escoltats. Vaig anomenar aquests mòduls «plugins».

Tot i que existeix més d'una eina per mostrar publicacions recents, no vaig trobar cap per mostrar de forma neta els meus hàbits musicals. A més, les eines que afegeixen contingut dinàmic a un perfil de GitHub utilitzen diversos mètodes de configuració: arxius YAML que generen el `README` des de zero, marcadors HTML com els que hem vist, o contingut incrustat des d'aplicacions web de Vercel. Establir un [Estàndard de Plugins](https://doteki.org/docs/developer-guide/plugin-standard) i utilitzar un únic arxiu de configuració [TOML](https://doteki.org/docs/configuration/) era l'enfocament òptim.

El programa general funcionaria amb dos fitxers: el `README.md` del perfil i un arxiu de configuració TOML. Al `README.md` afegiria els comentaris HTML per marcar on ha d'anar el contingut dinàmic. Per exemple:

```markdown
He estat escoltant a <!-- music start --><!-- music end -->.
```

El fitxer de configuració definiria què fer a cada parell de marcadors (una secció). És a dir, quin és l'identificador de la secció? Quin plugin necessitem executar? Amb quina configuració? Per exemple:

```toml
[sections.music]
plugin = "lastfm"
username = "welpo"
```

Això buscarà el parell de marcadors identificats amb «`music`» i executarà el plugin `lastfm` amb el meu nom d'usuari. El resultat del plugin es col·locarà entre els marcadors: `<!-- music start -->[Aquí]<!-- music end -->`.

El programa principal, dōteki («dinàmic» en japonès), maneja les següents tasques:

- Processar l'arxiu de configuració TOML i els arguments de línia de comandos.
- Llegir el contingut de l'arxiu `README.md`.
- Trobar els marcadors per a cada secció de l'arxiu de configuració.
- Per a cada secció:
  - Trucar a la funció `run` del plugin especificat, passant la configuració corresponent.
  - Formatejar la sortida del plugin. Per exemple, convertint-la en una llista separada per comes, o en una llista de MarkDown (com aquesta).
  - Reemplaçar el contingut entre els marcadors amb el resultat del plugin formatejat.
- Guardar l'arxiu `README.md`.

Els plugins són arxius Python independents que retornen *alguna cosa*: una llista de publicacions, cançons escoltades recentment, la data actual...

## Uns extres

Per automatitzar les actualitzacions vaig crear la meva primera GitHub Action: [`doteki-action`](https://github.com/welpo/doteki-action). Les seves [50 línies](https://github.com/welpo/doteki-action/blob/main/action.yaml) configuren Python i les seves dependències, executen dōteki amb l'arxiu de configuració al repositori de l'usuari, i guarden els canvis.

Tot i no ser dōteki el meu primer projecte de Python públic, és el primer que vaig considerar digne de publicar a PyPI, el repositori oficial de programari per a Python. Va ser un procés d'aprenentatge amb intents i errors i algunes versions retirades, però ara el procés de publicació està [automatitzat](https://github.com/welpo/doteki/blob/main/.github/workflows/cd.yml): quan pujo un tag de Git amb un número de versió a GitHub, una GitHub Action publica a [PyPI](https://pypi.org/project/doteki/), crea una [GitHub release](https://github.com/welpo/doteki/releases), i actualitza l'[acció de dōteki](https://github.com/welpo/doteki-action) per usar la versió més recent. Tot això amb [un changelog ben bonic](https://github.com/welpo/doteki/blob/main/CHANGELOG.md).

Vaig aprendre a utilitzar dues eines més: [Mend Renovate](https://www.mend.io/renovate/) per automatitzar l'actualització de dependències a través de pull requests ([exemple](https://github.com/welpo/doteki/pull/26)), i [Docusaurus](https://docusaurus.io/) per construir [una web moderna per a la documentació](https://doteki.org/).

## Compartir és aprendre

Escriure la [documentació del projecte](https://doteki.org/docs) va ajudar a aclarir els meus objectius, em va fer pensar com presentar-lo —què destacar— i com facilitar la introducció per a usuaris nous. Explicar el codi als amics va fer evidents ineficiències i redundàncies que havia passat per alt.

Un d'aquests amics m'havia recomanat el llibre [Clean Code, de Robert C. Martin](https://www.oreilly.com/library/view/clean-code-a/9780136083238/) (bona lectura!). Escriure dōteki em va donar l'oportunitat d'aplicar els principis del llibre. La meva esperança és que el codi principal ([`cli.py`](https://github.com/welpo/doteki/blob/main/doteki/cli.py)) pugui ser entès llegint-lo de dalt a baix.

## El futur del projecte

La primera versió de dōteki incloïa quatre plugins:

- [Current Date Plugin](https://doteki.org/docs/plugins/current_date), que retorna la data actual;
- [Feed Plugin](https://doteki.org/docs/plugins/feed) per buscar i formatar entrades d'un feed RSS/Atom;
- [Last.fm Plugin](https://doteki.org/docs/plugins/lastfm) per mostrar els principals artistes, àlbums, pistes o etiquetes;
- [Random Choice Plugin](https://doteki.org/docs/plugins/random_choice), que retorna un element aleatori d'una llista.

M'encantaria veure créixer el projecte, tant en termes d'usuaris com de col·laboradors. Pel que fa a les meves metes personals, planejo crear aquests dos plugins:

- Recent Releases Plugin: retorna una llista dels llançaments recents de projectes de GitHub;
- Currently Reading Plugin, per mostrar quin llibre estic llegint, compatible amb Goodreads i/o Literal.

---

No és la primera vegada que un projecte de «cap de setmana» es converteix en un projecte de diverses setmanes; els requisits van créixer juntament amb les línies de codi. No obstant això, ha estat una experiència d'aprenentatge divertida, i estic orgullós de l'eina, la seva documentació i la infraestructura de CI/CD.

Si vols saber més sobre dōteki, consulta aquests enllaços:

- [Lloc web / Documentació](https://doteki.org/)
- [Repositori a GitHub](https://github.com/welpo/doteki)
- [El meu perfil de GitHub](https://github.com/welpo) per veure'l en acció.

El projecte està obert a tot tipus de contribucions: sol·licituds de funcionalitat, correccions d'errors, millores en la documentació, nous plugins… Si tens una idea per a un plugin o vols compartir els teus pensaments, pots utilitzar els comentaris més avall, enviar-me un correu, o utilitzar l'[issue tracker](https://github.com/welpo/doteki/issues) o les [discussions](https://github.com/welpo/doteki/discussions) del projecte.
