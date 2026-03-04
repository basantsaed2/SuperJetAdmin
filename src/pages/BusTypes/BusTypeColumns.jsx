import { Edit, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"

export const getBusTypeColumns = (t, onEdit, onDelete) => [
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
