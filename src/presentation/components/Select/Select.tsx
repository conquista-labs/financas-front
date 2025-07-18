import React from "react";
import { useController } from "react-hook-form";
import {
  Box,
  Text,
  Label,
  Select as RaruiSelect,
} from "@rarui-react/components";

import { type SelectProps } from "./select.types.ts";

const Select: React.FC<SelectProps> = ({
  label,
  id,
  name,
  control,
  options,
  ...props
}) => {
  const {
    field,
    fieldState: { error },
  } = useController({
    name,
    control,
  });

  const value = options.find((option) => option.value === field.value);

  return (
    <Box display="flex" flexDirection="column" gap="$3xs" width="100%">
      <Label htmlFor={id}>{label}</Label>
      <RaruiSelect
        value={value}
        options={options}
        onChange={(option: any) => {
          field.onChange(option?.[0]?.value);
        }}
        {...props}
      />
      {error?.message && (
        <Text fontSize="$xs" color="$error">
          {error?.message}
        </Text>
      )}
    </Box>
  );
};

export default Select;
