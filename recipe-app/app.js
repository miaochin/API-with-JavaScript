// API: https://www.themealdb.com/api.php

const searchBtn = document.getElementById('search-button');
const searchText = document.getElementById('search-text');
const recipeList = document.querySelector('.recipe-list');

searchBtn.addEventListener('click', () => {
    searchName(searchText.value);
})

searchText.addEventListener('keyup', (e) => {
    if (e.keyCode === 13) {
        e.preventDefault();
        searchBtn.click();
    }
})

function addRecipe(name, imgsrc, instructions) {
    const recipe = document.createElement('div');
    recipe.classList.add('recipe');
    recipe.innerHTML = 
        `<img src="${imgsrc}" alt="food" />
        <p class="name">${name}</p>
        <button class="get-recipe">Get Recipe!</button>
        <div class="recipe-detail hidden">
            <button class="close-recipe"><i class="fas fa-times"></i></button>
            <p class="d-name">${name}</p>
            <p class="d-instructions">
                Instructions: ${instructions}
            </p>
        </div>`;
    recipeList.appendChild(recipe);
    
    const recipeDetail = recipe.querySelector('.recipe-detail');
    const getRecipeBtn = recipe.querySelector('.get-recipe');
    const closeRecipeBtn = recipe.querySelector('.close-recipe');
    
    getRecipeBtn.addEventListener('click', () => {
        recipeDetail.classList.remove('hidden');
    })
    
    closeRecipeBtn.addEventListener('click', () => {
        recipeDetail.classList.add('hidden');
    })
}


async function randomRecipe() {
    let mealId = [];
    let count = 0;
    while(count < 20) {
        const res = await fetch('https:www.themealdb.com/api/json/v1/1/random.php');
        const data = await res.json();
        if (!mealId.includes(data.meals[0].idMeal)) {
            const name = data.meals[0].strMeal;
            const imgsrc = data.meals[0].strMealThumb;
            const instructions = data.meals[0].strInstructions;
            addRecipe(name, imgsrc, instructions);
            mealId.push(data.meals[0].idMeal);
            count ++;
        }
    }
}

async function searchName(text) {
    const res = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${text}`);
    if (res.ok) {
        const data = await res.json();
        const meals = data.meals;
        if (meals) {
            recipeList.innerHTML = null;
            meals.forEach((meal) => {
                const name = meal.strMeal;
                const imgsrc = meal.strMealThumb;
                const instructions = meal.strInstructions;
                addRecipe(name, imgsrc, instructions);  
            })
        }
    }
}

randomRecipe();

