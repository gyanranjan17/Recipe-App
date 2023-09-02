//Initial References
let result = document.getElementById("result");
let searchBtn = document.getElementById("search-btn");
let url = "https://www.themealdb.com/api/json/v1/1/search.php?s=";
let userInput = document.getElementById("user-inp");
const suggestionsContainer = document.getElementById("suggestions-container");

function performSearch(){
  let userInp = document.getElementById("user-inp").value;
  if (userInp.length == 0) {
    result.innerHTML = `<h3>Input Field Cannot Be Empty</h3>`;
  } else {
    fetch(url + userInp)
      .then((response) => response.json())
      .then((data) => {
        let myMeal = data.meals[0];
        console.log(myMeal);
        console.log(myMeal.strMealThumb);
        console.log(myMeal.strMeal);
        console.log(myMeal.strArea);
        console.log(myMeal.strInstructions);
        let count = 1;
        let ingredients = [];
        for (let i in myMeal) {
          let ingredient = "";
          let measure = "";
          if (i.startsWith("strIngredient") && myMeal[i]) {
            ingredient = myMeal[i];
            measure = myMeal[`strMeasure` + count];
            count += 1;
            ingredients.push(`${measure} ${ingredient}`);
          }
        }
        console.log(ingredients);

        result.innerHTML = `
    <img src=${myMeal.strMealThumb}>
    <div class="details">
        <h2>${myMeal.strMeal}</h2>
        <h4>${myMeal.strArea}</h4>
    </div>
    <div id="ingredient-con"></div>
    <div id="recipe">
        <button id="hide-recipe">X</button>
        <pre id="instructions">${myMeal.strInstructions}</pre>
    </div>
    <button id="show-recipe">View Recipe</button>
    `;
        let ingredientCon = document.getElementById("ingredient-con");
        let parent = document.createElement("ul");
        let recipe = document.getElementById("recipe");
        let hideRecipe = document.getElementById("hide-recipe");
        let showRecipe = document.getElementById("show-recipe");

        ingredients.forEach((i) => {
          let child = document.createElement("li");
          child.innerText = i;
          parent.appendChild(child);
          ingredientCon.appendChild(parent);
        });

        hideRecipe.addEventListener("click", () => {
          recipe.style.display = "none";
        });
        showRecipe.addEventListener("click", () => {
          recipe.style.display = "block";
        });
      })
      .catch(() => {
        result.innerHTML = `<h3>Invalid Input</h3>`;
      });
  }
};
searchBtn.addEventListener("click", () => {
  performSearch();
});

// Event listener for keyup on input field (to detect the Enter key)
userInput.addEventListener("keyup", (event) => {
  if (event.key === "Enter") {
    performSearch();
  }
});











function fetchSuggestions(userInputValue) {
  fetch(url + userInputValue)
      .then((response) => response.json())
      .then((data) => {
          const meals = data.meals;

          // Clear the previous suggestions
          suggestionsContainer.innerHTML = "";

          if (meals) {
              meals.forEach((meal) => {
                  const suggestionItem = document.createElement("div");
                  suggestionItem.classList.add("suggestion-item");
                  suggestionItem.innerText = meal.strMeal;

                  // Add a click event listener to populate the input field with the suggestion
                  suggestionItem.addEventListener("click", () => {
                      userInput.value = meal.strMeal;
                      suggestionsContainer.innerHTML = ""; // Clear suggestions after selecting
                      performSearch(); // Trigger the search immediately
                  });

                  suggestionsContainer.appendChild(suggestionItem);
              });
          }
      })
      .catch(() => {
          // Handle errors if needed
      });
}

// Event listener for input changes
userInput.addEventListener("input", () => {
  const userInputValue = userInput.value.trim(); // Remove leading/trailing spaces
  if (userInputValue.length >= 1) { // You can adjust the minimum length for suggestions
      fetchSuggestions(userInputValue);
      suggestionsContainer.style.display = "block"; // Show suggestions
  } else {
      suggestionsContainer.style.display = "none"; // Hide suggestions when input is too short
  }
});
document.addEventListener("click", (event) => {
  if (!suggestionsContainer.contains(event.target) && event.target !== userInput) {
      suggestionsContainer.style.display = "none";
  }
});


