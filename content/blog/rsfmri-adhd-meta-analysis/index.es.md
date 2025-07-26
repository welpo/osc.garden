+++
title = "Resonancia magnética funcional en reposo (rsfMRI) del trastorno por déficit de atención e hiperactividad: metaanálisis"
date = 2021-06-10
description = "Mi Trabajo Fin de Máster de Psicología General Sanitaria. Un metaanálisis exhaustivo de estudios de rsfMRI de todo el cerebro comparando personas con trastorno por déficit de atención e hiperactividad con personas neurotípicas."

[taxonomies]
tags = ["trabajo fin de máster", "psicología", "investigación"]

[extra]
toc_ignore_pattern = "(?i)^(Tabla|Figura|Table de contenido)"
social_media_card = "img/social_cards/es_blog_rsfmri_adhd_meta_analysis.jpg"
iine = false
+++

Este es mi Trabajo Fin de Máster del Máster de Psicología General Sanitaria de la Universitat de Barcelona (Curso 2019-2021), tutorizado por Joan Guàrdia Olmos.

**Autores y autoras**: Óscar Fernández-Vázquez<sup> a</sup>, Silvia Ruiz-Torras<sup> d</sup>, Maribel Peró-Cebollero<sup> abc</sup>, Joan Guàrdia-Olmos<sup> abc</sup>.

<details><summary>Afiliaciones</summary><sup>a</sup> Facultat de Psicologia, Secció de Psicologia Quantitativa, Universitat de Barcelona, España <br> <sup>b</sup> UB Institute of Complex Systems, Universitat de Barcelona, España <br> <sup>c</sup> Institute of Neuroscience, Universitat de Barcelona, España <br> <sup>d</sup> Clínica Psicològica de la Universitat de Barcelona, Fundació Josep Finestres, Universitat de Barcelona, España</details>

<br>

### Tabla de contenido

{{ toc() }}

## Resumen

**Objetivo**: Llevar a cabo un metaanálisis de resonancia magnética funcional en estado de reposo (rsfMRI) que englobe toda la literatura publicada relevante que compare personas con trastorno por déficit de atención e hiperactividad con personas neurotípicas (NT).

**Método**: Tras realizar búsquedas en un gran conjunto de bases de datos, se incluyeron estudios que utilizaran como criterio diagnóstico las dos versiones más recientes del DSM o el ICD, que compararan TDAH y NT, y que reportaran los resultados como coordenadas en un espacio estereotáctico estándar con un valor de significación asociado. Se excluyeron estudios que realizaran un análisis de regiones de interés a priori o análisis de integración funcional, así como estudios en idiomas distintos al español o el inglés. Todas las fases de cribado (por título y abstract y por texto completo) se llevaron a cabo por dos revisores de forma independiente. El metaanálisis de los picos se llevó a cabo a través del programa SDM, estableciendo un valor de significación estadística sin corregir de p \< ,005.

**Resultados**: Se incluyeron 10 estudios que comprenden una muestra de 641 participantes, todos ellos niños y niñas. Se encontraron 3 picos significativos. Dos de hiperactivación (TDAH \> NT), en el lóbulo paracentral izquierdo (SDM-Z = 3,112; p = ,0009; 75 vóxeles) y otro en el cuerpo calloso (SDM-Z = 2,886; p = ,0019; 25 vóxeles), y un pico de hipoactivación más grande y significativo en el cerebelo derecho (SDM-Z = -3,683; p = ,0001; 543 vóxeles). El reducido número de artículos no permitió análisis de heterogeneidad. La calidad de los estudios es moderadamente alta y el riesgo de sesgo del pico más significativo parece ser bajo.

**Conclusiones**: Este metaanálisis contribuye al creciente campo de la neuroimagen en trastornos psicológicos. Hemos identificado alteraciones significativas en el cerebelo, una región implicada en procesos neuropsicológicos deteriorados en el TDAH. Estos resultados deberían guiar futuros estudios de neuroimagen en trastornos psicológicos.

## Abstract

**Objective**: To conduct a comprehensive meta-analysis of all resting state functional MRI (rsfMRI) studies to date comparing people with attention deficit hyperactivity disorder (ADHD) to neurotypical (NT) people.

**Method**: After conducting searches in a large set of databases, we included studies using the two most recent versions of the DSM or ICD, comparing ADHD to NT, and provided the results as peaks of coordinates in a standard stereotactic space with their associated significance level. We excluded studies using seed-based or functional integration analyses, and those in languages other than Spanish or English. All screening phases (by title/abstract and full text) were performed independently by two reviewers. The meta-analysis was conducted on the software SDM, establishing a threshold of an uncorrected p \< ,005.

**Results**: We included 10 studies comprising 641 participants, all of them children. We found 3 significant peaks. Two peaks indicated hyperactivation (ADHD \> NT) in the left paracentral lobule (SDM-Z = 3,112; p = ,0009; 75 voxels) and the corpus callosum (SDM-Z = 2,886; p = ,0019; 25 voxels), and one, more significant, hypoactivation peak (ADHD \< NT) in the right cerebellum (SDM-Z = -3,683; p = ,0001; 543 voxels). The low number of included studies didn’t allow for heterogeneity analyses. The quality of the studies is moderately high and the risk of bias for the most significant peak appears to be low.

**Conclusions**: This meta-analysis contributes to the growing field of neuroimaging in psychological disorders. We have identified significant alterations in the cerebellum, a region involved in neuropsychological processes that are impaired in ADHD. Our results should guide future neuroimaging studies in this field.

## Agradecimientos

<p align="center">A Joan Guàrdia por generarme un interés por la estadística en general y los metaanálisis en particular. Por su exigencia, entusiasmo, crítica y aliento.</p>

<p align="center">A Maribel Peró por concederme una sólida base sobre la metodología, por su honestidad, asistencia, supervisión y dirección.</p>

<p align="center">A Silvia Ruiz por sus valiosísimas aportaciones a lo largo de todo el proceso, por sus ánimos y su incansable entusiasmo.</p>

<p align="center">A Cristina Cañete por su generosidad, paciencia y ayuda.</p>

<p align="center">A Pablo Peinado por su apoyo constante y valiosos comentarios.</p>

<p align="center">A Juan Pablo Sanabria por sus estupendas recomendaciones sobre cómo coordinar un metaanálisis de forma eficiente.</p>

<p align="center">A Alexandra Elbakyan por su contribución a la difusión mundial de la ciencia y libre acceso a la literatura científica.</p>

## Introducción

El trastorno por déficit de atención con hiperactividad (TDAH) es un trastorno del neurodesarrollo caracterizado por un patrón persistente de inatención y/o hiperactividad-impulsividad que interfiere en el funcionamiento o desarrollo de la persona (APA, 2013).

Los metaanálisis más recientes reportan una prevalencia mundial entre 5,29% (Polanczyk et al., 2014) y 7,2% (Thomas et al., 2015). Los datos de un estudio epidemiológico reciente con una muestra de 1.104 niños y niñas catalanes entre 3 y 6 años (Canals et al., 2018) coinciden con este rango; encontraron una prevalencia del TDAH del 5,4%. Por lo general, en la literatura se reporta una mayor prevalencia en el sexo masculino que el femenino, con una proporción variable entre 1,6:1 (Fayyad et al., 2017) y 10:1 (Jiménez et al., 2012, citados en Canals et al., 2016). La proporción probablemente esté más cercana al 2,45:1, basándonos en estudios metaanalíticos con muestras comunitarias (Polanczyk y Jensen, 2008).

En edades tempranas de desarrollo, el TDAH ya tiene un impacto significativo en el rendimiento escolar y la salud familiar (Canals et al., 2018). Si bien los síntomas suelen disminuir con la edad, meta-análisis de estudios de seguimiento longitudinales de niños y niñas con TDAH indican que al menos el 15% siguen cumpliendo con los criterios diagnósticos a los 25 años, y un ~40-60% cumplen los criterios de TDAH en remisión parcial (Faraone et al., 2006). El metaanálisis de Simon et al. (2009) encontró una prevalencia global del TDAH en la adultez del 2,5%. Esto coincide con datos más recientes de Fayyad et al. (2017), quienes, tras analizar 26.744 respuestas de adultos de 20 países a la Entrevista Diagnóstica Internacional Compuesta (CIDI por sus siglas en inglés), reportaron una prevalencia del TDAH en adultos a nivel global del 2,8%. Concluyeron que se trata de un trastorno «prevalente, seriamente perjudicial, y altamente comórbido pero muy poco reconocido y tratado en todos los países y culturas».

El TDAH está asociado con un deterioro funcional en muchos dominios; un mayor riesgo en relación a problemas de salud mental (mayor ansiedad y depresión); menor nivel educativo; peor funcionamiento general; y mayores índices de abuso de sustancias, divorcio, desempleo y condenas penales (Erskine et al., 2016; Kessler et al., 2005; Lichtenstein et al., 2006, citados en Agnew-Blais et al., 2018). El estudio longitudinal de Stern et al. (2020) sugiere que la sintomatología del TDAH es predictora del desarrollo de problemas emocionales desde la infancia hasta la edad adulta.

La ausencia de causas físicas para el TDAH ha generado controversia en la prensa popular (Tripp y Wickens, 2009), con debates sobre su diagnóstico, el tratamiento farmacológico, y llegando a discutirse la existencia del trastorno. Comprender la base neurobiológica del TDAH supone un reto, pues diversos correlatos conductuales no son únicos del TDAH. Por ejemplo, los déficits observados en TDAH en memoria de trabajo, flexibilidad cognitiva, y atención, son similares a los observados en la esquizofrenia (Banaschewski et al., 2005, citados en Gallo y Posner, 2016). Este problema de especificidad se mantiene por la falta de estudios de neuroimagen que comparen directamente entre personas con TDAH y otros trastornos (Kasparek et al., 2015).

