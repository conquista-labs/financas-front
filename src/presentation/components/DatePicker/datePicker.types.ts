import type { DatepickerProps as RaruiDatepickerProps } from "@rarui-react/components";

export interface DatepickerProps
  extends Omit<RaruiDatepickerProps, "onChange"> {
  name: string;
  control: any;
  label?: string;
}
