import { act, fireEvent, screen } from "@testing-library/react";

export const fillForm = (fields: Record<string, string>) => {
  Object.entries(fields).forEach(async ([name, value]) => {
    const input = screen.getByPlaceholderText(new RegExp(name, "i"));
    await act(() => fireEvent.change(input, { target: { value } }));
  });
};
