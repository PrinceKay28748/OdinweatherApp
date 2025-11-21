// This is the Odin Weather App main JavaScript file
// It will handle fetching weather data and updating the UI


const fetchWeatherData = async (location)=>{
    try{
        const response = await fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${encodeURIComponent(location)}?unitGroup=metric&key=KQB4PVGD5CQP58LN2PY295WNZ&contentType=json`);

        if(!response.ok){
            throw new Error('Network response was not ok ' + response.statusText);
        }

        const weatherData = await response.json();
        console.log(weatherData);

        return weatherData;
    }catch(error){
        console.error('There has been a problem with your fetch operation:', error);
    }
}

// Function to process and transform the weather data response
const processWeatherData = (weatherData) => {
    return {
        resolvedAddress: weatherData.resolvedAddress,
        currentConditions: extractCurrentConditions(weatherData.currentConditions),
        dailySummaries: weatherData.days.map(extractDaySummary)
    };
};

// Function to extract and format current weather conditions
const extractCurrentConditions = (currentConditions) => {
    return {
        temp: currentConditions.temp,
        feelslike: currentConditions.feelslike,
        humidity: currentConditions.humidity,
        conditions: currentConditions.conditions
    };
};

// Function to transform each day's summary data from the weather data
const extractDaySummary = (day) => {
    return {
        date: day.datetime,
        maxTemp: day.tempmax,
        minTemp: day.tempmin,
        description: day.description
    };
};

// function that takes user input and triggers the fetch and process functions
// it will be taken from the form input in the HTML so lets target that element

// Render processed weather data into the DOM
const renderWeather = (data) => {
    const container = document.getElementById('weather-container');
    if (!container) return;
    container.innerHTML = '';

    const address = data?.resolvedAddress ?? '';
    const cur = data?.currentConditions ?? {};

    const currentHtml = `
        <section class="current-weather">
            <h2>${address}</h2>
            <p>Temperature: ${cur.temp ?? '-'} °C</p>
            <p>Feels like: ${cur.feelslike ?? '-'} °C</p>
            <p>Conditions: ${cur.conditions ?? '-'}</p>
            <p>Humidity: ${cur.humidity ?? '-'}%</p>
        </section>
    `;
    container.insertAdjacentHTML('beforeend', currentHtml);

    const days = Array.isArray(data?.dailySummaries) ? data.dailySummaries : [];
    if (days.length) {
        const listHtml = days.map(d => `
            <article class="forecast-day">
                <h3>${d.date}</h3>
                <p>${d.description ?? ''}</p>
                <p>High: ${d.maxTemp ?? '-'} °C, Low: ${d.minTemp ?? '-'} °C</p>
            </article>
        `).join('');
        container.insertAdjacentHTML('beforeend', `<section class="forecast">${listHtml}</section>`);
    }
};

// Wire up the form submit so it shows loading, fetches, processes and renders
const getWeatherforLocation = () => {
    const form = document.getElementById('search-form');
    if (!form) {
        console.warn('search-form not found in DOM');
        return;
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const locationInput = document.getElementById('city-input');
        const locationValue = locationInput?.value?.trim();
        if (!locationValue) {
            alert('Please enter a city name.');
            return;
        }

        showLoading();
        try {
            const finalweatherData = await fetchWeatherData(locationValue);
            if (!finalweatherData) throw new Error('No data returned from API');
            const processedData = processWeatherData(finalweatherData);
            console.log(processedData);
            await renderWeatherWithIcons(processedData);
        } catch (err) {
            console.error(err);
            alert('Error fetching weather. Check console for details.');
        } finally {
            hideLoading();
        }
    });
};
getWeatherforLocation();

const showLoading = () => {
    const bar = document.getElementById('loading-bar');
    if (bar) bar.classList.add('active');
};

const hideLoading = () => {
    const bar = document.getElementById('loading-bar');
    if (bar) bar.classList.remove('active');
};


// Map a human-readable condition to an icon filename
const getIconNameFromConditions = (conditions = '') => {
    const c = (conditions || '').toLowerCase();
    if (c.includes('sun') || c.includes('clear')) return 'sun';
    if (c.includes('cloud') || c.includes('overcast')) return 'cloud';
    if (c.includes('rain') || c.includes('drizzle') || c.includes('showers')) return 'rain';
    if (c.includes('snow') || c.includes('sleet') || c.includes('flurr')) return 'snow';
    return 'unknown';
};

// Try to dynamically import an icon (works with bundlers). Fallback to file path string.
const loadIcon = async (iconName) => {
    try {
        // When using a bundler that supports importing assets this will return a module with default = URL
        const mod = await import(`./icons/${iconName}.svg`);
        // module.default (URL) is typical; some setups return the svg string/module
        return (mod && (mod.default || mod)) || `./icons/${iconName}.svg`;
    } catch (err) {
        // dynamic import failed (no bundler or not allowed in this environment) — return a static path
        return `./icons/${iconName}.svg`;
    }
};

// Async render that tries to load icons for current conditions and each forecast day
const renderWeatherWithIcons = async (data) => {
    const container = document.getElementById('weather-container');
    if (!container) return;
    container.innerHTML = '';

    const address = data?.resolvedAddress ?? '';
    const cur = data?.currentConditions ?? {};

    // current icon
    const currentIconName = getIconNameFromConditions(cur.conditions);
    const currentIconSrc = await loadIcon(currentIconName);

    const currentHtml = `
        <section class="current-weather">
            <div class="icon-wrap"><img alt="current icon" src="${currentIconSrc}" width="48" height="48"/></div>
            <div>
              <h2>${address}</h2>
              <p>Temperature: ${cur.temp ?? '-'} °C</p>
              <p>Feels like: ${cur.feelslike ?? '-'} °C</p>
              <p>Conditions: ${cur.conditions ?? '-'}</p>
              <p>Humidity: ${cur.humidity ?? '-'}%</p>
            </div>
        </section>
    `;
    container.insertAdjacentHTML('beforeend', currentHtml);

    const days = Array.isArray(data?.dailySummaries) ? data.dailySummaries : [];
    if (days.length) {
        // build forecast section, but we'll load icons for each day and then replace placeholders
        const forecastId = `forecast-${Date.now()}`;
        const listHtml = days.map((d, idx) => `
            <article class="forecast-day">
                <div class="day-icon" data-icon-idx="${idx}"><img alt="" src="./icons/unknown.svg" width="36" height="36"></div>
                <h3>${d.date}</h3>
                <p>${d.description ?? ''}</p>
                <p>High: ${d.maxTemp ?? '-'} °C, Low: ${d.minTemp ?? '-'} °C</p>
            </article>
        `).join('');

        container.insertAdjacentHTML('beforeend', `<section id="${forecastId}" class="forecast">${listHtml}</section>`);

        // now asynchronously load and swap icons for each forecast day
        const forecastSection = document.getElementById(forecastId);
        if (forecastSection) {
            for (let i = 0; i < days.length; i++) {
                const day = days[i];
                const iconName = getIconNameFromConditions(day.description || day.conditions || '');
                const src = await loadIcon(iconName);
                const imgWrap = forecastSection.querySelector(`[data-icon-idx="${i}"] img`);
                if (imgWrap) imgWrap.src = src;
            }
        }
    }
};