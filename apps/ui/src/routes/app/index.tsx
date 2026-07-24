import { component$ } from '@builder.io/qwik';
import { routeLoader$ } from '@builder.io/qwik-city';
import { applicationSummaries } from '../../lib/actions/application-summary.action';
import {
  createDataTable,
  type DataTableColumn,
} from '../../components/ui/data-table';
import type { ApplicationSummary } from '@app/types';

const useApplicationsLoader = routeLoader$(async (event) => {
  const sid = event.cookie.get('sid')?.value;
  return await applicationSummaries(sid);
});

const DataTable = createDataTable<ApplicationSummary>();

export const columns: readonly DataTableColumn<ApplicationSummary>[] = [
  {
    key: 'createdAt',
    header: 'Created At',
  },
  {
    key: 'status',
    header: 'Status',
  },
  {
    key: 'company.name',
    header: 'Company',
  },
  {
    key: 'role',
    header: 'Role',
  },
  {
    key: 'company.jobDescription',
    header: 'Job Description',
  },
  {
    key: 'notes',
    header: 'Latest Note',
  },
  {
    key: 'updatedAt',
    header: 'Last Updated',
  },
];

export default component$(() => {
  const applications = useApplicationsLoader();

  return (
    <section id="applications-home" class="flex h-full w-full  justify-center">
      <div class="w-full">
        <DataTable
          columns={columns}
          rows={applications.value?.data ?? []}
          rowKey="id"
          selectedRowIds={[]}
          onRowSelectionChange$={() => {}}
          onSelectAll$={() => {}}
          onEditRow$={() => {}}
          onDeleteRow$={() => {}}
          emptyMessage="No applications found."
        />
      </div>
    </section>
  );
});
