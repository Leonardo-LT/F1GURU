import { For } from "solid-js"
import calendar from "../calendar.json"
import CalendarCard from "./calendarCard"

const CalendarWidget = (props) => {
  return (
    <>
      <For each={calendar}>
        {(item, index) => (
          <CalendarCard round_number={index() + 1} sessions={item.sessions} grandprix_name={item.country} grandprix_circuit={item.circuit_name} country_key={item.country_key} />
        )}
      </For>
    </>
  )
}

export default CalendarWidget