import { ImplementDataTable } from './create-table';
import type { DataTableProps, DataTableColumn } from './types';
import type { Component } from '@builder.io/qwik';

const createDataTable = <T extends object>(): Component<DataTableProps<T>> =>
  ImplementDataTable as unknown as Component<DataTableProps<T>>;

export { createDataTable, type DataTableProps, type DataTableColumn };
