import type { InputProps as RaruiInputProps } from "@rarui-react/components";

export interface InputProps extends Omit<RaruiInputProps, "children"> {
  name: string;
  control: any;
  label?: string;
  children?: React.ComponentType<RaruiInputProps>;
}
