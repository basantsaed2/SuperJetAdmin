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
} from "@/components/ui/table" // تأكدي من مسار ملفك الذي أرسلتيه
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { THEME } from "@/utils/theme"

export function GenericDataTable({ columns, data }) {
    const [columnFilters, setColumnFilters] = React.useState([])

    // نحدد أول عمود يحتوي على داتا كعمود بحث افتراضي
    const searchableColumns = columns.filter(col => col.accessorKey)
    const [searchColumn, setSearchColumn] = React.useState(searchableColumns[0]?.accessorKey || "")

    const table = useReactTable({
        data,
        columns,
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
            {/* شريط أدوات البحث */}
            <div className="flex items-center gap-2 p-1">
                <Select value={searchColumn} onValueChange={(val) => {
                    // تصفية البحث القديم عند تغيير العمود
                    table.getColumn(searchColumn)?.setFilterValue("")
                    setSearchColumn(val)
                }}>
                    <SelectTrigger className="w-[160px] bg-white border-slate-200 shadow-sm">
                        <SelectValue placeholder="Search by..." />
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
                    placeholder={`Search in ${searchColumn}...`}
                    value={(table.getColumn(searchColumn)?.getFilterValue()) ?? ""}
                    onChange={(event) =>
                        table.getColumn(searchColumn)?.setFilterValue(event.target.value)
                    }
                    className="max-w-sm bg-white border-slate-200 shadow-sm"
                />
            </div>

            {/* استخدام المكونات التي أرسلتِها */}
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
                                <TableCell colSpan={columns.length} className="h-32 text-center text-slate-400">
                                    No records found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination Control */}
            <div className="flex items-center justify-between px-2">
                <p className="text-xs text-slate-500">
                    Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
                </p>
                <div className="flex items-center space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                        className="h-8 text-xs"
                    >
                        Previous
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                        className="h-8 text-xs"
                    >
                        Next
                    </Button>
                </div>
            </div>
        </div>
    )
}