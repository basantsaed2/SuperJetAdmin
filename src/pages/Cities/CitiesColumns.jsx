import { MapPin } from "lucide-react"

export const getCitiesColumns = (t) => [
    {
        accessorKey: "name",
        header: t('city_name'),
        cell: ({ row }) => (
            <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center border border-slate-200">
                    <MapPin className="w-4 h-4 text-slate-500" />
                </div>
                <span className="font-bold text-slate-700">{row.original.name}</span>
            </div>
        ),
    },
]
