import { Wrench } from "lucide-react"

export const getMaintenancesColumns = (t) => [
    {
        accessorKey: "name",
        header: t('maintenance_name'),
        cell: ({ row }) => (
            <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center border border-slate-200">
                    <Wrench className="w-4 h-4 text-slate-500" />
                </div>
                <span className="font-bold text-slate-700">{row.original.name}</span>
            </div>
        ),
    },
    {
        accessorKey: "maintenanceType",
        header: t('maintenance_type'),
        cell: ({ row }) => (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                {row.original.maintenanceType?.name || '---'}
            </span>
        ),
    },
]
