function countryListMarkup(countries) {
    return countries
      .map(({ flags, name }) => {
        return `<li>
                      <img src="${flags.svg}" alt="${name.official}" width="25" height="25" />
                           <p>${name.official}</p>
                  </li>`;
      })
      .join('');
  }
  
  export { countryListMarkup };