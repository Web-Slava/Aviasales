const formSearch = document.querySelector('.form-search'),
      inputCitiesFrom = document.querySelector('.input__cities-from'),
      inputCitiesTo = document.querySelector('.input__cities-to'),
      dropdownCitiesFrom = document.querySelector('.dropdown__cities-from'),
      dropdownCitiesTo = document.querySelector('.dropdown__cities-to'),
      inputDateDepart = document.querySelector('.input__date-depart'),
      cheapestTicket = document.getElementById('cheapest-ticket'),
      otherCheapTickets = document.getElementById('other-cheap-tickets'),
      wrongRequest = document.getElementById('wrong-request');

const citiesApi = 'dataBase/cities.json',
      proxy = 'https://cors-anywhere.herokuapp.com/',
      API_KEY = 'f6f7e9439d56ced6fb60cb83274a2feb',
      calendar = 'http://min-prices.aviasales.ru/calendar_preload',
      MAX_COUNT = 10;

let city = [];

// ---- functions ----
                // формируем запрос на сервер
const getData = (url, callback, reject = console.error) => {

    const request = new XMLHttpRequest();

    request.open('GET', url);

    request.addEventListener('readystatechange', () => {
        if (request.readyState !== 4) return;
            
        if(request.status === 200) {
            callback(request.response);
        } else {
            reject(request.status);
        }
    });

    request.send();
};

            // создает выпадающий список городов
const showCity = (input, list) => {
    list.textContent = '';

    if(input.value !== '') {
        const filterCity = city.filter((item) => {
            const fixItem = item.name.toLowerCase();
            return fixItem.startsWith(input.value.toLowerCase());
        });

        filterCity.forEach((item) => {   
            const li = document.createElement('li');
            li.classList.add('dropdown__city');
            li.textContent = item.name;
            list.append(li);
        });
    }
};

const selectCity = (event, input, list) => {
    const target = event.target;
    if(target.tagName.toLowerCase() === 'li') {
        input.value = target.textContent;
        list.textContent = '';
    }
};

const getNameCity = (code) => {
    const objCity = city.find((item) => item.code === code);
    return objCity.name;
};

const getDate = (date) => {
    return new Date(date).toLocaleString('ru', {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

const getChanges = (num) => {
    if(num) {
        return num === 1 ? 'одна пересадка' : 'две пересадки';
    } else {
        return 'Без пересадок';
    }
};

const getLinkAviasales = (data) => {
    let link = 'https://www.aviasales.ru/search/';

    link += data.origin;

    const date = new Date(data.depart_date);

    const day = date.getDate();
    const month = date.getMonth() + 1;

    link += day < 10 ? '0' + day : day;
    link += month < 10 ? '0' + month : month;
    link += data.destination;
    link += '1';

    return link;
};

const createCard = (data) => {
    const ticket = document.createElement('article');
    ticket.classList.add('ticket');

    let deep = '';

    if(data) {
        deep = `
        <h3 class="agent">${data.gate}</h3>
        <div class="ticket__wrapper">
            <div class="left-side">
                <a href="${getLinkAviasales(data)}" class="button button__buy" target = "_blank">Купить
                    за ${data.value} ₽</a>
            </div>
            <div class="right-side">
                <div class="block-left">
                    <div class="city__from">Вылет из города
                        <span class="city__name">${getNameCity(data.origin)}</span>
                    </div>
                    <div class="date">${getDate(data.depart_date)}</div>
                </div>
        
                <div class="block-right">
                    <div class="changes">${getChanges(data.number_of_changes)}</div>
                    <div class="city__to">Город назначения:
                        <span class="city__name">${getNameCity(data.destination)}</span>
                    </div>
                </div>
            </div>
        </div>
        `;
    } else {
        deep = '<h3>К сожалению на текущую дату билетов не нашлось</h3>';
    }

    ticket.insertAdjacentHTML('afterbegin', deep);

    return ticket;
};

const renderCheapDay = (cheapTicket) => {
    cheapestTicket.innerHTML ='<h2>Самый дешевый билет на выбранную дату</h2>';

    const ticket = createCard(cheapTicket[0]);
    cheapestTicket.append(ticket);
    console.log(cheapTicket);
};

const renderCheapYear = (cheapTickets) => {
    otherCheapTickets.innerHTML = '<h2>Другие билеты на ближайшие даты</h2>';

    
    cheapTickets.sort((item1, item2) => {
        const date1 = new Date(item1.depart_date);
        const date2 = new Date(item2.depart_date);
        return date1 - date2;
    });

    for(let i = 0; i < cheapTickets.length && i < MAX_COUNT; i++) {
        const ticket = createCard(cheapTickets[i]);
        otherCheapTickets.append(ticket);
    }
};

const renderCheap = (data, date) => {
    
    const cheapTicketYear = JSON.parse(data).best_prices;

    const cheapTicketDay = cheapTicketYear.filter((item) => {
        return item.depart_date === date;
    });

    renderCheapDay(cheapTicketDay);
    renderCheapYear(cheapTicketYear);
    
};

        // вызов функций

inputCitiesFrom.addEventListener('input', () => {
    showCity(inputCitiesFrom, dropdownCitiesFrom);
});

inputCitiesTo.addEventListener('input', () => {
    showCity(inputCitiesTo, dropdownCitiesTo);
});

dropdownCitiesFrom.addEventListener('click', (event) => {
    selectCity(event, inputCitiesFrom, dropdownCitiesFrom);
});

dropdownCitiesTo.addEventListener('click', (event) => {
    selectCity(event, inputCitiesTo, dropdownCitiesTo);
});

formSearch.addEventListener('submit', (event) => {
    event.preventDefault();
    wrongRequest.innerHTML = '';

    const cityFrom = city.find((item) => inputCitiesFrom.value === item.name);

    const cityTo = city.find((item) => inputCitiesTo.value === item.name);

    const formData = {
        from: cityFrom,
        to: cityTo,
        when: inputDateDepart.value
    };

    // const errorText = document.createElement('p');  //--- вариант добавления текста с ошибкой
    // errorText.classList.add('error-request');

    if(formData.from && formData.to) {
        
        const requestData = `?depart_date=${formData.when}&origin=${formData.from.code}&destination=${formData.to.code}&one_way=true`;

        getData(calendar + requestData, (response) => {
               renderCheap(response, formData.when);
        }, (error) => {
            // errorText.innerHTML = 'К сожалению в этом направлении нет билетов';
            // wrongRequest.append(errorText);
            wrongRequest.innerHTML = 'К сожалению в этом направлении нет билетов';

            console.error('Ошибка', error);
        });
    } else {
        // errorText.innerHTML = 'Введите корректное название города';
        // wrongRequest.append(errorText);
        wrongRequest.innerHTML = 'Введите корректное название города';
    }

    // const requestData = '?depart_date=' + formData.when +
    //     '&origin=' + formData.from + '&destination=' +
    //     formData.to + '&one_way=true';
   
});

getData(citiesApi, (data) => {
    city = JSON.parse(data).filter((item) => {
        return item.name;
    });
    
    city.sort((a, b) => {
        if (a.name < b.name) {
            return -1;
        } 
        if (a.name > b.name) {
            return 1;
        }
        return 0;
    });
    console.log(city);

});

