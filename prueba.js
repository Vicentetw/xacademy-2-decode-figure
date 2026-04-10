// =============================================================================
//
//   EJERCICIO XACADEMY - GUÍA COMPLETA DESDE CERO
//   Para ejecutar: node solution.js
//
// =============================================================================
//
//  ANTES DE ARRANCAR: ¿qué es "async" y "await"?
//
//  Cuando le pedís algo a un servidor por internet, Node.js no se queda
//  esperando parado. En cambio, sigue ejecutando otras cosas y cuando
//  llega la respuesta, la procesa.
//
//  "async" antes de una función significa: "esta función va a hacer
//  operaciones que tardan (como llamadas a internet)".
//
//  "await" antes de una línea significa: "esperá aquí hasta que esto
//  termine antes de continuar con la siguiente línea".
//
//  Ejemplo de la vida real:
//    Hacés un pedido en un restaurante (fetch)
//    Esperás que traigan la comida (await)
//    Cuando llegó, la comés (siguiente línea)
//
// =============================================================================


// -----------------------------------------------------------------------------
// CONSTANTE: BASE_URL
// -----------------------------------------------------------------------------
// Una constante es un valor que no cambia durante la ejecución del programa.
// Guardamos la URL base del servidor acá para no repetirla en cada función.
// Así si la URL cambia, la modificamos en un solo lugar.
// -----------------------------------------------------------------------------
const BASE_URL = "https://xacademy-ejercicio-02-2026.vercel.app/api";


// =============================================================================
// FUNCIÓN 1: obtenerDesafio()
// =============================================================================
//
// ¿QUÉ HACE?
//   Le pide al servidor un nuevo desafío usando HTTP GET.
//
// ¿QUÉ DEVUELVE?
//   Un objeto JavaScript con esta forma:
//   {
//     id: "challenge_1775783431323_abc",   ← identificador único
//     map: "Li4mCi4mLgouLiY=",            ← el mapa en Base64 (ilegible aún)
//     targetSymbol: "&"                    ← el símbolo que forma la figura
//   }
//
// ¿QUÉ ES fetch()?
//   Es la función nativa de JavaScript para hacer peticiones HTTP.
//   Es como abrir una URL en el browser, pero desde código.
//   fetch() devuelve una Promise (promesa de que va a llegar algo).
//   Por eso usamos "await": esperamos hasta que llegue la respuesta.
//
// ¿QUÉ ES .json()?
//   La respuesta del servidor llega como texto plano.
//   .json() lo convierte a un objeto JavaScript que podemos usar.
//
// =============================================================================
async function obtenerDesafio() {

  // Hacemos la petición GET a la URL del challenge
  // "await" significa: esperá hasta que el servidor responda
  const respuesta = await fetch(`${BASE_URL}/challenge`);

  // La respuesta llega como texto. .json() la convierte a objeto JavaScript.
  // Otro "await" porque esta conversión también puede tardar.
  const datos = await respuesta.json();

  // Retornamos el objeto con { id, map, targetSymbol }
  return datos;
}


// =============================================================================
// FUNCIÓN 2: decodificarMapa(base64)
// =============================================================================
//
// ¿QUÉ RECIBE?
//   Un string en Base64, por ejemplo: "Li4mCi4mLgouLiY="
//
// ¿QUÉ HACE?
//   Paso 1: Convierte el Base64 a texto ASCII legible:
//             "Li4mCi4mLgouLiY=" → "..\n.&.\n..&"
//
//   Paso 2: Corta el texto por los saltos de línea (\n) para tener filas:
//             ["..", ".&.", "..&"]
//
//   Paso 3: Convierte cada fila (string) en array de caracteres:
//             [[".","."], [".",".","&","."], [".",".","&"]]
//
// ¿QUÉ DEVUELVE?
//   Una grilla 2D (array de arrays) donde cada celda es un carácter.
//   Para acceder a una celda: grilla[y][x]  (primero fila, luego columna)
//
// ¿QUÉ ES Buffer.from()?
//   Buffer es una clase de Node.js para manejar datos binarios.
//   Buffer.from(string, "base64") toma un string Base64 y lo decodifica.
//   .toString("ascii") convierte el resultado a texto ASCII legible.
//
// =============================================================================
function decodificarMapa(base64) {

  // PASO 1: Decodificar Base64 → texto ASCII
  // Buffer.from recibe el Base64 y lo convierte a texto
  const texto = Buffer.from(base64, "base64").toString("ascii");

  // PASO 2 y 3: Convertir el texto en grilla 2D
  //
  // .trim()        → elimina espacios o \n al inicio y al final del texto
  //
  // .split("\n")   → corta el string cada vez que encuentra un salto de línea
  //                  "fila0\nfila1\nfila2" → ["fila0", "fila1", "fila2"]
  //
  // .map(...)      → transforma cada elemento del array aplicando una función
  //                  Acá la función recibe cada "fila" (string) y la convierte
  //                  en array de caracteres con .split("")
  //                  "abc" → ["a", "b", "c"]
  //
  // Resultado final: array de arrays de caracteres = grilla 2D
  const grilla = texto.trim().split("\n").map((fila) => fila.split(""));

  return grilla;
}


