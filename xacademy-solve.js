const BASE_URL = "https://xacademy-ejercicio-02-2026.vercel.app/api";

async function main() {
  const res = await fetch(`${BASE_URL}/challenge`);
  const data = await res.json();

  console.log(data);
}

main();