import type { QRL } from '@builder.io/qwik';

type TableRowId = string | number;

type StringKey<T> = Extract<keyof T, string>;
type PrimitiveValue =
  | string
  | number
  | boolean
  | bigint
  | symbol
  | null
  | undefined
  | Date;

type NestedKey<T extends object> = {
  [K in StringKey<T>]: NonNullable<T[K]> extends
    | PrimitiveValue
    | readonly unknown[]
    ? K
    : NonNullable<T[K]> extends object
      ? K | `${K}.${NestedKey<NonNullable<T[K]>>}`
      : K;
}[StringKey<T>];

type RowIdKey<T extends object> = {
  [K in StringKey<T>]-?: NonNullable<T[K]> extends TableRowId ? K : never;
}[StringKey<T>];

type DataTableColumn<T extends object> = {
  key: NestedKey<T>;
  header: string;
  accessor?: (row: T) => unknown;
  headerClass?: string;
  cellClass?: string;
  align?: 'left' | 'center' | 'right';
};

interface DataTableProps<T extends object> {
  columns: readonly DataTableColumn<T>[];
  rows: readonly T[];

  /**
   * Property used for the Qwik key and row actions.
   * It must contain a string or number.
   */
  rowKey: RowIdKey<T>;

  selectedRowIds?: readonly TableRowId[];

  onRowSelectionChange$?: QRL<(rowId: TableRowId, selected: boolean) => void>;

  onSelectAll$?: QRL<(selected: boolean) => void>;

  onEditRow$?: QRL<(rowId: TableRowId) => void>;
  onDeleteRow$?: QRL<(rowId: TableRowId) => void>;

  emptyMessage?: string;
}

export {
  DataTableProps,
  DataTableColumn,
  NestedKey,
  RowIdKey,
  StringKey,
  TableRowId,
};
