const GroupCard = (props) => {
  return (
    <>
      <div
        class="widget w-full flex flex-row gap-4 justify-between items-center px-4 min-h-fit cursor-pointer"
        onClick={() => props.setGroup(props.group)}
      >
        <div class="w-full sm:w-[40%]">
          <h3 class="font-bold text-2xl uppercase truncate">
            {props.group.groupName}
          </h3>
          <p class="text-gray-400">
            {props.group.members.length}{" "}
            {props.group.members.length > 1 ? "members" : "member"}
          </p>
        </div>

        <div class="h-full items-center justify-end hidden sm:flex sm:w-[55%]">
          <p class="text-center">{props.group.id}</p>
        </div>
        <div
          class="w-[5%] h-full flex items-center justify-center hover:text-primary transition-colors"
          onClick={() => props.quitGroup(props.group.id)}
        >
          <i class="fa-solid fa-trash fa-xl"></i>
        </div>
      </div>
    </>
  );
};

export default GroupCard;
