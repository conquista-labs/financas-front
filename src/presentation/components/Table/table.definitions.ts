import type { ColumnsDefinition, Column } from "./table.types";

export class ColumnsDefinitions<T> implements ColumnsDefinition<T> {
  private columns: Column<T>[] = [];

  setColum(
    label: string,
    field: keyof T,
    options?: Column<T>["options"],
  ): ColumnsDefinition<T> {
    this.columns.push({ label, field, options });
    return this;
  }

  getColumns(): Column<T>[] {
    return this.columns;
  }
}
