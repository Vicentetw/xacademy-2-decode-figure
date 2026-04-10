//----------------------------------------------------------------------
//Constante para obtener el reto
//----------------------------------------------------------------------
const BASE_URL = "https://xacademy-ejercicio-02-2026.vercel.app/api";

async function obtenerDesafio() {
  const respuesta = await fetch(`${BASE_URL}/challenge`);
  const datos = await respuesta.json();

  console.log(datos);
  //retorno datos con { id: ,map: , targetSymbol: }
  return datos;
}

//----------------------------------------------------------------------
//Decodificación del mensaje mapa base 64
//----------------------------------------------------------------------
//Recibe string en Base64
//Convierte el base64 a a texto ASCII
// Corta el texto por los saldos de linea \n para las fila
// Convierte cada fila esting en array de caracteres
//devuelge grilla  como array de arrays de caracteres

//Bufer.from recibe el base 64 y lo convierte a texto ascii.
function decodificarMapa(base64) {

  const texto = Buffer.from(base64, 'base64').toString('ascii');
  //trim() elimina los espacios en blanco al inicio y al final del texto, luego split('\n') corta el texto por los saltos de linea para obtener cada fila, y map() convierte cada fila en un array de caracteres usando split("").
  // .split("\n")   → corta el string cada vez que encuentra un salto de línea
  //                  "fila0\nfila1\nfila2" → ["fila0", "fila1", "fila2"]
  const grilla = texto.trim().split('\n').map((fila) => fila.split(""));
  console.log(grilla);
  return grilla;

}
//----------------------------------------------------------------------
// FUNCIÓN 3: encontrarPuntos(grilla, simbolo)
//-----------------------------------------------------------------------


//decodificarMapa();
//obtenerDesafio();

//ENCONTRAR PUNTOS
function encontrarPuntos(grilla, simbolo) {
  const puntos = [];
  // Recorro con bucle externo cada fila eje Y vertical
  for (let y = 0; y < grilla.length; y++) {
    // Recorro con bucle interno cada columna eje X horizontal
    for (let x = 0; x < grilla[y].length; x++) {
      //compara simbolo en la posición actual con el simbolo objetivo, si coincide, guarda las coordenadas (x, y) en el array puntos.
      if (grilla[y][x] === simbolo) {
        puntos.push({ x, y });
      }

    }
  }
  console.log("Los puntos son: ", puntos);
  return puntos;
}

function detectarForma(puntos) {
  //extraigo los valores de x en xs y de y en ys  en un array
  const xs = puntos.map(p => p.x);
  const ys = puntos.map(p => p.y);
  //calculo el centro de la forma encontrando el punto medio entre el mínimo y máximo de las coordenadas x e y respectivamente. Esto se hace sumando el mínimo y el máximo y dividiendo por 2.
  const centroX = (Math.min(...xs) + Math.max(...xs)) / 2;
  const centroY = (Math.min(...ys) + Math.max(...ys)) / 2;

  const esCruz = puntos.every((p) => p.x === centroX || p.y === centroY);

  if (esCruz) {
    return "cross";
  }

  //Obseto contador de símbolos por fila y columna

  const simbolosPorFila = {};

  for (const p of puntos) {
    // Si simbolosPorFila[p.y]  existe, le sumo 1.
    // Si NO existe (undefined), uso 0 como valor inicial y le summo 1.
    // El operador || devuelve el primer valor "truthy": undefined||0 → 0
    simbolosPorFila[p.y] = (simbolosPorFila[p.y] || 0) + 1;
  }

  const cantidades = Object.values(simbolosPorFila);


  const esPalindromo = cantidades.every(
    (c, i) => c === cantidades[cantidades.length - 1 - i]
  );

  if (esPalindromo) return "square";

  // triangulo 
  // Si llega hasta acá, no es cruz ni cuadrado → es triángulo
  return "triangle";
}

function calcularCentro(puntos) {

  // Suma todos los valores de X usando reduce
  // acc = acumulador, p = punto actual
  const sumaX = puntos.reduce((acc, p) => acc + p.x, 0);

  // Sumamos todos los valores de Y
  const sumaY = puntos.reduce((acc, p) => acc + p.y, 0);

  // % cantidad de puntos para obtener el promedio
  // Math.round() redondea a entero 
  // (el enunciado dice que .5 redondea hacia arriba, que es lo que hace Math.round)
  return {
    x: Math.round(sumaX / puntos.length),
    y: Math.round(sumaY / puntos.length),
  };
}

