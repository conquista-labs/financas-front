import { useGoogleLogin } from "@react-oauth/google";
import { Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import Logo from "@/presentation/assets/images/logo.svg?react";
import { usePostLoginWithGoogle } from "@/presentation/hooks/api";
import { urlRouters } from "@/presentation/router/router.definitions";
import { useAuthStore } from "@/presentation/store";

/**
 * Cartão de login (painel direito) da nova identidade "Nossa Grana".
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
    <div className="relative flex flex-1 flex-col items-center justify-center overflow-hidden p-10">
      {/* brilhos radiais roxos de fundo */}
      <div className="pointer-events-none absolute -right-[100px] -top-[120px] size-[360px] rounded-full bg-[radial-gradient(circle,rgba(91,75,224,0.16),transparent_70%)]" />
      <div className="pointer-events-none absolute -bottom-[140px] -left-[90px] size-[340px] rounded-full bg-[radial-gradient(circle,rgba(155,123,234,0.14),transparent_70%)]" />

      <div className="relative w-full max-w-[380px] animate-om-rise rounded-[26px] border border-line bg-card p-9 shadow-[0_30px_70px_-30px_rgba(43,35,80,0.25)]">
        <div className="mb-[30px] flex justify-center text-primary-strong">
          <Logo height={38} />
        </div>

        <h1 className="mb-2 text-center font-display text-[27px] font-bold -tracking-[0.02em] text-fg">
          Bem-vindos de volta! 👋
        </h1>
        <p className="mb-[30px] text-center text-[14.5px] leading-relaxed text-fg2">
          Entre para gerenciar seus gastos e acompanhar as finanças de vocês.
        </p>

        <button
          type="button"
          onClick={() => login()}
          disabled={isPending}
          className="flex w-full items-center justify-center gap-[11px] rounded-[14px] border-[1.5px] border-line bg-card p-[14px] text-[15px] font-semibold text-fg transition-all hover:border-primary hover:shadow-[0_8px_20px_-12px_rgba(91,75,224,0.5)] disabled:opacity-60"
        >
          <GoogleIcon />
          {isPending ? "Entrando…" : "Entrar com o Google"}
        </button>

        <div className="my-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-line" />
          <span className="text-[11.5px] font-medium text-muted">
            acesso seguro
          </span>
          <div className="h-px flex-1 bg-line" />
        </div>

        <div className="flex items-center justify-center gap-2 text-[12.5px] text-muted">
          <Lock className="size-[14px]" strokeWidth={1.8} />
          Seus dados são privados e só de vocês dois.
        </div>
      </div>

      <p className="relative mt-[22px] text-center text-xs text-muted">
        Nossa Grana · Versão 1.0.0
      </p>
    </div>
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
