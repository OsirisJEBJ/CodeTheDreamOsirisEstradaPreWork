const API_URL = "https://api.thedogapi.com/v1/breeds";

const TARGET_SIZE_MAX = 10; // kg
const TARGET_TEMPERAMENT = ["Gentle", "Calm", "Affectionate", "Friendly"];

async function getBreedImage(breedId) {
  try {
    const response = await fetch(
      `https://api.thedogapi.com/v1/images/search?breed_id=${breedId}`
    );
    const data = await response.json();

    return data[0]?.url || "https://placedog.net/400";
  } catch (error) {
    console.error("Error fetching breed image:", error);
    return "https://placedog.net/400";
  }
}

async function loadSimilarDogs() {
  try {
    const response = await fetch(API_URL);
    const breeds = await response.json();

    const container = document.getElementById("similar-list");
    container.innerHTML = "";

    const similar = breeds.filter(breed => {
      const weightStr = breed.weight.metric.split("-")[0].trim();
      const weight = parseInt(weightStr);

      const temperament = breed.temperament?.split(", ") || [];

      const isSmall = weight && weight <= TARGET_SIZE_MAX;
      const isGentle = temperament.some(t => TARGET_TEMPERAMENT.includes(t));

      return isSmall && isGentle;
    });

    for (const breed of similar) {
      const imageUrl = await getBreedImage(breed.id);

      const card = document.createElement("div");
      card.className = "breed-card";

      card.innerHTML = `
        <h2>${breed.name}</h2>
        <img src="${imageUrl}" alt="${breed.name}">
        <p><strong>Temperament:</strong> ${breed.temperament || "N/A"}</p>
        <p><strong>Weight:</strong> ${breed.weight.metric} kg</p>
      `;

      container.appendChild(card);
    }

  } catch (error) {
    console.error("Error loading similar dogs:", error);
    document.getElementById("similar-list").innerHTML =
      "<p>Failed to load similar dogs. Try again later.</p>";
  }
}

loadSimilarDogs();