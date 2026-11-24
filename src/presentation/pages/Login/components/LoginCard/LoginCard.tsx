import { useGoogleLogin } from "@react-oauth/google";
import { Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { usePostLoginWithGoogle } from "@/presentation/hooks/api";
import { urlRouters } from "@/presentation/router/router.definitions";
import { useAuthStore } from "@/presentation/store";

/**
 * Coluna de login (painel direito) no layout Repaginado.
 * A lógica de autenticação (Google OAuth auth-code → usePostLoginWithGoogle →
 * setAuth → navigate) é preservada da versão anterior; só a apresentação muda.
 */
export const LoginCard = () => {
  const { setAuth } = useAuthStore();
  const { mutate, isPending } = usePostLoginWithGoogle();
  const navigate = useNavigate();

  const login = useGoogleLogin({
    flow: "auth-code",
    scope: [
      "openid",
      "profile",
      "email",
      "https://www.googleapis.com/auth/calendar",
    ].join(" "),
    onSuccess: (credentialResponse) => {
      mutate(
        { code: credentialResponse.code },
        {
          onSuccess: (response) => {
            setAuth(response.data);
            navigate(urlRouters.root);
          },
          onError: (error) => toast.error(error.message),
        },
      );
    },
  });

  return (
    <section className="flex min-w-0 flex-1 flex-col items-center justify-center gap-[22px] px-6 py-12">
      <div className="flex w-full max-w-[380px] animate-om-rise flex-col gap-[22px]">
        {/* no celular o painel de marca some: a marca vem para o topo */}
        <div className="flex items-center gap-[10px] min-[860px]:hidden">
          <div className="grid size-[34px] place-items-center rounded-[11px] bg-primary font-display text-base font-bold text-white">
            N
          </div>
          <span className="font-display text-lg font-bold text-fg">
            Nossa Grana
          </span>
        </div>

        <div>
          <h1 className="font-display text-[32px] font-bold -tracking-[0.03em] text-fg">
            Bem-vindos de volta
          </h1>
          <p className="mt-2 text-[15.5px] leading-normal text-fg2">
            Entre para ver como estão as finanças de vocês.
          </p>
        </div>

        <button
          type="button"
          onClick={() => login()}
          disabled={isPending}
          className="flex h-14 w-full items-center justify-center gap-3 rounded-[16px] border border-line bg-card text-[15.5px] font-semibold text-fg shadow-[0_8px_20px_-14px_rgba(23,22,27,0.4)] transition-colors hover:border-primary disabled:opacity-60"
        >
          {isPending ? (
            <span
              aria-hidden="true"
              className="size-4 animate-om-spin rounded-full border-2 border-line border-t-primary"
            />
          ) : (
            <GoogleIcon />
          )}
          {isPending ? "Entrando…" : "Entrar com Google"}
        </button>

        <div className="flex items-start gap-3 rounded-[16px] border border-line bg-card px-4 py-[14px]">
          <Lock
            className="mt-0.5 size-[18px] shrink-0 text-primary-strong"
            strokeWidth={2}
          />
          <p className="text-[13.5px] leading-[1.45] text-fg2">
            <strong className="font-semibold text-fg">Acesso seguro.</strong>{" "}
            Seus dados são privados e só de vocês dois.
          </p>
        </div>
      </div>

      <p className="text-[12.5px] text-muted">Nossa Grana · Versão 1.0.0</p>
    </section>
  );
};

/** Ícone do Google com as 4 cores oficiais (do protótipo). */
const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
    <path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1Z"
      fill="#4285F4"
    />
    <path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23Z"
      fill="#34A853"
    />
    <path
      d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84Z"
      fill="#FBBC05"
    />
    <path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 0 0 2.18 7.06l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38Z"
      fill="#EA4335"
    />
  </svg>
);
