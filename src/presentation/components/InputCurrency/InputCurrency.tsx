import React from "react";
import { useController } from "react-hook-form";
import { Box, Text, Label, Input as RaruiInput } from "@rarui-react/components";
import { NumericFormat } from "react-number-format";
import { type InputProps } from "./inputCurrency.types";

const InputCurrency: React.FC<InputProps> = ({
  label,
  id,
  name,
  control,
  ...props
}) => {
  const {
    field: { value, onChange },
    fieldState: { error },
  } = useController({
    name,
    control,
  });

  return (
    <Box display="flex" flexDirection="column" gap="$3xs" width="100%">
      <Label htmlFor={id}>{label}</Label>
      <NumericFormat
        thousandSeparator="."
        decimalSeparator=","
        decimalScale={2}
        fixedDecimalScale
        allowNegative={false}
        onValueChange={(values) => {
          onChange(values.floatValue);
        }}
        value={value}
        customInput={RaruiInput}
        {...(props as any)}
      />

      {error?.message && (
        <Text fontSize="$s" color="$error">
          {error.message}
        </Text>
      )}
    </Box>
  );
};

export default InputCurrency;
