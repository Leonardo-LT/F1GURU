import { useLocation, A } from "@solidjs/router";
import { Show } from "solid-js";

export default function Nav(props) {
  const location = useLocation();
  const active = (path) =>
    path == location.pathname
      ? "border-sky-600"
      : "border-transparent hover:border-sky-600";
  return (
    <nav class="overflow-x-auto fixed top-0 left-0 w-screen h-auto bg-bg border-b-2 border-widget-border flex justify-center z-10">
      <div class="w-full lg:w-[80vw] h-full flex items-center justify-center text-white font-semibold text-l">
        <div class="flex flex-row items-center justify-center flex-1 gap-10">
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
