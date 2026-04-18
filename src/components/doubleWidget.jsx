import { Show } from "solid-js";

const DoubleWidget = (props) => {
  return (
    <div class="row-span-1 widget col-span-2 px-5 py-0 flex items-center shadow-sm">
      
      <div class="flex-1 flex items-center justify-center gap-4 py-6">
        <i class={"text-gray-400 fa-solid fa-2x " + props.first_icon}></i>
        
        <div class="flex flex-col">
          <span class="text-gray-400 text-sm font-medium tracking-wide">
            {props.first_name}
          </span>
          <div class="flex items-baseline gap-1.5 mt-0.5">
            <span class="text-white text-xl font-bold">
              {props.first_main_data}
            </span>
            <Show when={props.first_secondary_data}>
              <span class="text-gray-500 text-sm font-bold">
                {props.first_secondary_data}
              </span>
            </Show>
          </div>
        </div>
      </div>

      <div class="w-px h-3/5 bg-widget-border"></div>

      <div class="flex-1 justify-center flex items-center gap-4 py-6">
        <i class={"text-gray-400 fa-solid fa-2x " + props.second_icon}></i>
        
        <div class="flex flex-col">
          <span class="text-gray-400 text-sm font-medium tracking-wide">
            {props.second_name}
          </span>
          <div class="flex items-baseline gap-1.5 mt-0.5">
            <span class="text-white text-xl font-bold">
              {props.second_main_data}
            </span>
            <Show when={props.second_secondary_data}>
              <span class="text-gray-500 text-sm font-bold">
                {props.second_secondary_data}
              </span>
            </Show>
          </div>
        </div>
      </div>

    </div>
  )
}

export default DoubleWidget;