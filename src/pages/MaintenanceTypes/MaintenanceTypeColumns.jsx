export const getMaintenanceTypeColumns = (t) => [
    {
        accessorKey: "name",
        header: t('maintenance_type_name'),
        cell: ({ row }) => <span className="font-bold text-slate-700">{row.original.name}</span>,
    },
]
