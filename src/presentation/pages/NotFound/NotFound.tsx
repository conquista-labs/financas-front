import { useNavigate } from "react-router-dom";

import { Button } from "@/presentation/components";
import { urlRouters } from "@/presentation/router/router.definitions";

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate(urlRouters.root);
  };

  return (
    <div className="flex h-dvh flex-col items-center justify-center px-6 text-center">
      <p className="font-display text-[72px] font-bold leading-none text-primary">
        404
      </p>
      <h1 className="mt-4 text-lg font-bold text-primary">
        Desculpe, não conseguimos encontrar essa página.
      </h1>
      <p className="mt-2 max-w-md text-muted">
        A página que você procura não existe ou foi movida para outro endereço!
      </p>
      <Button className="mt-6" onClick={handleGoHome}>
        Voltar à página inicial
      </Button>
    </div>
  );
};

export default NotFound;
