const Widget = (props) => {
  return (
    <>
      <div class="widget col-span-1 row-span-2 grid grid-cols-4">
        <div class="col-span-2">
          <i class={"fa-solid fa-2x pb-2 " + props.icon}></i>
          <p class="font-bold text-2xl">{props.first_data}</p>
          <h3 class="text-gray-500">{props.description}: {props.second_data}</h3>
        </div>
        <div class="col-span-2 col-start-3 flex flex-row-reverse text-gray-500">
          <p>{props.name}</p>
        </div>
      </div>
    </>
  )
}

export default Widget