// calcularCodigo ¿QUÉ RECIBE?
//   cantidadSimbolos → puntos.length, la cantidad de símbolos encontrados
//   centro           → el objeto {x, y} que calculamos antes
//
// ¿QUÉ HACE?
//   Aplica la fórmula del enunciado:
//   code = (cantidad_de_símbolos * centro.x) + centro.y
function calcularCodigo(cantidadSimbolos, centro) {
  return (cantidadSimbolos * centro.x) + centro.y;
}

// validarRespuesta(id, forma, centro, codigo)
async function validarRespuesta(id, forma, centro, codigo) {

  // Armamo el objeto con respuesta que pide el servidor
  const cuerpo = {
    id:     id,                    // id del desafío
    shape:  forma,                 // forma que detectamos
    center: [centro.x, centro.y], // el servidor espera un array [x, y], no un objeto {x,y}
    code:   codigo,                // el código calculado
  };

  // Hacemos el POST a /validate con el objeto const cuerpo {} convertido a JSON
  const respuesta = await fetch(`${BASE_URL}/validate`, {
    method:  "POST",                               // tipo de petición HTTP
    headers: { "Content-Type": "application/json" }, // le decimos que mandamos JSON
    body:    JSON.stringify(cuerpo),               // convertimos el objeto a string
  });

  // Parseamos la respuesta del servidor a objeto JavaScript
  const resultado = await respuesta.json();

  return resultado;
}

async function resolverDesafio() {

  // PASO 1: Pedo el desafío --------------------------------------------------
  const desafio = await obtenerDesafio();
  console.log(`\n Desafio: ${desafio.id} | Simbolo: "${desafio.targetSymbol}"`);

  // PASO 2: Decodificar el mapa Base64 en una grilla 2D -----------------------
  const grilla = decodificarMapa(desafio.map);

  // muestro el mapa visualmente
  console.log("\n Mapa:");
  grilla.forEach((fila, i) => console.log(`   Fila ${i}: ${fila.join(" ")}`));

  // PASO 3: Encontrar todos los puntos del símbolo----------------------------- 
  const puntos = encontrarPuntos(grilla, desafio.targetSymbol);
  console.log(`\n   Simbolos encontrados: ${puntos.length}`);

  // PASO 4: Detectar la forma--------------------------------------------------
  const forma = detectarForma(puntos);
  console.log(`   Forma detectada: ${forma}`);

  //  PASO 5: Calcular el centro -------------------------------------------------
  const centro = calcularCentro(puntos);
  console.log(`   Centro: x=${centro.x}, y=${centro.y}`);

  //  PASO 6: Calcular el código --------------------------------------------------
  const codigo = calcularCodigo(puntos.length, centro);
  console.log(`   Codigo: (${puntos.length} x ${centro.x}) + ${centro.y} = ${codigo}`);

  // PASO 7: Enviar la respuesta al servidor ------------------------------------
  const resultado = await validarRespuesta(desafio.id, forma, centro, codigo);

  if (resultado.success) {
    console.log(`\n CORRECTO! ${resultado.message}`);
  } else {
    console.log(`\n Incorrecto:`, resultado);
  }

  // Retornamos la forma y si fue correcto para que el loop principal lo sepa
  return { forma, ok: resultado.success };
}



//main para pasar el reto a la función decodificarMapa y mostrar la grilla resultante. 

async function main() {
  console.log("Iniciando...\n");

  //  guarda formas que ya resolvimos correctamente
  const formasResueltas = new Set();

  // Contador de intentos para evitar un loop infinito si algo falla
  let intentos = 0;

  // Continuamos mientras:
  //   formasResueltas.size < 3  → no hayamos resuelto las 3 formas
  //   intentos < 30             → no hayamos superado 30 intentos por el bloqueo
  while (formasResueltas.size < 3 && intentos < 30) {

    intentos++;

    // Mostramos el progreso actual
    // [...formasResueltas] convierte el Set en array para poder usar .join()
    console.log(`\n--- Intento #${intentos} | Resueltos: [${[...formasResueltas].join(", ") || "ninguno"}] ---`);

    try {
      // Resolvemos un desafío y obtenemos la forma detectada y si fue correcto
      const { forma, ok } = await resolverDesafio();

      // Solo agregamo al Set si el servidor confirmó que estaba bien
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
    console.log("Espera 1 minuto y volve a correr: node xacademy-solve.js");
  }
}

// Llamamos a main() para arrancar el programa.

main();