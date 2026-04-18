import { getDriversFromTeamName } from "../utility/getDriversFromTeamName";
import teams from "../teams.json";

const ConstructorCard = (props) => {
  const team = getDriversFromTeamName(props.team_name);
  const teamColor = "#" + team.teamColour;
  const logoUrl = teams[props.team_name];

  return (
    <>
      <div class="flex items-center gap-3 min-w-0">
        <div class="flex flex-row gap-3 items-center shrink-0">
          <p class="w-5 text-center shrink-0">{props.position}</p>
          <div
            class="rounded-full border-2 aspect-square w-12 flex items-center justify-center p-1 bg-black/20 shrink-0"
            style={{ "border-color": teamColor }}
          >
            <img
              src={logoUrl}
              alt={props.team_name}
              class="w-8 h-8 object-contain"
            />
          </div>
        </div>

        <div class="flex flex-col flex-1 min-w-0">
          <p class="font-semibold text-base truncate">{props.team_name}</p>
          <p class="text-gray-500 text-sm truncate">{team.driversList.join(" · ")}</p>
        </div>

        <p class="shrink-0 font-semibold tabular-nums">{props.points}</p>
      </div>
    </>
  );
};

export default ConstructorCard;
