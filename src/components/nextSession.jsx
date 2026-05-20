import { createDateNow } from "@solid-primitives/date";
import {
  getNextSession,
  getNextGrandPrix,
  getCurrentGrandPrixImage,
} from "../utility/sessionUtils";
import { createEffect, createMemo, createSignal, Show } from "solid-js";

const NextSession = (props) => {
  const [time] = createDateNow(1000);
  const [nextSession, setNextSession] = createSignal(getNextSession());
  const nextGrandPrix = getNextGrandPrix();
  const startTime = createMemo(() => new Date(nextSession().start));
  const endTime = createMemo(() => new Date(nextSession().end));
  const live = createMemo(() => time() <= endTime() && time() >= startTime());
  const imageUrl = createMemo(() => getCurrentGrandPrixImage());

  createEffect(() => {
    if (startTime() - time() < 0 && !live()) {
      setNextSession(getNextSession());
    }
  });

  createEffect(() => console.log("Image URL:", imageUrl()));

  return (
    <>
      <div
        class="next-session widget col-span-12 lg:col-span-8 row-start-1 row-span-1 gap-15 h-full bg-cover bg-center"
        style={`background-image: linear-gradient(rgba(24, 34, 52, 0.7), rgba(24, 34, 52, 0.7)), url('${imageUrl()}');`}
      >
        <div class="h-fit">
          <p class="font-bold text-primary mb-2 text-xs sm:text-lg">
            NEXT SESSION
          </p>
          <h1 class="font-bold text-3xl">{nextSession().name}</h1>
          <h3>
            Local Time:{" "}
            {startTime().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </h3>
        </div>

        <Show when={!live()}>
          <div class="flex-1 flex flex-col justify-center">
            <div class="hidden sm:flex gap-2 sm:gap-5">
              <div class="time-widget">
                <span>
                  {Math.floor((startTime() - time()) / 1000 / (3600 * 24))}
                </span>
                <p>DAYS</p>
              </div>
              <div class="time-widget">
                <span>
                  {Math.floor(
                    (((startTime() - time()) / 1000) % (3600 * 24)) / 3600,
                  ) % 24}
                </span>
                <p>HRS</p>
              </div>
              <div class="time-widget">
                <span>
                  {Math.floor((((startTime() - time()) / 1000) % 3600) / 60) %
                    60}
                </span>
                <p>MINS</p>
              </div>
              <div class="time-widget">
                <span>{Math.floor(((startTime() - time()) / 1000) % 60)}</span>
                <p>SECS</p>
              </div>
            </div>

            <div class="flex gap-2 sm:gap-5 sm:hidden">
              <div class="time-widget">
                <span>
                  {Math.floor((startTime() - time()) / 1000 / (3600 * 24))} :{" "}
                  {Math.floor(
                    (((startTime() - time()) / 1000) % (3600 * 24)) / 3600,
                  )}{" "}
                  : {Math.floor((((startTime() - time()) / 1000) % 3600) / 60)}{" "}
                  : {Math.floor(((startTime() - time()) / 1000) % 60)}
                </span>
                <p>DAYS HRS MINS SECS</p>
              </div>
            </div>
          </div>

          <button onClick={props.onNotify} class="button">
            Notify
          </button>
        </Show>

        <Show when={live()}>
          <p class="font-extrabold text-7xl animate-pulse text-primary h-full flex flex-col justify-end">
            LIVE
          </p>
        </Show>
      </div>
    </>
  );
};

export default NextSession;
