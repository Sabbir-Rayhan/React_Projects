import React, { useState } from "react";

function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!city) {
      alert("Enter a city");
      return;
    }
    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=6ffefd1f81a744b4938f8da895e68dcf&units=metric`
      );
      const data = await res.json();
      if (data.cod === "404") {
        setError("City Not Found! Please Try a different city.");
        setWeather(null);
      } else {
        setWeather(data);
        setError("");
      }
    } catch (er) {
      setError("Failed to fetch data. Please try again.");
      setWeather(null);
    }
  };

  return (
    <div className="bg-gradient-to-br from-purple-800 via-pink-600 to-orange-500 w-full min-h-screen flex flex-col justify-center items-center p-4 shadow-lg">
      <h1 className="text-4xl text-white font-extrabold mb-8">🌎 Weather App</h1>
      <div className="bg-white bg-opacity-25 backdrop-blur-lg rounded-xl shadow-lg w-full max-w-md p-6">
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <input
            type="text"
            className="w-full rounded-md outline-none p-3 border-0 bg-white bg-opacity-70 text-gray-800 placeholder-gray-700 focus:ring-2 focus:ring-orange-400"
            placeholder="Enter Your City"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
          <button
            type="submit"
            className="px-4 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold rounded-md hover:from-red-500 hover:to-orange-600 transition-all"
          >
            See Weather
          </button>
        </form>

        {/* Error Message */}
        {error && <p className="text-center text-red-700 mt-4">{error}</p>}
      </div>

      {/* Weather Info */}
      {weather && (
        <div className="mt-8 bg-opacity-25 backdrop-blur-lg rounded-xl shadow-2xl w-full max-w-md p-6 text-center">
          <h2 className="text-3xl font-semibold text-white">
            {weather.name}, {weather.sys.country}
          </h2>
          <div className="flex items-center justify-center mt-4">
            <img
              src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
              alt="Weather Icon"
              className="w-20 h-20"
            />
            <p className="text-4xl font-bold text-white ml-4">
              {weather.main.temp}°C
            </p>
          </div>
          <p className="text-xl text-white capitalize mt-2">
            {weather.weather[0].description}
          </p>
          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className=" bg-opacity-30 rounded-lg p-3">
              <p className="text-sm text-gray-100">Humidity</p>
              <p className="text-lg font-bold text-white">
                {weather.main.humidity}%
              </p>
            </div>
            <div className="bg-opacity-30 rounded-lg p-3">
              <p className="text-sm text-gray-100">Wind Speed</p>
              <p className="text-lg font-bold text-white">
                {weather.wind.speed} m/s
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
