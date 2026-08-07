"use client";

import { useActionState } from "react";
import { loginAction, type LoginState } from "./actions";

const initialState: LoginState = {};

export function LoginForm() {
  const [state, action, pending] = useActionState(loginAction, initialState);

  return (
    <form action={action} className="mt-8 space-y-5">
      <div>
        <label htmlFor="email" className="text-navy text-sm font-bold">Email address</label>
        <input id="email" name="email" type="email" autoComplete="email" required className="border-line mt-2 w-full rounded-md border bg-white px-4 py-3" />
      </div>
      <div>
        <label htmlFor="password" className="text-navy text-sm font-bold">Password</label>
        <input id="password" name="password" type="password" autoComplete="current-password" required minLength={8} className="border-line mt-2 w-full rounded-md border bg-white px-4 py-3" />
      </div>
      {state.error && <p role="alert" className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-800">{state.error}</p>}
      <button type="submit" disabled={pending} className="bg-amber text-deep-navy hover:bg-amber-hover w-full rounded-md px-5 py-3 font-bold disabled:cursor-wait disabled:opacity-60">
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
