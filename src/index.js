import './css/styles.css';
import { fetchCountries } from './js/fetchCountries';
import { countryListMarkup } from './js/countryListMarkup';
import { countryInfoMarkup } from './js/countryInfoMarkup';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';

const DEBOUNCE_DELAY = 300;

const inputValue = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

// Назву країни для пошуку користувач вводить у текстове поле input#search-box.
// HTTP-запити виконуються при введенні назви країни, тобто на події input.
// Але робити запит з кожним натисканням клавіші не можна, оскільки одночасно буде багато запитів
// і вони будуть виконуватися в непередбачуваному порядку.
// Необхідно застосувати прийом Debounce на обробнику події і робити HTTP-запит через 300 мс після того,
// як користувач перестав вводити текст. Використовуй пакет lodash.debounce.
inputValue.addEventListener('input', debounce(onInputSearch, DEBOUNCE_DELAY));

function onInputSearch(event) {
  // Якщо користувач повністю очищає поле пошуку, то HTTP-запит не виконується,
  // а розмітка списку країн або інформації про країну зникає.
  if (!event.target.value) {
    emptyInput();
    Notiflix.Notify.warning('Please enter any data!');
    return;
  }

  // Виконай санітизацію введеного рядка методом trim(), це вирішить проблему,
  // коли в полі введення тільки пробіли, або вони є на початку і в кінці рядка.
  return (
    fetchCountries(event.target.value.trim())
      .then(showCountry)
      // Якщо користувач ввів назву країни, якої не існує, бекенд поверне не порожній масив, а помилку зі статус кодом 404 - не знайдено.
      // Якщо це не обробити, то користувач ніколи не дізнається про те, що пошук не дав результатів.
      .catch(showError)
  );
}

function showCountry(countries) {
  // Якщо у відповіді бекенд повернув більше ніж 10 країн, в інтерфейсі з'являється повідомлення про те,
  // що назва повинна бути специфічнішою.
  // Для повідомлень використовуй бібліотеку notiflix і виводь такий рядок "Too many matches found. Please enter a more specific name.".
  if (countries.length > 10) {
    emptyInput();
    Notiflix.Notify.info(
      'Too many matches found. Please enter a more specific name.'
    );
    return;
  }

  // Якщо бекенд повернув від 2-х до 10-и країн, під тестовим полем відображається список знайдених країн.
  // Кожен елемент списку складається з прапора та назви країни.
  if (countries.length >= 2 && countries.length <= 10) {
    emptyInput();
    countryList.innerHTML = countryListMarkup(countries);
    return;
  }

  // Якщо результат запиту - це масив з однією країною, в інтерфейсі відображається розмітка картки
  // з даними про країну: прапор, назва, столиця, населення і мови.
  emptyInput();
  countryInfo.innerHTML = countryInfoMarkup(countries);
}

// Додай повідомлення "Oops, there is no country with that name" у разі помилки, використовуючи бібліотеку notiflix.
function showError() {
  emptyInput();
  Notiflix.Notify.failure('Oops, there is no country with that name');
}

function emptyInput() {
  countryList.innerHTML = '';
  countryInfo.innerHTML = '';
}


