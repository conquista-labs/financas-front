import type { ColorPickerProps as RaruiColorPickerProps } from "@rarui-react/components";

export interface ColorPickerProps
  extends Omit<RaruiColorPickerProps, "onChange"> {
  name: string;
  control: any;
  label?: string;
}
