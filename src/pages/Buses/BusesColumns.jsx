import { Bus, ShieldCheck, Calendar, Loader2 } from "lucide-react"
import i18n from "@/i18n"
import { cn } from "@/lib/utils"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
export const getBusesColumns = (t, onStatusChange, updatingId) => [
    {
        accessorKey: "busImage",
        header: t('bus_image'),
        cell: ({ row }) => (
            <div className="flex items-center justify-center w-12 h-10 bg-slate-100 rounded-lg overflow-hidden border border-slate-200">
                {row.original.busImage ? (
                    <img
                        src={row.original.busImage}
                        alt="Bus"
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <Bus className="w-5 h-5 text-slate-400" />
                )}
            </div>
        ),
    },
    {
        accessorKey: "busNumber",
        header: t('bus_number'),
        cell: ({ row }) => (
            <div className="flex flex-col">
                <span className="font-bold text-slate-700">{row.original.busNumber}</span>
                <span className="text-[10px] text-slate-400 font-mono uppercase truncate w-16">
                    {row.original.id?.split('-')[0]}
                </span>
            </div>
        ),
    },
    {
        accessorKey: "plateNumber",
        header: t('plate_number'),
        cell: ({ row }) => (
            <span className="px-2 py-1 bg-slate-50 text-slate-600 rounded font-bold text-xs border border-slate-200/60 shadow-sm">
                {row.original.plateNumber}
            </span>
        ),
    },
    {
        accessorKey: "maxSeats",
        header: t('max_seats'),
        cell: ({ row }) => (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                {row.original.maxSeats} {t('seats')}
            </span>
        ),
    },
    {
        accessorKey: "busType",
        header: t('bus_type'),
        cell: ({ row }) => (
            <div className="flex flex-col">
                <span className="text-slate-700 font-bold text-xs truncate max-w-[120px]">
                    {row.original.busType?.name || row.original.name || '---'}
                </span>
                <span className="text-[10px] text-slate-400 uppercase tracking-tighter">
                    {row.original.busType?.capacity || row.original.capacity} {t('seats')}
                </span>
            </div>
        ),
    },
    {
        accessorKey: "licenseNumber",
        header: t('license_number'),
        cell: ({ row }) => (
            <div className="flex items-center gap-1.5 text-slate-500">
                <ShieldCheck className="w-3.5 h-3.5 text-green-500" />
                <span className="text-xs font-medium">{row.original.licenseNumber}</span>
            </div>
        ),
    },
    {
        accessorKey: "licenseExpiryDate",
        header: t('license_expiry'),
        cell: ({ row }) => {
            const expiryDate = row.original.licenseExpiryDate;
            const date = expiryDate ? new Date(expiryDate).toLocaleDateString() : '---';
            const isExpired = expiryDate && new Date(expiryDate) < new Date();

            return (
                <div className={cn("flex items-center gap-1.5", isExpired ? "text-red-500" : "text-slate-500")}>
                    <Calendar className="w-3.5 h-3.5" />
                    <span className="text-xs font-medium">{date}</span>
                </div>
            );
        },
    },

    {
        accessorKey: "status",
        header: t('status'),
        cell: ({ row }) => {
            const status = row.original.status?.toLowerCase() || 'active';

            // تعريف الألوان بناءً على الحالة
            const statusStyles = {
                active: "bg-green-50 text-green-700 border-green-200",
                maintenance: "bg-amber-50 text-amber-700 border-amber-200",
                inactive: "bg-slate-50 text-slate-500 border-slate-200"
            };

            return (
                <div className={cn(
                    "inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border",
                    statusStyles[status] || statusStyles.inactive
                )}>
                    {t(status)}
                </div>
            );
        },
    },
]
