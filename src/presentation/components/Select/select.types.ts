import type { SelectProps as RaruiSelectProps } from "@rarui-react/components";

export interface SelectProps extends RaruiSelectProps {
  name: string;
  control: any;
  label?: string;
  filterOptions?: boolean;
}
