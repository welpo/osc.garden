+++
title = "Les 8 idees estadístiques més importants: inferència causal contrafactual"
date = 2023-10-23
updated = 2023-11-27
description = "Explorant més enllà del mantra \"la correlació no implica causalitat\", aquesta entrada introdueix com els contrafactuals serveixen de fonament per entendre relacions causa-efecte."

[taxonomies]
tags = ["les 8 idees estadístiques més importants", "ciència de dades", "estadística", "revisió d'article"]

[extra]
social_media_card = "img/social_cards/ca_blog_counterfactual_causal_inference.jpg"
+++

Aquest article és el primer d'una [sèrie d'entrades](/ca/tags/les-8-idees-estadistiques-mes-importants/) on exploro les 8 idees estadístiques més importants dels últims 50 anys, segons la revisió de [Gelman i Vehtari (2021)](https://arxiv.org/abs/2012.00174). Et convido que m'acompanyis en aquest camí d'aprenentatge mentre aprofundim en el primer concepte: l'**inferència causal contrafactual**.

<details>
  <summary>Introducció a la sèrie: Les 8 idees estadístiques més importants</summary>
  <p>Els últims cinquanta anys han vist avenços significatius en el camp de l'estadística, canviant la manera d'entendre i analitzar dades. <a href="https://arxiv.org/abs/2012.00174">Gelman i Vehtari (2021)</a> han revisat les 8 idees més importants en estadística dels últims 50 anys.</p>

  <p>Com a part del meu camí d'aprenentatge, he decidit aprofundir en aquestes 8 idees i compartir els meus descobriments. A cada article trobaràs una introducció a un concepte, així com alguns recursos per aprendre'n més. Així que, si t'interessa l'estadística, ets al lloc adequat!</p>
</details>

---

## Inferència causal contrafactual

> «La correlació no implica causalitat.»

Aquest mantra, repetit ad nauseam, ens porta a preguntar-nos: hi ha alguna manera d'identificar la causalitat?

{{ multilingual_quote(original="causal identification is possible, under assumptions, and one can state these assumptions rigorously and address them, in various ways, through design and analysis.", translated="La identificació causal és possible, sota certes premisses, i es poden establir aquestes premisses rigorosament i abordar-les, de diverses maneres, a través del disseny i l'anàlisi.", author="Gelman & Vehtari (2021)") }}

Diversos camps (econometria, epidemiologia, psicologia…) han vist sorgir diversos mètodes per a la **inferència causal** —el procés de determinar la relació causa-efecte entre variables— amb un element en comú: la formulació de preguntes causals en termes de **contrafactuals**.

Un contrafactual és alguna cosa que no ha passat, però *podria haver passat*. Un exemple d'una pregunta contrafactual: «Com seria la teva vida si haguessis acceptat aquella oferta de treball que vas rebutjar?».

És un contrafactual perquè s'inquireix sobre un resultat potencial que no va ocórrer. De fet, una altra manera de pensar en contrafactuals és considerar-los **resultats potencials**.

Els mètodes d'inferència causal busquen quantificar aquestes respostes mitjançant l'ús de tècniques estadístiques, models causals i altres enfocaments. Amb l'inferència causal, podem tractar preguntes com:

- La introducció primerenca d'aliments al·lergògens redueix el risc de desenvolupar al·lèrgies als nens?
- Com afecta la descriminalització de les drogues a les taxes d'abús de substàncies?
- Hauria de tenir una mascota?
- Què hauria passat si hagués fet exercici de forma regular durant els darrers sis mesos?

Examinem aquest últim exemple.

L'ideal seria utilitzar un **assaig controlat aleatoritzat** (RCT per les seves sigles en anglès) per respondre a aquesta pregunta. Repartiríem persones a l'atzar en dos grups: un faria exercici regularment durant un mes i l'altre no. Tots dos registrarien el seu estat d'ànim periòdicament.

¿Per què no podem simplement observar les persones que fan exercici regularment i comparar el seu estat d'ànim amb les que no? Per les **variables de confusió**.

Una **variable de confusió** és un factor que influeix tant en el tractament com en el resultat. Per exemple, podria ser que les persones que fan exercici regularment tinguin més temps lliure. No milloraria el teu estat d'ànim si tinguessis més temps lliure? I no seria més fàcil fer exercici regularment amb aquest temps extra? Ho veus, no? La variable de confusió (temps lliure) pot influir tant en el tractament (exercici) com en el resultat (estat d'ànim).

Per tant, un RCT té dos avantatges clau: gràcies a l'aleatorització, elimina el biaix de les variables de confusió aïllant els efectes del tractament/intervenció, i ens permet quantificar la incertesa en les nostres estimacions. El **resultat contrafactual** per a cada persona que va fer exercici s'estimaria que és l'estat d'ànim mitjà del grup que no va fer exercici, i viceversa.

