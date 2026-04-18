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

const isFavourite = (favourites, driver) => {
  const num = driverNumberMapping[driver];

  return favourites().includes(String(num));
};

const DriversStandings = () => {
  const [standings] = createResource(fetchStandings);
  const [favourites] = createResource(fetchFavourites);

  return (
    <>
      <div class="grid grid-cols-7 justify-between gap-6 font-semibold m-4">
        <p class="col-span-1 text-center">STANDING</p>
        <p class="col-span-2 text-center">DRIVER</p>
        <p class="col-span-1 text-center">TEAM</p>
        <p class="col-span-1 text-center">POINTS</p>
        {/* <p class="flex-1">WINS</p> */}
        <p class="col-span-1 text-center">GRAPH</p>
        <p class="col-span-1 text-center">FOLLOW</p>
      </div>
      <Suspense>
        <Show when={standings() && favourites()}>
          <For each={standings()}>
            {(item, index) => {
              const driver = getDriverFromNumber(item.driver_number);
              const fav =
                favourites().length != 0
                  ? isFavourite(favourites, driver.full_name)
                  : false;
              console.log(fav);
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
