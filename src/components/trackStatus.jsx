import { createResource, Match, Show } from "solid-js";

const fetchTrackStatus = async () => {
  try {
    const response = await fetch(
      "https://api.openf1.org/v1/race_control?session_key=latest&category=Flag&category=Sector",
    );
    if (!response.ok) return null;
    let json = await response.json();
    return Array.isArray(json) && json.length > 0
      ? json[json.length - 1]
      : null;
  } catch (err) {
    return null;
  }
};

const TrackStatus = (props) => {
  const [trackStatus] = createResource(fetchTrackStatus);

  return (
    <>
      <div class="widget flex flex-col items-center justify-center row-span-2 w-full flex-1 min-h-0 p-6">
        <Show
          when={trackStatus()}
          fallback={
            <div class="p-4 text-center text-gray-500 font-semibold italic">
              Track data currently unavailable
            </div>
          }
        >
          <h3 class="font-bold text-xl text-gray-400 pb-4">TRACK STATUS</h3>
          <div>
            <div>
              <Show
                when={trackStatus().flag == "CHEQUERED"}
                fallback={
                  <i
                    class="fa-solid fa-flag fa-5x"
                    classList={{
                      "text-blue-500": trackStatus().flag == "BLUE",
                      "text-green-500": trackStatus().flag == "GREEN",
                      "text-yellow-500": trackStatus().flag == "YELLOW",
                    }}
                  ></i>
                }
              >
                <i class="fa-solid fa-flag-checkered fa-5x"></i>
              </Show>
            </div>
            <div>
              <h1>{trackStatus().flag}</h1>
              <p>{trackStatus().message}</p>
            </div>
          </div>
        </Show>
      </div>
    </>
  );
};

export default TrackStatus;
