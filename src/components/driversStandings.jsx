import getDriverFromNumber from "../utility/getDriverFromNumber";
import { fetchStandings } from "../utility/fetchDriversStandings";
import { createResource, For, Show, Suspense } from "solid-js";
import StandingsCard from "./standingsCard";
import { fApp } from "../app";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { driverNumberMapping } from "../utility/mapping";

const db = getFirestore(fApp);

const fetchFavourites = async () => {
  await getAuth().authStateReady();
  const user = getAuth().currentUser;
  if (user) {
    const res = await getDocs(
      collection(db, "userFavourites", user.uid, "drivers"),
    );
    const docs = res.docs;
    const docIds = docs.map((doc) => doc.id);
    return docIds;
  }

  return [];
};

const isFavourite = (favourites, driverName) => {
  const num = driverNumberMapping[driverName];

  return favourites().includes(String(num));
};

const DriversStandings = () => {
  const [standings] = createResource(fetchStandings);
  const [favourites] = createResource(fetchFavourites);

  return (
    <>
      <div class="grid grid-cols-4 md:grid-cols-6 gap-4 items-center my-6 mx-4 w-auto justify-between whitespace-pre place-items-center">
        <p class="col-span-1 text-center">STANDING</p>
        <p class="col-span-2 text-center">DRIVER</p>
        <p class="md:col-span-1 hidden md:block text-center">TEAM</p>
        <p class="md:col-span-1 hidden md:block text-center">POINTS</p>
        <p class="col-span-1 text-center">FOLLOW</p>
      </div>

      <Suspense>
        <Show when={standings() && favourites()}>
          <For each={standings()}>
            {(item, index) => {
              const driver = getDriverFromNumber(item.driver_number);
              const fav =
                favourites() && favourites().length != 0
                  ? isFavourite(favourites, driver.full_name)
                  : false;

              return (
                <StandingsCard
                  firstName={driver.full_name}
                  standing={index() + 1}
                  secondName={driver.team_name}
                  points={item.points_current}
                  img={driver.headshot_url}
                  team_color={driver.team_colour}
                  type={true}
                  isFav={fav}
                />
              );
            }}
          </For>
        </Show>
      </Suspense>
    </>
  );
};

export default DriversStandings;
