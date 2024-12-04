+++
title = "Creando una aplicación web progresiva para practicar números japoneses"
date = 2024-11-05
description = "He desarrollado una aplicación web para practicar los números en japonés. Durante el proceso, aprendí cómo testear JavaScript vanilla, creación de PWAs, accesibilidad, inconsistencias entre navegadores y eliminación automática de caché sin frameworks."

[taxonomies]
tags = ["código", "japonés", "lingüística", "javascript", "web app"]

[extra]
copy_button = true
stylesheets = ["blog/ramu-japanese-numbers-practice-web-app/css/styles.css"]
tldr = "He creado [<ruby>ラ<rt>ra</rt>ム<rt>mu</rt></ruby>, una aplicación web](https://ramu.osc.garden) para practicar los números en japonés. Descubro inconsistencias entre navegadores, cómo testear JavaScript vanilla y cómo crear una aplicación web progresiva. [Repositorio](https://github.com/welpo/ramu) y [vídeo demo](https://github.com/welpo/ramu?tab=readme-ov-file#demo)."
social_media_card = "img/social_cards/es_blog_ramu_japanese_numbers_practice_webapp.jpg"
+++

<details>
    <summary>Tabla de contenido</summary>
    <!-- toc -->
</details>

Los números fueron una de las primeras cosas que aprendí en japonés. Aprender a contar del uno al diez no es difícil. Si sabes contar del 1 al 10, sabes contar del 1 al 99: dices cuántas decenas hay y luego la unidad. Por ejemplo, cuarenta y dos es «<ruby>cuatro<rt>四</rt></ruby> <ruby>diez<rt>十</rt></ruby> <ruby>dos<rt>二</rt></ruby>»: <ruby>四<rt>yon</rt></ruby><ruby>十<rt>juu</rt></ruby><ruby>二<rt>ni</rt></ruby>.

Más allá del 99, necesitas aprender el nombre para 100 (<ruby>百<rt>hyaku</rt></ruby>), 1.000 (<ruby>千<rt>sen</rt></ruby>) y 10.000 (<ruby>万<rt>man</rt></ruby>). Después de 10.000, los números se crean agrupando dígitos en miríadas (cada 10.000). Esto significa que 40.000 no es «cuarenta miles» (<span class="strike-through"><ruby>四<rt>yon</rt></ruby><ruby>十<rt>juu</rt></ruby><ruby>千<rt>sen</rt></ruby></span>), sino «cuatro diez-miles» (<ruby>四<rt>yon</rt></ruby><ruby>万<rt>man</rt></ruby>). 100.000 es <ruby>十<rt>juu</rt></ruby><ruby>万<rt>man</rt></ruby>: «diez diez-miles». Cada miríada tiene una nueva unidad:

<div class="container full-width" id="myriads">
<div class="number-chain">
<div class="number-unit">
<div class="reading">ichi</div>
<div class="kanji">一</div>
<div class="western" data-full="1">1</div>
</div>
<div class="number-unit">
<div class="reading">man</div>
<div class="kanji">万</div>
<div class="western" data-full="1,0000">10<sup>4</sup></div>
</div>
<div class="number-unit">
<div class="reading">oku</div>
<div class="kanji">億</div>
<div class="western" data-full="1,0000,0000">10<sup>8</sup></div>
</div>
<div class="number-unit">
<div class="reading">chō</div>
<div class="kanji">兆</div>
<div class="western" data-full="1,0000,0000,0000">10<sup>12</sup></div>
</div>
<div class="number-unit">
<div class="reading">kei</div>
<div class="kanji">京</div>
<div class="western" data-full="1,0000,0000,0000,0000">10<sup>16</sup></div>
</div>
<div class="number-unit">
<div class="reading">gai</div>
<div class="kanji">垓</div>
<div class="western" data-full="1,0000,0000,0000,0000,0000">10<sup>20</sup></div>
</div>
<div class="number-unit">
<div class="reading">shi</div>
<div class="kanji">秭</div>
<div class="western" data-full="1,0000,0000,0000,0000,0000,0000">10<sup>24</sup></div>
</div>
<div class="number-unit">
<div class="reading">jō</div>
<div class="kanji">穣</div>
<div class="western" data-full="1,0000,0000,0000,0000,0000,0000,0000">10<sup>28</sup></div>
</div>
<div class="number-unit">
<div class="reading">muryōtaisū</div>
<div class="kanji">無量大数</div>
<div class="western" data-full="1,0000,0000,0000,0000,0000,0000,0000,0000,0000,0000,0000,0000,0000,0000,0000,0000,0000">10<sup>68</sup></div>
</div>
</div>
<div class="note">Nota: Hay más unidades entre <ruby>穣<rt>jō</rt></ruby> y <ruby>無量大数<rt>muryōtaisū</rt></ruby> (un número con orígenes budistas que se traduce como «número inmensurablemente grande»). Consulta <a href="https://es.wikipedia.org/wiki/N%C3%BAmeros_japoneses#De_10_000_en_adelante">numerales japoneses (Wikipedia)</a> para ver la lista completa.</div>
</div>

