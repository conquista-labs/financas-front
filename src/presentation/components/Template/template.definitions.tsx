import { urlRouters } from "@/presentation/router/router.definitions";
import {
  FolderListFilledIcon,
  HomeFilledIcon,
  UsersFilledIcon,
  CreditCardOutlinedIcon,
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
    title: "Pessoas",
    link: urlRouters.peoples,
    icon: <UsersFilledIcon size="medium" height={18} width={18} />,
  },
  {
    id: 3,
    title: "Categorias",
    link: urlRouters.categories,
    icon: <FolderListFilledIcon size="medium" height={18} width={18} />,
  },
  {
    id: 4,
    title: "Meios de pagamento",
    link: urlRouters.meansOfPayment,
    icon: <CreditCardOutlinedIcon size="medium" height={18} width={18} />,
  },
];
