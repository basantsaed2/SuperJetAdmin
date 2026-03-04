import { Edit, Trash2, Users, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"

export const getAdminsColumns = (t, onEdit, onDelete) => [
    {
        accessorKey: "name",
        header: t('name'),
        cell: ({ row }) => (
            <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center border border-slate-200">
                    <Users className="w-4 h-4 text-slate-500" />
                </div>
                <div className="flex flex-col">
                    <span className="font-bold text-slate-700">{row.original.name}</span>
                    <span className="text-[10px] text-slate-400 font-medium">{row.original.email}</span>
                </div>
            </div>
        ),
    },
    {
        accessorKey: "phone",
        header: t('phone'),
        cell: ({ row }) => <span className="text-sm text-slate-600 font-medium">{row.original.phone}</span>
    },
    {
        accessorKey: "role",
        header: t('role'),
        cell: ({ row }) => (
            <div className="flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-blue-500" />
                <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 text-[10px] font-bold border border-blue-100">
                    {row.original.role?.name || row.original.type || t('admin')}
                </span>
            </div>
        ),
    },
    {
        id: "actions",
        header: t('actions'),
        cell: ({ row }) => (
            <div className="flex items-center gap-2">
                <TooltipProvider>
                    {/* Edit Action */}
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

                    {/* Delete Action */}
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
