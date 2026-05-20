import { createSignal, ErrorBoundary, Show, Suspense } from "solid-js";
import ConstructorStandings from "../components/constructorsStandings";
import DriversStandings from "../components/driversStandings";
import { useSearchParams } from "@solidjs/router";

export default function Standings(props) {
  const [searchParams] = useSearchParams();
  const [driversPage, setDriversPage] = createSignal(searchParams.tab !== "constructors");

  return (
    <section class="flex-1 flex flex-col min-h-0">
      <h1 class="font-bold text-3xl s:text-4xl px-4 py-5">
        2026 Championship Standings
      </h1>

      <div class="flex gap-2 mx-7 my-3 font-semibold">
        <div
          onClick={(e) => {
            setDriversPage(true);
          }}
          class="w-20 h-10 cursor-pointer"
          classList={{
            "text-primary": driversPage(),
            "text-white": !driversPage(),
          }}
        >
          Drivers
        </div>
        <div
          onClick={(e) => {
            setDriversPage(false);
          }}
          class="w-20 h-10 cursor-pointer"
          classList={{
            "text-primary": !driversPage(),
            "text-white": driversPage(),
          }}
        >
          Constructors
        </div>
      </div>

      <div class="min-h-screen flex flex-col pb-6">
        <div class="overflow-y-auto overflow-x-auto  mx-6 rounded-xl bg-widget-bg border border-widget-border">
          <ErrorBoundary
            fallback={(err, reset) => (
              <div class=" bg-widget-bg p-4 rounded-md flex flex-col gap-5">
                <p>Failed to load data</p>
                <button
                  class="button"
                  onClick={reset}
                >
                  Try Again
                </button>
              </div>
            )}
          >
            <Suspense
              fallback={
                <div class="widget text-gray-400 animate-pulse">
                  Loading standings...
                </div>
              }
            >
              <Show when={driversPage()}>
                <DriversStandings>{props.children}</DriversStandings>
              </Show>

              <Show when={!driversPage()}>
                <ConstructorStandings setConstructor={setDriversPage}>
                  {props.children}
                </ConstructorStandings>
              </Show>
            </Suspense>
          </ErrorBoundary>
        </div>
      </div>
    </section>
  );
}
