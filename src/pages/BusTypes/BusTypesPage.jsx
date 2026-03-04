// src/pages/BusTypes/BusTypesPage.jsx
import * as React from "react";
import { useNavigate } from "react-router-dom"; // 1. استيراد الهوك
import { Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GenericDataTable } from "@/components/ui/custom/GenericDataTable";
import { getBusTypeColumns } from "./BusTypeColumns";
import { THEME } from "@/utils/theme";
import { useGet } from "@/hooks/useGet";
import BusTypesHeader from "./components/BusTypesHeader";

const BusTypesPage = () => {
    const navigate = useNavigate(); // 2. تعريف التوجيه
    const { data, isLoading, error, refetch } = useGet(["busTypes"], "/api/admin/busTypes");

    // دالة العرض (View)
    const handleView = (item) => {
        console.log("View:", item);
        // إذا كان لديك صفحة عرض تفاصيل: navigate(`/bus_types/view/${item.id}`)
    };

    // دالة التعديل (Edit) - التوجيه لمسار التعديل مع الـ ID
    const handleEdit = (item) => {
        navigate(`/bus_types/edit/${item.id}`);
    };

    // دالة الحذف
    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this bus type?")) {
            console.log("Deleting:", id);
            // هنا يتم استدعاء api الحذف ثم refetch()
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
            <BusTypesHeader 
                isLoading={isLoading} 
                refetch={refetch} 
                onAddClick={() => navigate("/bus_types/add")} 
            />

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