// =============================================================================
// FUNCIÓN 3: encontrarPuntos(grilla, simbolo)
// =============================================================================
//
// ¿QUÉ RECIBE?
//   grilla  → la grilla 2D que armamos en la función anterior
//   simbolo → el carácter que buscamos, ej: "&"
//
// ¿QUÉ HACE?
//   Recorre TODAS las celdas de la grilla.
//   Cada vez que encuentra el símbolo, guarda su posición.
//
// ¿QUÉ DEVUELVE?
//   Un array de objetos {x, y} con la posición de cada símbolo encontrado.
//   Ejemplo: [{x:2,y:1}, {x:3,y:1}, {x:4,y:1}, {x:2,y:2}, ...]
//
// ¿POR QUÉ DOS FOR ANIDADOS?
//   Porque la grilla es 2D: primero necesitamos elegir la fila (y),
//   y dentro de esa fila recorrer cada columna (x).
//   Es como leer un libro: primero elegís la página (y = fila),
//   después leés cada letra de esa página (x = columna).
//
// =============================================================================
function encontrarPuntos(grilla, simbolo) {

  // Array vacío donde vamos a ir acumulando las posiciones encontradas
  const puntos = [];

  // Bucle externo: recorre las FILAS (eje Y, vertical)
  // y empieza en 0 y llega hasta el último índice (grilla.length - 1)
  for (let y = 0; y < grilla.length; y++) {

    // Bucle interno: recorre las COLUMNAS de la fila actual (eje X, horizontal)
    // grilla[y].length es la cantidad de columnas en la fila y
    for (let x = 0; x < grilla[y].length; x++) {

      // Comparamos el carácter en esta celda con el símbolo que buscamos
      if (grilla[y][x] === simbolo) {

        // Si coincide, guardamos la posición en el array
        // { x, y } es shorthand de { x: x, y: y }
        puntos.push({ x, y });
      }
    }
  }

  // Retornamos el array completo con todas las posiciones encontradas
  return puntos;
}


