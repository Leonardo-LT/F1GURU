import { useLocation, A } from "@solidjs/router";
import { Show, createSignal } from "solid-js";

export default function Nav(props) {
  const [isOpen, setIsOpen] = createSignal(false);
  // const location = useLocation();
  // const active = (path) =>
  //   path == location.pathname
  //     ? "border-sky-600"
  //     : "border-transparent hover:border-sky-600";
  return (
    <nav class="overflow-x-auto fixed top-0 left-0 w-screen h-auto bg-bg border-b-2 border-widget-border flex justify-center z-10">
      <div class="relative flex justify-between px-5 md:px-0 w-full lg:w-[80vw] h-full items-center md:justify-center text-white font-semibold text-l">
        <div class="hidden md:flex flex-row items-center justify-center flex-1 gap-10">
          <A href="/" class="nav-link" activeClass="nav-link-active" end>
            Home
          </A>
          <A href="/standings" class="nav-link" activeClass="nav-link-active">
            Standings
          </A>
          <A href="/garage" class="nav-link" activeClass="nav-link-active">
            Garage
          </A>
          <A href="/calendar" class="nav-link" activeClass="nav-link-active">
            Calendar
          </A>
          <A href="/fantaF1" class="nav-link" activeClass="nav-link-active">
            FantaF1
          </A>
        </div>

        <div class="md:hidden" onClick={() => setIsOpen(!isOpen())}>
          <i class="fa-solid fa-bars fa-xl text-white"></i>
          <div
            class={
              "fixed widget rounded-none rounded-br-2xl shadow-2xl left-0 top-[5vh] " +
              (isOpen() ? "" : "hidden")
            }
          >
            <div class="flex flex-col items-center justify-center flex-1 gap-4">
              <A href="/" class="nav-link" activeClass="nav-link-active" end>
                Home
              </A>
              <A
                href="/standings"
                class="nav-link"
                activeClass="nav-link-active"
              >
                Standings
              </A>
              <A href="/garage" class="nav-link" activeClass="nav-link-active">
                Garage
              </A>
              <A
                href="/calendar"
                class="nav-link"
                activeClass="nav-link-active"
              >
                Calendar
              </A>
              <A href="/fantaF1" class="nav-link" activeClass="nav-link-active">
                FantaF1
              </A>
            </div>
          </div>
        </div>

        <Show when={!props.user()}>
          <A href="/auth" class="nav-link" activeClass="nav-link-active">
            <i class="fa-solid fa-user mr-1.5"></i>
            Sign In / Up
          </A>
        </Show>
        <Show when={props.user()}>
          <div
            onClick={[props.logOut, props.auth]}
            class="nav-link cursor-pointer"
          >
            <i class="fa-solid fa-user mr-1.5"></i>
            Log Out
          </div>
        </Show>
      </div>
    </nav>
  );
}
