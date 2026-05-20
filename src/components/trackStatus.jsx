import { createResource, ErrorBoundary, Match, Show, Suspense } from "solid-js";

const fetchTrackStatus = async () => {
  const response = await fetch(
    "https://api.openf1.org/v1/race_control?session_key=latest&category=Flag&category=Sector",
  );
  if (!response.ok) throw new Error("Failed to fetch track status");
  let json = await response.json();
  return Array.isArray(json) && json.length > 0
    ? json[json.length - 1]
    : null;
};

const TrackStatus = (props) => {
  const [trackStatus, { refetch }] = createResource(fetchTrackStatus);

  return (
    <>
      <ErrorBoundary
        fallback={(err, reset) => (
          <div class="widget flex flex-col items-center justify-center row-span-2 w-full flex-1 min-h-0 p-6 text-gray-500 font-semibold italic gap-3">
            <p>Failed to load track status</p>
            <button
              class="button"
              onClick={() => { refetch(); reset(); }}
            >
              Try Again
            </button>
          </div>
        )}
      >
        <Suspense
          fallback={
            <div class="widget flex flex-col items-center justify-center row-span-2 w-full flex-1 min-h-0 p-6 animate-pulse text-gray-400">
              Loading track status...
            </div>
          }
        >
          <div class="widget flex flex-col items-center justify-between row-span-2 w-full flex-1 min-h-0 p-6">
            <Show
              when={trackStatus()}
              fallback={
                <div class="p-4 text-center text-gray-500 font-semibold italic">
                  Track data currently unavailable
                </div>
              }
            >
              <h3 class="font-bold text-xl text-gray-400 pb-4">TRACK STATUS</h3>

              <div class="flex flex-1 flex-col justify-center items-center gap-5">
                <div>
                  <Show
                    when={trackStatus().flag == "CHEQUERED"}
                    fallback={
                      <i
                        class="fa-solid fa-flag fa-5x"
                        classList={{
                          "text-blue-500": trackStatus().flag.includes("BLUE"),
                          "text-green-500": trackStatus().flag.includes("GREEN"),
                          "text-yellow-500": trackStatus().flag.includes("YELLOW"),
                        }}
                      ></i>
                    }
                  >
                    <i class="fa-solid fa-flag-checkered fa-5x"></i>
                  </Show>
                </div>
                <div>
                  <p>{trackStatus().message}</p>
                </div>
              </div>
            </Show>
          </div>
        </Suspense>
      </ErrorBoundary>
    </>
  );
};

export default TrackStatus;
