import { Edit, Trash2, ShieldCheck, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"

export const getRolesColumns = (t, onEdit, onDelete, onView) => [
    {
        accessorKey: "name",
        header: t('role_name'),
        cell: ({ row }) => (
            <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center border border-slate-200">
                    <ShieldCheck className="w-4 h-4 text-slate-500" />
                </div>
                <span className="font-bold text-slate-700">{row.original.name}</span>
            </div>
        ),
    },
    {
        id: "actions",
        header: t('actions'),
        cell: ({ row }) => (
            <div className="flex items-center gap-2">
                <TooltipProvider>
                    {/* View Action */}
                    <Tooltip delayDuration={300}>
                        <TooltipTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-slate-500 hover:text-slate-700 hover:bg-slate-50"
                                onClick={() => onView(row.original)}
                            >
                                <Eye className="h-4 w-4" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent><p>{t('view')}</p></TooltipContent>
                    </Tooltip>

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
