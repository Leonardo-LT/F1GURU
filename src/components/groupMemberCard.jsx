const GroupMemberCard = (props) => {
  return (
    <>
      <div class="widget flex justify-between">
        <div class="w-1/4 text-start">{props.pos}</div>
        <div class="w-2/4 truncate">{props.member.username}</div>
        <div class="w-1/3 text-end">{props.points}</div>
      </div>
    </>
  );
};

export default GroupMemberCard;
