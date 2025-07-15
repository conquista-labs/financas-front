import React from "react";
import { useController } from "react-hook-form";
import { Box, Text, Label, Input as RaruiInput } from "@rarui-react/components";

import { type InputProps } from "./input.types";

const Input: React.FC<InputProps> = ({
  label,
  id,
  name,
  control,
  children: CustomComponent,
  ...props
}) => {
  const {
    field,
    fieldState: { error },
  } = useController({
    name,
    control,
  });

  return (
    <Box display="flex" flexDirection="column" gap="$3xs">
      <Label htmlFor={id}>{label}</Label>
      {CustomComponent ? (
        <CustomComponent
          id={id}
          appearance={error?.message ? "error" : undefined}
          {...props}
          {...field}
        />
      ) : (
        <RaruiInput
          id={id}
          appearance={error?.message ? "error" : undefined}
          {...props}
          {...field}
        />
      )}
      {error?.message && (
        <Text fontSize="$xs" color="$error">
          {error?.message}
        </Text>
      )}
    </Box>
  );
};

export default Input;
