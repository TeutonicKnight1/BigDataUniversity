"use server";

export default async function getProviders() {
  // console.log(`${process.env.API_URL}/locations?coordinates=51.50,-0.12&radius=5000&limit=10`,);

  const res = await fetch(`${process.env.API_URL}/countries/1`, {
    headers: {
      "X-API-Key": process.env.NEXT_X_API_KEY as string,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    console.error("Failed to fetch providers", await res.statusText);
  }

  return res.json();
}
