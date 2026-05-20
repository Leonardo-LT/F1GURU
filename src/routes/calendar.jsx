import { Suspense } from "solid-js";
import CalendarWidget from "../components/calendarWidget";

export default function Calendar() {
  return (
    <>
      <div class="p-4">
        <h1 class="font-bold text-3xl p-4 pl-1">Race Calendar</h1>
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
          <Suspense>
            <CalendarWidget />
          </Suspense>
        </div>
      </div>
    </>
  );
}
