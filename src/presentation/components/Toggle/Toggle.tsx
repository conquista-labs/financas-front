import React from "react";
import { useController } from "react-hook-form";
import { Box, Text, Toggle as RaruiToggle } from "@rarui-react/components";

import { type ToggleProps } from "./toggle.types";

const Toggle: React.FC<ToggleProps> = ({ id, name, control, ...props }) => {
  const {
    field,
    fieldState: { error },
  } = useController({
    name,
    control,
  });

  return (
    <Box display="flex" flexDirection="column" gap="$3xs">
      <RaruiToggle id={id} {...props} checked={field.value} {...field} />
      {error?.message && (
        <Text fontSize="$s" color="$error">
          {error?.message}
        </Text>
      )}
    </Box>
  );
};

export default Toggle;
