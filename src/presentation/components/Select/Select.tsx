import React, { useState } from "react";
import { useController } from "react-hook-form";
import {
  Box,
  Text,
  Label,
  Divider,
  Icon,
  Input,
  Select as RaruiSelect,
} from "@rarui-react/components";

import { type SelectProps } from "./select.types.ts";
import { SearchIcon } from "@rarui/icons";

const Select: React.FC<SelectProps> = ({
  label,
  id,
  name,
  control,
  options,
  filterOptions = true,
  ...props
}) => {
  const {
    field,
    fieldState: { error },
  } = useController({
    name,
    control,
  });

  const [filter, setFilter] = useState("");

  const value = options.find((option) => option.value === field.value);

  return (
    <Box display="flex" flexDirection="column" gap="$3xs" width="100%">
      <Label htmlFor={id}>{label}</Label>
      <RaruiSelect
        value={value ?? []}
        options={options.filter((option) =>
          option.label.toLowerCase().includes(filter.toLowerCase()),
        )}
        onChange={(option: any) => {
          field.onChange(option?.[0]?.value);
        }}
        {...props}
      >
        {filterOptions && (
          <Box
            display="flex"
            flexDirection="column"
            gap="$4xs"
            paddingRight="$xs"
          >
            <Input
              size="small"
              divider={false}
              border={false}
              leadingStart={
                <Icon
                  color="$currentColor"
                  source={<SearchIcon size="small" />}
                />
              }
              onChange={(event) => setFilter(event.target.value)}
              value={filter}
            />
            <Divider thickness="$2" color="$secondary" />
          </Box>
        )}
      </RaruiSelect>
      {error?.message && (
        <Text fontSize="$s" color="$error">
          {error?.message}
        </Text>
      )}
    </Box>
  );
};

export default Select;
