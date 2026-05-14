import { createSignal, Show, Suspense } from "solid-js";
import ConstructorStandings from "../components/constructorsStandings";
import DriversStandings from "../components/driversStandings";

export default function Standings(props) {
  const [driversPage, setDriversPage] = createSignal(true);

  return (
    <section class="flex-1 flex flex-col min-h-0">
      <h1 class="font-bold text-4xl px-4 py-5">2026 Championship Standings</h1>

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
          <Suspense
            fallback={
              <div class="widget text-gray-400 animate-pulse">
                Caricamento classifica...
              </div>
            }
          >
            <Show when={driversPage()}>
              <DriversStandings>{props.children}</DriversStandings>
            </Show>

            <Show when={!driversPage()}>
              <ConstructorStandings>{props.children}</ConstructorStandings>
            </Show>
          </Suspense>
        </div>
      </div>
    </section>
  );
}
