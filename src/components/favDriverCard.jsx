import { getDriverFromFullName } from "../utility/getDriversFromTeamName"

const FavDriverCard = (props) => {

  return (
    <>
      <div class="widget snap-center shrink-0 grid-span-1 min-w-fit flex flex-col gap-9">
        <div class="flex gap-4 justify-around">
          <p class="font-extrabold text-5xl">{props.driver_number}</p>
          <div class="text-center">
            <p>{props.full_name}</p>
            <p>{props.team_name}</p>
          </div>
          <img src={props.headshot_url} alt={props.full_name} class="rounded-full border-2 aspect-square w-14"/>
        </div>

        <div class="flex gap-4 text-center">
          <div class="widget flex-1">
            <p class="font-bold text-gray-400">PTS</p>
            <p class="font-extrabold text-4xl">{props.points_current}</p>
          </div>
          <div class="widget flex-1">
            <p class="font-bold  text-gray-400">POS</p>
            <p class="font-extrabold text-4xl">{props.position}</p>
          </div>
          <div class="widget flex-1">
            <p class="font-bold text-gray-400">GAP</p>
            <p class="font-extrabold text-4xl">{props.points_current - props.points_start}</p>
          </div>
        </div>
      </div>
    </>
  )
}

export default FavDriverCard