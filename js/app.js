import conditions from "../dic.js";

const KEY = '2506df3f297e417f8eb140617251309';

const header = document.querySelector('.header');
const form = document.querySelector('#form');
const input = document.querySelector('.input');

function removeCard() {
  const prevCard = document.querySelector('.card');
  if (prevCard) prevCard.remove();
};

function showError(errorMessage) {
  const htmlErr = `<div class="card">${errorMessage}</div>`
  header.insertAdjacentHTML('afterend', htmlErr);
};

function showCard({ name, country, temp, text, icon }) {
  const html = `
      <div class="card">
        <h2 class="card_sity">${name} <span>${country}</span></h2>
        <div class="card_weather">
          <div class="card_value">${temp}<sup>°c</sup></div>
          <img class="card_img" src="${icon}">
        </div>
        <div class="card_desc">${text}</div>
      </div>
      `
  header.insertAdjacentHTML('afterend', html);
};

async function getWeather(city) {
  const url = `https://api.weatherapi.com/v1/current.json?key=${KEY}&q=${city}`

  const response = await fetch(url);
  const data = await response.json();
  return data;
}

form.onsubmit = async function (e) {
  // Отменяем отправку формы
  e.preventDefault();

  // Берем значение из input
  let city = input.value.trim();

  const data = await getWeather(city);

  if (data.error) {
    removeCard();
    showError(data.error.message);
  } else {
    removeCard();

    const info = conditions.find((el) => el.code === data.current.condition.code);

    const filePath = './image/' + (data.current.condition.is_day ? 'day' : 'night') + '/';
    const fileName = (data.current.condition.is_day ? info.day : info.night) + '.png';
    const imgPath = filePath + fileName;

    const weatherData = {
      name: data.location.name,
      country: data.location.country,
      temp: data.current.temp_c,
      text: data.current.condition.is_day ? info.languages[23]['day_text'] : info.languages[23]['night_text'],
      icon: imgPath,
    };

    showCard(weatherData);
  };

};