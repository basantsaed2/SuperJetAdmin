// src/pages/Cities/CitiesPage.jsx
import * as React from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, AlertCircle, MapPin, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GenericDataTable } from "@/components/custom/GenericDataTable";
import { getCitiesColumns } from "./CitiesColumns";
import { THEME } from "@/utils/theme";
import { useGet } from "@/hooks/useGet";
import { useDelete } from "@/hooks/useDelete";
import PageHeader from "@/components/custom/PageHeader";
import DeleteConfirmDialog from "@/components/custom/DeleteConfirmDialog";
import { useTranslation } from "react-i18next";
import { usePermissions } from "@/hooks/usePermissions";

const CitiesPage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { canEdit, canDelete } = usePermissions();
    const moduleName = "City";
    const { data, isLoading, error, refetch } = useGet(["cities"], "/api/admin/cities");

    // Deletion State
    const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
    const [itemToDelete, setItemToDelete] = React.useState(null);

    const deleteMutation = useDelete("/api/admin/cities", ["cities"]);

    const handleEdit = (item) => {
        navigate(`/cities/edit/${item.id}`);
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
        () => getCitiesColumns(t),
        [t]
    );

    const citiesData = React.useMemo(() => {
        if (!data) return [];
        return data?.data?.cities || data?.cities || [];
    }, [data]);

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
            {/* Header */}
            <PageHeader
                icon={MapPin}
                title={t('cities')}
                subtitle={t('manage_cities')}
                addPath="/cities/add"
                addText={t('add_new_city')}
                moduleName={moduleName}
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
                        <GenericDataTable
                            columns={columns}
                            data={citiesData}
                            onEdit={canEdit(moduleName) ? handleEdit : null}
                            onDelete={canDelete(moduleName) ? handleDeleteClick : null}
                        />
                    </div>
                )}
            </div>

            {!isLoading && !error && (
                <p className="text-[11px] text-slate-400 px-2 uppercase tracking-wider">
                    {t('total_records')}: <span className="font-bold text-slate-600">{citiesData.length}</span>
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

export default CitiesPage;
