+++
title = "Las 8 ideas estadísticas más importantes: inferencia causal contrafactual"
date = 2023-10-23
updated = 2023-11-27
description = "«La correlación no implica causalidad». Cómo los contrafactuales ayudan a determinar relaciones de causa y efecto."

[taxonomies]
tags = ["las 8 ideas estadísticas más importantes", "ciencia de datos", "estadística", "revisión de artículo"]

[extra]
social_media_card = "img/social_cards/es_blog_counterfactual_causal_inference.jpg"
+++

Este artículo es el primero de una [serie de entradas](/es/tags/las-8-ideas-estadisticas-mas-importantes/) donde abordo las 8 ideas estadísticas más importantes de los últimos 50 años, según la revisión de [Gelman y Vehtari (2021)](https://arxiv.org/abs/2012.00174). El primer concepto es **la inferencia causal contrafactual**.

<details>
  <summary>Introducción a la serie: Las 8 ideas estadísticas más importantes</summary>
  <p>Los últimos 50 años han visto avances significativos en el campo de la estadística, moldeando la forma de entender y analizar datos. <a href="https://arxiv.org/abs/2012.00174">Gelman y Vehtari (2021)</a> revisaron las 8 ideas más importantes en estadísticas de los últimos 50 años.</p>

   <p>Sentía curiosidad por las ocho ideas, así que decidí escribir sobre ellas para profundizar mi comprensión. Espero que a alguien más le resulte útil.</p>
</details>

---

## Inferencia causal contrafactual

> «La correlación no implica causalidad.»

Este mantra, manido hasta la saciedad, nos lleva a preguntarnos: ¿hay alguna forma de identificar la causalidad?

{{ multilingual_quote(original="causal identification is possible, under assumptions, and one can state these assumptions rigorously and address them, in various ways, through design and analysis.", translated="La identificación causal es posible, bajo ciertas asunciones, y se pueden establecer estas suposiciones rigurosamente y abordarlas, de diversas maneras, a través del diseño y el análisis.", author="Gelman & Vehtari (2021)") }}

Diferentes campos (econometría, epidemiología, psicología…) han visto surgir varios métodos para la **inferencia causal** —el proceso de determinar la relación causa-efecto entre variables— con un elemento en común: el modelado de preguntas causales en términos de **contrafactuales**.

Un contrafactual es algo que no sucedió, pero *podría haber sucedido*. Un ejemplo de una pregunta contrafactual: «¿Cómo sería tu vida si hubieses aceptado esa oferta de trabajo que rechazaste?».

Es un contrafactual porque se pregunta sobre un resultado potencial que no ocurrió. De hecho, otra forma de pensar en contrafactuales es considerarlos **resultados potenciales**.

Los métodos de inferencia causal buscan cuantificar estas respuestas mediante el uso de métodos estadísticos, modelos causales y otras técnicas. Usando la inferencia causal, podemos abordar preguntas como:

- ¿La introducción temprana de alimentos alergénicos reduce el riesgo de desarrollar alergias en los niños?
- ¿Cuál es el efecto de la descriminalización de las drogas en las tasas de abuso de sustancias?
- ¿Debería tener una mascota?
- ¿Qué hubiese ocurrido si hubiera hecho ejercicio de forma regular durante los últimos seis meses?

Exploremos este último ejemplo.

Lo ideal sería utilizar un **ensayo controlado aleatorizado** (RCT por sus siglas en inglés) para responder a esta pregunta. Dividiríamos aleatoriamente a personas en dos grupos: uno haría ejercicio regularmente durante un mes y el otro no. Ambos registrarían su estado de ánimo de forma periódica.

¿Por qué no podemos simplemente observar a las personas que hacen ejercicio regularmente y comparar su estado de ánimo con aquellos que no lo hacen? Por las **variables de confusión**.

Una **variable de confusión** es un factor que influye tanto en el tratamiento como en el resultado. Por ejemplo, puede que las personas que hacen ejercicio regularmente tengan más tiempo libre. ¿No mejoraría tu estado de ánimo si tuvieses más tiempo libre? Y ¿no te resultaría más fácil hacer ejercicio regularmente con ese tiempo extra? Te haces una idea: la variable de confusión (tiempo libre) puede influir tanto en el tratamiento (ejercicio) como en el resultado (estado de ánimo).

Por lo tanto, un RCT tiene dos ventajas clave: gracias a la aleatorización, elimina el sesgo de las variables de confusión al aislar los efectos del tratamiento/intervención, y nos permite cuantificar la incertidumbre en nuestras estimaciones. El **resultado contrafactual** para cada persona que hizo ejercicio se estimaría que es el estado de ánimo medio del grupo que no hizo ejercicio, y viceversa.

Pero los RCTs no siempre son posibles. A veces son poco éticos[^1], muy costosos o llevan demasiado tiempo. En estos casos, podemos usar la inferencia causal contrafactual para estimar el efecto de una intervención. Hay varios métodos para ello, como el emparejamiento, las [diferencias en diferencias](https://es.wikipedia.org/wiki/Diferencias_en_diferencias) o la [estimación de variables instrumentales](https://es.wikipedia.org/wiki/Variable_instrumental).

En nuestro ejemplo, podríamos utilizar el **emparejamiento** en lugar de un RCT. Es decir, recopilaríamos datos (observacionales) de varios individuos y buscaríamos pares de personas que fueran similares en todos los aspectos (edad, dieta, patrones de sueño, cantidad de tiempo libre…) excepto en sus hábitos de ejercicio. Estas variables adicionales nos ayudarían a controlar las variables de confusión. Con estos datos, compararíamos el estado de ánimo de estas parejas para responder a nuestra pregunta. Mucho más sencillo. Veámoslo:

{% wide_container() %}

| Sujeto   | Edad | Calidad de dieta | Horas de sueño | Tiempo libre (horas) | Ejercicio (horas/semana) | Puntuación de ánimo |
|----------|------|------------------|----------------|----------------------|--------------------------|---------------------|
| Adam     | 25   | Buena            | 8              | 2                    | 4                        | 8                   |
| May      | 24   | Buena            | 8              | 2.5                  | 0                        | 6                   |
| Anton    | 52   | Media            | 6.5            | 1                    | 4                        | 8                   |
| Kashika  | 54   | Media            | 7              | 1                    | 0                        | 6                   |
| Oluchi   | 35   | Mala             | 6              | 3                    | 4                        | 7                   |
| Kílian   | 32   | Mala             | 6.5            | 3                    | 0                        | 5                   |

{% end %}

Tomando la tabla ilustrativa de arriba, podríamos emparejar a 3 pares de sujetos en base a todas las variables excepto el ejercicio. ¿Ves algún patrón en términos de estado de ánimo?

Al comparar estos emparejamientos, podríamos estimar el efecto causal del ejercicio sobre el estado de ánimo, respondiendo a nuestra pregunta a través de la inferencia causal contrafactual. Una respuesta contrafactual (muy específica y simplificada) sería «si May hiciera ejercicio 4 horas a la semana, su estado de ánimo sería aproximadamente 2 puntos más alto».

## Conclusión

En este artículo hemos explorado el mundo de la inferencia causal. Si bien la correlación nos puede dar pistas valiosas, es a través de la inferencia causal que nos acercamos a entender el «por qué» detrás de los fenómenos. Comprender la causalidad es crucial para tomar decisiones informadas e implementar intervenciones efectivas en diversos campos.

Hemos visto cómo los RCTs son el estándar de oro para la inferencia causal, pero que no siempre son posibles. En esos casos, podemos recurrir a la inferencia causal contrafactual.

La inferencia causal contrafactual se utiliza en la atención sanitaria (para estimar el efecto de un tratamiento), en la educación (para determinar la eficacia de un nuevo plan de estudios), en la tecnología (para ver cómo reaccionan los usuarios ante una nueva característica) y en muchos otros campos.

{{ multilingual_quote(original="Felix qui potuit rerum cognoscere causas<br>
    Atque metus omnes, et inexorabile fatum<br>
    Subjecit pedibus, strepitumque Acherontis avari.", translated="Feliz es aquel que ha podido conocer las causas de las cosas,<br>
    y ha puesto todo temor, y el inexorable destino, y el ruido<br>
    del ávido Aqueronte, bajo sus pies.", author="Virgilio") }}

Esta cita de Virgilio (29 a.C.) nos recuerda que la búsqueda de las «causas de las cosas» no es sólo un ejercicio académico; es una antigua búsqueda humana que puede acercarnos a una comprensión armoniosa del mundo y nuestro lugar en él.

¡Eso es todo por hoy! En el próximo artículo aprenderemos sobre **[bootstrapping y la inferencia basada en la simulación](/es/blog/bootstrapping-and-simulation-based-inference/)**.

## Recursos de aprendizaje

**Proyecto divertido**: [Spurious correlations](https://tylervigen.com/spurious-correlations) (correlaciones espurias) es un proyecto de Tyler Vigen que muestra fuertes (pero espurias) correlaciones entre variables aparentemente no relacionadas, como el número de personas que se ahogan en una piscina y el número de películas en las que aparece Nicolas Cage cada año.

**Podcast**: [Alan Hájek on puzzles and paradoxes in probability and expected value — 80,000 Hours Podcast (2022)](https://80000hours.org/podcast/episodes/alan-hajek-probability-expected-value/#counterfactuals-021638). Una discusión profundamente interesante sobre probabilidad, valor esperado y contrafactuales. La discusión se adentra (a partir del minuto 02:16:38) en los matices del razonamiento contrafactual y la necesidad de precisión en el establecimiento de reglas lógicas para ellos. Hájek argumenta que la mayoría de los contrafactuales son esencialmente falsos, pero «aproximadamente verdaderos y lo suficientemente cercanos a la verdad para transmitir información útil».

**Artículo académico**: [Causal inference based on counterfactuals — Höfler (2005)](https://doi.org/10.1186/1471-2288-5-28). Un resumen sobre los enfoques relacionados con contrafactuales. Revisa los experimentos imperfectos, los ajustes por factores de confusión, las exposiciones variables en el tiempo, los riesgos contrapuestos y la probabilidad de causalidad.

**Libro**: [El libro del porqué — Judea Pearl (2018)](https://www.pasadopresente.com/component/booklibraries/bookdetails/2020-06-17-11-33-26). Una inmersión profunda en la ciencia de la inferencia y el descubrimiento causal, explorando teorías, métodos y aplicaciones en el mundo real. Pearl sostiene que todos los resultados potenciales pueden derivarse de los modelos de ecuaciones estructurales y expone los problemas que plantean otros enfoques, como el emparejamiento.

---

[^1]: Lamentablemente, hay demasiados ejemplos reales de investigación no ética. Véase el [experimento Tuskegee](https://es.wikipedia.org/wiki/Experimento_Tuskegee), los [experimentos de sífilis en Guatemala](https://es.wikipedia.org/wiki/Experimentos_sobre_s%C3%ADfilis_en_Guatemala), o los [numerosos ejemplos de empresas farmacéuticas que no respetan los principios fundamentales de la investigación ética en países africanos (en inglés)](https://en.wikipedia.org/wiki/Medical_experimentation_in_Africa). Los métodos de inferencia causal contrafactual pueden ser una alternativa cuando la realización de un RCT es éticamente problemático.
