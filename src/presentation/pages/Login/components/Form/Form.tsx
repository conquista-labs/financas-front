import { useNavigate } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import {
  Box,
  Icon,
  Button,
  Text,
  Input as RaruiInput,
} from "@rarui-react/components";
import { useToast } from "@rarui-react/components/dist/Toast";
import { MailOutlinedIcon, ArrowLineRightIcon } from "@rarui/icons";

import { urlRouters } from "@/presentation/router/router.definitions";
import { usePostAuth } from "@/presentation/hooks/api";
import { useAuthStore } from "@/presentation/store";
import { Input } from "@/presentation/components";
import { PostLoginRequest } from "@/domain/usecases";
import { defaultValues, schema } from "./form.definitions";

const Form: React.FC = () => {
  const { setAuth } = useAuthStore();
  const { mutate, isPending } = usePostAuth();
  const { addToast } = useToast();

  const navigate = useNavigate();

  const { handleSubmit, control } = useForm<PostLoginRequest>({
    resolver: yupResolver(schema),
    values: defaultValues,
    mode: "onChange",
  });

  const handleLogin = (data: PostLoginRequest) => {
    mutate(data, {
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
    });
  };

  return (
    <Box
      as="form"
      onSubmit={handleSubmit(handleLogin)}
      display="flex"
      flexDirection="column"
      gap="$s"
    >
      <Input
        label="E-mail"
        name="email"
        id="email"
        placeholder="Digite seu endereço de e-mail"
        control={control}
        divider={false}
        leadingEnd={
          <Icon
            color="$currentColor"
            source={<MailOutlinedIcon size="medium" />}
          />
        }
      />
      <Input
        label="Senha"
        name="password"
        id="password"
        placeholder="Digite sua senha"
        control={control}
        divider={false}
        children={RaruiInput.Password}
      />
      <Button
        type="submit"
        full
        appearance="brand"
        size="large"
        disabled={isPending}
      >
        Vamos lá
        <Icon
          color="$currentColor"
          source={<ArrowLineRightIcon size="medium" />}
        />
      </Button>

      <Text fontSize="$xs" textAlign="center" color="$secondary">
        Versão: 1.0.0
      </Text>
    </Box>
  );
};

export default Form;
