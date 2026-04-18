import NextSession from "../components/nextSession";
import {
  DriversStandingsWidget,
  ConstructorsStandingsWidget,
} from "../components/driversWidget";
import TrackStatus from "../components/trackStatus";
import WeatherWidgets from "../components/weatherWidgets";
import {
  getNextSession,
  getNextGrandPrix,
  setNotify,
} from "../utility/sessionUtils";

export default function Home() {
  const nextSession = getNextSession();
  const nextGrandPrix = getNextGrandPrix();
  const startTime = new Date(nextSession.start);
  const handleNotify = () => setNotify(nextSession.name, startTime);

  return (
    <>
      <section class="h-full flex flex-col p-8">
        <div class="mb-5 min-h-0">
          <h1 class="text-4xl/10 font-bold sm:truncate sm:text-5xl sm:tracking-tight">
            Grandprix of {nextGrandPrix.country}
          </h1>
          <p>{nextGrandPrix.circuit_name}</p>
        </div>

        <div class="grid grid-cols-12 flex-1 auto-rows-auto gap-7 min-h-0 lg:grid-rows-[5fr_3fr]">
          <NextSession
            nextSession={nextSession}
            startTime={startTime}
            onNotify={handleNotify}
          />

          <div class="col-span-12 row-start-2 flex flex-col gap-4 min-h-0 w-full h-full md:row-start-1 md:col-span-4">
            <TrackStatus />
            <WeatherWidgets />
          </div>

          <DriversStandingsWidget gridClass="col-span-12 md:col-span-6 lg:col-span-6 row-start-3 md:row-start-2 w-full min-h-0 h-auto lg:h-full" />

          <ConstructorsStandingsWidget gridClass="col-span-12 md:col-span-6 lg:col-span-6 row-start-4 md:row-start-2 w-full min-h-0 h-auto lg:h-full" />
        </div>
      </section>
    </>
  );
}