Pero eso no es todo. El japonés, al igual que el coreano y el chino, tiene «contadores»: sustantivos que se añaden como sufijo a los números. Indican a qué se refiere ese número: libros (<ruby>冊<rt>satsu</rt></ruby>), personas (<ruby>人<rt>ri/nin</rt></ruby> o <ruby>名<rt>mei</rt></ruby>), maquinaria (<ruby>台<rt>dai</rt></ruby>), oraciones (<ruby>文<rt>bun</rt></ruby>), años de edad (<ruby>歳<rt>sai</rt></ruby>), países (<ruby>箇国<rt>kakoku</rt></ruby>), ubicaciones (<ruby>箇所<rt>kasho</rt></ruby>), latas (<ruby>缶<rt>kan</rt></ruby>)…

Un ejemplo: <span class="number">tres</span> es <span class="no-wrap"><ruby class="number">三<rt>san</rt></ruby></span>. <span class="noun">Rana</span> es <span class="no-wrap"><ruby class="noun">カ<rt>ka</rt></ruby><ruby class="noun">エ<rt>e</rt></ruby><ruby class="noun">ル<rt>ru</rt></ruby></span>. Podrías pensar que «<span class="number">tres</span> <span class="noun">ranas</span>» es <span class="no-wrap"><ruby class="number">三<rt>san</rt></ruby><ruby class="noun">カ<rt>ka</rt></ruby><ruby class="noun">エ<rt>e</rt></ruby><ruby class="noun">ル<rt>ru</rt></ruby></span> o <span class="no-wrap"><ruby class="noun">カ<rt>ka</rt></ruby><ruby class="noun">エ<rt>e</rt></ruby><ruby class="noun">ル<rt>ru</rt></ruby><ruby class="number">三<rt>san</rt></ruby></span>. Pero no; falta el contador (y el posesivo <ruby>の<rt>no</rt></ruby>). En este caso, usaríamos el contador para animales pequeños: <ruby class="counter">匹<rt>hiki</rt></ruby>. «<span class="number">Tres</span> <span class="noun">ranas</span>» se convierte en «<span class="number">tres</span> <span class="counter">animal-pequeño</span> de <span class="noun">rana</span>»: <span class="phrase"><ruby class="number">三<rt>san</rt></ruby><ruby class="counter">匹<rt>biki</rt></ruby><ruby>の<rt>no</rt></ruby><ruby class="noun">カ<rt>ka</rt></ruby><ruby class="noun">エ<rt>e</rt></ruby><ruby class="noun">ル<rt>ru</rt></ruby></span>. («<ruby class="counter">hiki<rt>ひき</rt></ruby>» se convierte en «<ruby class="counter">biki<rt>びき</rt></ruby>» mediante <a href="https://es.wikipedia.org/wiki/Rendaku"><ruby>連<rt>ren</rt></ruby><ruby>濁<rt>daku</rt></ruby> o sonorización secuencial</a>.)

