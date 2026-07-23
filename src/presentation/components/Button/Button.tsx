/**
 * Button da nova identidade "Nossa Grana".
 * Wrapper no padrão do projeto (pasta PascalCase + index) sobre o primitivo
 * shadcn cru em ../ui/button. A app consome sempre daqui; o primitivo em ui/
 * fica intocado para o `shadcn add` continuar funcionando sem retrabalho.
 */
export type { ButtonProps } from "../ui/button";
export { Button, buttonVariants } from "../ui/button";
