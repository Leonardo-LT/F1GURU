import { createResource, createSignal, ErrorBoundary, Show, Suspense } from "solid-js";
import Widget from "./widget";
import DoubleWidget from "./doubleWidget";

const fetchWeatherData = async () => {
  const response = await fetch(
    "https://api.openf1.org/v1/weather?meeting_key=latest&session_key=latest",
  );
  if (!response.ok) throw new Error("Failed to fetch weather data");
  let json = await response.json();
  return Array.isArray(json) && json.length > 0
    ? json[json.length - 1]
    : null;
};

const getCardinal = (deg) => {
  const dirs = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  return dirs[Math.round(deg / 45) % 8];
};

const WeatherWidgets = (props) => {
  const [weatherData, { refetch }] = createResource(fetchWeatherData);

  return (
    <>
      <ErrorBoundary
        fallback={(err, reset) => (
          <div class="widget col-span-2 row-span-3 flex flex-col justify-center items-center text-gray-500 font-semibold italic gap-3">
            <p>Failed to load weather data</p>
            <button
              class="button"
              onClick={() => { refetch(); reset(); }}
            >
              Try Again
            </button>
          </div>
        )}
      >
        <Suspense
          fallback={
            <div class="grid grid-cols-2 gap-3 grid-rows-3 row-span-1 items-stretch w-full flex-1 min-h-0">
              <div class="widget col-span-2 row-span-3 flex justify-center items-center text-gray-400 animate-pulse">
                Loading weather data...
              </div>
            </div>
          }
        >
          <div class="grid grid-cols-2 gap-3 grid-rows-3 row-span-1 items-stretch w-full flex-1 min-h-0">
            <Show
              when={weatherData()}
              fallback={
                <div class="widget col-span-2 row-span-3 flex justify-center items-center text-gray-500 font-semibold italic">
                  Weather data unavailable.
                </div>
              }
            >
              <Widget
                first_data={weatherData().air_temperature + "°C"}
                description="Track"
                second_data={weatherData().track_temperature + "°C"}
                name="AIR"
                icon="fa-temperature-low text-orange-400"
              />

              <Widget
                first_data={weatherData().humidity + "%"}
                description="Rain"
                second_data={weatherData().rainfall + "%"}
                name="HUMIDITY"
                icon="fa-droplet text-cyan-400"
              />

              <DoubleWidget
                first_main_data={
                  Math.floor(weatherData().wind_speed * 3.6 * 100) / 100 + " km/h"
                }
                first_secondary_data={getCardinal(weatherData().wind_direction)}
                first_name="WIND"
                first_icon="fa-wind"
                second_main_data={weatherData().pressure + " hPa"}
                second_name="PRESSURE"
                second_icon="fa-arrows-down-to-line"
              />
            </Show>
          </div>
        </Suspense>
      </ErrorBoundary>
    </>
  );
};

export default WeatherWidgets;
