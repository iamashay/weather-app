(()=> {
    const qs = (selector) => document.querySelector(selector);
    const API = "17ad72df7d2148db9a3140250231607"
    const DOMAIN = "https://api.weatherapi.com"
    const getWeatherDetails = async (location)=> {
        try {
            const fetchDetails = await fetch(`${DOMAIN}/v1/current.json?key=${API}&q=${location}&aqi=no`, {mode: "cors"});
            const detailsJSON = await fetchDetails.json();
            if (!fetchDetails.ok) throw new Error(detailsJSON.error.message)
            return detailsJSON
        } catch (error) {
            throw new Error(error.message)
        }
    }
    
    const searchInput = qs("#search input")
    const searchInputButton = qs(".search-icon")
    

    const updateView = ()=>{
        const locationInput = searchInput.value
        const locationDiv = qs(".location-name")
        const descriptionDiv = qs(".description")
        const temperatureDiv = qs(".temperature")
        const windDiv = qs(".wind")
        const humidityDiv = qs(".humidity")
        const weatherImgElm = qs("#weather-image")

        getWeatherDetails(locationInput)
        .then(
            (response) => {
                const {location, current} = {...response}
                locationDiv.textContent = `${location.name}, ${location.region}, ${location.country}`
                descriptionDiv.textContent = current.condition.text
                temperatureDiv.textContent = Math.floor(current.temp_c)
                windDiv.textContent = current.wind_kph
                humidityDiv.textContent = current.humidity
                weatherImgElm.src = current.condition.icon.replace("64x64", "128x128")
            }, 
            (error) => {
                alert("Error "+error)
            }
        )
    }

    searchInputButton.addEventListener("click", updateView)
    searchInput.addEventListener("keypress", (e) => e.key === 'Enter' ? updateView() : false)


})()