// =============================================================================
// FUNCIÓN 4: detectarForma(puntos)
// =============================================================================
//
// ¿QUÉ RECIBE?
//   El array de puntos {x,y} de todos los símbolos encontrados.
//
// ¿QUÉ DEVUELVE?
//   Un string: "cross", "square" o "triangle"
//
// ── LÓGICA PARA DETECTAR CROSS ───────────────────────────────────────────────
//
//   Una cruz se ve así (centro en x=2, y=2):
//
//     col:  0 1 2 3 4
//   fila 0: . . & . .    ← x=2 (== centroX) ✓
//   fila 1: . . & . .    ← x=2 (== centroX) ✓
//   fila 2: & & & & &    ← todos en y=2 (== centroY) ✓
//   fila 3: . . & . .    ← x=2 (== centroX) ✓
//   fila 4: . . & . .    ← x=2 (== centroX) ✓
//
//   Regla: TODOS los puntos tienen que estar ó en la columna central
//          ó en la fila central (o en ambas, como el punto central).
//
// ── LÓGICA PARA DETECTAR SQUARE ──────────────────────────────────────────────
//
//   Un cuadrado puede ser sólido o hueco:
//
//   Sólido:              Hueco:
//   & & &                & & & & &
//   & & &                &       &
//   & & &                &       &
//                         &       &
//                         & & & & &
//
//   Si contamos cuántos símbolos hay por fila:
//   Sólido: [3, 3, 3]         ← todas iguales
//   Hueco:  [5, 2, 2, 2, 5]   ← simétrico (palíndromo)
//
//   ¿Qué es un palíndromo?
//   Una secuencia que se lee igual de izquierda a derecha que de derecha
//   a izquierda. Ejemplos: "aba", [1,2,1], [5,2,2,2,5]
//
//   [3, 3, 3]       → palíndromo ✓ (square sólido)
//   [5, 2, 2, 2, 5] → palíndromo ✓ (square hueco)
//   [1, 2, 3, 4, 5] → NO palíndromo → triángulo
//
// ── LÓGICA PARA DETECTAR TRIANGLE ────────────────────────────────────────────
//
//   Si no es cruz ni cuadrado, es triángulo. No necesita lógica propia.
//
// =============================================================================
function detectarForma(puntos) {

  // Extraemos todos los valores de X en un array
  // .map() transforma cada elemento: de {x,y} nos quedamos solo con x
  const xs = puntos.map((p) => p.x);

  // Extraemos todos los valores de Y en un array
  const ys = puntos.map((p) => p.y);

  // Calculamos el centro del bounding box (la caja que encierra la figura)
  // Math.min(...xs) → el x más a la izquierda de todos los puntos
  // Math.max(...xs) → el x más a la derecha de todos los puntos
  // El centro es el promedio de ambos extremos
  // Math.round() redondea al entero más cercano
  const centroX = Math.round((Math.min(...xs) + Math.max(...xs)) / 2);
  const centroY = Math.round((Math.min(...ys) + Math.max(...ys)) / 2);

  // ── DETECTAR CROSS ──────────────────────────────────────────────────────────
  //
  // .every() recorre el array y devuelve true SOLO si TODOS los elementos
  // cumplen la condición. Si uno solo no la cumple, devuelve false.
  //
  // Para cada punto p, verificamos:
  //   p.x === centroX  → el punto está en la columna central
  //   p.y === centroY  → el punto está en la fila central
  //   El || significa OR: alcanza con que cumpla una de las dos condiciones.
  //
  const esCruz = puntos.every((p) => p.x === centroX || p.y === centroY);

  // Si todos los puntos están en la columna O fila central → es una cruz
  if (esCruz) return "cross";

  // ── CONTAR SÍMBOLOS POR FILA ────────────────────────────────────────────────
  //
  // Creamos un objeto que funciona como contador por fila.
  // Las claves son los números de fila, los valores son los conteos.
  //
  // Ejemplo con puntos [{x:1,y:3},{x:2,y:3},{x:1,y:4},{x:2,y:4},{x:3,y:4}]:
  //   Procesando {x:1, y:3}: simbolosPorFila = { 3: 1 }
  //   Procesando {x:2, y:3}: simbolosPorFila = { 3: 2 }
  //   Procesando {x:1, y:4}: simbolosPorFila = { 3: 2, 4: 1 }
  //   Procesando {x:2, y:4}: simbolosPorFila = { 3: 2, 4: 2 }
  //   Procesando {x:3, y:4}: simbolosPorFila = { 3: 2, 4: 3 }
  //
  const simbolosPorFila = {};

  for (const p of puntos) {
    // Si simbolosPorFila[p.y] ya existe, le sumamos 1.
    // Si NO existe (undefined), usamos 0 como valor inicial y le sumamos 1.
    // El operador || devuelve el primer valor "truthy": undefined||0 → 0
    simbolosPorFila[p.y] = (simbolosPorFila[p.y] || 0) + 1;
  }

  // Object.values() extrae solo los valores del objeto (sin las claves)
  // Del ejemplo anterior: { 3: 2, 4: 3 } → [2, 3]
  const cantidades = Object.values(simbolosPorFila);

  // ── DETECTAR SQUARE ─────────────────────────────────────────────────────────
  //
  // Verificamos si "cantidades" es un palíndromo.
  //
  // .every() con índice i: recorre cada elemento y su posición i.
  // cantidades.length - 1 - i es el índice del elemento "espejo" (el opuesto).
  //
  // Ejemplo con [5, 2, 2, 2, 5] (length=5):
  //   i=0: cantidades[0]=5  vs  cantidades[5-1-0]=cantidades[4]=5  ✓
  //   i=1: cantidades[1]=2  vs  cantidades[5-1-1]=cantidades[3]=2  ✓
  //   i=2: cantidades[2]=2  vs  cantidades[5-1-2]=cantidades[2]=2  ✓ (centro)
  //   i=3: cantidades[3]=2  vs  cantidades[5-1-3]=cantidades[1]=2  ✓
  //   i=4: cantidades[4]=5  vs  cantidades[5-1-4]=cantidades[0]=5  ✓
  //   Todos cumplen → es palíndromo → es un square
  //
  // Ejemplo con [1, 2, 3, 4, 5] (length=5):
  //   i=0: cantidades[0]=1  vs  cantidades[4]=5  ✗
  //   Ya falló → no es palíndromo → no es square
  //
  const esPalindromo = cantidades.every(
    (c, i) => c === cantidades[cantidades.length - 1 - i]
  );

  if (esPalindromo) return "square";

  // ── TRIANGLE ────────────────────────────────────────────────────────────────
  // Si llegamos hasta acá, no es cruz ni cuadrado → es triángulo
  return "triangle";
}


