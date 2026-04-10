//----------------------------------------------------------------------
//Constante para obtener el reto
//----------------------------------------------------------------------
const BASE_URL = "https://xacademy-ejercicio-02-2026.vercel.app/api";

async function obtenerDesafio() {
  const respuesta = await fetch(`${BASE_URL}/challenge`);
  const datos = await respuesta.json();

  console.log(datos);
}

obtenerDesafio();