import React from "react"; // useEffect
import { useController } from "react-hook-form";
import { Box, Text, Label, Input as RaruiInput } from "@rarui-react/components";
import { useMask } from "@react-input/mask";
import { type InputProps } from "./inputCurrency.types";
// import { formatCurrency } from "./inputCurrency.definitions";

const InputCurrency: React.FC<InputProps> = ({
  label,
  id,
  name,
  control,
  ...props
}) => {
  const {
    field: {
      value,
      // onChange,
      onBlur,
    },
    fieldState: { error },
  } = useController({
    name,
    control,
  });

  // Máscara de moeda: permite apenas números e formata como R$ 1.234,56
  const inputRef = useMask({
    mask: "__.___,__",
    replacement: { _: /\d/ },
    showMask: false,
  });

  // useEffect(() => {
  //   if (value) {
  //     onChange(inputRef.current.value);
  //   }
  // }, []);

  // Quando o valor do formulário muda, atualiza o input
  // useEffect(() => {
  //   if (inputRef.current && value !== undefined && value !== null) {
  //     inputRef.current.value = formatCurrency(value);
  //   }
  // }, [value]);

  const handleChange = () =>
    // e: React.ChangeEvent<HTMLInputElement>
    {
      // onChange(e.target.value);
    };

  return (
    <Box display="flex" flexDirection="column" gap="$3xs" width="100%">
      <Label htmlFor={id}>{label}</Label>
      <RaruiInput
        id={id}
        ref={inputRef}
        value={value ?? ""}
        onChange={handleChange}
        onBlur={onBlur}
        appearance={error?.message ? "error" : undefined}
        {...props}
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