// =============================================================================
// FUNCIÓN 5: calcularCentro(puntos)
// =============================================================================
//
// ¿QUÉ RECIBE?
//   El array de puntos {x,y}.
//
// ¿QUÉ HACE?
//   Calcula el punto central de la figura promediando todas las x y todas las y.
//
// ¿POR QUÉ EL PROMEDIO?
//   Porque el centro geométrico de un conjunto de puntos es el punto que
//   minimiza la distancia a todos los demás. Matemáticamente es el promedio.
//
// EJEMPLO:
//   Puntos de un cuadrado 3x3 empezando en (2,1):
//   (2,1)(3,1)(4,1)
//   (2,2)(3,2)(4,2)
//   (2,3)(3,3)(4,3)
//
//   sumaX = 2+3+4+2+3+4+2+3+4 = 27   centroX = 27/9 = 3
//   sumaY = 1+1+1+2+2+2+3+3+3 = 18   centroY = 18/9 = 2
//   Centro = (3, 2) ✓ (que es el punto del medio del cuadrado)
//
// ¿QUÉ ES .reduce()?
//   Es una función que "reduce" un array a un único valor acumulando.
//   reduce((acumulador, elemento) => acumulador + elemento.x, 0)
//                                                              ↑
//                                                     valor inicial del acumulador
//
//   Con puntos [{x:2},{x:3},{x:4}]:
//     Inicio:       acumulador = 0
//     Elemento {x:2}: acumulador = 0 + 2 = 2
//     Elemento {x:3}: acumulador = 2 + 3 = 5
//     Elemento {x:4}: acumulador = 5 + 4 = 9
//     Resultado: 9
//
// =============================================================================
function calcularCentro(puntos) {

  // Sumamos todos los valores de X usando reduce
  // acc = acumulador, p = punto actual
  const sumaX = puntos.reduce((acc, p) => acc + p.x, 0);

  // Sumamos todos los valores de Y
  const sumaY = puntos.reduce((acc, p) => acc + p.y, 0);

  // Dividimos por la cantidad de puntos para obtener el promedio
  // Math.round() redondea al entero más cercano
  // (el enunciado dice que .5 redondea hacia arriba, que es lo que hace Math.round)
  return {
    x: Math.round(sumaX / puntos.length),
    y: Math.round(sumaY / puntos.length),
  };
}


// =============================================================================
// FUNCIÓN 6: calcularCodigo(cantidadSimbolos, centro)
// =============================================================================
//
// ¿QUÉ RECIBE?
//   cantidadSimbolos → puntos.length, la cantidad de símbolos encontrados
//   centro           → el objeto {x, y} que calculamos antes
//
// ¿QUÉ HACE?
//   Aplica la fórmula del enunciado:
//   code = (cantidad_de_símbolos * centro.x) + centro.y
//
// EJEMPLO:
//   9 símbolos, centro en x=3, y=2
//   code = (9 * 3) + 2 = 27 + 2 = 29
//
// =============================================================================
function calcularCodigo(cantidadSimbolos, centro) {
  return (cantidadSimbolos * centro.x) + centro.y;
}


