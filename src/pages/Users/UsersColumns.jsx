import { Edit, Trash2, User, Key, Phone, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"

export const getUsersColumns = (t, onEdit, onDelete) => [
    {
        accessorKey: "name",
        header: t('name'),
        cell: ({ row }) => (
            <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center border border-slate-200">
                    <User className="w-4 h-4 text-slate-500" />
                </div>
                <div className="flex flex-col">
                    <span className="font-bold text-slate-700">{row.original.name}</span>
                    {row.original.username && (
                        <div className="flex items-center gap-1">
                            <Key className="w-2.5 h-2.5 text-slate-400" />
                            <span className="text-[10px] text-slate-400 font-medium">{row.original.username}</span>
                        </div>
                    )}
                </div>
            </div>
        ),
    },
    {
        accessorKey: "phone",
        header: t('phone'),
        cell: ({ row }) => (
            <div className="flex items-center gap-1.5 text-sm text-slate-600 font-medium">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                {row.original.phone}
            </div>
        )
    },
    {
        accessorKey: "role",
        header: t('role'),
        cell: ({ row }) => (
            <div className="flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-indigo-500" />
                <span className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 text-[10px] font-bold border border-indigo-100">
                    {t(row.original.role) || row.original.role}
                </span>
            </div>
        ),
    },
    {
        accessorKey: "hasAccount",
        header: t('status'),
        cell: ({ row }) => (
            <div className={`inline-flex items-center px-2 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                row.original.hasAccount 
                    ? "bg-green-50 text-green-600 border border-green-100" 
                    : "bg-slate-50 text-slate-400 border border-slate-100"
            }`}>
               {row.original.hasAccount ? t('active') : t('inactive')}
            </div>
        ),
    },
    {
        id: "actions",
        header: t('actions'),
        cell: ({ row }) => (
            <div className="flex items-center gap-2">
                <TooltipProvider>
                    <Tooltip delayDuration={300}>
                        <TooltipTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                onClick={() => onEdit(row.original)}
                            >
                                <Edit className="h-4 w-4" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent><p>{t('edit')}</p></TooltipContent>
                    </Tooltip>

                    <Tooltip delayDuration={300}>
                        <TooltipTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                                onClick={() => onDelete(row.original)}
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent><p>{t('delete')}</p></TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>
        ),
    },
]
