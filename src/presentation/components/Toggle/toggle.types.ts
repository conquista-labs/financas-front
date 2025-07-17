import type { ToggleProps as RaruiToggleProps } from "@rarui-react/components";

export interface ToggleProps extends Omit<RaruiToggleProps, "children"> {
  name: string;
  control: any;
  label?: string;
}
