import { createResource, ErrorBoundary, Show, Suspense } from "solid-js";
import ConstructorCard from "./constructorCard";
import { A } from "@solidjs/router";
import { fetchConstructorsStandings } from "../utility/fetchConstructorsStandings";

const ConstructorsStandingsWidget = (props) => {
  const [standings, { refetch }] = createResource(fetchConstructorsStandings);
  const defaultGridClass =
    "row-start-4 row-span-1 col-start-1 lg:h-full w-full min-h-0 h-auto lg:row-start-2 col-span-full md:col-span-6";

  return (
    <div class={props.gridClass ?? defaultGridClass}>
      <div class="widget flex flex-col content-around gap-4 h-full min-h-0 overflow-y-auto w-full">
        <div class="flex justify-between items-center">
          <h3 class="font-bold text-2xl">Constructor Standings</h3>
          <A
            href="/standings?tab=constructors"
            class="text-primary hover:text-blue-400 text-sm shrink-0"
          >
            View All
          </A>
        </div>
        <ErrorBoundary
          fallback={(err, reset) => (
            <div class="flex flex-col justify-center items-center h-full p-4 text-center text-gray-500 font-semibold italic gap-3">
              <p>Failed to load data</p>
              <button
                class="button"
                onClick={() => {
                  refetch();
                  reset();
                }}
              >
                Try Again
              </button>
            </div>
          )}
        >
          <Suspense
            fallback={
              <div class="flex flex-col justify-center items-center h-full p-4 text-center text-gray-400 animate-pulse">
                Loading standings...
              </div>
            }
          >
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
          </Suspense>
        </ErrorBoundary>
      </div>
    </div>
  );
};

export default ConstructorsStandingsWidget;
