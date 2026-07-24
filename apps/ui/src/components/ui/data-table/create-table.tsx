import { component$, type QRL } from '@builder.io/qwik';
import type { TableRowId } from './types';
import { alignmentClass, formatCellValue, getValueByPath } from './helpers';

type RuntimeColumn = {
  key: string;
  header: string;
  accessor?: (row: Record<string, unknown>) => unknown;
  headerClass?: string;
  cellClass?: string;
  align?: 'left' | 'center' | 'right';
};

interface RuntimeDataTableProps {
  columns: readonly RuntimeColumn[];
  rows: readonly Record<string, unknown>[];
  rowKey: string;

  selectedRowIds?: readonly TableRowId[];

  onRowSelectionChange$?: QRL<(rowId: TableRowId, selected: boolean) => void>;

  onSelectAll$?: QRL<(selected: boolean) => void>;

  onEditRow$?: QRL<(rowId: TableRowId) => void>;
  onDeleteRow$?: QRL<(rowId: TableRowId) => void>;

  emptyMessage?: string;
}

export const ImplementDataTable = component$<RuntimeDataTableProps>(
  ({
    columns,
    rows,
    rowKey,
    selectedRowIds = [],
    onRowSelectionChange$,
    onSelectAll$,
    onEditRow$,
    onDeleteRow$,
    emptyMessage = 'No records found.',
  }) => {
    const selectedIds = new Set(selectedRowIds);

    const selectable = Boolean(onRowSelectionChange$);
    const hasActions = Boolean(onEditRow$ || onDeleteRow$);

    const allRowsSelected =
      rows.length > 0 &&
      rows.every((row) => selectedIds.has(row[rowKey] as TableRowId));

    const tableColumnCount =
      columns.length + (selectable ? 1 : 0) + (hasActions ? 1 : 0);

    return (
      <div class="overflow-x-auto">
        <table class="table">
          <thead>
            <tr>
              {selectable && (
                <th class="w-12">
                  <input
                    type="checkbox"
                    class="checkbox checkbox-sm"
                    aria-label="Select all rows"
                    checked={allRowsSelected}
                    disabled={!onSelectAll$ || rows.length === 0}
                    onChange$={(_, input) => onSelectAll$?.(input.checked)}
                  />
                </th>
              )}

              {columns.map((column) => (
                <th
                  key={column.key}
                  scope="col"
                  class={[alignmentClass(column.align), column.headerClass]}
                >
                  {column.header}
                </th>
              ))}

              {hasActions && (
                <th scope="col" class="text-right">
                  Actions
                </th>
              )}
            </tr>
          </thead>

          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td
                  colSpan={tableColumnCount}
                  class="py-8 text-center text-base-content/60"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              rows.map((row) => {
                const rowId = row[rowKey] as TableRowId;
                const rowSelected = selectedIds.has(rowId);

                return (
                  <tr
                    key={rowId}
                    class={{
                      'bg-primary/5': rowSelected,
                    }}
                  >
                    {selectable && (
                      <th scope="row">
                        <input
                          type="checkbox"
                          class="checkbox checkbox-sm"
                          aria-label={`Select row ${rowId}`}
                          checked={rowSelected}
                          onChange$={(_, input) =>
                            onRowSelectionChange$?.(rowId, input.checked)
                          }
                        />
                      </th>
                    )}

                    {columns.map((column) => {
                      const value = column.accessor
                        ? column.accessor(row)
                        : getValueByPath(row, column.key);
                      return (
                        <td
                          key={column.key}
                          class={[
                            alignmentClass(column.align),
                            column.cellClass,
                          ]}
                        >
                          {formatCellValue(value)}
                        </td>
                      );
                    })}

                    {hasActions && (
                      <td>
                        <div class="flex justify-end gap-2">
                          {onEditRow$ && (
                            <button
                              type="button"
                              class="btn btn-ghost btn-sm"
                              aria-label={`Edit row ${rowId}`}
                              onClick$={() => onEditRow$(rowId)}
                            >
                              Edit
                            </button>
                          )}

                          {onDeleteRow$ && (
                            <button
                              type="button"
                              class="btn btn-ghost btn-sm text-error"
                              aria-label={`Delete row ${rowId}`}
                              onClick$={() => onDeleteRow$(rowId)}
                            >
                              Delete
                            </button>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    );
  },
);