Hay [más de 300 contadores](https://www.tofugu.com/japanese/japanese-counters-list/), pero te puedes apañar con un par de docenas.

En resumen: para dominar los números en japonés, necesitas conocer el nombre y la escritura de las unidades, ser capaz de pensar en grupos de 10.000 en lugar de 1.000, y conocer los contadores. Esto requiere práctica.

## La idea

Me pregunté: ¿cómo sería el sistema de práctica ideal? Para la comprensión lectora:

- Veo un número aleatorio, ya sea en números arábigos (por ejemplo, 40) o kanji (<ruby>四<rt>yon</rt></ruby><ruby>十<rt>juu</rt></ruby>), e intento leerlo. Opcionalmente, con un contador
- Poco después, escucho la respuesta correcta mientras veo el número, reforzando la asociación
- Repetir

Para la comprensión oral, oigo un número e intento entenderlo. La respuesta se revela después de unos segundos, visualmente, mientras vuelvo a escuchar el número.

La intención era dedicar unas pocas horas al proyecto; tiendo a añadir requisitos, convirtiendo proyectos de fin de semana en proyectos de varios meses. Le pedí ayuda a [Claude](https://claude.ai/) 3.5 Sonnet (New) para crear una aplicación web usando HTML, CSS y JavaScript vanilla —usar frameworks con los que no estoy familiarizado sería una pérdida de tiempo.

El primer prototipo era decente y funcionaba con números arábigos, pero quería más. Yo contra mi perfeccionismo. Decidí añadir soporte para números en kanji. No quería añadir dependencias, lo que significaba escribir las funciones yo mismo —o guiar a Claude para que las escribiera. Como aún no había aprendido sobre la agrupación en 10.000 y los nombres de las unidades, subestimé cuánto tiempo llevaría.

Quería probar la función `número → kanji`. ¿Estaba generando los kanji correctos, en el orden correcto, con el prefijo correcto?

## Testeando JavaScript vanilla

Las pruebas manuales eran incómodas. Estuve tentado a abandonar todo lo vanilla y usar [Astro](https://astro.build/), pero le pregunté a Claude si había alguna manera de añadir pruebas a mi JavaScript vanilla. Se le ocurrió este fragmento:

```js
if (new URLSearchParams(window.location.search).has("test")) {
  const script = document.createElement("script");
  script.src = "tests.js";
  document.head.appendChild(script);
}
```

Con esto, al visitar la página principal con `?test` al final, se ejecutaría [`tests.js`](https://github.com/welpo/ramu/blob/main/app/tests.js). Los resultados de los (>100) tests se mostrarían en la consola del navegador:

```txt
running kanji conversion tests…
✅ Passed: 0 → 零
✅ Passed: 1 → 一
✅ Passed: 5 → 五
✅ Passed: 1000 → 千
✅ Passed: 2036521801 → 二十億三千六百五十二万千八百一
✅ Passed: 100000000000000000000 → 一垓
✅ Passed: 1e+24 → 一秭
✅ Passed: 1e+68 → 一無量大数
✅ Passed: -1 → -1
✅ Passed: NaN → NaN
```

¡Genial! Ahora podía actualizar el script principal, recargar el navegador con el flag `?test`, y ver si los cambios arreglaban los tests que no pasaban.

Determinar cuál debería ser el resultado esperado requirió bastante tiempo y aprendizaje. Después de algunas lecturas e iteraciones de código, todas las pruebas pasaban correctamente.

## Accesibilidad

El código original era aceptablemente accesible: usaba HTML semántico. Añadí:

- Navegación por teclado
- Atributos Aria con actualizaciones dinámicas donde era necesario (por ejemplo, alternancia del botón de pausa)
- Compatibilidad con lectores de pantalla

Este último fue difícil. Primero, necesitaba decidir cómo adaptar el flujo de práctica para personas con discapacidad visual. Usé una fuente grande y un contraste fuerte. Para la práctica con números arábigos, añadí soporte para lector de pantalla a través de [`aria-live`](https://developer.mozilla.org/docs/Web/Accessibility/ARIA/Attributes/aria-live): las actualizaciones en un elemento oculto serían anunciadas por los lectores de pantalla:

```html
<div
  id="screen-reader-announcement"
  class="visually-hidden"
  aria-live="polite"
  aria-atomic="true">
</div>
```

La aplicación tiene dos modos: práctica de lectura y de escucha. En la práctica de lectura, se muestra un número durante unos segundos. Debes decir/pensar la pronunciación en japonés antes de escuchar la respuesta. Para usuarios de lector de pantalla, me aseguré de que la parte de «lectura» se leyera en voz alta, mientras dejaba que el texto a voz (TTS) japonés se encargara de la parte de la respuesta:

<div class="audio-container">
  <audio controls src="/blog/ramu-japanese-numbers-practice-web-app/media/voiceover_demo.mp3" title="Demo de voiceover"></audio>
  <span class="audio-note">(la velocidad de las voces puede ajustarse)</span>
</div>

Para la práctica de «escucha», el flujo se invierte. En este caso, como JavaScript no puede detectar el uso de lectores de pantalla, no puedo silenciar el TTS para la respuesta. Esto significa que la voz japonesa y la respuesta (en el idioma del usuario) se superponen. Como el lector de pantalla tiene prioridad, suena más fuerte. Aunque no es ideal, es aceptable.

## Inconsistencias entre navegadores

Esperaba que hubiera una (1) manera de obtener las voces del sistema, con resultados consistentes entre navegadores.

No fue así. Chrome inicializa las voces de manera diferente a Firefox/Safari. En el mismo sistema con dos voces japonesas instaladas, Firefox obtiene ambas voces, Chrome obtiene cuatro voces, y Safari obtiene una voz —de menor calidad— (bueno, dos, pero suenan idénticas).

Safari requiere interacción del usuario poco antes de permitir una emisión TTS, pero solo en móviles. Solucioné esto emitiendo «<ruby>あ<rt>a</rt></ruby>» a volumen 0 justo después de pulsar «inicio» en modo lectura en dispositivos iOS.

### Depuración en móvil

No conseguía que el emulador de Android detectase las voces japonesas. Como no tenía acceso a la consola del navegador, le pregunté a Claude:

{{ multilingual_quote(original="How can we debug without access to console? Maybe create a div and populate it through appending paragraphs?", translated="¿Cómo podemos depurar sin acceso a la consola? ¿Quizás creando un div y añadiendo párrafos?") }}

Me devolvió código para crear un div con estilos y una función para escribir en él:

```javascript
const debugPanel = document.createElement('div');
debugPanel.id = 'debug-panel';
debugPanel.style.cssText = 'position: fixed; bottom: 10px; left: 10px; background: rgba(0,0,0,0.8); color: white; padding: 10px; max-height: 200px; overflow-y: auto; font-family: monospace; font-size: 12px; z-index: 9999;';
document.body.appendChild(debugPanel);

function debugLog(message) {
  const time = new Date().toLocaleTimeString();
  const p = document.createElement('p');
  p.style.margin = '2px 0';
  p.textContent = `${time}: ${message}`;
  debugPanel.insertBefore(p, debugPanel.firstChild);
  console.log(`${time}: ${message}`);
}
```

Y actualizó la función de inicialización de TTS para registrar en el panel de depuración:

{{ dual_theme_image(light_src="media/debug_light.webp", dark_src="media/debug_dark.webp" alt="Panel de depuración con mensajes" ) }}

Pero al principio no veía esto. ¿Qué estaba pasando? Nada de lo que intentaba surgía efecto. La razón: la caché. Aunque estaba forzando la recarga del HTML, el archivo JavaScript estaba en caché.

## Eliminación de caché

Una forma de ignorar la caché es añadir un signo de interrogación y texto/números después de una URL: `example.com/?hola`.

Estaba haciendo esto para asegurarme de que el HTML se actualizara, pero si el HTML en sí contiene una referencia directa a `app.js`, y ese archivo está en caché… buena suerte.

La solución es evitar la caché añadiendo el [hash del archivo](https://es.wikipedia.org/wiki/Funci%C3%B3n_hash_criptogr%C3%A1fica) —o parte de él— a la URL que estás cargando:

```diff
- <script src="/app.js" defer></script>
+ <script src="/app.js?h=0158eccd" defer></script>
```

Si hubiera usado Astro u otro framework similar, esto no sería un problema. No queriendo complicar las cosas, actualicé el [pre-commit hook](https://github.com/welpo/ramu/blob/main/.githooks/pre-commit) —un script que se ejecuta cada vez que hago cambios en un commit. El hook comprueba si he modificado un archivo que necesita ruptura de la caché. Si es así, actualiza el hash en el HTML e incluye los cambios en el commit.

¡Fácil! Y sin dependencias.

## Aplicación web progresiva

Quería que la aplicación funcionara sin conexión. Todo el procesamiento se realiza localmente, incluyendo la generación de voz; el único problema sería acceder a la URL en una zona sin conectividad.

La solución: convertirla en una aplicación web progresiva (PWA). Esto permite instalar la app y utilizarla sin conexión, aprovechando toda la pantalla. Las PWAs se sienten como una aplicación nativa.

Al no estar familiarizado con su implementación, utilicé la [documentación de Microsoft sobre PWAs](https://learn.microsoft.com/microsoft-edge/progressive-web-apps-chromium/how-to/) y la ayuda de Claude para convertir mi HTML+CSS+JS en una PWA.

No llevó mucho tiempo. El principal obstáculo fue probar si la PWA funcionaba correctamente sin hacer el deploy. El servidor HTTP de Python (`python3 -m http.server`) no fue suficiente, pero [`http-server`](https://www.npmjs.com/package/http-server) con claves locales OpenSSL funcionó.

### Avisos respetuosos con el usuario

Es incómodo cuando, momentos después de visitar una web por primera vez, me interrumpen con: «Suscríbete a nuestra newsletter» o «¿Podemos mostrarte notificaciones?». No.

Quería que los usuarios supieran que podían instalar la PWA, ya que no creo que sea una tecnología muy conocida. Mi primera idea fue «esperar dos segundos después de la primera visita en iOS» (Chrome sugiere la instalación de PWA por defecto, y no creo que tenga mucho sentido sugerir una instalación en dispositivos no móviles). Pero me pareció demasiado agresivo: ni siquiera han probado la aplicación. ¡Puede que no funcione su dispositivo! (Aunque debería.)

Me decidí por «mostrar el aviso a usuarios de iOS después de que completen su sesión». Es un pequeño aviso con instrucciones sencillas:

<div id="pwa-prompt">
{{ dual_theme_image(light_src="media/pwa_prompt_light.webp", dark_src="media/pwa_prompt_dark.webp", alt="Aviso para instalar la PWA") }}
</div>

Para que fuera fácil cerrarlo, añadí padding al botón `x`, obteniendo un área de clic más grande (compensado visualmente con un margen negativo). Si el usuario cierra el aviso, no se vuelve a mostrar.

---

La mayor parte del tiempo la dediqué a resolver inconsistencias entre navegadores, accesibilidad y la función de conversión de números a kanji. Además de eso, trabajé en el diseño (incluyendo que se viera bien independientemente de la resolución), la creación del logotipo, la documentación y el manejo de errores. Por ejemplo, si el script no encuentra una voz japonesa, muestra una advertencia con una explicación clara de lo que ha fallado, incluyendo los pasos para instalar una voz en función del sistema operativo.

Mi objetivo era terminar este proyecto en una tarde, incluyendo este artículo. No lo conseguí. Finalmente, dediqué unas cuantas horas —en vez de unos cuantos meses— distribuidas en menos de una semana. ¡No está mal! Aunque estuve tentado de añadir múltiples modos (práctica de meses específicos o lectura de la hora), me contuve.

Lo considero una victoria. He aprendido sobre el sistema de numeración japonés, PWAs, accesibilidad, testear JS vanilla, detalles de API de navegador… ¡y he creado una pequeña web app, bonita, divertida —tan divertida como permite el tema— y útil!

¿Quieres probarla? [Clica aquí](https://ramu.osc.garden). El [código está en GitHub](https://github.com/welpo/ramu). <ruby>がんばってください！</ruby>
