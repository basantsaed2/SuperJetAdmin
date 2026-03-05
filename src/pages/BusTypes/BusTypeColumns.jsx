export const getBusTypeColumns = (t) => [
    {
        accessorKey: "name",
        header: t('name'),
        cell: ({ row }) => <span className="font-bold text-slate-700">{row.original.name}</span>,
    },
    {
        accessorKey: "capacity",
        header: t('capacity'),
        cell: ({ row }) => (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                {row.original.capacity} {t('seats')}
            </span>
        ),
    },
    {
        accessorKey: "description",
        header: t('description'),
        cell: ({ row }) => (
            <span className="text-slate-500 text-xs italic truncate max-w-[200px] block">
                {row.original.description || t('no_description')}
            </span>
        ),
    },
]
