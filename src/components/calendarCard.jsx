import { createSignal, Show, For } from "solid-js";
import ArrowRight from "lucide-solid/icons/arrow-right";
import Trophy from "lucide-solid/icons/trophy";
import PlayCircle from "lucide-solid/icons/play-circle";
import getCodeFromNation from "../utility/getCodeFromNation";

const CalendarCard = (props) => {
  const [isExpanded, setIsExpanded] = createSignal(false);

  const now = Date.now();
  const sessions = props.sessions || [];
  
  const raceSession = sessions[sessions.length - 1];
  const endDate = new Date(raceSession?.end);
  const isFinished = now > endDate.getTime();
  const isSprint = sessions.some(s => s.name.toLowerCase().includes("sprint"));

  const displaySessions = sessions.filter(s => 
    s.name === "Qualifying" || s.name === "Race" || s.name === "Sprint"
  ).slice(-2);

  const getSessionStatus = (session) => {
    const start = new Date(session.start).getTime();
    const end = new Date(session.end).getTime();

    if (now > end) {
      return { status: "Completed", class: "text-gray-500 line-through", isLive: false };
    } else if (now >= start && now <= end) {
      return { status: "LIVE NOW", class: "text-blue-500 font-bold", isLive: true };
    } else {
      const dateObj = new Date(session.start);
      const timeStr = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
      const dayStr = dateObj.toLocaleDateString("en-US", { weekday: 'short' });
      return { status: `${dayStr}, ${timeStr}`, class: "text-white", isLive: false };
    }
  };

  const hasLiveSession = sessions.some(s => getSessionStatus(s).isLive);

  return (
    <div 
      onClick={() => setIsExpanded(!isExpanded())}
      class={`relative flex flex-col rounded-2xl border bg-[#12151e] overflow-hidden p-5 shadow-lg transition-all duration-300 cursor-pointer hover:border-gray-500
        ${isExpanded() ? 'md:col-span-2 border-blue-600' : 'col-span-1 border-[#232732] min-h-[300px]'}`
      }
    >
      
      <Show when={!isExpanded()}>
        <div class={`absolute top-0 left-0 right-0 h-32 opacity-20 pointer-events-none ${isFinished ? 'bg-gradient-to-b from-red-700' : 'bg-gradient-to-b from-green-700'}`}></div>

        <div class="relative flex justify-end items-center gap-2 mb-4">
          <Show when={isSprint}>
            <span class="bg-[#facc15] text-black text-[10px] font-extrabold px-2.5 py-1 rounded tracking-widest uppercase shadow-sm">⚡ Sprint</span>
          </Show>
          <span class="bg-[#1a1e26] border border-[#232732] text-gray-300 text-[10px] font-extrabold px-2.5 py-1 rounded tracking-widest uppercase shadow-sm">
            Round {props.round_number} {isFinished && "• Finished"}
          </span>
        </div>

        <div class="relative flex justify-between items-start mb-6">
          <div class="w-12 h-8 bg-[#1a1e26] rounded border border-[#232732] flex-shrink-0 overflow-hidden">
             <img src={`https://flagcdn.com/${getCodeFromNation(props.grandprix_name)}.svg`} alt="Flag" class="w-full h-full object-cover" />
          </div>
          <div class="flex flex-col items-end leading-none">
            <span class="text-[2.5rem] font-bold text-white tracking-tighter mb-1">{endDate.getDate().toString().padStart(2, '0')}</span>
            <span class="text-xs font-bold text-gray-500 uppercase tracking-widest">{endDate.toLocaleString("en-US", { month: 'short' })}</span>
          </div>
        </div>

        <div class="relative mb-6 flex-1">
          <h2 class="text-xl font-bold text-white mb-1 tracking-tight">{props.grandprix_name}</h2>
          <h3 class="text-sm text-gray-500 font-medium">{props.grandprix_circuit}</h3>
        </div>

        <div class="h-px bg-[#232732] w-full mb-4"></div>

        <div class="relative mt-auto">
          <Show 
            when={!isFinished} 
            fallback={
              <div class="flex items-center justify-between text-sm py-1">
                <div class="flex items-center gap-2 text-gray-400">
                  <Trophy size={16} /> <span class="font-bold text-gray-300">TBA</span>
                </div>
                <div class="flex items-center gap-1 text-gray-400">Results <ArrowRight size={16} /></div>
              </div>
            }
          >
            <div class="flex flex-col gap-3">
              <For each={displaySessions}>
                {(item) => (
                  <div class="flex justify-between items-center text-sm">
                    <span class="text-gray-400 font-medium">{item.name}</span>
                    <span class="text-white font-medium font-mono">{getSessionStatus(item).status}</span>
                  </div>
                )}
              </For>
            </div>
          </Show>
        </div>
      </Show>

      <Show when={isExpanded()}>
        <div class="flex flex-col md:flex-row h-full gap-6">
          <div class="flex-1 flex flex-col">
            <div class="flex items-start justify-between mb-6">
              <div class="flex items-center gap-4">
                <div class="w-10 h-7 rounded border border-[#232732] overflow-hidden">
                  <img src={`https://flagcdn.com/${getCodeFromNation(props.grandprix_name)}.svg`} alt="Flag" class="w-full h-full object-cover" />
                </div>
                <div>
                  <h2 class="text-2xl font-bold text-white">{props.grandprix_name}</h2>
                  <h3 class="text-sm text-gray-400">{props.grandprix_circuit}</h3>
                </div>
              </div>

              <div class="flex gap-2">
                <Show when={hasLiveSession}>
                  <span class="bg-red-900/30 text-red-500 border border-red-800 text-[10px] font-bold px-2 py-1 rounded tracking-widest uppercase">
                    <span class="w-2 h-2 rounded-full bg-red-500 inline-block mr-1 animate-pulse"></span>LIVE
                  </span>
                </Show>
                <span class="bg-[#1a1e26] border border-[#232732] text-gray-300 text-[10px] font-bold px-2 py-1 rounded tracking-widest uppercase">
                  Round {props.round_number}
                </span>
              </div>
            </div>

            <div class="flex flex-col gap-2 mb-6">
              <For each={sessions}>
                {(item) => {
                  const statusInfo = getSessionStatus(item);
                  return (
                    <div class={`flex justify-between items-center p-3 rounded-lg border text-sm font-mono
                      ${statusInfo.isLive ? 'bg-blue-900/20 border-blue-700/50' : 'bg-[#1a1e26] border-[#232732]'}`}
                    >
                      <span class={statusInfo.isLive ? 'text-white font-bold' : 'text-gray-400'}>
                        {statusInfo.isLive && <span class="text-blue-500 mr-2">•</span>}
                        {item.name}
                      </span>
                      <span class={statusInfo.class}>{statusInfo.status}</span>
                    </div>
                  );
                }}
              </For>
            </div>

            <Show when={!isFinished}>
              <button class="mt-auto w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-lg flex justify-center items-center gap-2 transition-colors">
                <PlayCircle size={20} /> Watch Live Timing
              </button>
            </Show>
          </div>

          <div class="hidden md:flex flex-1 flex-col items-center justify-center border-l border-[#232732] pl-6 relative">
            <div class="w-48 h-48 border-4 border-blue-900/30 rounded-[3rem] rotate-45 mb-10"></div>
            
            <div class="absolute bottom-0 right-0 text-right">
              <p class="text-[10px] text-gray-500 font-bold tracking-widest uppercase">Track Temp</p>
              <p class="text-2xl text-white font-bold">32°C</p>
            </div>
          </div>

        </div>
      </Show>

    </div>
  );
}

export default CalendarCard;