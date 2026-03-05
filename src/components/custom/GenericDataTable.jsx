import * as React from "react"
import {
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    useReactTable,
} from "@tanstack/react-table"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { THEME } from "@/utils/theme"
import { useTranslation } from "react-i18next";
import { Edit, Trash2, Eye } from "lucide-react";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

export function GenericDataTable({ columns, data, isLoading, onEdit, onDelete, onView }) {
    const { t } = useTranslation();
    const [columnFilters, setColumnFilters] = React.useState([])

    const searchableColumns = columns.filter(col =>
        col.accessorKey &&
        !col.accessorKey.toLowerCase().includes("image")
    )
    const [searchColumn, setSearchColumn] = React.useState(searchableColumns[0]?.accessorKey || "")

    // Build the actions column dynamically if any action handler is provided
    const actionsColumn = React.useMemo(() => {
        if (!onEdit && !onDelete && !onView) return null;
        return {
            id: "actions",
            header: t('actions'),
            cell: ({ row }) => (
                <div className="flex items-center gap-1">
                    <TooltipProvider>
                        {onView && (
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
                        )}
                        {onEdit && (
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
                        )}
                        {onDelete && (
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
                        )}
                    </TooltipProvider>
                </div>
            ),
        };
    }, [onEdit, onDelete, onView, t]);

    // Merge provided columns with the actions column
    const mergedColumns = React.useMemo(() => {
        if (!actionsColumn) return columns;
        return [...columns, actionsColumn];
    }, [columns, actionsColumn]);

    const table = useReactTable({
        data,
        columns: mergedColumns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        state: {
            columnFilters,
        },
    })

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2 p-1">
                <Select value={searchColumn} onValueChange={(val) => {
                    table.getColumn(searchColumn)?.setFilterValue("")
                    setSearchColumn(val)
                }}>
                    <SelectTrigger className="w-[160px] bg-white border-slate-200 shadow-sm">
                        <SelectValue placeholder={t('search_by')} />
                    </SelectTrigger>
                    <SelectContent position="popper" className="z-[9999] bg-white">
                        {searchableColumns.map((col) => (
                            <SelectItem key={col.accessorKey} value={col.accessorKey}>
                                {typeof col.header === 'string' ? col.header : col.accessorKey}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <Input
                    placeholder={`${t('search_in')} ${t(searchColumn.toLowerCase())}...`}
                    value={(table.getColumn(searchColumn)?.getFilterValue()) ?? ""}
                    onChange={(event) =>
                        table.getColumn(searchColumn)?.setFilterValue(event.target.value)
                    }
                    className="max-w-sm bg-white border-slate-200 shadow-sm"
                />
            </div>

            <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                <Table>
                    <TableHeader className="bg-slate-50/50">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id} className="hover:bg-transparent">
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id} className="font-bold py-4 text-[#003366]">
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id} className="hover:bg-slate-50/50 transition-colors">
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id} className="py-3">
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={mergedColumns.length} className="h-32 text-center text-slate-400">
                                    {t('no_records_found')}
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination Control */}
            <div className="flex items-center justify-between px-2">
                <p className="text-xs text-slate-500">
                    {t('page')} {table.getState().pagination.pageIndex + 1} {t('of')} {table.getPageCount()}
                </p>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                        className="h-8 text-xs"
                    >
                        {t('previous')}
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                        className="h-8 text-xs"
                    >
                        {t('next')}
                    </Button>
                </div>
            </div>
        </div>
    )
}