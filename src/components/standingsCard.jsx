import { fApp } from "../app";
import { getFirestore, doc, setDoc, deleteDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { driverNumberMapping, teamNumberMapping } from "../utility/mapping";
import { createSignal } from "solid-js";

const StandingsCard = (props) => {
  const [isFav, setFav] = createSignal(props.isFav);
  const teamColor = "#" + props.team_color;
  const db = getFirestore(fApp);

  const setFavourite = async (type, el) => {
    await getAuth().authStateReady();
    if (getAuth.currentUser) {
      alert("You must be signed in to use this feature");
      return;
    }

    const id = type ? driverNumberMapping[el] : teamNumberMapping[el];
    const subCollection = type ? "drivers" : "constructors";

    try {
      console.log(id);
      const path = `/userFavourites/${getAuth().currentUser.uid}/${subCollection}/${id}`;
      if (isFav()) {
        await deleteDoc(doc(db, path));
        setFav(false);
      } else {
        await setDoc(doc(db, path), {});
        setFav(true);
      }
    } catch (error) {
      alert("Favourite set error");
    }
  };

  return (
    <>
      <div class="grid grid-cols-4 md:grid-cols-6 gap-4 items-center my-6 mx-4 w-auto justify-items-stretch whitespace-pre text-center">
        <p class="flex-1 col-span-1 text-center">{props.standing}</p>
        <div class="flex-row gap-5 col-span-2 w-full justify-self-stretch items-center hidden md:flex">
          <img
            src={props.img}
            alt={props.firstName}
            class="rounded-full border-2 aspect-square w-14 p-1"
            style={{ "border-color": teamColor }}
          />
          <p>{props.firstName}</p>
        </div>

        <div class="flex-col gap-2 col-span-2 w-full justify-center justify-self-stretch items-center flex md:hidden">
          <img
            src={props.img}
            alt={props.firstName}
            class="rounded-full border-2 aspect-square w-14 p-1"
            style={{ "border-color": teamColor }}
          />
          <p>{props.firstName}</p>
        </div>

        <p class="md:col-span-1 text-center hidden md:block">
          {props.secondName}
        </p>

        <p class="md:col-span-1 hidden md:block">{props.points}</p>

        <i
          onClick={() => setFavourite(props.type, props.firstName)}
          class={`fa-solid fa-heart fa-2x col-span-1 cursor-pointer ${isFav() ? "text-primary hover:text-primary-200" : "hover:text-gray-400"}`}
        ></i>
      </div>
    </>
  );
};

export default StandingsCard;