// =============================================================================
// FUNCIÓN 7: validarRespuesta(id, forma, centro, codigo)
// =============================================================================
//
// ¿QUÉ RECIBE?
//   id     → el id del desafío que nos dio el servidor
//   forma  → "square", "triangle" o "cross"
//   centro → { x, y }
//   codigo → el número calculado con la fórmula
//
// ¿QUÉ HACE?
//   Hace un POST a /validate con nuestra respuesta en formato JSON.
//   El servidor la evalúa y nos dice si está bien o mal.
//
// ¿DIFERENCIA ENTRE GET Y POST?
//   GET  → pedimos información (solo URL, sin cuerpo)
//   POST → enviamos información (tiene un "body" con datos)
//
// ¿QUÉ ES JSON.stringify()?
//   Convierte un objeto JavaScript a un string JSON para enviarlo por HTTP.
//   { id: "abc", shape: "square" } → '{"id":"abc","shape":"square"}'
//
// ¿QUÉ ES "Content-Type": "application/json"?
//   Es un header HTTP que le avisa al servidor: "lo que te mando es JSON".
//   Sin esto el servidor no sabe cómo interpretar el body.
//
// ¿QUÉ DEVUELVE?
//   El objeto de respuesta del servidor:
//   Si está bien: { success: true, message: "¡Correcto!...", emoji: "🎉" }
//   Si está mal:  { success: false, message: "Forma incorrecta...", expected: {...} }
//
// =============================================================================
async function validarRespuesta(id, forma, centro, codigo) {

  // Armamos el objeto con la respuesta que pide el servidor
  const cuerpo = {
    id:     id,                    // el id del desafío
    shape:  forma,                 // la forma que detectamos
    center: [centro.x, centro.y], // el servidor espera un array [x, y], no un objeto {x,y}
    code:   codigo,                // el código calculado
  };

  // Hacemos el POST
  const respuesta = await fetch(`${BASE_URL}/validate`, {
    method:  "POST",                               // tipo de petición HTTP
    headers: { "Content-Type": "application/json" }, // le decimos que mandamos JSON
    body:    JSON.stringify(cuerpo),               // convertimos el objeto a string
  });

  // Parseamos la respuesta del servidor a objeto JavaScript
  const resultado = await respuesta.json();

  return resultado;
}


// =============================================================================
// FUNCIÓN 8: resolverDesafio()
// =============================================================================
//
// Esta función es el "director de orquesta". Llama a todas las funciones
// anteriores en el orden correcto para resolver UN desafío completo.
//
// Retorna { forma, ok } para que el loop sepa si fue correcto y qué forma era.
//
// =============================================================================
async function resolverDesafio() {

  // ── PASO 1: Pedir el desafío ─────────────────────────────────────────────
  const desafio = await obtenerDesafio();
  console.log(`\n Desafio: ${desafio.id} | Simbolo: "${desafio.targetSymbol}"`);

  // ── PASO 2: Decodificar el mapa Base64 en una grilla 2D ──────────────────
  const grilla = decodificarMapa(desafio.map);

  // Mostramos el mapa en consola para poder ver visualmente qué recibimos
  console.log("\n Mapa:");
  grilla.forEach((fila, i) => console.log(`   Fila ${i}: ${fila.join(" ")}`));

  // ── PASO 3: Encontrar todos los puntos del símbolo en la grilla ──────────
  const puntos = encontrarPuntos(grilla, desafio.targetSymbol);
  console.log(`\n   Simbolos encontrados: ${puntos.length}`);

  // ── PASO 4: Detectar la forma ────────────────────────────────────────────
  const forma = detectarForma(puntos);
  console.log(`   Forma detectada: ${forma}`);

  // ── PASO 5: Calcular el centro ───────────────────────────────────────────
  const centro = calcularCentro(puntos);
  console.log(`   Centro: x=${centro.x}, y=${centro.y}`);

  // ── PASO 6: Calcular el código ───────────────────────────────────────────
  const codigo = calcularCodigo(puntos.length, centro);
  console.log(`   Codigo: (${puntos.length} x ${centro.x}) + ${centro.y} = ${codigo}`);

  // ── PASO 7: Enviar la respuesta al servidor ──────────────────────────────
  const resultado = await validarRespuesta(desafio.id, forma, centro, codigo);

  if (resultado.success) {
    console.log(`\n CORRECTO! ${resultado.message}`);
  } else {
    console.log(`\n Incorrecto:`, resultado);
  }

  // Retornamos la forma y si fue correcto para que el loop principal lo sepa
  return { forma, ok: resultado.success };
}


