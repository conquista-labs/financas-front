import { useEffect, useState } from "react";
import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

/**
 * Toaster da nova identidade "Nossa Grana" (sonner).
 * Lê o tema da aplicação diretamente do atributo `data-theme` da <html>
 * (fonte de verdade do tema — ver App.tsx), evitando depender de next-themes
 * (que o projeto não usa) ou acoplar este componente ao contexto do App.
 * Toasts aparecem em bottom-center, com suporte a ação "Desfazer" via
 * `toast(..., { action: { label: "Desfazer", onClick } })`.
 */
const useDomTheme = (): "light" | "dark" => {
  const read = (): "light" | "dark" =>
    typeof document !== "undefined" &&
    document.documentElement.getAttribute("data-theme") === "dark"
      ? "dark"
      : "light";

  const [theme, setTheme] = useState<"light" | "dark">(read);

  useEffect(() => {
    const observer = new MutationObserver(() => setTheme(read()));
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
    return () => observer.disconnect();
  }, []);

  return theme;
};

export const Toaster = ({ ...props }: ToasterProps) => {
  const theme = useDomTheme();

  return (
    <Sonner
      theme={theme}
      className="toaster group"
      position="bottom-center"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
        },
      }}
      {...props}
    />
  );
};
