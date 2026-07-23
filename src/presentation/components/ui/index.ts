/**
 * Kits compostos do shadcn/ui (nova identidade "Nossa Grana").
 *
 * A organização dos componentes shadcn segue a COMPLEXIDADE, não a origem:
 *
 * - **Peça única** (Button, Avatar, Separator, Toaster): tem 1 export principal.
 *   Foi convertida para o padrão do projeto (pasta PascalCase) e é importada
 *   de lá, NÃO daqui — ex.: import { Button } from "@/presentation/components".
 *
 * - **Kit composto** (Dialog, Sheet, DropdownMenu, Tooltip): não é "um"
 *   componente, e sim uma família de 10-15 sub-componentes montados juntos
 *   (<Dialog><DialogTrigger/><DialogContent/>...). Forçar isso em "1 pasta =
 *   1 componente" seria artificial, então fica como arquivo único aqui.
 *   Importe direto:  import { Dialog, DialogContent, ... } from "@/presentation/components/ui";
 *
 * (Como os componentes atuais são todos autônomos — nenhum importa outro de
 * ui/ — o padrão de pasta deles não afeta o `shadcn add`.)
 */
export { Calendar } from "./calendar";
export {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "./command";
export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
} from "./dialog";
export {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "./dropdown-menu";
export {
  Popover,
  PopoverAnchor,
  PopoverContent,
  PopoverTrigger,
} from "./popover";
export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "./select";
export {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetOverlay,
  SheetPortal,
  SheetTitle,
  SheetTrigger,
} from "./sheet";
export { Skeleton } from "./skeleton";
export { Switch } from "./switch";
export { Textarea } from "./textarea";
export {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./tooltip";
