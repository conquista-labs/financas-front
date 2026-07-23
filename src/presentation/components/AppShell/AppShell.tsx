import { QuickAddModal, QuickAddProvider } from "../QuickAdd";
import { MobileTabBar } from "./Mobile/MobileTabBar";
import { MobileTopBar } from "./Mobile/MobileTopBar";
import { Sidebar } from "./Sidebar/Sidebar";
import { SidebarProvider } from "./useSidebar";

/**
 * Layout raiz da nova identidade "Nossa Grana".
 * Desktop (>=900px): Sidebar recolhível sticky + área de conteúdo.
 * Mobile (<900px): Sidebar oculta; top bar sticky + bottom tab bar fixa.
 * O modal de Lançamento Rápido vive aqui (QuickAddProvider), acessível de
 * qualquer gatilho (Lançar da sidebar, FAB mobile, botão Nova das telas).
 */
export const AppShell = ({ children }: { children: React.ReactNode }) => {
  return (
    <QuickAddProvider>
      <SidebarProvider>
        <div className="flex min-h-dvh bg-bg text-fg">
          <Sidebar />
          <div className="flex min-w-0 flex-1 flex-col">
            <MobileTopBar />
            <main className="min-w-0 flex-1">
              {/* Fluido com teto alto: usa o espaço ao lado da sidebar em telas
                  grandes (até 1400px) em vez de espremer o conteúdo, com padding
                  lateral generoso para respiro nos dois extremos. pb no mobile
                  reserva espaço para a bottom tab bar fixa. */}
              <div className="mx-auto w-full max-w-[1400px] px-6 pb-28 pt-2 lg:px-10 lg:py-8">
                {children}
              </div>
            </main>
          </div>
          <MobileTabBar />
        </div>
      </SidebarProvider>
      <QuickAddModal />
    </QuickAddProvider>
  );
};
