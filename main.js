const formSearch = document.querySelector('.form-search'),
      inputCitiesFrom = document.querySelector('.input__cities-from'),
      inputCitiesTo = document.querySelector('.input__cities-to'),
      dropdownSitiesFrom = document.querySelector('.dropdown__cities-from'),
      dropdownSitiesTo = document.querySelector('.dropdown__cities-to'),
      inputDateDepart = document.querySelector('.input__date-depart');

const сity = ["Москва", "Минск", "Самара", "Одесса", "Екатеринбург",
              "Нижний-Новгород", "Калиниград", "Вроцлав", "Санкт-Петербург",
              "Киев", "Волгоград", "Челябинск", "Днепропетровск", "Керчь"];

const showCity = (input, list) => {
    list.textContent = '';

    if(input.value !== '') {
        const filterCity = сity.filter((item) => {
            const fixItem = item.toLowerCase();
            return fixItem.includes(input.value.toLowerCase());
        })
        filterCity.forEach((item) => {
            const li = document.createElement('li');
            li.classList.add('dropdown__city');
            li.textContent = item;
            list.append(li);
        });
    }
};

inputCitiesFrom.addEventListener("input", () => {
    showCity(inputCitiesFrom, dropdownSitiesFrom);
});

dropdownSitiesFrom.addEventListener('click', (event) => {
    const target = event.target;
    if(target.tagName.toLowerCase() === 'li') {
        inputCitiesFrom.value = target.textContent;
        dropdownSitiesFrom.textContent = '';
    }
});

inputCitiesTo.addEventListener('input', () => {
    showCity(inputCitiesTo, dropdownSitiesTo);
});

dropdownSitiesTo.addEventListener('click', (event) => {
    const target = event.target;
    if(target.tagName.toLowerCase() === 'li') {
        inputCitiesTo.value = target.textContent;
        dropdownSitiesTo.textContent = '';
    }
});