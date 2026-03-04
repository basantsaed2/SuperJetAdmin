import * as React from "react";
import { Plus, BusFront, Loader2, RefreshCw, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GenericDataTable } from "@/components/ui/custom/GenericDataTable";
import { getBusTypeColumns } from "./BusTypeColumns";
import { THEME } from "@/utils/theme";
import { useGet } from "@/hooks/useGet";

const BusTypesPage = () => {
    const { data, isLoading, error, refetch } = useGet(["busTypes"], "/api/admin/busTypes");

    const handleView = (item) => console.log("View:", item);
    const handleEdit = (item) => console.log("Edit:", item);

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this bus type?")) {
            console.log("Deleting:", id);
        }
    };

    const columns = React.useMemo(
        () => getBusTypeColumns(handleEdit, handleDelete, handleView),
        []
    );

    const busTypesData = React.useMemo(() => {
        if (!data) return [];
        return data?.data?.busTypes || data?.busTypes || [];
    }, [data]);


    
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${THEME.colors.primary} text-white shadow-lg shadow-blue-900/20`}>
                        <BusFront size={24} />
                    </div>
                    <div>
                        <h1 className={`text-2xl font-bold ${THEME.colors.accent} tracking-tight`}>Bus Types</h1>
                        <p className="text-slate-500 text-sm">Manage fleet categories and seating capacities</p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => refetch()}
                        disabled={isLoading}
                        className="border-slate-200 hover:bg-slate-50"
                    >
                        <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
                    </Button>
                    <Button className={`${THEME.colors.secondary} ${THEME.colors.accent} font-bold shadow-md hover:opacity-90 hover:text-white`}>
                        <Plus className="mr-2 h-4 w-4" /> Add New Type
                    </Button>
                </div>
            </div>

            {/* Table Content */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 min-h-[300px] relative overflow-hidden">
                {isLoading ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/60 backdrop-blur-[1px] z-10">
                        <Loader2 className="h-8 w-8 animate-spin text-[#003366] mb-2" />
                        <p className="text-sm font-medium text-slate-500">Loading fleet data...</p>
                    </div>
                ) : error ? (
                    <div className="flex flex-col items-center justify-center h-64 text-center p-6">
                        <AlertCircle className="h-10 w-10 text-red-500 mb-2" />
                        <h3 className="font-bold text-slate-800">Connection Error</h3>
                        <p className="text-slate-500 text-sm mb-4 max-w-xs text-balance">
                            {error?.response?.data?.message || error?.message || "Could not load data"}
                        </p>
                        <Button variant="outline" onClick={() => refetch()}>Try Reconnecting</Button>
                    </div>
                ) : (
                    <div className="p-2">
                        <GenericDataTable columns={columns} data={busTypesData} />
                    </div>
                )}
            </div>

            {!isLoading && !error && (
                <p className="text-[11px] text-slate-400 px-2 uppercase tracking-wider">
                    Total Records: <span className="font-bold text-slate-600">{busTypesData.length}</span>
                </p>
            )}
        </div>
    );
};

export default BusTypesPage;