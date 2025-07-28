import React from "react";

import { Box, Title, Text, Button, Icon } from "@rarui-react/components";
import { RefreshIcon } from "@rarui/icons";
import { getLastUpdate } from "./header.definitions";

const Header: React.FC<{
  nome: string;
  atualizadoEm?: string;
  onAtualizar: () => void;
}> = ({
  nome,
  atualizadoEm,
  onAtualizar,
}: {
  nome: string;
  atualizadoEm?: string;
  onAtualizar: () => void;
}) => (
  <Box display="flex" justifyContent="space-between" alignItems="center">
    <Title as="h4" color="$secondary" fontWeight="$bold">
      Olá, {nome}
    </Title>
    <Box display="flex" alignItems="center" gap="$2xs">
      <Text fontSize="$s" color="$secondary">
        Última atualização: {atualizadoEm && getLastUpdate(atualizadoEm)}
      </Text>
      <Button size="medium" variant="text" onClick={onAtualizar}>
        <Icon source={<RefreshIcon size="medium" />} />
        Atualizar
      </Button>
    </Box>
  </Box>
);

export default Header;
