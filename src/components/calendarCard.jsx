import { createSignal, Show, For } from "solid-js";
import getCodeFromNation from "../utility/getCodeFromNation";

const CalendarCard = (props) => {
  const [isExpanded, setIsExpanded] = createSignal(false);

  const now = Date.now();
  const sessions = props.sessions || [];

  const raceSession = sessions[sessions.length - 1];
  const endDate = new Date(raceSession?.end);
  const isFinished = now > endDate.getTime();
  const isSprint = sessions.some((s) =>
    s.name.toLowerCase().includes("sprint"),
  );

  const displaySessions = sessions
    .filter(
      (s) =>
        s.name === "Qualifying" || s.name === "Race" || s.name === "Sprint",
    )
    .slice(-2);

  const getSessionStatus = (session) => {
    const start = new Date(session.start).getTime();
    const end = new Date(session.end).getTime();

    if (now > end) {
      return {
        status: "Completed",
        class: "text-gray-500 line-through",
        isLive: false,
      };
    } else if (now >= start && now <= end) {
      return {
        status: "LIVE NOW",
        class: "text-blue-500 font-bold",
        isLive: true,
      };
    } else {
      const dateObj = new Date(session.start);
      const timeStr = dateObj.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
      const dayStr = dateObj.toLocaleDateString("en-US", { weekday: "short" });
      return {
        status: `${dayStr}, ${timeStr}`,
        class: "text-white",
        isLive: false,
      };
    }
  };

  const hasLiveSession = sessions.some((s) => getSessionStatus(s).isLive);

  return (
    <div
      onClick={() => setIsExpanded(!isExpanded())}
      class={`relative flex flex-col rounded-2xl border shadow-xl bg-widget-bg overflow-hidden p-5 transition-all duration-300 cursor-pointer hover:border-primary/60
        ${isExpanded() ? "md:border-primary" : "border-widget-border min-h-75"}`}
    >
      <div class="z-2 relative flex justify-end items-center gap-2 mb-4">
        <Show when={isSprint}>
          <span class="bg-primary text-white text-[10px] font-extrabold px-2 py-1 rounded tracking-widest shadow-sm">
            SPRINT
          </span>
        </Show>
        <span class="bg-black/40 border border-black/80 text-white text-[10px] font-extrabold px-2 py-1 rounded tracking-widest shadow-sm">
          ROUND {props.round_number} {isFinished && "• Finished"}
        </span>
        <Show when={hasLiveSession}>
          <span class="bg-red-900/30 text-red-500 border border-red-500 text-[10px] font-bold px-2 py-1 rounded tracking-widest">
            <span class="w-2 h-2 rounded-full bg-red-500 inline-block mr-1 animate-pulse"></span>
            LIVE
          </span>
        </Show>
      </div>

      <Show when={!isExpanded()}>
        <div
          class={`absolute top-0 left-0 right-0 h-32  ${isFinished ? "bg-linear-to-b from-red-950" : "bg-linear-to-b from-green-950"}`}
        ></div>

        <div class="relative flex justify-between items-start">
          <div class="w-12 h-8">
            <img
              src={`https://flagcdn.com/${getCodeFromNation(props.grandprix_name)}.svg`}
              alt="Flag"
              class="w-full h-full object-cover rounded"
            />
          </div>
          <div class="flex flex-col items-end gap-1">
            <span class="text-4xl font-bold text-white">
              {endDate.getDate().toString().padStart(2, "0")}
            </span>
            <span class="text-xs font-bold text-gray-400 uppercase tracking-widest">
              {endDate.toLocaleString("en-US", { month: "short" })}
            </span>
          </div>
        </div>

        <div class="relative mb-6 h-fit">
          <h2 class="text-xl font-bold text-white mb-1">
            {props.grandprix_name}
          </h2>
          <h3 class="text-sm text-gray-400 font-medium">
            {props.grandprix_circuit}
          </h3>
        </div>

        <div class="mt-auto">
          <Show when={!isFinished}>
            <div class="h-px bg-gray-700 w-full mb-4"></div>
            <div class="flex flex-col gap-3">
              <For each={displaySessions}>
                {(item) => (
                  <div class="flex justify-between items-center text-sm">
                    <span class="text-gray-400">{item.name}</span>
                    <span class="text-white">
                      {getSessionStatus(item).status}
                    </span>
                  </div>
                )}
              </For>
            </div>
          </Show>
        </div>
      </Show>

      <Show when={isExpanded()}>
        <div class="flex flex-col md:flex-row h-full w-full gap-6">
          <div class="h-fit w-full">
            <div class="flex items-start justify-between mb-6">
              <div class="flex items-center gap-4">
                <div class="w-10 h-7 rounded border border-gray-700 overflow-hidden">
                  <img
                    src={`https://flagcdn.com/${getCodeFromNation(props.grandprix_name)}.svg`}
                    alt="Flag"
                    class="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h2 class="text-2xl font-bold text-white">
                    {props.grandprix_name}
                  </h2>
                  <h3 class="text-sm text-gray-400">
                    {props.grandprix_circuit}
                  </h3>
                </div>
              </div>
            </div>

            <div class="flex flex-col gap-2 mb-6">
              <For each={sessions}>
                {(session) => {
                  const statusInfo = getSessionStatus(session);
                  return (
                    <div
                      class={`flex justify-between items-center p-3 rounded-lg border text-sm"
                      ${statusInfo.isLive ? "bg-primary/15 border-primary/50" : "bg-gray-800/80 border-gray-700"}`}
                    >
                      <span
                        class={
                          statusInfo.isLive
                            ? "text-white font-bold"
                            : "text-gray-400"
                        }
                      >
                        {session.name}
                      </span>
                      <span class={statusInfo.class}>{statusInfo.status}</span>
                    </div>
                  );
                }}
              </For>
            </div>
          </div>
        </div>
      </Show>
    </div>
  );
};

export default CalendarCard;
