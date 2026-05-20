import { fApp } from "../app";
import { getFirestore, collection, getDocs, doc } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { numberDriverMapping, numberTeamMapping } from "../utility/mapping";
import { createResource, Show, For, Suspense, ErrorBoundary } from "solid-js";
import {
  getDriverFromFullName,
  getDriverObjectsFromTeamName,
} from "../utility/getDriversFromTeamName";
import FavDriverCard from "../components/favDriverCard";
import {
  fetchStandings,
  getDriverPosition,
} from "../utility/fetchDriversStandings";
import { fetchConstructorsStandings } from "../utility/fetchConstructorsStandings";
import FavConstructorCard from "../components/favConstructorCard";
import teams from "../teams.json";
import getTeamPosition from "../utility/getTeamPosition";

const db = getFirestore(fApp);

const fetchDriverFavourites = async () => {
  await getAuth().authStateReady();
  const user = getAuth().currentUser;
  if (user) {
    const res = await getDocs(
      collection(db, "userFavourites", user.uid, "drivers"),
    );
    const docs = res.docs;
    const docIds = docs.map((doc) => doc.id);
    let ret = docIds.map((num) =>
      getDriverFromFullName(numberDriverMapping[parseInt(num)]),
    );
    return ret;
  }
};

const fetchConstructorrFavourites = async () => {
  await getAuth().authStateReady();
  const user = getAuth().currentUser;
  if (user) {
    const res = await getDocs(
      collection(db, "userFavourites", user.uid, "constructors"),
    );
    const docs = res.docs;
    const docIds = docs.map((doc) => doc.id);
    let ret = docIds.map((num) => numberTeamMapping[parseInt(num)]);
    return ret;
  }
};

const checkCurrUser = async () => {
  await getAuth().authStateReady();
  return getAuth().currentUser != null;
};

export default function Garage() {
  const [driverFavourites] = createResource(fetchDriverFavourites);
  const [driverStandings] = createResource(fetchStandings);
  const [constructorFavourites] = createResource(fetchConstructorrFavourites);
  const [constructorStandings] = createResource(fetchConstructorsStandings);
  const [isLogged, { refetch: loggedRefetch, mutate: loggedMutate }] =
    createResource(checkCurrUser);

  onAuthStateChanged(getAuth(), () => loggedMutate(() => getAuth.currentUser));

  return (
    <>
      <Show
        when={isLogged()}
        fallback={
          <div class="p-8 text-center text-white">
            Log in to access this section
          </div>
        }
      >
        <div class="w-full flex justify-center items-center flex-col gap-4">
          <div class="pt-8 pb-6 font-bold text-3xl flex gap-4">
            <i class="fa-solid fa-star text-primary"></i>
            FAVOURITE DRIVERS
          </div>

          <ErrorBoundary
            fallback={(err, reset) => (
              <div class="widget bg-widget-bg p-4 rounded-md flex flex-col gap-5">
                <p>Failed to load favourite drivers</p>
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
                <div class="widget animate-pulse text-gray-400">
                  Loading drivers data...
                </div>
              }
            >
              <div class="w-15/16 s:w-3/4">
                <div class="flex flex-row gap-8 overflow-x-auto snap-x snap-mandatory py-4 px-2 [&::-webkit-scrollbar]:hidden scroll-smooth">
                  <For
                    each={driverFavourites()}
                    fallback={
                      <div class="flex-1 flex justify-center">
                        <p class="widget">No favourite drivers.</p>
                      </div>
                    }
                  >
                    {(item, index) => {
                      let standing =
                        getDriverPosition(
                          item.driver_number,
                          driverStandings(),
                        ) || {};
                      return (
                        <FavDriverCard
                          full_name={item.full_name}
                          team_name={item.team_name}
                          driver_number={item.driver_number}
                          headshot_url={item.headshot_url}
                          position={standing["position_current"] ?? "-"}
                          points_current={standing["points_current"] ?? 0}
                          points_start={standing["points_start"] ?? 0}
                        />
                      );
                    }}
                  </For>
                </div>
              </div>
            </Suspense>
          </ErrorBoundary>

          <div class="pt-8 pb-6 font-bold text-3xl flex gap-4">
            <i class="fa-solid fa-star text-primary"></i>
            FAVOURITE CONSTRUCTORS
          </div>

          <ErrorBoundary
            fallback={(err, reset) => (
              <div class="widget bg-widget-bg p-4 rounded-md flex flex-col gap-5">
                <p>Failed to load favourite constructors</p>
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
                <div class="widget animate-pulse text-gray-400">
                  Loading drivers data
                </div>
              }
            >
              <div class="w-15/16 s:w-3/4">
                <div class="flex flex-row gap-8 overflow-x-auto snap-x snap-mandatory py-4 px-2 [&::-webkit-scrollbar]:hidden scroll-smooth">
                  <For
                    each={constructorFavourites()}
                    fallback={
                      <div class="flex-1 flex justify-center">
                        <p class="widget">No favourite constructors.</p>
                      </div>
                    }
                  >
                    {(item, index) => {
                      const standing =
                        getTeamPosition(item, constructorStandings()) || {};
                      const position = standing["position_current"] ?? "-";

                      const teamData = getDriverObjectsFromTeamName(item);
                      const drivers = teamData.driversList;
                      const teamColour = teamData.teamColour;

                      const teamDriversPoints = drivers.map((d) => {
                        let std = getDriverPosition(
                          d.driver_number,
                          driverStandings(),
                        );
                        return {
                          last_name: d.last_name,
                          points: std ? std.points_current : 0,
                        };
                      });

                      let gapToNext = null;
                      let gapLabel = "";
                      if (position > 1) {
                        const nextPosition = position - 1;
                        const nextStanding = constructorStandings().find(
                          (s) => s.position_current === nextPosition,
                        );
                        if (nextStanding) {
                          gapToNext =
                            nextStanding.points_current - standing.points_current;
                          gapLabel = `Gap to P${nextPosition}:`;
                        }
                      } else if (
                        constructorStandings() &&
                        constructorStandings().length > 1
                      ) {
                        const nextStanding = constructorStandings().find(
                          (s) => s.position_current === 2,
                        );
                        if (nextStanding) {
                          gapToNext =
                            (standing.points_current ?? 0) -
                            nextStanding.points_current;
                          gapLabel = `Gap to P2:`;
                        }
                      }

                      return (
                        <FavConstructorCard
                          team_name={item}
                          team_logo={teams[item]}
                          position={position}
                          points_current={standing["points_current"]}
                          driversPoints={teamDriversPoints}
                          teamColour={teamColour}
                          gapToNext={gapToNext}
                          gapLabel={gapLabel}
                        />
                      );
                    }}
                  </For>
                </div>
              </div>
            </Suspense>
          </ErrorBoundary>
        </div>
      </Show>
    </>
  );
}
