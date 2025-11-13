import { useNavigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import { Box, Button, Text } from "@rarui-react/components";
import { useToast } from "@rarui-react/components/dist/Toast";

import { urlRouters } from "@/presentation/router/router.definitions";
import { usePostLoginWithGoogle } from "@/presentation/hooks/api";
import { useAuthStore } from "@/presentation/store";
import { Loading } from "@/presentation/components";

const Form: React.FC = () => {
  const { setAuth } = useAuthStore();
  const { mutate, isPending } = usePostLoginWithGoogle();
  const { addToast } = useToast();

  const navigate = useNavigate();

  const login = useGoogleLogin({
    flow: "auth-code",
    onSuccess: (credentialResponse) => {
      mutate(
        {
          code: credentialResponse.code,
        },
        {
          onSuccess: (response) => {
            setAuth(response.data);
            navigate(urlRouters.root);
          },
          onError: (error) => {
            addToast({
              title: error.message,
              appearance: "error",
              variant: "solid",
              duration: 4000,
            });
          },
        },
      );
    },
  });

  return (
    <Box display="flex" flexDirection="column" gap="$s">
      <Button full onClick={() => login()}>
        Entrar com o Google 🚀
      </Button>
      <Text fontSize="$s" textAlign="center" color="$secondary">
        Versão: 1.0.0
      </Text>
      <Loading isLoading={isPending} />
    </Box>
  );
};

export default Form;
