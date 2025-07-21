import React from "react";
import { useController } from "react-hook-form";
import {
  Box,
  Text,
  Label,
  Textarea as RaruiTextarea,
} from "@rarui-react/components";

import { type DatepickerProps } from "./textarea.types.ts";

const Textarea: React.FC<DatepickerProps> = ({
  label,
  id,
  name,
  control,
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
    <Box display="flex" flexDirection="column" gap="$3xs" width="100%">
      <Label htmlFor={id}>{label}</Label>
      <RaruiTextarea {...field} {...props} />
      {error?.message && (
        <Text fontSize="$xs" color="$error">
          {error?.message}
        </Text>
      )}
    </Box>
  );
};

export default Textarea;
