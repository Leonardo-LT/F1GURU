import { createSignal, Show } from "solid-js";
import { useNavigate } from "@solidjs/router";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";

const auth = getAuth();

const errorMapping = (code) => {
  const map = {
    "auth/email-already-in-use": "This email is already registered.",
    "auth/invalid-email": "Please enter a valid email address.",
    "auth/weak-password": "Password must be at least 6 characters.",
    "auth/user-not-found": "No account found with this email.",
    "auth/wrong-password": "Incorrect password. Please try again.",
    "auth/invalid-credential": "Invalid credentials. Please try again.",
    "auth/too-many-requests": "Too many attempts. Please try again later.",
  };
  return map[code] || "Something went wrong. Please try again.";
};

export default function Auth() {
  const navigate = useNavigate();
  const [mode, setMode] = createSignal("signin");
  const [email, setEmail] = createSignal("");
  const [password, setPassword] = createSignal("");
  const [confirmPassword, setConfirmPassword] = createSignal("");
  const [error, setError] = createSignal("");
  const [loading, setLoading] = createSignal(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email() || !password()) {
      setError("Please fill in all fields.");
      return;
    }

    if (mode() === "signup" && password() !== confirmPassword()) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      if (mode() === "signin") {
        await signInWithEmailAndPassword(auth, email(), password());
      } else {
        await createUserWithEmailAndPassword(auth, email(), password());
      }
      navigate("/");
    } catch (err) {
      setError(errorMapping(err.code));
    } finally {
      setLoading(false);
    }
  };

  const switchMode = (newMode) => {
    setMode(newMode);
    setError("");
    setConfirmPassword("");
  };

  return (
    <div class="auth-container">
      <div class="auth-card">
        <div class="text-center mb-6">
          <h1 class="text-3xl font-bold">
            F1 <span class="text-primary">GURU</span>
          </h1>
        </div>

        <div class="auth-tabs">
          <button
            class={`auth-tab ${mode() === "signin" ? "auth-tab-active" : ""}`}
            onClick={() => switchMode("signin")}
          >
            Sign In
          </button>
          <button
            class={`auth-tab ${mode() === "signup" ? "auth-tab-active" : ""}`}
            onClick={() => switchMode("signup")}
          >
            Sign Up
          </button>
        </div>

        <Show when={error()}>
          <div class="auth-error mb-4">{error()}</div>
        </Show>

        <form onSubmit={handleSubmit} class="flex flex-col gap-4">
          <div>
            <label class="block text-xs font-semibold text-gray-400 mb-1.5 ml-1">
              EMAIL
            </label>
            <input
              id="auth-email"
              type="email"
              class="auth-input"
              placeholder="you@example.com"
              value={email()}
              onInput={(e) => setEmail(e.target.value)}
              autocomplete="email"
            />
          </div>

          <div>
            <label class="block text-xs font-semibold text-gray-400 mb-1.5 ml-1">
              PASSWORD
            </label>
            <input
              id="auth-password"
              type="password"
              class="auth-input"
              placeholder="••••••••"
              value={password()}
              onInput={(e) => setPassword(e.target.value)}
              autocomplete={mode() === "signin" ? "current-password" : "new-password"}
            />
          </div>

          <Show when={mode() === "signup"}>
            <div>
              <label class="block text-xs font-semibold text-gray-400 mb-1.5 ml-1">
                CONFIRM PASSWORD
              </label>
              <input
                id="auth-confirm-password"
                type="password"
                class="auth-input"
                placeholder="••••••••"
                value={confirmPassword()}
                onInput={(e) => setConfirmPassword(e.target.value)}
                autocomplete="new-password"
              />
            </div>
          </Show>

          <button
            id="auth-submit"
            type="submit"
            class="auth-btn mt-2"
            disabled={loading()}
          >
            {loading()
              ? "Loading..."
              : mode() === "signin"
                ? "Sign In"
                : "Create Account"}
          </button>
        </form>
      </div>
    </div>
  );
}