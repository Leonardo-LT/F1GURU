import { Router, useLocation } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { Suspense, createSignal, onMount } from "solid-js";
import Nav from "~/components/Nav";
import { MetaProvider, Link, Title } from "@solidjs/meta";
import "./index.css";
import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import {
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
  getFirestore,
} from "firebase/firestore";
import { getApps } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyBjGBVUsy3JcP-P0mfbM6VU8auaPUQiJfA",
  authDomain: "f1guru-8c822.firebaseapp.com",
  projectId: "f1guru-8c822",
  storageBucket: "f1guru-8c822.firebasestorage.app",
  messagingSenderId: "896046200600",
  appId: "1:896046200600:web:654ff9b13aef562fdf106d",
  measurementId: "G-94T2HX2Q21",
};

const fApp =
  getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

let db;
try {
  db = initializeFirestore(fApp, {
    localCache: persistentLocalCache({
      tabManager: persistentMultipleTabManager(),
    }),
  });
} catch {
  db = getFirestore(fApp);
}

const logOut = (auth) => {
  signOut(auth)
    .then(() => {
      alert("User signed out successfully");
    })
    .catch((error) => {
      alert("Error signing out: " + error);
    });
};

export default function App() {
  const auth = getAuth();
  const [user, setUser] = createSignal(auth.currentUser);

  onAuthStateChanged(auth, () => {
    setUser(auth.currentUser);
  });

  onMount(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js", {
        scope: "/",
        type: import.meta.env.DEV ? "module" : "classic",
      });
    }
  });

  return (
    <Router
      root={(props) => (
        <MetaProvider>
          <Title>F1 Guru</Title>
          <Link rel="manifest" href="/manifest.webmanifest" />
          <meta name="theme-color" content="#1f2937" />
          <div class="overflow-x-hidden overflow-y-auto bg-bg min-h-screen h-screen lg:h-screen ">
            <div class="h-[5vh]">
              <Nav user={user} auth={auth} logOut={logOut} />
            </div>

            <main class="text-white flex flex-col items-center w-full min-h-[95vh] lg:max-h-fit">
              <div class="w-[95vw] min-h-[95vh] md:w-[90vw] lg:w-[80vw] lg:h-[95vh]">
                <Suspense>{props.children}</Suspense>
              </div>
            </main>
          </div>
        </MetaProvider>
      )}
    >
      <FileRoutes />
    </Router>
  );
}

export { App, fApp, db };
