import { createDateNow } from "@solid-primitives/date";

/**
 * Props:
 *   nextSession  - session object  { name, start, end }
 *   startTime    - Date instance for the session start
 *   onNotify     - () => void  called when the Notify button is clicked
 */
const NextSession = (props) => {
  const [time] = createDateNow(1000);

  return (
    <>
      <div class="next-session widget col-span-12 md:col-span-8 row-start-1 row-span-1 gap-15">
        <div class="h-fit">
          <p class="font-bold text-primary mb-2 text-xs sm:text-lg">
            NEXT SESSION
          </p>
          <h1 class="font-bold text-3xl">{props.nextSession.name}</h1>
          <h3>
            Local Time:{" "}
            {props.startTime.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </h3>
        </div>

        <div class="flex-1 flex flex-col justify-center">
          {/* Wide layout: 4 separate boxes */}
          <div class="hidden sm:flex gap-2 sm:gap-5">
            <div class="time-widget">
              <span>
                {Math.floor((props.startTime - time()) / 1000 / (3600 * 24))}
              </span>
              <p>DAYS</p>
            </div>
            <div class="time-widget">
              <span>
                {Math.floor(
                  (((props.startTime - time()) / 1000) % (3600 * 24)) / 3600,
                ) % 24}
              </span>
              <p>HRS</p>
            </div>
            <div class="time-widget">
              <span>
                {Math.floor((((props.startTime - time()) / 1000) % 3600) / 60) % 60}
              </span>
              <p>MINS</p>
            </div>
            <div class="time-widget">
              <span>{Math.floor(((props.startTime - time()) / 1000) % 60)}</span>
              <p>SECS</p>
            </div>
          </div>

          {/* Compact layout: single box for mobile */}
          <div class="flex gap-2 sm:gap-5 sm:hidden">
            <div class="time-widget">
              <span>
                {Math.floor((props.startTime - time()) / 1000 / (3600 * 24))} :{" "}
                {Math.floor(
                  (((props.startTime - time()) / 1000) % (3600 * 24)) / 3600,
                )}{" "}
                : {Math.floor((((props.startTime - time()) / 1000) % 3600) / 60)}{" "}
                : {Math.floor(((props.startTime - time()) / 1000) % 60)}
              </span>
              <p>DAYS : HRS : MINS : SECS</p>
            </div>
          </div>
        </div>

        <button
          onClick={props.onNotify}
          class="bg-primary w-22 h-10 rounded-lg hover:bg-primary/50 text-white cursor-pointer"
        >
          Notify
        </button>
      </div>
    </>
  );
};

export default NextSession;
