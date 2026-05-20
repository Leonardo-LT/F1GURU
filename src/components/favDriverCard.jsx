import { getDriverFromFullName } from "../utility/getDriversFromTeamName";

const FavDriverCard = (props) => {
  return (
    <>
      <div class="widget snap-center grid-span-1 min-w-fit flex flex-col gap-5 sm:gap-9">
        <div class="flex gap-2 sm:gap-4 justify-between items-center">
          <img
            src={props.headshot_url}
            alt={props.full_name}
            class="w-14 sm:w-16 aspect-square rounded-full border-2 "
            style={{
              "border-color": `#${getDriverFromFullName(props.full_name).team_colour}`,
            }}
          />
          <div>
            <p class="font-bold text-xl sm:text-2xl w-28 sm:w-36">
              {props.full_name}
            </p>
            <p>{props.team_name}</p>
          </div>

          <p class="font-extrabold text-3xl sm:text-5xl">
            {props.driver_number}
          </p>
        </div>

        <div class="flex gap-4 text-center">
          <div class="widget flex-1">
            <p class="font-bold text-gray-400">PTS</p>
            <p class="font-extrabold text-2xl sm:text-4xl">
              {props.points_current}
            </p>
          </div>
          <div class="widget flex-1">
            <p class="font-bold  text-gray-400">POS</p>
            <p class="font-extrabold text-2xl sm:text-4xl">{props.position}</p>
          </div>
          <div class="widget flex-1">
            <p class="font-bold text-gray-400">GAP</p>
            <p class="font-extrabold text-2xl sm:text-4xl">
              {props.points_current - props.points_start}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default FavDriverCard;
