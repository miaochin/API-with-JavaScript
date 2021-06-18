// API: https://api.covid19api.com

const place = document.getElementById('place');
const summaryNum = document.getElementById('summary-num');
const deathsNum = document.getElementById('deaths-num');
const recoveredNum = document.getElementById('recovered-num');
const activeNum = document.getElementById('active-num');
const searchText = document.getElementById('search-text');
const searchBtn = document.getElementById('search-button');
const date = document.getElementById('date');

searchBtn.addEventListener('click', () => {
    getCountryData(searchText.value);
})

searchText.addEventListener('keyup', (e) => {
    if (e.keyCode == 13) {
        searchBtn.click();
    }
})

async function getWroldData() {
    const res = await fetch('https://api.covid19api.com/summary');
    const data = await res.json();
    const globalData = data.Global;
    place.innerText = 'World';
    summaryNum.innerText = Number(globalData.TotalConfirmed).toLocaleString();
    deathsNum.innerText = Number(globalData.TotalDeaths).toLocaleString();
    recoveredNum.innerText = Number(globalData.TotalRecovered).toLocaleString();
    const TotalActive = (Number(globalData.TotalConfirmed)- Number(globalData.TotalDeaths) - Number(globalData.TotalRecovered)).toLocaleString();
    activeNum.innerText = TotalActive;
    Date(globalData);
}

async function getCountryData(country) {
    const res = await fetch(`https://api.covid19api.com/total/country/${country}`);
    const data = await res.json();
    const countryData = data[data.length-1];
    place.innerText = countryData.Country;
    summaryNum.innerText = Number(countryData.Confirmed).toLocaleString();
    deathsNum.innerText = Number(countryData.Deaths).toLocaleString();
    recoveredNum.innerText = Number(countryData.Recovered).toLocaleString();
    activeNum.innerText = Number(countryData.Active).toLocaleString();
    Date(countryData);
}

function Date(data) {
    let dateNow = '';
    let i = 0;
    while (data.Date[i] != 'T') {
        dateNow += data.Date[i];
        i++
    }
    date.innerText = `Date: ${dateNow}`;
}

getWroldData();