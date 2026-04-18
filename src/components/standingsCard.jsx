import { fApp } from "../app";
import { getFirestore, doc, setDoc, deleteDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth"
import { driverNumberMapping, teamNumberMapping } from "../utility/mapping";
import { createSignal } from "solid-js";

const StandingsCard = (props) => {
  const [isFav, setFav] = createSignal(props.isFav)
  const teamColor = "#" + props.team_color;
  const db = getFirestore(fApp);

  const setFavourite = async (type, el) => {
    console.log("eccolo qua: ", getAuth(fApp).currentUser.uid)
    if (getAuth.currentUser) {
      alert("You must be signed in to use this feature")
      return
    }

    const id = props.type ? driverNumberMapping[el] : teamNumberMapping[el]
    const subCollection = props.type ? "drivers" : "constructors"

    try {
      const path = `/userFavourites/${getAuth().currentUser.uid}/${subCollection}/${id}`
      if (isFav()) {
        await deleteDoc(doc(db, path))
        setFav(false)
      } else {
        await setDoc(doc(db, path), {})
        setFav(true)
      }
    } catch (error) {
      alert("Favourite set error")
    }
  }

  return (
    <>
      <div class="grid grid-cols-7 gap-4 items-center my-6 mx-4 w-auto justify-between whitespace-pre place-items-center">
        <p class="flex-1 col-span-1">{props.standing}</p>
        <div class="flex flex-row gap-5 col-span-2 w-full relative lg:left-[30%]">
          <img
            src={props.img}
            alt={props.firstName}
            class="rounded-full border-2 aspect-square w-14 p-1"
            style={{ "border-color": teamColor }}
          />
          <p>{props.firstName}</p>
        </div>
        <div class="col-span-1">{props.secondName}</div>
        <p class="col-span-1">{props.points}</p>
        {/* <p class="">{props.wins}</p> */}
        <div class="col-span-1">graph</div>
        
        <i onClick={() => setFavourite(props.type, props.firstName)} class={`fa-solid fa-heart fa-2x col-span-1 cursor-pointer ${isFav() ? "text-primary hover:text-primary-200" : "hover:text-gray-400"}`}></i>
      </div>
    </>
  );
};

export default StandingsCard;
