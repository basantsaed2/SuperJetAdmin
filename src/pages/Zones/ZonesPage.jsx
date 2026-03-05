// src/pages/Zones/ZonesPage.jsx
import * as React from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, AlertCircle, Plus, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GenericDataTable } from "@/components/custom/GenericDataTable";
import { getZonesColumns } from "./ZonesColumns";
import { THEME } from "@/utils/theme";
import { useGet } from "@/hooks/useGet";
import { useDelete } from "@/hooks/useDelete";
import PageHeader from "@/components/custom/PageHeader";
import DeleteConfirmDialog from "@/components/custom/DeleteConfirmDialog";
import { useTranslation } from "react-i18next";

const ZonesPage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { data, isLoading, error, refetch } = useGet(["zones"], "/api/admin/zones");
    
    // Deletion State
    const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
    const [itemToDelete, setItemToDelete] = React.useState(null);

    const deleteMutation = useDelete("/api/admin/zones", ["zones"]);

    const handleEdit = (item) => {
        navigate(`/zones/edit/${item.id}`);
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

    const columns = React.useMemo(
        () => getZonesColumns(t, handleEdit, handleDeleteClick),
        [t]
    );

    const zonesData = React.useMemo(() => {
        if (!data) return [];
        return data?.data?.zones || data?.zones || [];
    }, [data]);

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
            {/* Header */}
            <PageHeader 
                icon={Navigation}
                title={t('zones')}
                subtitle={t('manage_zones')}
                actions={
                    <>
                        <Button 
                            onClick={() => navigate("/zones/add")}
                            size="sm"
                            className={`${THEME.colors.secondary} ${THEME.colors.accent} font-bold shadow-md hover:opacity-90 hover:text-white h-9`}
                        >
                            <Plus className="mr-2 h-4 w-4" /> {t('add_new_zone')}
                        </Button>
                    </>
                }
            />

            {/* Table Content */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 min-h-[300px] relative overflow-hidden">
                {isLoading ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/60 backdrop-blur-[1px] z-10">
                        <Loader2 className="h-8 w-8 animate-spin text-[#003366] mb-2" />
                        <p className="text-sm font-medium text-slate-500">{t('loading')}...</p>
                    </div>
                ) : error ? (
                    <div className="flex flex-col items-center justify-center h-64 text-center p-6">
                        <AlertCircle className="h-10 w-10 text-red-500 mb-2" />
                        <h3 className="font-bold text-slate-800">{t('error')}</h3>
                        <p className="text-slate-500 text-sm mb-4 max-w-xs text-balance">
                            {error?.response?.data?.message || error?.message || t('could_not_load_data')}
                        </p>
                        <Button variant="outline" onClick={() => refetch()}>{t('retry')}</Button>
                    </div>
                ) : (
                    <div className="p-2">
                        <GenericDataTable columns={columns} data={zonesData} />
                    </div>
                )}
            </div>

            {!isLoading && !error && (
                <p className="text-[11px] text-slate-400 px-2 uppercase tracking-wider">
                    {t('total_records')}: <span className="font-bold text-slate-600">{zonesData.length}</span>
                </p>
            )}

            {/* Delete Confirmation Dialog */}
            <DeleteConfirmDialog 
                isOpen={deleteDialogOpen}
                onClose={() => setDeleteDialogOpen(false)}
                onConfirm={handleConfirmDelete}
                itemName={itemToDelete?.name}
                isLoading={deleteMutation.isPending}
                title={t('confirm_delete')}
                description={t('delete_warning')}
                cancelText={t('cancel')}
                confirmText={t('delete')}
            />
        </div>
    );
};

export default ZonesPage;
