import getDriverFromNumber from "../utility/getDriverFromNumber.js"

const DriverCard = (props) => {
  const driver = getDriverFromNumber(props.number)
  const teamColor = "#"+driver.team_colour

  return (
    <>
      <div class="flex items-center gap-3 min-w-0">
        <div class="flex flex-row gap-3 items-center shrink-0">
          <p class="w-5 text-center shrink-0">{props.position}</p>
          <img src={driver.headshot_url} alt={driver.first_name} class="rounded-full border-2 aspect-square w-12 shrink-0" style={{"border-color" : teamColor}}/>
        </div>
        <div class="flex items-center gap-2 flex-1 min-w-0">
          <p class="font-bold text-xl shrink-0">{props.number}</p>
          <div class="flex flex-col min-w-0">
            <p class="font-semibold text-base truncate">{driver.first_name} {driver.last_name}</p>
            <p class="text-gray-500 text-sm truncate">{driver.team_name}</p>
          </div>
        </div>
        <p class="shrink-0 font-semibold tabular-nums">{props.points}</p>
      </div>
    </>
  ) 
}

export default DriverCard; 