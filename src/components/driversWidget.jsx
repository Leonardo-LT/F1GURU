import { createResource, Show } from "solid-js";
import DriverCard from "./driverCard";
import ConstructorCard from "./constructorCard";
import { A } from "@solidjs/router";
import { fetchStandings } from "../utility/fetchDriversStandings";
import { fetchConstructorsStandings } from "../utility/fetchConstructorsStandings";

/**
 * Generic standings widget.
 *
 * Props:
 *   mode      - "drivers" (default) | "constructors"
 *   gridClass - optional override for the outer grid/positioning classes
 */
const DriversStandingsWidget = (props) => {
  const [standings] = createResource(fetchStandings);
  const defaultGridClass =
    "row-start-3 row-span-1 col-start-1 lg:h-full w-full min-h-0 h-auto lg:row-start-2 col-span-full md:col-span-6";

  return (
    <div class={props.gridClass ?? defaultGridClass}>
      <div class="widget flex flex-col content-around gap-4 h-full min-h-0 overflow-y-auto w-full">
        <div class="flex justify-between items-center">
          <h3 class="font-bold text-2xl">Driver Standings</h3>
          <A href="/standings" class="text-primary hover:text-blue-400 text-sm shrink-0">
            View All
          </A>
        </div>
        <Show
          when={standings() && standings().length >= 3}
          fallback={
            <div class="flex flex-col justify-center items-center h-full p-4 text-center text-gray-500 font-semibold italic">
              Standings data currently unavailable.
            </div>
          }
        >
          <div class="flex flex-col flex-1 content-around justify-around gap-2 overflow-y-auto min-h-0">
            <DriverCard
              number={standings()[0].driver_number}
              points={standings()[0].points_current}
              position={standings()[0].position_current}
            />
            <DriverCard
              number={standings()[1].driver_number}
              points={standings()[1].points_current}
              position={standings()[1].position_current}
            />
            <DriverCard
              number={standings()[2].driver_number}
              points={standings()[2].points_current}
              position={standings()[2].position_current}
            />
          </div>
        </Show>
      </div>
    </div>
  );
};

const ConstructorsStandingsWidget = (props) => {
  const [standings] = createResource(fetchConstructorsStandings);
  const defaultGridClass =
    "row-start-4 row-span-1 col-start-1 lg:h-full w-full min-h-0 h-auto lg:row-start-2 col-span-full md:col-span-6";

  return (
    <div class={props.gridClass ?? defaultGridClass}>
      <div class="widget flex flex-col content-around gap-4 h-full min-h-0 overflow-y-auto w-full">
        <div class="flex justify-between items-center">
          <h3 class="font-bold text-2xl">Constructor Standings</h3>
          <A href="/standings?tab=constructors" class="text-primary hover:text-blue-400 text-sm shrink-0">
            View All
          </A>
        </div>
        <Show
          when={standings() && standings().length >= 3}
          fallback={
            <div class="flex flex-col justify-center items-center h-full p-4 text-center text-gray-500 font-semibold italic">
              Standings data currently unavailable.
            </div>
          }
        >
          <div class="flex flex-col flex-1 content-around justify-around gap-2 overflow-y-auto min-h-0">
            <ConstructorCard
              team_name={standings()[0].team_name}
              points={standings()[0].points_current}
              position={1}
            />
            <ConstructorCard
              team_name={standings()[1].team_name}
              points={standings()[1].points_current}
              position={2}
            />
            <ConstructorCard
              team_name={standings()[2].team_name}
              points={standings()[2].points_current}
              position={3}
            />
          </div>
        </Show>
      </div>
    </div>
  );
};

// Default export keeps backward compat — renders the drivers widget
const StandingsWidget = (props) => {
  if (props.mode === "constructors") {
    return <ConstructorsStandingsWidget gridClass={props.gridClass} />;
  }
  return <DriversStandingsWidget gridClass={props.gridClass} />;
};

export { DriversStandingsWidget, ConstructorsStandingsWidget };
export default StandingsWidget;
