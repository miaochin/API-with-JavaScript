// API: https://restcountries.eu/

const searchBtn = document.getElementById('search-button');
const country = document.getElementById('search-country');
const country_name = document.getElementById('country-name');
const country_lang = document.querySelector('.country-lang');
const country_flag = document.getElementById('country-flag');
const flag = document.querySelector('.flag');
const language = document.querySelector('.language');


searchBtn.addEventListener('click', () => {
    getCountryInfo();
})

country.addEventListener("keyup", (e) => {
    if (e.keyCode === 13) {
        e.preventDefault();
        searchBtn.click();
    }
})

async function getCountryInfo() {
    const res = await fetch(`https://restcountries.eu/rest/v2/name/${country.value}?fullText=true`);
    if (!res.ok) {
        window.alert('This country can not be found!');
    }
    else {
        country_name.classList.remove('hidden')
        flag.classList.remove('hidden');
        language.classList.remove('hidden');
        const data = await res.json();
        country_name.innerText = data[0].name;
        country_flag.src = data[0].flag;
        const languages = data[0].languages;
        country_lang.innerHTML = null;
        languages.forEach(element => {
            const lang = document.createElement('li');
            lang.innerText = element.name;
            country_lang.appendChild(lang);
        });
        country.value = '';
    }
}

