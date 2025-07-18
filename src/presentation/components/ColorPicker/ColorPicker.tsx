import React from "react";
import { useController } from "react-hook-form";
import {
  Box,
  Text,
  Label,
  ColorPicker as RaruiColorPicker,
} from "@rarui-react/components";

import { type ColorPickerProps } from "./colorPicker.types";

const ColorPicker: React.FC<ColorPickerProps> = ({ label, name, control }) => {
  const {
    field,
    fieldState: { error },
  } = useController({
    name,
    control,
  });

  return (
    <Box display="flex" flexDirection="column" gap="$3xs">
      <Label>{label}</Label>
      <RaruiColorPicker
        value={field.value}
        onChange={(cor) => field.onChange(cor.hex)}
      />
      {error?.message && (
        <Text fontSize="$xs" color="$error">
          {error?.message}
        </Text>
      )}
    </Box>
  );
};

export default ColorPicker;
