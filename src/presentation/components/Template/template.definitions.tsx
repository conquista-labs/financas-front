import { urlRouters } from "@/presentation/router/router.definitions";
import {
  FolderListFilledIcon,
  HomeFilledIcon,
  UsersFilledIcon,
  CreditCardOutlinedIcon,
  MoneyFilledIcon,
  CalendarEventFilledIcon,
} from "@rarui/icons";

export const MENUS = [
  {
    id: 1,
    title: "Início",
    link: urlRouters.root,
    icon: <HomeFilledIcon size="medium" height={18} width={18} />,
  },
  {
    id: 2,
    title: "Transações",
    link: urlRouters.transactions,
    icon: <MoneyFilledIcon size="medium" height={18} width={18} />,
  },
  {
    id: 3,
    title: "Calendario",
    link: urlRouters.calendar,
    icon: <CalendarEventFilledIcon size="medium" height={18} width={18} />,
  },
  {
    id: 4,
    title: "Pessoas",
    link: urlRouters.peoples,
    icon: <UsersFilledIcon size="medium" height={18} width={18} />,
  },
  {
    id: 5,
    title: "Categorias",
    link: urlRouters.categories,
    icon: <FolderListFilledIcon size="medium" height={18} width={18} />,
  },
  {
    id: 6,
    title: "Meios de pagamento",
    link: urlRouters.meansOfPayment,
    icon: <CreditCardOutlinedIcon size="medium" height={18} width={18} />,
  },
];
