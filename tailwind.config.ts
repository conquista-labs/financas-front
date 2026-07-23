import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";

/**
 * Fundação visual "Nossa Grana" (rebrand).
 * Tokens em CSS vars (RGB channels) definidos em
 * src/presentation/assets/styles/tailwind.css, com variante dark via
 * [data-theme="dark"] / .dark na <html>. Convive com o RarUI (prefixo
 * --rarui-*) durante a migração progressiva.
 */
export default {
  darkMode: ["class", '[data-theme="dark"]'],
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      screens: {
        /* Breakpoint do shell: desktop a partir de 900px, mobile abaixo
           (conforme o guia da Etapa 1). Sobrescreve o lg padrão (1024px). */
        lg: "900px",
      },
      colors: {
        bg: "rgb(var(--bg) / <alpha-value>)",
        card: {
          DEFAULT: "rgb(var(--card) / <alpha-value>)",
          foreground: "rgb(var(--card-foreground) / <alpha-value>)",
        },
        card2: "rgb(var(--card2) / <alpha-value>)",
        line: "rgb(var(--line) / <alpha-value>)",
        line2: "rgb(var(--line2) / <alpha-value>)",
        track: "rgb(var(--track) / <alpha-value>)",
        fg: "rgb(var(--fg) / <alpha-value>)",
        fg2: "rgb(var(--fg2) / <alpha-value>)",
        muted: {
          DEFAULT: "rgb(var(--muted) / <alpha-value>)",
          foreground: "rgb(var(--muted-foreground) / <alpha-value>)",
        },
        primary: {
          DEFAULT: "rgb(var(--primary) / <alpha-value>)",
          foreground: "rgb(var(--primary-foreground) / <alpha-value>)",
          strong: "rgb(var(--primary-strong) / <alpha-value>)",
          soft: "rgb(var(--accent-soft) / <alpha-value>)",
        },
        success: "rgb(var(--success) / <alpha-value>)",
        danger: "rgb(var(--danger) / <alpha-value>)",
        warning: "rgb(var(--warning) / <alpha-value>)",
        star: "rgb(var(--star) / <alpha-value>)",

        /* Nomes do shadcn (ponte de tokens — ver tailwind.css) */
        background: "rgb(var(--background) / <alpha-value>)",
        foreground: "rgb(var(--foreground) / <alpha-value>)",
        popover: {
          DEFAULT: "rgb(var(--popover) / <alpha-value>)",
          foreground: "rgb(var(--popover-foreground) / <alpha-value>)",
        },
        secondary: {
          DEFAULT: "rgb(var(--secondary) / <alpha-value>)",
          foreground: "rgb(var(--secondary-foreground) / <alpha-value>)",
        },
        accent: {
          DEFAULT: "rgb(var(--accent) / <alpha-value>)",
          foreground: "rgb(var(--accent-foreground) / <alpha-value>)",
        },
        destructive: {
          DEFAULT: "rgb(var(--destructive) / <alpha-value>)",
          foreground: "rgb(var(--destructive-foreground) / <alpha-value>)",
        },
        border: "rgb(var(--border) / <alpha-value>)",
        input: "rgb(var(--input) / <alpha-value>)",
        ring: "rgb(var(--ring) / <alpha-value>)",
      },
      fontFamily: {
        sans: ["Outfit", "sans-serif"],
        display: ["Space Grotesk", "sans-serif"],
      },
      borderRadius: {
        card: "20px",
        hero: "22px",
        btn: "13px",
        pill: "9999px",
      },
      boxShadow: {
        primary: "0 10px 22px -12px rgb(91 75 224 / .9)",
        hero: "0 20px 40px -22px rgb(43 35 80 / .7)",
        modal: "0 20px 50px -12px rgb(0 0 0 / .4)",
      },
      keyframes: {
        "om-fade": {
          from: { opacity: "0", transform: "translateY(4px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "om-pop": {
          from: { opacity: "0", transform: "scale(.96)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
        "om-rise": {
          from: { opacity: "0", transform: "translateY(8px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "om-toast": {
          from: { opacity: "0", transform: "translateY(12px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "om-float": {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
        "om-floatb": {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(6px)" },
        },
        "om-spin": {
          to: { transform: "rotate(360deg)" },
        },
        "om-shimmer": {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        },
      },
      animation: {
        "om-fade": "om-fade .3s ease",
        "om-pop": "om-pop .25s ease",
        "om-rise": "om-rise .3s ease",
        "om-toast": "om-toast .3s ease",
        "om-float": "om-float 6s ease-in-out infinite",
        "om-floatb": "om-floatb 7s ease-in-out infinite",
        "om-spin": "om-spin 1s linear infinite",
        "om-shimmer": "om-shimmer 1.3s ease-in-out infinite",
      },
    },
  },
  plugins: [animate],
} satisfies Config;
