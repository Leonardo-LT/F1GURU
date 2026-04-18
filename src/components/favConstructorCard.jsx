import { Show } from "solid-js";

const FavConstructorCard = (props) => {
  const driver1 = props.driversPoints && props.driversPoints.length > 0 ? props.driversPoints[0] : { last_name: 'Driver 1', points: 50 };
  const driver2 = props.driversPoints && props.driversPoints.length > 1 ? props.driversPoints[1] : { last_name: 'Driver 2', points: 50 };
  
  const totalPoints = props.points_current || 0;
  let d1Percent = totalPoints > 0 ? Math.round((driver1.points / totalPoints) * 100) : 50;
  let d2Percent = totalPoints > 0 ? Math.round((driver2.points / totalPoints) * 100) : 50;

  if (totalPoints > 0) {
    d2Percent = 100 - d1Percent;
  }

  return (
    <>
      <div class="widget snap-start grid-span-1 min-w-fit flex flex-col justify-between w-96 p-6">
        <div class="flex gap-4 items-start justify-between">
          <div class="flex gap-5 items-center">
             <div class="p-2 rounded-full border-2 flex items-center justify-center" style={{ "border-color": `#${props.teamColour}` }}>
               <img src={props.team_logo} alt={props.team_name} class="w-14 h-14 aspect-square "/>
             </div>
             <div class="flex flex-col">
               <p class="font-bold text-2xl leading-tight w-36 whitespace-normal">{props.team_name}</p>
               <p class="font-bold mt-2 text-gray-400">P{props.position}</p>
             </div>
          </div>
          
          <div class="flex flex-col items-end">
             <div class="flex items-baseline gap-2">
               <p class="font-bold leading-none mb-1">{props.points_current}</p>
               <p class="font-semibold text-gray-400 text-sm">PTS</p>
             </div>
             <Show when={props.gapLabel}>
               <div class="flex flex-col items-end text-[0.95rem] text-gray-300 mt-1">
                 <p>{props.gapLabel}</p>
                 <p>+{props.gapToNext}</p>
               </div>
             </Show>
          </div>
        </div>

        <div class="flex flex-col mt-8 gap-2">
          <div class="flex justify-between text-base text-gray-400 font-medium px-1">
            <p>{driver1.last_name} ({d1Percent}%)</p>
            <p>{driver2.last_name} ({d2Percent}%)</p>
          </div>
          <div class="w-full h-[0.6rem] bg-[#3F3F46] rounded-full flex overflow-hidden">
            <div style={{ width: `${d1Percent}%`, "background-color": `#${props.teamColour}` }} class="h-full"></div>
            <div style={{ width: `${d2Percent}%`, "background-color": `#${props.teamColour}`, filter: "brightness(0.55)" }} class="h-full"></div>
          </div>
        </div>
      </div>
    </>
  )
}

export default FavConstructorCard