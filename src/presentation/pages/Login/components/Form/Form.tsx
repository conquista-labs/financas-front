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

import { useAuth } from "@/presentation/hooks/api";
import { useAuthStore } from "@/presentation/store";

import { urlRouters } from "@/presentation/router";
import { Input } from "@/presentation/components";

import { defaultValues, schema } from "./form.definitions";
import type { LoginDto } from "@/domain/models";
const Form: React.FC = () => {
  const { setAuth } = useAuthStore();
  const { mutate } = useAuth();
  const { addToast } = useToast();

  const navigate = useNavigate();

  const { handleSubmit, control } = useForm<LoginDto>({
    resolver: yupResolver(schema),
    values: defaultValues,
    mode: "onChange",
  });

  const handleLogin = (data: LoginDto) => {
    console.log("data", data);
    mutate(data, {
      onSuccess: (response) => {
        setAuth(response);
        navigate(urlRouters.root);
      },
      onError: (error) => {
        console.log(error);
        addToast({
          title: error.message,
          appearance: "error",
          variant: "solid",
          duration: 4000,
        });
      },
    });
    // setAuth(fakeResponse);
    // navigate(urlRouters.fund.listing);
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
        // disabled={isPending}
      >
        <Text fontSize="$m" color="$on-brand">
          Fazer login
          {/* {isPending ? "•︎•︎•︎" : "Fazer login"} */}
        </Text>
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
