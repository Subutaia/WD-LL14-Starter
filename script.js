// Populate the area dropdown when the page loads
window.addEventListener("DOMContentLoaded", function () {
  const areaSelect = document.getElementById("area-select");
  areaSelect.innerHTML = '<option value="">Select Area</option>';

  fetch("https://www.themealdb.com/api/json/v1/1/list.php?a=list")
    .then((response) => response.json())
    .then((data) => {
      if (data.meals) {
        data.meals.forEach((areaObj) => {
          const option = document.createElement("option");
          option.value = areaObj.strArea;
          option.textContent = areaObj.strArea;
          areaSelect.appendChild(option);
        });
      }
    });
});

// When the user selects an area, fetch and display meals for that area
document
  .getElementById("area-select")
  .addEventListener("change", async function () {
    const area = this.value;
    const resultsDiv = document.getElementById("results");
    resultsDiv.innerHTML = ""; // Clear previous results

    if (!area) return;

    // Use async/await to fetch meals for the selected area
    try {
      const response = await fetch(
        `https://www.themealdb.com/api/json/v1/1/filter.php?a=${encodeURIComponent(
          area
        )}`
      );
      const data = await response.json();

      if (data.meals) {
        data.meals.forEach((meal) => {
          // Create a card for each meal
          const mealDiv = document.createElement("div");
          mealDiv.className = "meal";
          mealDiv.style.cursor = "pointer"; // Show pointer on hover

          const title = document.createElement("h3");
          title.textContent = meal.strMeal;

          const img = document.createElement("img");
          img.src = meal.strMealThumb;
          img.alt = meal.strMeal;

          mealDiv.appendChild(title);
          mealDiv.appendChild(img);

          // Add a click event to fetch and show meal details
          mealDiv.addEventListener("click", async function () {
            // Fetch meal details using the meal ID
            const mealId = meal.idMeal;
            const detailResponse = await fetch(
              `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`
            );
            const detailData = await detailResponse.json();

            // Save the current area so we can reload the meal list
            const currentArea = area;

            // Clear previous results and show details
            resultsDiv.innerHTML = "";

            if (detailData.meals && detailData.meals[0]) {
              const mealDetails = detailData.meals[0];

              // Create elements to show meal details
              const detailsDiv = document.createElement("div");
              detailsDiv.className = "meal-details";

              // Meal name
              const name = document.createElement("h2");
              name.textContent = mealDetails.strMeal;
              detailsDiv.appendChild(name);

              // Meal image
              const detailImg = document.createElement("img");
              detailImg.src = mealDetails.strMealThumb;
              detailImg.alt = mealDetails.strMeal;
              detailsDiv.appendChild(detailImg);

              // Instructions
              const instructions = document.createElement("p");
              instructions.textContent = mealDetails.strInstructions;
              detailsDiv.appendChild(instructions);

              // Back button
              const backButton = document.createElement("button");
              backButton.textContent = "Back";
              backButton.style.marginTop = "24px";
              backButton.style.padding = "10px 24px";
              backButton.style.fontSize = "1rem";
              backButton.style.borderRadius = "6px";
              backButton.style.border = "none";
              backButton.style.background = "#92c7fc";
              backButton.style.color = "#222";
              backButton.style.cursor = "pointer";

              // When clicked, reload the meal list for the selected area
              backButton.addEventListener("click", async function () {
                // Trigger the change event to reload meals
                document
                  .getElementById("area-select")
                  .dispatchEvent(new Event("change"));
              });

              detailsDiv.appendChild(backButton);

              // Show details in resultsDiv
              resultsDiv.appendChild(detailsDiv);
            } else {
              resultsDiv.textContent = "Meal details not found.";
            }
          });

          resultsDiv.appendChild(mealDiv);
        });
      } else {
        resultsDiv.textContent = "No meals found for this area.";
      }
    } catch (error) {
      resultsDiv.textContent = "Error fetching meals.";
    }
  });
