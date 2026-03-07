import { Bus, Calendar, MapPin, Wrench, User, ExternalLink } from "lucide-react"

export const getMaintenanceReportColumns = (t, onViewMaintenances) => [
    {
        accessorKey: "busNumber",
        header: t('bus_number'),
        cell: ({ row }) => (
            <div className="flex flex-col">
                <span className="font-bold text-slate-700">{row.original.busNumber}</span>
                <span className="text-[10px] text-slate-400 font-mono uppercase">
                    {row.original.plateNumber}
                </span>
            </div>
        ),
    },
    {
        accessorKey: "busType",
        header: t('bus_type'),
        cell: ({ row }) => (
            <span className="text-slate-600 font-medium text-xs">
                {row.original.busType || '---'}
            </span>
        ),
    },
    {
        accessorKey: "driverName",
        header: t('driver_name'),
        cell: ({ row }) => (
            <div className="flex items-center gap-1.5 text-slate-600">
                <User className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-xs">{row.original.driverName || '---'}</span>
            </div>
        ),
    },
    {
        accessorKey: "checkInTime",
        header: t('check_in_time'),
        cell: ({ row }) => {
            const date = row.original.checkInTime ? new Date(row.original.checkInTime).toLocaleString() : '---';
            return (
                <div className="flex items-center gap-1.5 text-slate-500">
                    <Calendar className="w-3.5 h-3.5" />
                    <span className="text-xs font-medium">{date}</span>
                </div>
            );
        },
    },
    {
        accessorKey: "garageName",
        header: t('garage'),
        cell: ({ row }) => (
            <div className="flex items-center gap-1.5 text-slate-600">
                <MapPin className="w-3.5 h-3.5 text-blue-500" />
                <span className="text-xs font-medium">{row.original.garageName || '---'}</span>
            </div>
        ),
    },
    {
        accessorKey: "reportedMaintenances",
        header: t('reported_maintenances'),
        cell: ({ row }) => {
            const maintenances = row.original.reportedMaintenances || [];
            return (
                <div
                    className="flex flex-wrap gap-1 cursor-pointer hover:bg-slate-50 p-1 rounded-md border border-transparent hover:border-slate-200 transition-all group"
                    onClick={() => onViewMaintenances(maintenances)}
                >
                    {maintenances.length > 0 ? (
                        <>
                            {maintenances.slice(0, 2).map((m, idx) => (
                                <span key={idx} className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-100">
                                    <Wrench className="w-2.5 h-2.5 mr-1" />
                                    {m}
                                </span>
                            ))}
                            {maintenances.length > 2 && (
                                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
                                    +{maintenances.length - 2}
                                </span>
                            )}
                            <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                                <ExternalLink className="w-3 h-3 text-slate-400" />
                            </div>
                        </>
                    ) : (
                        <span className="text-slate-400 text-xs">---</span>
                    )}
                </div>
            );
        },
    },
]
