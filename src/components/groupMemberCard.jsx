const GroupMemberCard = (props) => {
  return (
    <>
      <div class="widget flex justify-between">
        <div class="w-2/3 truncate">{props.member.username}</div>
        <div class="w-1/3 text-end">{props.points}</div>
      </div>
    </>
  );
};

export default GroupMemberCard;
