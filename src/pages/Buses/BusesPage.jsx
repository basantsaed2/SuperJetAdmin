import * as React from "react";
import { useNavigate } from "react-router-dom";
import { AlertCircle, Plus, Bus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GenericDataTable } from "@/components/custom/GenericDataTable";
import { getBusesColumns } from "./BusesColumns";
import { THEME } from "@/utils/theme";
import { useGet } from "@/hooks/useGet";
import { useDelete } from "@/hooks/useDelete";
// تم حذف useUpdate من هنا
import PageHeader from "@/components/custom/PageHeader";
import DeleteConfirmDialog from "@/components/custom/DeleteConfirmDialog";
import { useTranslation } from "react-i18next";

const BusesPage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    // لجلب البيانات
    const { data, isLoading, error, refetch } = useGet(["buses"], "/api/admin/buses");

    // Deletion State
    const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
    const [itemToDelete, setItemToDelete] = React.useState(null);
    const deleteMutation = useDelete("/api/admin/buses", ["buses"]);

    const handleEdit = (item) => {
        navigate(`/buses/edit/${item.id}`);
    };

    const handleDeleteClick = (item) => {
        setItemToDelete(item);
        setDeleteDialogOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!itemToDelete) return;
        try {
            await deleteMutation.mutateAsync(itemToDelete.id);
            setDeleteDialogOpen(false);
            setItemToDelete(null);
        } catch (error) {
            console.error("Delete failed:", error);
        }
    };

    // تم تعديل الـ columns لتأخذ الـ t فقط، وحذف الـ handlers
    const columns = React.useMemo(
        () => getBusesColumns(t),
        [t]
    );

    const busesData = React.useMemo(() => {
        if (!data) return [];
        return data?.data?.buses || data?.buses || [];
    }, [data]);

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <PageHeader
                icon={Bus}
                title={t('buses')}
                subtitle={t('manage_buses')}
                actions={
                    <Button
                        onClick={() => navigate("/buses/add")}
                        size="sm"
                        className={`${THEME.colors.secondary} ${THEME.colors.accent} font-bold shadow-md hover:opacity-90 hover:text-white h-9`}
                    >
                        <Plus className="mr-2 h-4 w-4" /> {t('add_new_bus')}
                    </Button>
                }
            />

            <div className="bg-white rounded-xl shadow-sm border border-slate-100 min-h-[300px] relative overflow-hidden">
                {isLoading ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/60 backdrop-blur-[1px] z-10">
                        <p className="text-sm font-medium text-slate-500">{t('loading')}...</p>
                    </div>
                ) : error ? (
                    <div className="flex flex-col items-center justify-center h-64 text-center p-6">
                        <AlertCircle className="h-10 w-10 text-red-500 mb-2" />
                        <h3 className="font-bold text-slate-800">{t('error')}</h3>
                        <Button variant="outline" onClick={() => refetch()}>{t('retry')}</Button>
                    </div>
                ) : (
                    <div className="p-2">
                        <GenericDataTable
                            columns={columns}
                            data={busesData}
                            onEdit={handleEdit}
                            onDelete={handleDeleteClick}
                        />
                    </div>
                )}
            </div>

            {!isLoading && !error && (
                <p className="text-[11px] text-slate-400 px-2 uppercase tracking-wider">
                    {t('total_records')}: <span className="font-bold text-slate-600">{busesData.length}</span>
                </p>
            )}

            <DeleteConfirmDialog
                isOpen={deleteDialogOpen}
                onClose={() => setDeleteDialogOpen(false)}
                onConfirm={handleConfirmDelete}
                itemName={itemToDelete?.busNumber}
                isLoading={deleteMutation.isPending}
            />
        </div>
    );
};

export default BusesPage;