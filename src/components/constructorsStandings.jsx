import { createResource, For, Suspense } from "solid-js";
import { fetchConstructorsStandings } from "../utility/fetchConstructorsStandings";
import StandingsCard from "./standingsCard";
import { getDriversFromTeamName } from "../utility/getDriversFromTeamName";
import teams from "../teams.json";
import { teamNumberMapping } from "../utility/mapping";
import { getAuth } from "firebase/auth";
import { fApp } from "../app";
import { getDocs, collection, getFirestore } from "firebase/firestore";

const db = getFirestore(fApp);

const fetchFavourites = async () => {
  const user = getAuth().currentUser;
  if (user) {
    const res = await getDocs(
      collection(db, "userFavourites", user.uid, "constructors"),
    );
    const docs = res.docs;
    const docIds = docs.map((doc) => doc.id);
    return docIds;
  }
};

const isFavourite = (favourites, team) => {
  const num = teamNumberMapping[team];

  return favourites().includes(String(num));
};

const ConstructorStandings = () => {
  const [standings] = createResource(fetchConstructorsStandings);
  const [favourites] = createResource(fetchFavourites);

  return (
    <>
      <div class="grid grid-cols-7 gap-4 items-center my-6 mx-4 w-auto justify-between whitespace-pre place-items-center">
        <p class="col-span-1 text-center">STANDING</p>
        <p class="col-span-2 text-center">TEAM</p>
        <p class="col-span-1 text-center">DRIVERS</p>
        <p class="col-span-1 text-center">POINTS</p>
        {/* <p class="flex-1">WINS</p> */}
        <p class="col-span-1 text-center">GRAPH</p>
        <p class="col-span-1 text-center">FOLLOW</p>
      </div>
      <Suspense>
        <Show when={standings() && favourites()}>
          <For each={standings()}>
            {(item, index) => {
              let team = getDriversFromTeamName(item.team_name);
              let drivers = team["driversList"].join("\r\n");
              let teamColour = team["teamColour"];

              return (
                <StandingsCard
                  firstName={item.team_name}
                  standing={index() + 1}
                  secondName={drivers}
                  points={item.points_current}
                  team_color={teamColour}
                  img={teams[item.team_name]}
                  type={false}
                  isFav={isFavourite(favourites, item.team_name)}
                />
              );
            }}
          </For>
        </Show>
      </Suspense>
    </>
  );
};

export default ConstructorStandings;
