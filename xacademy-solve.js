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
async function main() {
  const datos = await obtenerDesafio();

  const grilla = decodificarMapa(datos.map);

  console.log("Grilla final:", grilla);
}

main();