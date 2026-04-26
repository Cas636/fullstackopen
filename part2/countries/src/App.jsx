import { useState, useEffect } from 'react'
import axios from 'axios'

const api_key = import.meta.env.VITE_SOME_KEY || ''

const Weather = ({ capital }) => {
  const [weather, setWeather] = useState(null)

  useEffect(() => {
    if (!api_key) return
    axios
      .get(`https://api.openweathermap.org/data/2.5/weather?q=${capital}&appid=${api_key}&units=metric`)
      .then(response => {
        setWeather(response.data)
      })
      .catch(error => console.log('weather fetch error', error))
  }, [capital])

  if (!api_key) return <p>Weather API key not configured (VITE_SOME_KEY).</p>
  if (!weather) return null

  return (
    <div>
      <h3>Weather in {capital}</h3>
      <p>temperature {weather.main.temp} Celsius</p>
      <img src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`} alt="weather icon" />
      <p>wind {weather.wind.speed} m/s</p>
    </div>
  )
}

const CountryDetail = ({ country }) => {
  return (
    <div>
      <h2>{country.name.common}</h2>
      <p>capital {country.capital[0]}</p>
      <p>area {country.area}</p>
      <h4>languages:</h4>
      <ul>
        {Object.values(country.languages).map(lang => (
          <li key={lang}>{lang}</li>
        ))}
      </ul>
      <img src={country.flags.png} alt={`Flag of ${country.name.common}`} width="150" />
      <Weather capital={country.capital[0]} />
    </div>
  )
}

const App = () => {
  const [countries, setCountries] = useState([])
  const [search, setSearch] = useState('')
  const [selectedCountry, setSelectedCountry] = useState(null)

  useEffect(() => {
    axios
      .get('https://studies.cs.helsinki.fi/restcountries/api/all')
      .then(response => {
        setCountries(response.data)
      })
  }, [])

  const handleSearchChange = (event) => {
    setSearch(event.target.value)
    setSelectedCountry(null) 
  }

  const filtered = search === '' 
    ? [] 
    : countries.filter(c => c.name.common.toLowerCase().includes(search.toLowerCase()))

  let displayContent
  
  if (selectedCountry) {
    displayContent = <CountryDetail country={selectedCountry} />
  } else if (filtered.length > 10) {
    displayContent = <p>Too many matches, specify another filter</p>
  } else if (filtered.length > 1 && filtered.length <= 10) {
    displayContent = filtered.map(country => (
      <div key={country.cca3}>
        {country.name.common} 
        <button onClick={() => setSelectedCountry(country)}>show</button>
      </div>
    ))
  } else if (filtered.length === 1) {
    displayContent = <CountryDetail country={filtered[0]} />
  }

  return (
    <div>
      find countries <input value={search} onChange={handleSearchChange} />
      {displayContent}
    </div>
  )
}

export default App
