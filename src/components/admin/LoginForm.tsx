"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";

export function LoginForm() {
  const router = useRouter();
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);

    if (error) {
      setError("Correo o contraseña incorrectos.");
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <label className="flex flex-col gap-1 text-sm font-medium text-novva-gray">
        Correo electrónico
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="rounded-xl border border-novva-white/15 bg-novva-black px-4 py-3 text-novva-white outline-none transition-colors focus:border-novva-purple"
          placeholder="tu@correo.com"
          autoComplete="email"
        />
      </label>

      <label className="flex flex-col gap-1 text-sm font-medium text-novva-gray">
        Contraseña
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="rounded-xl border border-novva-white/15 bg-novva-black px-4 py-3 text-novva-white outline-none transition-colors focus:border-novva-purple"
          placeholder="••••••••"
          autoComplete="current-password"
        />
      </label>

      {error && (
        <p className="rounded-xl bg-novva-pink/10 px-4 py-2.5 text-sm text-novva-pink">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="mt-2 rounded-full bg-novva-purple px-6 py-3 text-sm font-bold text-novva-black transition-all hover:bg-novva-pink disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? "Ingresando…" : "Ingresar"}
      </button>
    </form>
  );
}