Dicho esto, Pievsky et al. (2018) llevaron a cabo una extensa revisión bibliográfica sobre el funcionamiento neurocognitivo de personas con TDAH. Tras revisar 34 metaanálisis y ponderar los resultados de cada dominio neurocognitivo por el número de estudios agregado, encontraron un rendimiento inferior en memoria de trabajo, variabilidad del tiempo de reacción, inhibición de respuesta, inteligencia/logro, planificación/organización, y vigilancia. La fuerza de la relación diagnóstico-funcionamiento neurocognitivo estaba moderada por la edad, con diferencias entre grupos más altas entre niños y adultos que entre jóvenes.

Existen diversas revisiones sistemáticas y metaanálisis que han tratado de arrojar luz sobre la pregunta «¿hay diferencias en resonancia estructural o funcional entre personas con TDAH y personas con desarrollo normativo?».

Kasparek et al. (2015) hicieron una revisión de la literatura de neuroimagen en TDAH. La [Tabla 1](#tabla-1), adaptada y traducida del artículo, recoge los hallazgos más importantes en el campo de la neuroimagen en niños.

##### **Tabla 1**. *Hallazgos en estudios de resonancia magnética. Adaptado y traducido de Kasparek et al. (2015).* {#tabla-1 .full-width}

{% wide_container() %}

| Región                                                                              | MG | MB  | CF  |
|-------------------------------------------------------------------------------------|----|-----|-----|
| Caudado                                                                             | ↓  |     | ↓   |
| Tálamo                                                                              | ↓  |     | ↓   |
| Cingulado anterior                                                                  | ↓  | ↓   | ↓   |
| Córtex prefrontal                                                                   | ↓  | ↓   | ↓   |
| Corteza premotora y AMS                                                             | ↓  |     | ↓   |
| Córtex parietal superior                                                            | ↓  |     | ↓   |
| Precúneo, cingulado posterior, córtex parietal lateral, córtex frontal medial (DMN) |    |     | ↓   |
| Cerebelo (vermis inferior posterior)                                                | ↓  | ↓   | ↓   |
| Cuerpo calloso (esplenio/istmo)                                                     |    | ↓   |     |
| Fascículo longitudinal superior                                                     |    | ↓   |     |
| Corona radiata anterior                                                             |    | ↓   |     |

*Nota*. La tabla resume los hallazgos más replicados en niños con TDAH. La flecha indica un menor volumen de materia gris o blanca, o una disminución de actividad y conectividad funcional (TDAH \< NT). MG = materia gris; MB = materia blanca; CF = conectividad funcional; AMS = área motora suplementaria; DMN = red neuronal por defecto.

{% end %}

El metaanálisis más reciente de neuroimagen estructural (Frodl y Skokauskas, 2011) detectó menor volumen en personas con TDAH en el globo pálido derecho, el putamen derecho, y el núcleo caudado bilateral. Al parecer, estos cambios se reducen con el paso del tiempo y con la medicación. Aun así, los adultos con TDAH muestran una reducción persistente del volumen del córtex cingulado anterior. Los datos, según los autores, sugieren que los niños que no reciben tratamiento tendrían más cambios estructurales en regiones límbicas como la amígdala y el córtex cingulado anterior.

Un metaanálisis de neuroimagen con tareas (Hart et al., 2013) identificó diferencias al inhibir el córtex frontal inferior, el área motora suplementaria, el córtex cingulado anterior, y respecto a la atención, el córtex prefrontal dorsolateral y parietal y áreas cerebelares. El metaanálisis de 55 estudios de diversas tareas de Cortese et al. (2012) encontró hipoactivación en la red de control ejecutivo frontoparietal, el putamen, y la red de atención ventral. Se observó hiperactivación sustancial en la red neuronal por defecto (DMN por sus siglas en inglés) y el circuito visual.

Respecto a metaanálisis de neuroimagen funcional en reposo (rsfMRI), el más reciente (Cortese et al., 2021) agregó los resultados de 30 estudios utilizando la técnica de *activation likelihood estimation* (estimación de probabilidad de activación; ALE). No encontraron convergencia espacial en ninguna área. En contraposición, el metaanálisis de Sutcubasi et al. (2020) incluyó 20 estudios con semillas y reportó menor activación de la DMN en niños con TDAH.

Este metaanálisis pretende responder a la pregunta «¿existen diferencias significativas entre la activación cerebral (*whole-brain*) entre personas con TDAH y neurotípicas (NT)?». A excepción del metaanálisis de Cortese et al. (2021), la evidencia parecería apuntar al «sí». Este metaanálisis supone dos aportes respecto al más reciente: en primer lugar, el uso de la metodología Seed-based d Mapping (SDM; Radua et al., 2012) es una alternativa superior para metaanálisis basados en coordenadas, con una configuración predeterminada que optimiza la sensibilidad a la par que protege ante falsos positivos. En segundo lugar: es el primer metaanálisis hasta la fecha que se centra en análisis del cerebro completo (*whole-brain*); el uso de regiones de interés (ROI) seleccionadas a priori viola la suposición de que cada vóxel tiene, *a priori*, la misma probabilidad de ser reportado, creando un sesgo considerable y otorgando excesiva importancia a estas regiones (Müller et al., 2018 y 2017, citados en Samea et al., 2019). El metaanálisis de Cortese et al. (2021) incluye una mayoría (18 de 30) de estudios con uso de semilla, lo cual genera un mapa de activación igualmente sesgado. Esto queda evidenciado al comparar los resultados de Cortese et al. (2021) con los de Sutcubasi et al. (2020). Estos últimos preseleccionaron 4 áreas (*seeds*) sobre las que realizar el metaanálisis —también en estado de reposo—, encontrando desconectividad en la DMN, con una menor conectividad en el córtex cingulado anterior y una mayor actividad en el giro frontal inferior. Así, este estudio supone una aportación libre de este sesgo hacia el objetivo de explicar a nivel neuronal los factores etiológicos de este complejo trastorno.

## Método

Este metaanálisis se ha llevado a cabo siguiendo las recomendaciones de Müller et al. (2018), la versión más reciente de *Preferred Reporting Items for Systematic Reviews and Meta-Analyses* (PRISMA; Page et al., 2020), así como los estándares para metaanálisis cuantitativos de la Asociación Americana de Psicología *JARS-Quant* (APA, 2018).

### Fuentes de información

Realizamos búsquedas de forma sistemática en 7 bases de datos: Scopus, PubMed, PsycInfo, Web of Science, ERIC, CINAHL, y Google Scholar. Con el objetivo de identificar estudios de neuroimagen funcional en estado de reposo, comparando personas con TDAH con NT, se utilizaron las cadenas de búsqueda de la [Tabla 2](#tabla-2). Las búsquedas incluyeron manuscritos publicados desde el inicio de las bases de datos hasta el 24 de febrero de 2021. La búsqueda se actualizó el 26 de mayo de 2021. Cuando el artículo cumplía los criterios de inclusión pero faltaba información, incluso tras consultar el material suplementario, se contactó con los autores de forma sistemática.

También se revisaron las referencias de metaanálisis y revisiones anteriores para asegurarnos de que todos los estudios elegibles estaban incluidos.

##### **Tabla 2**. *Cadenas de búsqueda y filtros utilizados en cada base de datos.* {#tabla-2 .full-width}

{% wide_container() %}

| Base de datos         | Cadena de búsqueda | Filtros adicionales |
|-----------------------|--------------------|---------------------|
| **Scopus**               | **Título**: ADHD OR "attention deficit" OR "hyperactivity disorder" OR hyperactive<br>**Título/Abstract/Palabras clave**: fMRI OR "functional connectivity" OR "functional magnetic resonance Imaging"<br>**Título/Abstract/Palabras clave**: "resting state" OR rest | **Tipo de documento**: Artículo<br>**Idioma**: Inglés; Español |
| **PubMed**               | **Título**: ADHD OR "attention deficit" OR "hyperactivity disorder" OR hyperactive<br>**Título/Abstract**: fMRI OR "functional connectivity" OR "functional magnetic resonance Imaging"<br>**Título/Abstract**: "resting state" OR rest | **Especie**: Humanos<br>**Idioma**: Inglés; Español |
| **PsycInfo**             | **Título**: ADHD OR "attention deficit" OR "hyperactivity disorder" OR hyperactive<br>**Todos los campos**: fMRI OR "functional connectivity" OR "functional magnetic resonance Imaging"<br>**Todos los campos**: "resting state" OR rest | **Especie**: Humanos<br>**Idioma**: Inglés; Español<br>**Tipo de documento**: Disertación, Artículo en revista |
| **Web of Science**<sup> a</sup> | **Título**: ADHD OR "attention deficit" OR "hyperactivity disorder" OR hyperactive<br>**Tema**: fMRI OR "functional connectivity" OR "functional magnetic resonance Imaging"<br>**Tema**: "resting state" OR rest | **Idioma**: Inglés; Español; No especificado<br>**Tipo de documento**: Artículo, Ensayo clínico, Acceso temprano, Reporte de caso, Otro, No especificado |
| **ERIC**                 | **title**:(ADHD OR "attention deficit" OR "hyperactivity disorder" OR hyperactive) **AND** (fMRI OR "functional connectivity" OR "functional magnetic resonance imaging") **AND** ("resting state" OR rest) | n/a |
| **CINAHL**               | **Título**: ADHD OR "attention deficit" OR "hyperactivity disorder" OR hyperactive<br>**Todos los campos**: fMRI OR "functional connectivity" OR "functional magnetic resonance Imaging"<br>**Todos los campos**: "resting state" OR rest | **Especie**: Humanos<br>**Idioma**: Inglés; Español<br>**Tipo de documento**: Artículo, Estudio de caso, Ensayo clínico, Tesis doctoral, Tesis de maestría, Ensayo controlado aleatorizado, Investigación |
| **Google Scholar**<sup> b</sup> | allintitle: ADHD fMRI rest<br>allintitle: attention deficit rsfMRI<br>allintitle: attention deficit resting state<br>allintitle: ADHD resting state fMRI | **Incluir patentes**: No<br>**Incluir citas**: No |

<sup>a</sup> Bases de datos: WOS, BCI, BIOSIS, CABI, CCC, DIIDW, KJD, MEDLINE, RSCI, SCIELO, ZOOREC <br> <sup>b</sup> A día de hoy, Google Scholar no permite el uso de booleanos. Utilizamos 4 cadenas de búsqueda distintas con el objetivo de obtener una búsqueda equivalente al resto de bases de datos.

{% end %}

### Criterios de inclusión y exclusión

Los criterios de inclusión y exclusión fueron acordados antes de llevar a cabo la búsqueda. Se incluyeron artículos empíricos —estudios primarios— que utilizaran resonancia magnética funcional en reposo, que compararan personas con TDAH —diagnosticados según el DSM-IV, DSM-5, ICD-10, o ICD-11— y NT, y que reportaran los resultados como coordenadas en un espacio estereotáctico estándar con un valor de significación asociado. Se excluyeron estudios que realizaran un análisis de regiones de interés *a priori* o análisis de integración funcional, así como estudios en idiomas que no fueran el español o el inglés.

Al encontrar artículos con muestra compartida, se optó por incluir aquel que ofreciera un análisis y resultados más completos.

### Selección de estudios

En la primera fase, artículos duplicados fueron descartados automáticamente por Mendeley y manualmente por el primer revisor (ÓF-V). En la segunda fase, los dos revisores (ÓF-V y Silvia Ruiz-Torras) cribamos todos los artículos de forma independiente —con la opción *ciego* activada— utilizando Rayyan (Ouzzani et al., 2016) en función de su título y resumen. En la tercera fase se exportaron las referencias incluidas y se obtuvieron los textos completos. De nuevo, ambos revisores evaluamos los artículos de forma independiente para determinar su inclusión o exclusión. En ninguna de las fases de cribado fue necesario resolver desacuerdos con un revisor adicional; todos los desacuerdos pudieron resolverse al final de cada fase tras un diálogo entre los dos revisores.

### Recopilación de datos

ÓF-V extrajo en una tabla estandarizada los datos relevantes de cada artículo incluido. Los metadatos recogidos fueron: Autores, año, DOI, título, país, revista, objetivo, población de estudio. Respecto a la información referente a los sujetos del estudio, se extrajo el tamaño de la muestra total; el número de personas con TDAH y NT; la edad y rango o desviación estándar de cada grupo; si se hizo emparejamiento entre los grupos y cómo; el porcentaje de mujeres en cada grupo; el criterio diagnóstico de TDAH (y su instrumento); comorbilidades (tipos y porcentaje) y porcentaje de sujetos medicados. Se extrajo información sobre el método del estudio: el tipo y potencia del escáner, las instrucciones que recibieron los participantes antes de iniciar el escaneo, y el tipo de análisis. En cuanto a los resultados, se recogieron todas las coordenadas de los análisis relevantes junto a su valor de significación estadística, las conclusiones del artículo y sus limitaciones. Todas las coordenadas reportadas en Talairach fueron convertidas a MNI utilizando *Brett tal2mni* (Lancaster et al., 2007). Los valores de significación estadística proporcionados como *F* o *p* fueron convertidos a *t* a través de la fórmula *t = √F*&nbsp; y el [conversor de la web del proyecto SDM](https://www.sdmproject.com/utilities/?show=Statistics). Finalmente se recogió información sobre el umbral de significación estadística utilizado por cada estudio, indicando si era corregido o sin corregir. Siguiendo las indicaciones de Albajes-Eizagirre et al. (2019), si se proporcionaba el valor *t* indicado como umbral, se registró este valor; si en vez de un valor *t* solamente se indicaba un valor *p*, éste se convirtió en *t* utilizando el conversor de SDM. Si el artículo utilizaba estadísticos basados en clústeres, se usaba ese valor de significación. Cuando ninguno de estos valores estaba disponible, se registró un valor de umbral ligeramente inferior al valor de significación asociado al clúster significativo con menor número de vóxeles.

### Evaluación de calidad

Siguiendo revisiones de neuroimagen anteriores (Shepherd et al., 2012; Du et al., 2014, citados en Sun et al., 2020), ÓF-V evaluó la calidad de los estudios utilizando una lista de comprobación de 11 ítems (ver [Tabla 3](#tabla-3)). Los ítems están agrupados en 3 categorías: información sobre los participantes; métodos para la adquisición y análisis de la imagen; y resultados y conclusiones. Cada aspecto evaluado se puntuó con un valor de 0 si no se cumplía, 0,5 si se cumplía parcialmente, o 1 si se cumplía por completo.

##### **Tabla 3**. *Evaluación de calidad de la metodología por categorías.* {#tabla-3 .full-width}

{% wide_container() %}

<table>
    <thead>
        <tr>
            <th><strong>Categoría 1: sujetos</strong></th>
        </tr>
    </thead>
    <tbody>
        <tr><td>1. Los pacientes fueron evaluados prospectivamente, criterios diagnósticos específicos fueron aplicados y los datos demográficos fueron reportados.</td></tr>
        <tr><td>2. Los sujetos del grupo sano fueron evaluados prospectivamente, excluyendo trastornos psiquiátricos y otras enfermedades.</td></tr>
        <tr><td>3. Se controlaron variables importantes (edad, género, medicación, comorbilidad, severidad del trastorno…), o bien a través de la estratificación o estadísticamente.</td></tr>
        <tr><td>4. Tamaño de la muestra por grupo >10.</td></tr>
    </tbody>
    <thead>
        <tr>
            <th><strong>Categoría 2: métodos para la adquisición de imágenes y análisis</strong></th>
        </tr>
    </thead>
    <tbody>
        <tr><td>5. Potencia del imán ≥1.5 T.</td></tr>
        <tr><td>6. Análisis <i>whole-brain</i> fue automatizado sin ninguna región seleccionada a priori.</td></tr>
        <tr><td>7. Coordenadas reportadas en espacio estándar.</td></tr>
        <tr><td>8. La técnica de imágenes fue descrita claramente, permitiendo su reproducción.</td></tr>
        <tr><td>9. Las medidas fueron descritas claramente, permitiendo su reproducción.</td></tr>
    </tbody>
    <thead>
        <tr>
            <th><strong>Categoría 3: resultados y conclusiones</strong></th>
        </tr>
    </thead>
    <tbody>
        <tr><td>10. Los parámetros estadísticos para diferencias significativas y no-significativas importantes fueron provistos.</td></tr>
        <tr><td>11. Las conclusiones fueron consistentes con los resultados obtenidos y las limitaciones fueron discutidas.</td></tr>
    </tbody>
</table>

{% end %}

### Metaanálisis

Llevamos a cabo un metaanálisis basado en vóxeles utilizando SDM (Radua et al., 2012), versión 6.21. Los autores del software y metodología explican (Albajes-Eizagirre et al., 2019) que la mayoría de métodos metaanalíticos utilizan una prueba para convergencia de picos (*peaks*) con diversas limitaciones, y después llevan a cabo una clasificación binaria de la evidencia basándose exclusivamente en el p-valor. Además, estas pruebas de convergencia de picos se basan en la delicada suposición de que los vóxeles son independientes y tienen la misma probabilidad de generar un pico «falso», cuando lo cierto es que, en la materia gris real, cada vóxel correlaciona con sus vecinos, así que la probabilidad de que un vóxel muestre un pico «falso» depende de la composición de su tejido. Finalmente, esta metodología implica paradojas como que el poder estadístico aumente cuando hay pocos efectos reales y disminuya cuando hay múltiples efectos reales. En contraposición, los autores proponen el uso de SDM, que imputa los mapas cerebrales de los efectos estadísticos reportados en cada estudio y utiliza el modelo de efectos aleatorios para comprobar formalmente si los efectos son distintos a cero. Señalan diversas ventajas: las activaciones y desactivaciones son consideradas a la vez, de manera que los hallazgos contradictorios se cancelan entre ellos; y el uso del tamaño del efecto con el modelo de efectos aleatorios aumenta la fiabilidad y el rendimiento.

Introdujimos en SDM las siguientes variables para cada estudio, tanto de hiper como de hipoactivación: nombre del estudio; número de sujetos con TDAH; número de sujetos NT; si se habían controlado comorbilidades; número de elementos utilizados para emparejar los sujetos; edad media del grupo TDAH; valor del umbral *t*; y si el umbral era corregido o sin corregir.

El preprocesado se realizó con los valores predeterminados de SDM. A modo de resumen: se analizaron los picos en materia gris con 50 imputaciones para reducir el sesgo asociado a la imputación única (Rubin, 1987). A nivel técnico, se seleccionó: Modalidad *Functional MRI or PET*; Plantilla de correlación *gray matter*; Anisotropía *1,00*; Anchura a media altura isotrópica *20mm*; Máscara *gray matter*; Tamaño de vóxel *2mm*. El análisis de medias se computó con el valor predeterminado de imputaciones: 50. Para controlar adecuadamente los falsos positivos utilizamos la aproximación recomendada por Radua et al. (2012, citados en Müller et al., 2018): establecer un umbral de p-valor sin corregir = .005 y un tamaño de clúster de 10 vóxeles.

Si el número de estudios era suficiente, las variables de edad, número de características utilizadas para emparejar y comorbilidades se utilizarían para subanálisis de heterogeneidad.

### Sesgo de publicación

La heterogeneidad de los estudios se analizó utilizando los valores de τ, Q y P proporcionados por el preprocesado de SDM. Asimismo, el sesgo de publicación fue evaluado a través de la inspección visual del *funnel plot* generado vía SDM con las coordenadas de las áreas significativas.

## Resultados

### Selección de estudios

La búsqueda inicial produjo 843 registros (ver [Figura 1](#figura-1)). Tras remover duplicados, 342 artículos fueron cribados de forma independiente con un índice inicial de concordancia entre los revisores del 86,29%. La mayoría de artículos excluídos por utilizar semillas o ROI se centraron en la red neuronal por defecto, la red de control cognitivo, regiones subcorticales, cuerpo estriado, núcleo accumbens, núcleo caudado o el putamen. Tras revisar los textos completos, con una concordancia inicial del 95,34%, se excluyeron 33 artículos. 3 de ellos compartían muestra: An et al. (2013), Tian et al. (2008) y Cao et al. (2006). Se eligió el más reciente por ofrecer un análisis más exhaustivo de los datos. 3 artículos no proporcionaban información estadística asociada a las coordenadas de los picos: de Celis Alonso et al. (2014), Qiu et al. (2010) y Somandepalli et al. (2015). Se contactó con los autores, pero se terminaron descartando por no recibir respuesta o recibirla conforme no disponían de esos datos. Así, terminamos con 10 artículos para el metaanálisis (marcados con un asterisco en [Referencias](#referencias)).

##### **Figura 1**. *Diagrama de flujo PRISMA de la búsqueda y selección/exclusión de estudios.* {#figura-1 .full-width}

{{ invertible_image(src="img/prisma.es.webp", alt="Diagrama de flujo PRISMA", full_width=true) }}

### Características de los estudios incluidos

La [Tabla 4](#tabla-4) refleja las características de los 10 estudios seleccionados. El 80% de los estudios tiene su origen en China; uno se originó en Irán (Shekarchi et al., 2014) y otro (Shang et al., 2018) en Taiwán. Para nuestra sorpresa, ninguno de los artículos seleccionados estudió la población adulta; la edad media ponderada de los estudios es de 11,03 en el grupo TDAH y 10,69 en el grupo NT. La gran mayoría de estudios no incluyó niñas en su muestra. En los que sí lo hicieron (3/10), las niñas conformaron entre un 8,1% y un 54% de la muestra. La media del tamaño de la muestra total es de 68,2, con un rango de 25 a 182. La mayoría de estudios (8 de 10) emparejaron los sujetos de cada grupo utilizando al menos una variable. Prácticamente todos los estudios controlaron comorbilidades; sólo 3 incluyeron participantes con trastorno negativista desafiante, dificultades en el aprendizaje, síndrome de Tourette o trastorno de la conducta. Respecto a la medicación, la mitad de artículos sólo incluyeron a niños sin historial de medicación; el resto o bien reportaron que el número de sujetos con TDAH medicados era distinto a 0 (n = 2) o reportaron el número de sujetos que se estaban medicando (n = 2). Un artículo no proporcionó información al respecto.

Todos los estudios utilizaron escáneres de Siemens con una potencia de al menos 1,5 T. Excepto un estudio (An et al., 2013b), todos los artículos proporcionaron información sobre las instrucciones que recibieron los sujetos antes de llevar a cabo la neuroimagen. Todos pidieron a los sujetos que cerraran los ojos, pero había variabilidad en cuanto al resto de instrucciones: algunos estudios pedían que no se pensara en nada de forma sistemática, otros que no se pensara en nada en concreto, otros que se mantuvieran en un estado calmado. Hay variabilidad en el tipo de análisis realizado: la mayoría (60%) utilizaron Homogeneidad regional (ReHo); la mitad usó Amplitud de fluctuaciones de baja frecuencia (ALFF); dos estudios utilizaron análisis de grado de centralidad (DC); en uno llevaron a cabo análisis de la conectividad homotópica reflejada en vóxeles (VMHC); y en uno utilizaron análisis de componentes independientes (ICA) grupal. Ocho estudios reportaron los picos utilizando las coordenadas en el espacio estereotáctico MNI y dos utilizaron el estándar Talairach. De los 10 estudios, 7 reportaron los valores estadísticos de los picos con el valor *t*, los otros 3 utilizaron el *p*-valor (2) o el valor *F* (1).

##### **Tabla 4**. *Datos descriptivos de los estudios incluidos en el metaanálisis.* {#tabla-4 .full-width}

{% wide_container() %}

| Referencia                  | n (TDAH)| Edad (TDAH) | Porcentaje medicado (TDAH) | n (NT) | Edad (NT) | Emparejamiento              | Tipo de análisis | Umbral de significación (t) |
|-----------------------------|---------|-------------|----------------------------|--------|-----------|-----------------------------|------------------|-----------------------------|
| **An et al. (2013a)**       | 19      | 13.3        | 0%                         | 23     | 13.2      | Edad.                       | ReHo; ALFF       | 2.42                        |
| **An et al. (2013b)**       | 22      | 12.5        | 32%                        | 30     | 11.8      | Edad y mano dominante.      | ReHo             | 2.40                        |
| **Jiang et al. (2019)**     | 30      | 9.2         | 0%                         | 33     | 9.7       | Edad, sexo y mano dominante.| DC; VMHC         | 2.34                        |
| **Jiang et al. (2020)**     | 18      | 8.8         | n/a                        | 18     | 9         | No emparejados.             | ALFF             | 2.44                        |
| **Li et al. (2014)**        | 33      | 10.1        | 0%                         | 32     | 10.9      | Mano dominante.             | ALFF             | 1.67<sup> a</sup>           |
| **Shang et al. (2018)**     | 37      | 10.5        | 0%                         | 37     | 11.1      | n/a                         | ReHo             | 2.65                        |
| **Wang et al. (2017)**      | 91      | 12.4        | >0%                        | 91     | 12.2      | Edad y mano dominante.      | ALFF; ReHo; DC   | 2.12                        |
| **Shekarchi et al. (2014)** | 21      | 8.5         | >0%                        | 21     | n/a       | Edad.                       | ReHo; Group ICA  | 1.65<sup> a</sup>           |
| **Yu et al. (2016)**        | 30      | 10.2        | 0%                         | 30     | 10.3      | Edad y mano dominante.      | ReHo             | 2.66                        |
| **Zang et al. (2007)**      | 13      | 13          | 15%                        | 12     | 13.1      | Edad y mano dominante.      | ALFF             | 2.796                       |

*Nota.* Se recogieron más datos: DOI, país, objetivo del estudio, población, diagnóstico, comorbilidades, rango o desviación típica de la edad, instrucciones a los participantes al hacer la resonancia, tipos de análisis, conclusiones y limitaciones. Esta información está disponible en los respectivos artículos originales. <br> <sup>a</sup> Valor corregido. El resto de valores son sin corregir.

{% end %}

### Resultados de los estudios

La mitad de los artículos (An et al., 2013a y 2013b; Jiang et al. 2019 y 2020; Wang et al. 2017; Shekarchi et al., 2014; Yu et al., 2016; y Zeng et al., 2007) reportaron una disfunción en el cerebelo. Un 30% halló diferencias de activación en el córtex cingulado anterior (An et al., 2013a; Shekarchi et al., 2014; Zeng et al., 2007). La [Tabla 5](#tabla-5) contiene las distintas coordenadas identificadas por cada estudio así como los hallazgos reportados relevantes a este metaanálisis. La [Tabla 6](#tabla-6) presenta las limitaciones reportadas por cada estudio.

##### **Tabla 5**. *Coordenadas junto a su estadístico t y los hallazgos de cada artículo.* {#tabla-5 .full-width}

{% wide_container() %}

| Estudio          | Coordenadas MNI (x, y, z, *t*)                                                                                            | Hallazgos                                                                                                                                                                               |
|------------------|----------------------------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| An et al. (2013a)| <small>18, -84, -33, -4.67 <br> 48, 45, 12, -4.64<details><summary>Más</summary>-33, -60, -30, -4.31<br> 30, -75, -24, -4.19 <br> 6, -48, 75, -3.69 <br> 3, 51, 12, -3.46 <br> -3, 54, 3, -3.20 <br> 18, -78, -3, 3.69 <br> 15, 42, 21, 3.08 <br> -24, -60, -6, 3.4 <br> 18, -81, -3, 4.52 <br> 69, -21, 24, -4.05 <br> 30, -72, -27, -3.89 <br> -42, 30, -18, -3.86 <br> 42, 0, 63, -3.75 <br> -3, 0, 60, -3.49 <br> 12, 6, 66, -3.12 <br> 18, 6, -15, -3.37 <br> -6, -78, -21, -3.32 <br> 66, 0, 9, -3.24 <br> 33, 21, 54, -3.18 <br> 0, -51, 21, -2.91 <br> 21, -78, -3, 4.08 <br> -39, 39, -3, 3.63 <br> -21, -93, -12, 3.27 <br> -21, -30, 72, 3.53 <br> -9, -75, 21, 3.38 <br> -27, 39, 21, 3.20 <br> -60, 0, -24, -3.8 </details></small> | Los síntomas de TDAH correlacionaron con los valores de ReHo en el cerebelo derecho, el córtex cingulado anterior y el giro lingual izquierdo, pero no los valores de ALFF.                                      |
| An et al. (2013b)| <small>-18, 54, 15, -4.00 <br> 18, 24, 45, -3.53<details><summary>Más</summary>-12, -81, 24, 5.07<br> -3, -18, 57, 4.26 <br> 15, -102, 6, 3.16 <br> 21, -39, 66, 3.93 <br> 18, -9, 66, 3.78 <br> 18, -63, 18, 3.60 <br> -45, -30, 66, 3.59</details></small> | Una dosis de metilfenidato normaliza las disfunciones fronto-parieto-cerebelares de chicos con TDAH en estado de reposo.                                                                 |
| Jiang et al. (2019)| <small>-9, -30, 63, 5.81 <br> 9, -30, 63, 5.81<details><summary>Más</summary>-6, -84, 27, 5.82<br> 6, -84, 27, 5.82 <br> -6, -60, -45, 6.17 <br> 6, -60, -45, 6.17</details></small> | Comparados con el grupo NT, los niños con TDAH muestran una activación de VMHC superior en el lóbulo frontal superior bilateral y los lóbulos cerebelares anteriores bilaterales.                                |
| Jiang et al. (2020) | <small>3, 39, -21, 4.14 <br> -30, -6, -36, 2.59<details><summary>Más</summary>-54, -57, -6, -5.73<br> 3, -54, -12, 3.63 <br> -48, -36, 51, -1.62</details></small> | El grupo con TDAH mostró un aumento de ALFF en el córtex prefrontal medial bilateral, giro temporal inferior, lóbulo cerebelar anterior, y menor ALFF en el giro temporal central izquierdo.                      |
| Li et al. (2014)    | <small>18.18, 6, 2, 2.98<br>-12.12, 6, 2, 2.73<details><summary>Más</summary>21.21, 30, 38, 1.99<br>-24, 47, -11, -2.73<br>-18, 71, 5, -2.84</details></small> | El grupo TDAH mostró un deterioro en las funciones ejecutivas; menor ALFF en el córtex orbitofrontal izquierdo y el giro frontal izquierdo ventral superior; y mayor ALFF en el globo pálido derecho, el giro frontal dorsal superior derecho. |
| Shang et al. (2018) | <small>33, -9, -6, -8<br>-33, -9, -6, -6.05<details><summary>Más</summary>0, -66, 15, -3.72<br>48, -12, 45, -6.28<br>-9, 9, 42, -4.83<br>-3, -36, 54, -5</details></small> | El haplotipo CT interaccionaba de forma significativa con el TDAH en el giro poscentral derecho.                                                                                         |
| Wang et al. (2017)  | <small>0, -75, 24, 3.59<br>33, -69, -36, -3.70<details><summary>Más</summary>-3, -33, 69, 4.15<br>-6, 51, -6, 3.34</details></small> | Los datos agrupados mostraron actividad anormal en TDAH en diversas regiones: corteza somatosensorial bilateral, cerebelo bilateral y giro lingual bilateral.                                                  |
| Shekarchi et al. (2014) | <small>34, 45, 16, -2.15<br>22, 43, 12, -2.42<details><summary>Más</summary>25, 9, 28, -2.42<br>15, 47, 26, -2.12<br>22, 18, 4, -1.68<br>29, 8, 13, -2.42<br>15, 33, 8, -2.46</details></small> | Hipoactivación en TDAH en el córtex cingulado anterior, el giro frontal inferior, componentes posteriores de la red neuronal por defecto, el cerebelo y el tronco encefálico.                                   |
| Yu et al. (2016)    | <small>-3, 63, 39, -4.39<br>51, -51, 33, -3.84<details><summary>Más</summary>-6, -48, 39, -3.70<br>24, -48, -57, 3</details></small> | Comparado con el grupo NT, el grupo TDAH mostró menor ReHo en la red neuronal por defecto. El grupo TDAH mostró mayor ReHo en el cerebelo posterior. |
| Zang et al. (2007) | <small>-50, -59, -25, 3.69 <br> 13, -26, -5, -4.00<details><summary>Más</summary>46, 19, 7, -3.82<br> 62, -53, -17, 4.60 <br> -10, -29, 72, 3.19 <br> -4, -68, -18, -3.39<br>-13, -58, -39, -3.36 <br> 28, -65, -29, -3.78 <br> 46, -54, -57, -3.82 <br> 7, 11, 42, 3.83 <br> -7, -19, -16, -4.05</details></small> | Menor ALFF en TDAH en el córtex frontal inferior derecho, cerebelo. Mayor ALFF en córtex cingulado anterior, corteza somatosensorial y el tronco encefálico bilateral. |

{% end %}

<br>

##### **Tabla 6**. *Limitaciones descritas en cada estudio.* {#tabla-6 .full-width}

{% wide_container() %}

| Estudio                 | Limitaciones                                                                                                                                                                                                                                      |
|-------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| An et al. (2013a)       | n/a                                                                                                                                                                                                                                               |
| An et al. (2013b)       | Poca muestra en subanálisis; historial de medicación no controlado; sesgos inherentes al suavizado de ReHo.                                                                                                                                       |
| Jiang et al. (2019)     | Muestra reducida.                                                                                                                                                                                                                                 |
| Jiang et al. (2020)     | Edad de grupo NT con rango inferior a los otros grupos.                                                                                                                                                                                           |
| Li et al. (2014)        | Posible distorsión de diferencias en conectividad funcional por uso de regresión en la señal global; mezcla de subtipos en grupo de TDAH.                                                                                                         |
| Shang et al. (2018)     | Muestra modesta; gran rango de edad en grupo TDAH.                                                                                                                                                                                                |
| Wang et al. (2017)      | Reducido tamaño de la muestra no permitió explorar la contribución del subtipo de TDAH; sólo usaron 3 medidas para evaluar consistencia entre cohortes.                                                                                           |
| Shekarchi et al. (2014) | n/a                                                                                                                                                                                                                                               |
| Yu et al. (2016)        | Grupo TDAH con puntuaciones de cociente intelectual (CI) inferiores a NT y no se controló al hacer ANOVA; heterogeneidad de subtipos; 13 niños con comorbilidades; sólo incluye niños, no niñas.                                                  |
| Zeng et al. (2007)      | No pudieron corregir el sesgo generado por el ritmo cardíaco; no usaron corrección para comparaciones múltiples al comparar los grupos; no presentaron la correlación entre CI y ALFF; la mezcla de subtipos de TDAH pudo afectar los resultados. |

{% end %}

### Síntesis de resultados

Todos los estudios reportaron al menos cuatro picos significativos (ver [Tabla 5](#tabla-5)) al comparar el grupo TDAH con el NT. Los tamaños del efecto (*d* de Cohen en valor absoluto) de cada estudio oscilan entre un 0,545 (Wang et al., 2017) y un 1,483 (Zang et al., 2007). Siguiendo las recomendaciones de Sawilowsky (2009), todos se clasificarían entre un tamaño del efecto medio y muy grande. En la [Figura 2](#figura-2) aparece el *forest plot* con los tamaños del efecto, los intervalos de confianza y la media para cada grupo de picos (positivos y negativos).

##### **Figura 2**. *Forest plot de los artículos metaanalizados. El eje horizontal es el tamaño del efecto (d de Cohen).* {#figura-2 .full-width}

{{ invertible_image(src="img/forest_plot.es.png", alt="Forest plot", full_width=true) }}

Los valores de heterogeneidad de los picos positivos fueron moderados (I<sup>2</sup> = 46,99; Q = 13,20; df = 7) y los de los picos negativos fueron bajos (I<sup>2</sup> = 32,45; Q = 11,84; df = 8). Dados los pocos estudios encontrados, no se pudieron llevar a cabo subanálisis con potencia suficiente explorando el efecto de variables como la edad, el sexo o las comorbilidades.

Llevamos a cabo el metaanálisis en SDM. El umbral p sin corregir \< .05 resultó en tres picos estadísticamente significativos, listados en la [Tabla 7](#tabla-7). Encontramos 2 clústeres con diferencias positivas (TDAH \> NT) con tamaño superior a 25 vóxeles en el lóbulo paracentral izquierdo y el cuerpo calloso. El clúster más significativo (p \< .001; 543 vóxeles; SDM-Z = -3,683) es una diferencia negativa (TDAH \< NT) en el cerebelo derecho. Las coordenadas se pueden observar en la [Tabla 7](#tabla-7) y las Figuras [3](#figura-3) y [4](#figura-4). Las áreas significativas al completo quedan representadas en la [Figura 5](#figura-5). Al hacer un análisis *post hoc* más exigente, analizando los datos tras emplear *Family-Wise Error Correction* (FWEC) vía SDM con 1000 permutaciones, sólo el pico del cerebelo derecho superó el umbral p \< .05.

##### **Tabla 7**. *Clústeres significativos con \|SDM-Z\| ≥ 1,96.* {#tabla-7 .full-width}

{% wide_container() %}

| Coordenadas MNI | SDM-Z <sup>a</sup> | p           | Vóxeles | Área <sup>b</sup>                     |
|-----------------|--------------------|-------------|---------|---------------------------------------|
| -6, -30, 74     | 3,112              | 0,000928640 | 75      | Lóbulo paracentral izquierdo, AB 4    |
| -8, -76, 26     | 2,886              | 0,001951694 | 25      | Cuerpo calloso                        |
| 34, -64, -32    | -3,683             | 0,000115097 | 543     | Cerebelo derecho, crus I <sup>b</sup> |

*Nota*. AB = Área de Brodmann. <br> <sup>a</sup> El valor SDM-Z es el tamaño del efecto (g de Hedges) dividido por el error estándar. Al estar basado en valores provenientes de las permutaciones de SDM, no sigue una distribución normal. <br> <sup>b</sup> El hallazgo en el cerebelo derecho es el único que sobrevivió con p=.0469 tras aplicar FWEC. El tamaño del clúster con la corrección se redujo a 5 vóxeles.

{% end %}

##### **Figura 3**. *Representación del pico negativo significativo en el cerebelo derecho.* {#figura-3 .full-width}

{{ invertible_image(src="img/figure3.webp", alt="Representación del pico negativo significativo en el cerebelo derecho", full_width=true) }}

##### **Figura 4**. *Vista lateral, medial y dorsal de los dos picos positivos significativos en función de su tamaño.* {#figura-4 .full-width}

{{ invertible_image(src="img/figure4.webp", alt="Vista lateral, medial y dorsal de los dos picos positivos significativos en función de su tamaño", full_width=true) }}

##### **Figura 5**. *Corte coronal, sagital y axial del área hipoactivada (izquierda) e hiperactivadas (derecha).* {#figura-5 .full-width}

{{ dimmable_image(src="img/figure5.webp", alt="Funnel plot", full_width=true) }}

La inspección visual del *funnel plot* (Figura 6) asociado a la coordenada del cerebelo estadísticamente significativa no sugiere evidencia de sesgo de publicación.

##### **Figura 6**. *Funnel plot para el clúster estadísticamente significativo de menor activación en el cerebelo.* {#figura-6 .full-width}

{{ invertible_image(src="img/funnel_plot.png", alt="Funnel plot", full_width=true) }}

### Evaluación de calidad

La [Tabla 8](#tabla-8) muestra la evaluación de la calidad de los artículos incluidos en el metaanálisis. La mayoría obtuvieron la máxima puntuación en las distintas categorías.

##### **Tabla 8**. *Evaluación de la calidad de cada artículo por categorías.* {#tabla-8 .full-width}

{% wide_container() %}

| Estudio        | S 1 | S 2 | S 3 | S 4 | M 5 | M 6 | M 7 | M 8 | M 9 | R 10 | R 11 | Puntuación sobre 11 |
|----------------|-----|-----|-----|-----|-----|-----|-----|-----|-----|------|------|---------------------|
| An2013a        | 1   | 1   | 1   | 1   | 1   | 1   | 1   | 1   | 1   | 1    | 0,5  | 10,5                |
| An2013b        | 1   | 1   | 1   | 1   | 1   | 1   | 1   | 1   | 1   | 1    | 1    | 11                  |
| Jiang2019      | 1   | 1   | 1   | 1   | 1   | 1   | 1   | 1   | 1   | 1    | 1    | 11                  |
| Jiang2020      | 1   | 0   | 1   | 1   | 1   | 1   | 1   | 1   | 0,5 | 1    | 1    | 9,5                 |
| Li2014         | 1   | 1   | 1   | 1   | 1   | 1   | 1   | 1   | 1   | 1    | 1    | 11                  |
| Shang2018      | 1   | 1   | 1   | 1   | 1   | 1   | 1   | 1   | 1   | 1    | 1    | 11                  |
| Wang2017       | 1   | 0,5 | 1   | 1   | 1   | 1   | 1   | 1   | 1   | 1    | 1    | 10,5                |
| Shekarchi2014  | 1   | 1   | 1   | 1   | 1   | 1   | 1   | 0,5 | 1   | 0,5  | 0,5  | 9,5                 |
| Yu2016         | 1   | 1   | 1   | 1   | 1   | 1   | 1   | 1   | 1   | 1    | 1    | 11                  |
| Zang2007       | 1   | 0,5 | 1   | 1   | 1   | 1   | 1   | 1   | 1   | 1    | 0,5  | 10                  |

*Nota*. Prefijos de las columnas: «S» para «Sujetos», «M» para «métodos de imágenes y análisis», y «R» para «resultados y conclusiones» (categorías detalladas en la [Tabla 3](#tabla-3)). Puntuación: 0 (no cumplido), 0,5 (parcial), 1 (completo).

{% end %}

## Discusión

Hemos llevado a cabo un metaanálisis siguiendo las mejores prácticas disponibles (Müller et al., 2018). Tras usar estrictos criterios de selección, incluimos 10 artículos para metaanalizar centrados en las activaciones del cerebro en reposo de niños con TDAH comparado con NT. El metaanálisis encontró convergencia espacial en 3 áreas: 2 clústeres positivos reducidos en el lóboulo parecentral izquierdo y el cuerpo calloso, y un clúster negativo más grande en el cerebelo derecho. Este último hallazgo fue el único que se mantuvo al hacer un análisis *post-hoc* con FWEC y seleccionar un umbral de p \< .05.

Estos resultados divergen de los hallazgos más recientes (Cortese et al., 2021). Esto no debería ser sorprendente. En primer lugar, estos autores incluyeron 18 estudios basados en semillas. Tras realizar el metaanálisis de esos artículos, añadieron los estudios *whole-brain*. Es decir, que tan solo un 40% de sus artículos cumplían los criterios aplicados en este metaanálisis. En segundo lugar, los metaanálisis también se diferencian por la metodología de análisis de los picos: Cortese et al. (2021) emplearon ALE en vez de SDM. Siendo así, este metaanálisis puede considerarse una síntesis más específica del campo de la rsfMRI en TDAH.

Los resultados relativos al pico de hipoactivación en el cerebelo no son sorprendentes; se trata de uno de los hallazgos más tempranos. Además, el metilfenidato, uno de los tratamientos farmacológicos más frecuentes y eficaces para tratar el TDAH, genera cambios en la activación cerebelar de los niños (Rubia et al., 2009, citados en Stoodley, 2016). Adicionalmente, la red frontocerebelar está asociada con la habilidad de estimar los tiempos de las actividades, los intervalos de tiempo y las predicciones temporales (Durston, van Belle y de Zeeuw, 2011, citados en Kasparek et al., 2015), algo especialmente difícil para las personas con TDAH.

Por otro lado, el pico positivo del lóbulo paracentral izquierdo está situado en el área de la corteza motora primaria. Su función (ejecutar movimientos motores que impliquen movimientos contralaterales de dedos, manos, muñecas u orofaciales; secuencias motoras aprendidas; control de la respiración; parpadeo voluntario) encaja con las características del trastorno, especialmente el subtipo de hiperactividad. Finalmente, se ha visto que el cuerpo calloso es fundamental en la comunicación interhemisférica; una disfunción de esta área podría contribuir a las alteraciones de redes cerebrales asociadas con el TDAH (Gehrickle et al., 2017).

La calidad de la evidencia encontrada es moderadamente alta, con protocolos bien descritos, tamaños de muestra mejorables y algunos umbrales de significación estadística quizás demasiado laxos.

La generalización de las conclusiones es limitada por varios motivos. En primer lugar, ninguna de las publicaciones estudió la población joven o adulta. Además, el porcentaje de niñas en las muestras es muy reducido. Si bien hay más prevalencia en niños que en niñas, la diferencia en presentación del trastorno (Ramtekkar et al., 2010) justifica su estudio.

Los resultados de este metaanálisis deberían considerarse teniendo en cuenta sus fortalezas y limitaciones. Respecto a las fortalezas, llevamos a cabo una búsqueda exhaustiva en bases de datos; seguimos las recomendaciones para llevar a cabo un metaanálisis de neuroimagen y las pautas PRISMA; usamos Rayyan para minimizar la posibilidad de pérdida de evidencia; el cribaje en todas sus fases fue realizado por dos revisores de forma independiente; seleccionamos cuidadosamente los artículos antes de incluirlos; descartamos estudios con muestras compartidas o que no fueran *whole-brain*; evaluamos la calidad de los estudios; encontramos resultados significativos con un número reducido de estudios pero con un funnel plot que no sugiere sesgo de publicación para el pico asociado al cerebelo.

Más allá de las limitaciones consideradas por cada estudio ([Tabla 6](#tabla-6)), este metaanálisis tiene diversas limitaciones. La más evidente es que el número de estudios analizados (n = 10) confiere de poca potencia al metaanálisis, dificultando la detección de efectos más pequeños y aumentando el riesgo de que los resultados se vean afectados por estudios individuales. Además, esta cifra imposibilitó los subanálisis de heterogeneidad para analizar diferencias de sexo, edad, tipo de diagnóstico o medicación. También cabe mencionar que, a diferencia de otros metaanálisis, aquí sólo se incluyó literatura publicada en inglés o en español, omitiendo diversos estudios publicados en chino, por ejemplo. Otra limitación del estudio es que la exclusión de experimentos con análisis de ROI puede suponer un sesgo en sí mismo, pues provoca el descarte de muchos estudios (Müller et al., 2018). Con el objetivo de no descuidar la importancia de las regiones utilizadas como ROI, se ha reportado el número de estudios excluidos por este motivo, así como las regiones más frecuentemente utilizadas. Finalmente, los estudios de rsfMRI no pueden dar respuesta sobre el rol funcional de las áreas cerebrales, que es conocido solamente por analogía con otros estudios (Wig et al., 2011, citados en Tomasi y Volkow, 2011). En este sentido, teniendo en cuenta que cabe interpretar con cautela los resultados de todo estudio de rsfMRI, dicha precaución debe ser también tomada al considerar la implicación funcional de metaanálisis que agreguen esta evidencia.

En resumen, hemos identificado alteraciones en rsfMRI significativas en el cerebelo, una región implicada en procesos neuropsicológicos deteriorados en el TDAH. Este metaanálisis contribuye al creciente campo de la neuroimagen en trastornos psicológicos. Futuros estudios deberían tratar de emplear muestras con gran poder estadístico e incluir mujeres y adultos para conocer la heterogeneidad de la patología y aumentar la comprensión de la evolución del trastorno a lo largo del tiempo.

## Referencias

{% references() %}

Agnew-Blais, J. C., Polanczyk, G. V., Danese, A., Wertz, J., Moffitt, T. E., y Arseneault, L. (2018). Young adult mental health and functional outcomes among individuals with remitted, persistent and late-onset ADHD. *British Journal of Psychiatry*, *213*(3), 526-534. [https://doi.org/10.1192/bjp.2018.97](https://doi.org/10.1192/bjp.2018.97)

Albajes-Eizagirre, A., Solanes, A., Fullana, M. A., Ioannidis, J. P. A., Fusar-Poli, P., Torrent, C., Solé, B., Bonnín, C. M., Vieta, E., Mataix-Cols, D., y Radua, J. (2019). Meta-analysis of Voxel-Based Neuroimaging Studies using Seed-based d Mapping with Permutation of Subject Images (SDM-PSI). *Journal of Visualized Experiments : JoVE*, *153*. [https://doi.org/10.3791/59841](https://doi.org/10.3791/59841)

American Psychiatric Association. (2013). *Diagnostic and statistical manual of mental disorders* (5.<sup>a</sup> ed.). American Psychiatric Pub. [https://doi.org/10.1176/appi.books.9780890425596](https://doi.org/10.1176/appi.books.9780890425596)

American Psychological Association. (2018). *Quantitative Research Design (JARS–Quant)*. [https://apastyle.apa.org/jars/quantitative](https://apastyle.apa.org/jars/quantitative)

<abbr title="incluido en el metaanálisis">*</abbr> An, L., Cao, Q.-J., Sui, M.-Q., Sun, L., Zou, Q.-H., Zang, Y.-F., y Wang, Y.-F. (2013). Local synchronization and amplitude of the fluctuation of spontaneous brain activity in attention-deficit/hyperactivity disorder: A resting-state fMRI study. *Neuroscience Bulletin*, *29*(5), 603-613. [https://doi.org/10.1007/s12264-013-1353-8](https://doi.org/10.1007/s12264-013-1353-8)

<abbr title="incluido en el metaanálisis">*</abbr> An, L., Cao, X.-H., Cao, Q.-J., Sun, L., Yang, L., Zou, Q.-H., Katya, R., Zang, Y.-F., y Wang, Y.-F. (2013). Methylphenidate normalizes resting-state brain dysfunction in boys with attention deficit hyperactivity disorder. *Neuropsychopharmacology : Official Publication of the American College of Neuropsychopharmacology*, *38*(7), 1287-1295. [https://doi.org/10.1038/npp.2013.27](https://doi.org/10.1038/npp.2013.27)

Arnsten, A. F. T. (2009). The Emerging Neurobiology of Attention Deficit Hyperactivity Disorder: The Key Role of the Prefrontal Association Cortex. *The Journal of Pediatrics*, *154*(5), I-S43. [https://doi.org/10.1016/j.jpeds.2009.01.018](https://doi.org/10.1016/j.jpeds.2009.01.018)

Canals, J., Morales-Hidalgo, P., Jané, M. C., y Domènech, E. (2018). ADHD Prevalence in Spanish Preschoolers: Comorbidity, Socio-Demographic Factors, and Functional Consequences. *Journal of Attention Disorders*, *22*(2), 143-153. [https://doi.org/10.1177/1087054716638511](https://doi.org/10.1177/1087054716638511)

Cao, Q., Zang, Y.-F., Sun, L., y Long, X. (s. f.). Abnormal neural activity in children with attention deficit hyperactivity disorder: A resting-state functional magnetic resonance imaging study C3-Brain (2013-2030). [https://doi.org/10.1097/01.wnr.0000224769.92454.5d](https://doi.org/10.1097/01.wnr.0000224769.92454.5d)

Cheung, C. H. M., Rijdijk, F., McLoughlin, G., Faraone, S. V., Asherson, P., y Kuntsi, J. (2015). Childhood predictors of adolescent and young adult outcome in ADHD. *Journal of Psychiatric Research*, *62*, 92-100. [https://doi.org/10.1016/j.jpsychires.2015.01.011](https://doi.org/10.1016/j.jpsychires.2015.01.011)

Cortese, S., Aoki, Y. Y., Itahashi, T., Castellanos, F. X., y Eickhoff, S. B. (2021). Systematic Review and Meta-analysis: Resting-State Functional Magnetic Resonance Imaging Studies of Attention-Deficit/Hyperactivity Disorder. *Journal of the American Academy of Child and Adolescent Psychiatry*, *60*(1), 61-75. [https://doi.org/10.1016/j.jaac.2020.08.014](https://doi.org/10.1016/j.jaac.2020.08.014)

Cortese, S., Kelly, C., Chabernaud, C., Proal, E., Di Martino, A., Milham, M. P., y Xavier Castellanos, F. (2012). Toward Systems Neuroscience of ADHD: A Meta-Analysis of 55 fMRI Studies. *American Journal of Psychiatry*, *169*(10), 1038-1055. [https://doi.org/10.1176/appi.ajp.2012.11101521](https://doi.org/10.1176/appi.ajp.2012.11101521)

De Celis Alonso, B., Hidalgo Tobón, S., Dies Suarez, P., García Flores, J., De Celis Carrillo, B., y Barragán Pérez, E. (2014). A multi-methodological MR resting state network analysis to assess the changes in brain physiology of children with ADHD. *PLoS ONE*, *9*(6). [https://doi.org/10.1371/journal.pone.0099119](https://doi.org/10.1371/journal.pone.0099119)

Faraone, S. V., Biederman, J., y Mick, E. (2006). The age-dependent decline of attention deficit hyperactivity disorder: A meta-analysis of follow-up studies. *Psychological Medicine*, *36*(2), 159-165. [https://doi.org/10.1017/S003329170500471X](https://doi.org/10.1017/S003329170500471X)

Fayyad, J., Sampson, N. A., Hwang, I., Adamowski, T., Aguilar-Girolamo, G., Florescu, S., Gureje, O., Haro, J. M., Hu, C., Karam, E. G., Lee, S., Navarro-Mateu, F., O’Neill, S., Pennell, B. E., Piazza, M., Posada-Villa, J., Have, ten M., Torres, Y., Xavier, M., … Kessler, R. C. (2017). The descriptive epidemiology of DSM-IV Adult ADHD in the World Health Organization World Mental Health Surveys. *Atten Defic Hyperact Disord*, *9*(1), 47-65. [https://doi.org/10.1007/s12402-016-0208-3](https://doi.org/10.1007/s12402-016-0208-3)

Franke, B., Michelini, G., Asherson, P., Banaschewski, T., Bilbow, A., Buitelaar, J. K., Cormand, B., Faraone, S. V., Ginsberg, Y., Haavik, J., Kuntsi, J., Larsson, H., Lesch, K. P., Ramos-Quiroga, J. A., Réthelyi, J. M., Ribases, M., y Reif, A. (2018). Live fast, die young? A review on the developmental trajectories of ADHD across the lifespan. *European Neuropsychopharmacology*, *28*(10), 1059-1088. [https://doi.org/10.1016/j.euroneuro.2018.08.001](https://doi.org/10.1016/j.euroneuro.2018.08.001)

Frodl, T. y Skokauskas, N. (2012). Meta-analysis of structural MRI studies in children and adults with attention deficit hyperactivity disorder indicates treatment effects. *Acta Psychiatrica Scandinavica*, *125*(2), 114-126. [https://doi.org/10.1111/j.1600-0447.2011.01786.x](https://doi.org/10.1111/j.1600-0447.2011.01786.x)

Gallo, E. F., & Posner, J. (2016). Moving towards causality in attention-deficit hyperactivity disorder: Overview of neural and genetic mechanisms. *The Lancet Psychiatry, 3*(6), 555–567. [https://doi.org/10.1016/S2215-0366(16)00096-1](https://doi.org/10.1016/S2215-0366(16)00096-1)

Gehricke, J. G., Kruggel, F., Thampipop, T., Alejo, S. D., Tatos, E., Fallon, J., y Muftuler, L. T. (2017). The brain anatomy of attention-deficit/hyperactivity disorder in young adults - A magnetic resonance imaging study. *PLoS ONE*, *12*(4), 1-21. [https://doi.org/10.1371/journal.pone.0175433](https://doi.org/10.1371/journal.pone.0175433)

Hart, H., Radua, J., Nakao, T., Mataix-Cols, D., y Rubia, K. (2013). Meta-analysis of functional magnetic resonance imaging studies of inhibition and attention in attention-deficit/hyperactivity disorder: Exploring task-specific, stimulant medication, and age effects. *JAMA Psychiatry*, *70*(2), 185-198. [https://doi.org/10.1001/jamapsychiatry.2013.277](https://doi.org/10.1001/jamapsychiatry.2013.277)

<abbr title="incluido en el metaanálisis">*</abbr> Jiang, K., Wang, J., Zheng, A., Li, L., Yi, Y., Ding, L., Li, H., Dong, X., y Zang, Y. (2020). Amplitude of low-frequency fluctuation of resting-state fMRI in primary nocturnal enuresis and attention deficit hyperactivity disorder. *International Journal of Developmental Neuroscience*, *80*(3), 235-245. [https://doi.org/10.1002/jdn.10020](https://doi.org/10.1002/jdn.10020)

<abbr title="incluido en el metaanálisis">*</abbr> Jiang, K., Yi, Y., Li, L., Li, H., Shen, H., Zhao, F., Xu, Y., y Zheng, A. (2019). Functional network connectivity changes in children with attention-deficit hyperactivity disorder: A resting-state fMRI study. *International Journal of Developmental Neuroscience*, *78*(July), 1-6. [https://doi.org/10.1016/j.ijdevneu.2019.07.003](https://doi.org/10.1016/j.ijdevneu.2019.07.003)

Kasparek, T., Theiner, P., y Filova, A. (2015). Neurobiology of ADHD From Childhood to Adulthood: Findings of Imaging Methods. *Journal of Attention Disorders*, *19*(11), 931-943. [https://doi.org/10.1177/1087054713505322](https://doi.org/10.1177/1087054713505322)

Lancaster, J. L., Tordesillas-Gutiérrez, D., Martinez, M., Salinas, F., Evans, A., Zilles, K., Mazziotta, J. C., y Fox, P. T. (2007). Bias between MNI and talairach coordinates analyzed using the ICBM-152 brain template. *Human Brain Mapping*, *28*(11), 1194-1205. [https://doi.org/10.1002/hbm.20345](https://doi.org/10.1002/hbm.20345)

<abbr title="incluido en el metaanálisis">*</abbr> Li, F., He, N., Li, Y., Chen, L., Huang, X., Lui, S., Guo, L., Kemp, G. J., y Gong, Q. (2014). Intrinsic Brain Abnormalities in Attention Deficit Hyperactivity. *Radiology*, *272*(2), 514-523. [https://doi.org/10.1148/radiol.14131622](https://doi.org/10.1148/radiol.14131622)

Menon, V. (2011). Large-scale brain networks and psychopathology: a unifying triple network model. *Trends in Cognitive Sciences*, *15*(10), 483-506. [https://doi.org/10.1016/j.tics.2011.08.003](https://doi.org/10.1016/j.tics.2011.08.003)

Müller, V. I., Cieslik, E. C., Laird, A. R., Fox, P. T., Radua, J., Mataix-Cols, D., Tench, C. R., Yarkoni, T., Nichols, T. E., Turkeltaub, P. E., Wager, T. D., y Eickhoff, S. B. (2018). Ten simple rules for neuroimaging meta-analysis. *Neuroscience and Biobehavioral Reviews*, *84*, 151-161. [https://doi.org/10.1016/j.neubiorev.2017.11.012](https://doi.org/10.1016/j.neubiorev.2017.11.012)

Ouzzani, M., Hammady, H., Fedorowicz, Z., y Elmagarmid, A. (2016). Rayyan-a web and mobile app for systematic reviews. *Systematic Reviews*, *5*(1). [https://doi.org/10.1186/s13643-016-0384-4](https://doi.org/10.1186/s13643-016-0384-4)

Page, M. J., McKenzie, J. E., Bossuyt, P. M., Boutron, I., Hoffmann, T. C., Mulrow, C. D., Shamseer, L., Tetzlaff, J. M., Akl, E. A., Brennan, S. E., Chou, R., Glanville, J., Grimshaw, J. M., Hróbjartsson, A., Lalu, M. M., Li, T., Loder, E. W., Mayo-Wilson, E., McDonald, S., … Moher, D. (2021). The PRISMA 2020 statement: an updated guideline for reporting systematic reviews. *BMJ*, *372*. [https://doi.org/10.1136/bmj.n71](https://doi.org/10.1136/bmj.n71)

Pievsky, M. A., y McGrath, R. E. (2018). The Neurocognitive Profile of Attention-Deficit/Hyperactivity Disorder: A Review of Meta-Analyses. *Archives of Clinical Neuropsychology : The Official Journal of the National Academy of Neuropsychologists*, *33*(2), 143-157. [https://doi.org/10.1093/arclin/acx055](https://doi.org/10.1093/arclin/acx055)

Polanczyk, G. V, Willcutt, E. G., Salum, G. A., Kieling, C., y Rohde, L. A. (2014). ADHD prevalence estimates across three decades: an updated systematic review and meta-regression analysis. *International Journal of Epidemiology*, *43*(2), 434-442. [https://doi.org/10.1093/ije/dyt261](https://doi.org/10.1093/ije/dyt261)

Polanczyk, G., y Jensen, P. (2008). Epidemiologic Considerations in Attention Deficit Hyperactivity Disorder: A Review and Update. *Child and Adolescent Psychiatric Clinics of North America*, *17*(2), 245-260. [https://doi.org/10.1016/j.chc.2007.11.006](https://doi.org/10.1016/j.chc.2007.11.006)

Posner, J., Polanczyk, G. V, y Sonuga-Barke, E. (2020). Attention-deficit hyperactivity disorder. *Lancet (London, England)*, *395*(10222), 450-462. [https://doi.org/10.1016/S0140-6736(19)33004-1](https://doi.org/10.1016/S0140-6736(19)33004-1)

Radua, J., Mataix-Cols, D., Phillips, M. L., El-Hage, W., Kronhaus, D. M., Cardoner, N., y Surguladze, S. (2012). A new meta-analytic method for neuroimaging studies that combines reported peak coordinates and statistical parametric maps. *European Psychiatry*, *27*(8), 605–611. [https://doi.org/10.1016/j.eurpsy.2011.04.001](https://doi.org/10.1016/j.eurpsy.2011.04.001)

Ramtekkar, U. P., Reiersen, A. M., Todorov, A. A., y Todd, R. D. (2010). Sex and age differences in attention-deficit/hyperactivity disorder symptoms and diagnoses: implications for DSM-V and ICD-11. *Journal of the American Academy of Child and Adolescent Psychiatry*, *49*(3), 213-217. [https://doi.org/10.1016/j.jaac.2009.11.011](https://doi.org/10.1016/j.jaac.2009.11.011)

Rubin, D. B. (1987). *Multiple imputation for nonresponse in surveys* (Vol. 81). John Wiley y Sons. [https://doi.org/10.1002/9780470316696](https://doi.org/10.1002/9780470316696)

Samea, F., Soluki, S., Nejati, V., Zarei, M., Cortese, S., Eickhoff, S. B., Tahmasian, M., y Eickhoff, C. R. (2019). Brain alterations in children/adolescents with ADHD revisited: A neuroimaging meta-analysis of 96 structural and functional studies. *Neuroscience and Biobehavioral Reviews*, *100*, 1-8. [https://doi.org/10.1016/j.neubiorev.2019.02.011](https://doi.org/10.1016/j.neubiorev.2019.02.011)

Sawilowsky, S. S. (2009). New Effect Size Rules of Thumb. *Journal of Modern Applied Statistical Methods*, *8*(2), 597-599. [https://doi.org/10.22237/jmasm/1257035100](https://doi.org/10.22237/jmasm/1257035100)

Sayal, K., Prasad, V., Daley, D., Ford, T., y Coghill, D. (2018). ADHD in children and young people: prevalence, care pathways, and service provision. *The Lancet Psychiatry*, *5*(2), 175-186. [https://doi.org/10.1016/S2215-0366(17)30167-0](https://doi.org/10.1016/S2215-0366(17)30167-0)

<abbr title="incluido en el metaanálisis">*</abbr> Shang, C. Y., Lin, H. Y., Tseng, W. Y., y Gau, S. S. (2018). A haplotype of the dopamine transporter gene modulates regional homogeneity, gray matter volume, and visual memory in children with attention-deficit/hyperactivity disorder. *Psychological medicine*, *48*(15), 2530-2540. [https://doi.org/10.1017/S0033291718000144](https://doi.org/10.1017/S0033291718000144)

<abbr title="incluido en el metaanálisis">*</abbr> Shekarchi, B., Lashkari, M. H., Mehrvar, A., Aghdam, A. A., y Zadeh, S. F. (2014). Altered resting-state functional connectivity patterns of Several frontal and DMN related areas in children with Attention Deficit Hyperactivity Disorder. *Biosciences Biotechnology Research Asia*, *11*(2), 761-766. [https://doi.org/10.13005/bbra/1333](https://doi.org/10.13005/bbra/1333)

Simon, V., Czobor, P., Bálint, S., Mészáros, Á., y Bitter, I. (2009). Prevalence and correlates of adult attention-deficit hyperactivity disorder: Meta-analysis. *British Journal of Psychiatry*, *194*(3), 204-211. [https://doi.org/10.1192/bjp.bp.107.048827](https://doi.org/10.1192/bjp.bp.107.048827)

Stern, A., Agnew-Blais, J. C., Danese, A., Fisher, H. L., Matthews, T., Polanczyk, G. V, Wertz, J., y Arseneault, L. (2020). Associations between ADHD and emotional problems from childhood to young adulthood: a longitudinal genetically sensitive study. *Journal of Child Psychology and Psychiatry*, *61*(11), 1234-1242. [https://doi.org/https://doi.org/10.1111/jcpp.13217](https://doi.org/https://doi.org/10.1111/jcpp.13217)

Stoodley, C. J. (2016). The Cerebellum and Neurodevelopmental Disorders. *The Cerebellum*, *15*(1), 34-37. [https://doi.org/10.1007/s12311-015-0715-3](https://doi.org/10.1007/s12311-015-0715-3)

Sun, R., Zhou, J., Qu, Y., Zhou, J., Xu, G., y Cheng, S. (2020). Resting-state functional brain alterations in functional dyspepsia: Protocol for a systematic review and voxel-based meta-analysis. *Medicine*, *99*(48), e23292. [https://doi.org/10.1097/MD.0000000000023292](https://doi.org/10.1097/MD.0000000000023292)

Sutcubasi, B., Metin, B., Kurban, M. K., Metin, Z. E., Beser, B., y Sonuga-Barke, E. (2020). Resting-state network dysconnectivity in ADHD: A system-neuroscience-based meta-analysis. *The World Journal of Biological Psychiatry : The Official Journal of the World Federation of Societies of Biological Psychiatry*, 1-11. [https://doi.org/10.1080/15622975.2020.1775889](https://doi.org/10.1080/15622975.2020.1775889)

Thomas, R., Sanders, S., Doust, J., Beller, E., y Glasziou, P. (2015). Prevalence of attention-deficit/hyperactivity disorder: a systematic review and meta-analysis. *Pediatrics*, *135*(4), e994-1001. [https://doi.org/10.1542/peds.2014-3482](https://doi.org/10.1542/peds.2014-3482)

Tian, L., Jiang, T., Liang, M., Zang, Y., He, Y., Sui, M., y Wang, Y. (2008). Enhanced resting-state brain activities in ADHD patients: A fMRI study. *Brain and Development*, *30*(5), 342-348. [https://doi.org/10.1016/j.braindev.2007.10.005](https://doi.org/10.1016/j.braindev.2007.10.005)

Tomasi, D., & Volkow, N. D. (2012). Abnormal functional connectivity in children with attention-deficit/ hyperactivity disorder. *Biological Psychiatry, 71*(5), 443–450. [https://doi.org/10.1016/j.biopsych.2011.11.003](https://doi.org/10.1016/j.biopsych.2011.11.003)

Tripp, G. y Wickens, J. R. (2009). Neurobiology of ADHD. *Neuropharmacology*, *57*(7-8), 579-589. [https://doi.org/10.1016/j.neuropharm.2009.07.026](https://doi.org/10.1016/j.neuropharm.2009.07.026)

van Lieshout, M., Luman, M., Twisk, J. W. R., van Ewijk, H., Groenman, A. P., Thissen, A. J. A. M., Faraone, S. V., Heslenfeld, D. J., Hartman, C. A., Hoekstra, P. J., Franke, B., Buitelaar, J. K., Rommelse, N. N. J., y Oosterlaan, J. (2016). A 6-year follow-up of a large European cohort of children with attention-deficit/hyperactivity disorder-combined subtype: outcomes in late adolescence and young adulthood. *European Child and Adolescent Psychiatry*, *25*(9), 1007-1017. [https://doi.org/10.1007/s00787-016-0820-y](https://doi.org/10.1007/s00787-016-0820-y)

<abbr title="incluido en el metaanálisis">*</abbr> Wang, J.-B., Zheng, L.-J., Cao, Q.-J., Wang, Y.-F., Sun, L., Zang, Y.-F., y Zhang, H. (2017). Inconsistency in abnormal brain activity across cohorts of adhd- 200 in children with attention deficit hyperactivity disorder. *Frontiers in Neuroscience*, *11*(JUN). [https://doi.org/10.3389/fnins.2017.00320](https://doi.org/10.3389/fnins.2017.00320)

<abbr title="incluido en el metaanálisis">*</abbr> Yu, X., Yuan, B., Cao, Q., An, L., Wang, P., Vance, A., Silk, T. J., Zang, Y., Wang, Y., y Sun, L. (2016). Frequency-specific abnormalities in regional homogeneity among children with attention deficit hyperactivity disorder: a resting-state fMRI study. *Science Bulletin*, *61*(9), 682-692. [https://doi.org/10.1007/s11434-015-0823-y](https://doi.org/10.1007/s11434-015-0823-y)

<abbr title="incluido en el metaanálisis">*</abbr> Zang, Y.-F., Yong, H., Chao-Zhe, Z., Qing-Jiu, C., Man-Qiu, S., Meng, L., Li-Xia, T., Tian-Zi, J., y Yu-Feng, W. (2007). Altered baseline brain activity in children with ADHD revealed by resting-state functional MRI. *Brain and Development*, *29*(2), 83-91. [https://doi.org/10.1016/j.braindev.2006.07.002](https://doi.org/10.1016/j.braindev.2006.07.002)

{% end %}
