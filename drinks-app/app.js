// API: https://www.thecocktaildb.com/api.php

const search_text = document.getElementById('search-text');
const searchBtn = document.getElementById('search-button');
const drink_list = document.querySelector('.drink-list');
const favorite_drink_list = document.querySelector('.favorite-drink-list');
const homeBtn = document.getElementById('home');
const favoriteBtn = document.getElementById('favorite');
const homeInterface = document.querySelector('.home-interface');
const favoriteInterface = document.querySelector('.favorite-interface');
let fav_id = [];

const fav_drinks = JSON.parse(localStorage.getItem("favoriteDrinks"));

if (fav_drinks) {
    fav_drinks.forEach((drink) => {
        lookupById(drink);
    })
}

favoriteBtn.addEventListener('click', () => {
    homeInterface.classList.add('hidden');
    favoriteInterface.classList.remove('hidden');
})

homeBtn.addEventListener('click', () => {
    homeInterface.classList.remove('hidden');
    favoriteInterface.classList.add('hidden');
})

searchBtn.addEventListener('click', () => {
    if (!search_text.value) {
        window.alert("The input can not be empty!")
    }
    else {
        let empty_count = 0;
        for (let i = 0; i < search_text.value.length ; i++) {
            if (search_text.value[i] == ' ') {
                empty_count++;
            }
        }
        if (empty_count == search_text.value.length) {
            window.alert("The input can not be empty!")
        }
        else {
            searchByName(search_text.value);
        }
    }
})

search_text.addEventListener('keyup', (e) => {
    if (e.keyCode === 13) {
        e.preventDefault();
        searchBtn.click();
    }
})

async function lookupById(id) {
    const res = await fetch(`https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${id}`);
    const data = await res.json();
    const alcoholic = data.drinks[0].strAlcoholic;
    const name = data.drinks[0].strDrink;
    const glass = data.drinks[0].strGlass;
    const category = data.drinks[0].strCategory;
    const imgsrc = data.drinks[0].strDrinkThumb;
    addFavorite (id, name, category, imgsrc, alcoholic, glass);  
}


function addFavorite (id, name, category, imgsrc, alcoholic, glass) {
    if (!fav_id.includes(id)) {
        const favoriteDrink = document.createElement('li');
        favoriteDrink.innerHTML = 
            `<div class="drink-pic">
                    <img src=${imgsrc} alt="drink" />
            </div>
            <div class="drink-info">
                <p class="drink-name">${name}</p>
                <p class="drink-category">${category}</p>
                <p class="alcoholic">${alcoholic}</p>
                <p class="drink-glass"><i style="margin-right: 5px" class="fas fa-wine-glass-alt"></i>${glass}</p>
                <button class="delete"><i class="fas fa-trash"></i></button>
            </div>`;
        favorite_drink_list.appendChild(favoriteDrink);
        fav_id.push(id);
        updateLS(fav_id);
        const deleteBtn = favoriteDrink.querySelector('.delete');
        deleteBtn.addEventListener('click', () => {
            favoriteDrink.remove();
            const index = fav_id.indexOf(id);
            if (index > -1) {
                fav_id.splice(index, 1);
                updateLS(fav_id);
            }
        })
    }
}

async function randomDrink(num) {
    let drink_id = [];
    let count = 0;
    while (count < num) {
        const res = await fetch('https://www.thecocktaildb.com/api/json/v1/1/random.php');
        const data = await res.json();
        const id = data.drinks[0].idDrink;
        if (!drink_id.includes(id)) {
            drink_id.push(id);
            count ++;
            addHome(data.drinks[0]);
        }
    }
    
}

function addHome(drink_item) {
    const id = drink_item.idDrink;
    const alcoholic = drink_item.strAlcoholic;
    const name = drink_item.strDrink;
    const glass = drink_item.strGlass;
    const category = drink_item.strCategory;
    const imgsrc =drink_item.strDrinkThumb;
    const drink = document.createElement('li');
    drink.innerHTML =
        `<div class="drink-pic">
                <img src=${imgsrc} alt="drink" />
        </div>
        <div class="drink-info">
            <p class="drink-name">${name}</p>
            <p class="drink-category">${category}</p>
            <p class="alcoholic">${alcoholic}</p>
            <p class="drink-glass"><i style="margin-right: 5px" class="fas fa-wine-glass-alt"></i>${glass}</p>
                <button class="like"><i class="fas fa-plus"></i></button>
        </div>`;
    const likeBtn = drink.querySelector('.like');
    likeBtn.addEventListener('click', () => {
        addFavorite(id, name, category, imgsrc, alcoholic, glass);

    })
    drink_list.appendChild(drink);
}


async function searchByName(text) {
    const res = await fetch(`https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${text}`);
    if (!res.ok) {window.alert("This drink can not be found!")}
    else {
        const data = await res.json();
        console.log(data);
        if (data.drinks == null) {
            window.alert('This drink can not be found!');
        }
        else {
            drink_list.innerHTML = null;
            data.drinks.forEach((drink) => {
                addHome(drink);
            })
        }
    }
}

function updateLS() {
    localStorage.setItem('favoriteDrinks', JSON.stringify(fav_id)); 
}

randomDrink(8);