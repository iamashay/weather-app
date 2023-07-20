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

    const fetchImage =  async (url) => {
        const getImg = await fetch(url)
        const imgBlob = await getImg.blob()
        return URL.createObjectURL(imgBlob)
    }
    
    const searchInput = qs("#search input")
    const searchInputButton = qs(".search-icon")
    const loaderDiv = qs("#loader")
    const mainElm = qs("main")
    const errorDiv = qs("#error")


    const validateInput = () => {
        if(searchInput.value.trim() === "") throw new Error("Location cannot be empty!")
        if(searchInput.value.length <= 2) throw new Error("Name's too short!")
    }

    const showError = (msg) => {
        loaderDiv.style.display = "none"
        errorDiv.style.display = "block"
        errorDiv.textContent = msg;
    }

    const showLoader = () => {
        loaderDiv.style.display = "block"
        mainElm.style.display = "none"
        errorDiv.style.display = "none"
    }

    const showMainBody = () => {
        loaderDiv.style.display = "none"
        mainElm.style.display = "flex"
        errorDiv.style.display = "none"        
    }

    const updateView = (defaultDisplay)=>{
        

        const locationDiv = qs(".location-name")
        const descriptionDiv = qs(".description")
        const temperatureDiv = qs(".temperature")
        const windDiv = qs(".wind")
        const humidityDiv = qs(".humidity")
        const weatherImgElm = qs("#weather-image")
        const currentLocation = defaultDisplay ? "New Delhi" : searchInput.value

        showLoader()

        try {
            if (!defaultDisplay) validateInput()
        } catch(error){
            showError(error.message)
            return
        }


        getWeatherDetails(currentLocation)
        .then(
            async (response) => {
                const {location, current} = {...response}
                locationDiv.textContent = `${location.name}, ${location.region}, ${location.country}`
                descriptionDiv.textContent = current.condition.text
                temperatureDiv.textContent = Math.floor(current.temp_c)
                windDiv.textContent = current.wind_kph
                humidityDiv.textContent = current.humidity
                const imgURL = "https:"+current.condition.icon.replace("64x64", "128x128")
                try {
                    weatherImgElm.src = await fetchImage(imgURL)
                } catch (e) {
                    weatherImgElm.src = "./imgs/default.png"
                }
                showMainBody()
            }, 
            (error) => {
                showError(error.message)
                return
            }
        )
    }

    searchInputButton.addEventListener("click", updateView)
    searchInput.addEventListener("keypress", (e) => e.key === 'Enter' ? updateView() : false)
    updateView(true)

})()