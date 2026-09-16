"use client";

import {
  SelectDropdown,
  type SelectOption,
  type SelectDropdownProps,
} from "./SelectDropdown";

export type FilterSelectOption = SelectOption;

export interface FilterSelectProps
  extends Omit<SelectDropdownProps<string>, "size" | "labelStyle"> {
  size?: "sm" | "md";
  labelStyle?: "uppercase" | "standard";
}

export function FilterSelect({
  size = "sm",
  labelStyle = "uppercase",
  ...props
}: FilterSelectProps) {
  return <SelectDropdown size={size} labelStyle={labelStyle} {...props} />;
}