Però els RCT no sempre són possibles. A vegades són poc ètics[^1], massa cars o requereixen massa temps. En aquests casos, podem utilitzar l'inferència causal contrafactual per estimar l'efecte d'una intervenció. Hi ha diversos mètodes, com l'aparellament, les [diferències en diferències](https://es.wikipedia.org/wiki/Diferencias_en_diferencias) o l'[estimació de variables instrumentals](https://es.wikipedia.org/wiki/Variable_instrumental).

En el nostre exemple, podríem emprar l'**aparellament** en lloc d'un RCT. És a dir, recolliríem dades (observacionals) de diversos individus i buscaríem parelles de persones que fossin semblants en tots els aspectes (edat, dieta, patrons de son, quantitat de temps lliure…) excepte en els seus hàbits d'exercici. Aquestes variables addicionals ens ajudarien a controlar les variables de confusió. Amb aquestes dades, compararíem l'estat d'ànim d'aquestes parelles per respondre a la nostra pregunta. Molt més senzill. Vegem-ho:

{% wide_container() %}

| Subjecte | Edat | Qualitat de dieta | Hores de son | Temps lliure (hores) | Exercici (hores/setmana) | Puntuació d'ànim |
|----------|------|-------------------|--------------|----------------------|--------------------------|-------------------|
| Adam     | 25   | Bona              | 8            | 2                    | 4                        | 8                 |
| May      | 24   | Bona              | 8            | 2.5                  | 0                        | 6                 |
| Anton    | 52   | Mitjana           | 6.5          | 1                    | 4                        | 8                 |
| Kashika  | 54   | Mitjana           | 7            | 1                    | 0                        | 6                 |
| Oluchi   | 35   | Dolenta           | 6            | 3                    | 4                        | 7                 |
| Kílian   | 32   | Dolenta           | 6.5          | 3                    | 0                        | 5                 |

{% end %}

Prenent aquesta taula il·lustrativa, podríem ajuntar a 3 parelles de subjectes basant-nos en totes les variables llevat de l'exercici. Veus algun patró en termes d'estat d'ànim?

En comparar aquestes parelles, podríem estimar l'efecte causal de l'exercici sobre l'estat d'ànim, responent a la nostra pregunta mitjançant la inferència causal contrafactual. Una resposta contrafactual (molt específica i simplificada) seria: "si la May fes exercici 4 hores a la setmana, el seu estat d'ànim seria aproximadament 2 punts més alt".

## Conclusió

En aquest article hem explorat el món de la inferència causal. Encara que la correlació ens pot donar pistes valuoses, és a través de la inferència causal que ens apropem a entendre el "per què" darrere dels fenòmens. Comprendre la causalitat és crucial per prendre decisions informades i implementar intervencions efectives en diversos àmbits.

Hem vist com els RCTs són l'estàndard d'or per a la inferència causal, però que no sempre són possibles. En aquests casos, podem recórrer a la inferència causal contrafactual.

La inferència causal contrafactual s'utilitza en l'atenció sanitària (per estimar l'efecte d'un tractament), en l'educació (per determinar l'eficàcia d'un nou pla d'estudis), en la tecnologia (per veure com reaccionen els usuaris davant una nova característica) i en molts altres àmbits.

{{ multilingual_quote(original="Felix qui potuit rerum cognoscere causas<br>
    Atque metus omnes, et inexorabile fatum<br>
    Subjecit pedibus, strepitumque Acherontis avari.", translated="Feliç és aquell que ha pogut conèixer les causes de les coses,<br>
    i ha posat tota por, i el destí inexorable, i el soroll<br>
    de l'àvid Aqueront, sota els seus peus.", author="Virgili") }}

Aquesta cita de Virgili (29 aC) ens recorda que la recerca de les "causes de les coses" no és només un exercici acadèmic; és una antiga cerca humana que pot acostar-nos a una comprensió harmònica del món i el nostre lloc en ell.

Això és tot per avui! En el pròxim article aprendrem sobre **[bootstrapping i la inferència basada en la simulació](/ca/blog/bootstrapping-and-simulation-based-inference/)**.

## Recursos d'aprenentatge

**Projecte divertit**: [Spurious correlations](https://tylervigen.com/spurious-correlations) (correlacions espúries) és un projecte de Tyler Vigen que mostra fortes (però espúries) correlacions entre variables aparentment no relacionades, com el nombre de persones que s'ofeguen en una piscina i el nombre de pel·lícules en què apareix Nicolas Cage cada any.

**Pòdcast**: [Alan Hájek on puzzles and paradoxes in probability and expected value — 80,000 Hours Podcast (2022)](https://80000hours.org/podcast/episodes/alan-hajek-probability-expected-value/#counterfactuals-021638). Una discussió profundament interessant sobre probabilitat, valor esperat i contrafactuals. La discussió s'endinsa (a partir del minut 02:16:38) en els matisos del raonament contrafactual i la necessitat de precisió en l'establiment de regles lògiques per a ells. Hájek argumenta que la majoria dels contrafactuals són essencialment falsos, però "aproximadament veritables i prou propers a la veritat per transmetre informació útil".

**Article acadèmic**: [Causal inference based on counterfactuals — Höfler (2005)](https://doi.org/10.1186/1471-2288-5-28). Un resum sobre els enfocaments relacionats amb contrafactuals. Revisa els experiments imperfectes, els ajustaments per factors de confusió, les exposicions variables en el temps, els riscos contraposats i la probabilitat de causalitat.

**Llibre**: [El libro del porqué — Judea Pearl (2018)](https://www.pasadopresente.com/component/booklibraries/bookdetails/2020-06-17-11-33-26). Una immersió profunda en la ciència de la inferència i el descobriment causal, explorant teories, mètodes i aplicacions en el món real. Pearl sosté que tots els resultats potencials poden derivar-se dels models d'equacions estructurals i exposa els problemes que plantegen altres enfocaments, com l'ajuntament.

[^1]: Lamentablement, hi ha massa exemples reals d'investigació no ètica. Vegeu l'[experiment Tuskegee](https://es.wikipedia.org/wiki/Experimento_Tuskegee), els [experiments de sífilis a Guatemala](https://es.wikipedia.org/wiki/Experimentos_sobre_s%C3%ADfilis_en_Guatemala), o els [nombrosos exemples d'empreses farmacèutiques que no respecten els principis fonamentals de la investigació ètica en països africans (en anglès)](https://en.wikipedia.org/wiki/Medical_experimentation_in_Africa). Els mètodes d'inferència causal contrafactual poden ser una alternativa quan la realització d'un RCT és èticament problemàtic.