// =============================================================================
// FUNCIÓN PRINCIPAL: main()
// =============================================================================
//
// ¿POR QUÉ NECESITAMOS UN LOOP?
//   El servidor genera las formas al azar. Podría darte 5 squares seguidos
//   antes de darte un triangle. No podemos saber de antemano cuántos intentos
//   necesitamos, por eso repetimos hasta tener las 3.
//
// ¿QUÉ ES UN Set?
//   Es como un array pero con dos reglas especiales:
//   1. No admite duplicados: si agregás "square" dos veces, queda uno solo.
//   2. Tiene .size para saber cuántos elementos únicos tiene.
//
//   Usamos Set porque nos interesa saber CUÁNTAS FORMAS DISTINTAS resolvimos,
//   no cuántas veces resolvimos algo.
//
//   formasResueltas.add("square")  → agrega "square"
//   formasResueltas.add("square")  → no hace nada, ya existe
//   formasResueltas.size           → 1 (solo hay un elemento único)
//
// ¿POR QUÉ LA PAUSA DE 2500ms?
//   El servidor tiene un límite de 30 requests por minuto.
//   2500ms = 2.5 segundos entre requests.
//   60 segundos / 2.5 = 24 requests por minuto → estamos dentro del límite.
//
//   await new Promise((r) => setTimeout(r, 2500))
//   Esta línea crea una promesa que se resuelve después de 2500ms.
//   Es la forma de hacer un "sleep" (pausa) en JavaScript asíncrono.
//
// =============================================================================
async function main() {
  console.log("Iniciando...\n");

  // Set donde guardamos las formas que ya resolvimos correctamente
  const formasResueltas = new Set();

  // Contador de intentos para evitar un loop infinito si algo falla
  let intentos = 0;

  // Continuamos mientras:
  //   formasResueltas.size < 3  → no hayamos resuelto las 3 formas
  //   intentos < 30             → no hayamos superado 30 intentos
  while (formasResueltas.size < 3 && intentos < 30) {

    intentos++;

    // Mostramos el progreso actual
    // [...formasResueltas] convierte el Set en array para poder usar .join()
    console.log(`\n--- Intento #${intentos} | Resueltos: [${[...formasResueltas].join(", ") || "ninguno"}] ---`);

    try {
      // Resolvemos un desafío y obtenemos la forma detectada y si fue correcto
      const { forma, ok } = await resolverDesafio();

      // Solo agregamos al Set si el servidor confirmó que estaba bien
      if (ok) formasResueltas.add(forma);

    } catch (error) {
      // try/catch captura cualquier error inesperado (red caída, servidor, etc.)
      // En vez de crashear el programa, mostramos el error y seguimos
      console.error("Error:", error.message);
    }

    // Pausa de 2.5 segundos para respetar el rate limit del servidor
    // Solo esperamos si todavía nos faltan formas por resolver
    if (formasResueltas.size < 3) {
      await new Promise((r) => setTimeout(r, 2500));
    }
  }

  // Mensaje final dependiendo del resultado
  if (formasResueltas.size === 3) {
    console.log(`\nCompletado! Resolviste las 3 formas: square, triangle, cross`);
  } else {
    console.log(`\nSe acabaron los intentos. Resueltos: [${[...formasResueltas].join(", ")}]`);
    console.log("Espera 1 minuto y volve a correr: node solution.js");
  }
}

// Llamamos a main() para arrancar el programa.
// Todo el código de arriba son solo definiciones de funciones.
// Sin esta línea, nada se ejecutaría.
main();
