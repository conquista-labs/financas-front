import { urlRouters } from "@/presentation/router/router.definitions";
import {
  MailOutlinedIcon,
  HomeFilledIcon,
  ContentPasteOutlinedIcon,
  UsersFilledIcon,
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
    link: "/pessoas",
    icon: <UsersFilledIcon size="medium" height={18} width={18} />,
  },
  {
    id: 3,
    title: "Comissão",
    link: "/comissao",
    icon: <MailOutlinedIcon size="medium" height={18} width={18} />,
  },
  {
    id: 4,
    title: "Cadastro",
    link: "/cadastro",
    icon: <ContentPasteOutlinedIcon size="medium" height={18} width={18} />,
  },
];
