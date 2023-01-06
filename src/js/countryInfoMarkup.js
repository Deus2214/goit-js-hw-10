function countryInfoMarkup(countries) {
    return countries
      .map(({ flags, name, capital, population, languages }) => {
        return `<img src="${flags.svg}" alt="${
          name.official
        }" width="50" height="50" />
                  <h1>${name.official}</h1>
                  <p><span>Capital:&#160;</span>${capital}</p>
                  <p><span>Population:&#160;</span>${population}</p>
                  <p>
                      <span>Languages:&#160;</span>
                      ${Object.values(languages).join(', ')}
                  </p>`;
      })
      .join('');
  }
  
  export { countryInfoMarkup };