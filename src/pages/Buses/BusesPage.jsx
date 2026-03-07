import * as React from "react";
import { useNavigate } from "react-router-dom";
import { AlertCircle, Bus, Download, QrCode } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GenericDataTable } from "@/components/custom/GenericDataTable";
import { getBusesColumns } from "./BusesColumns";
import { THEME } from "@/utils/theme";
import { useGet } from "@/hooks/useGet";
import { useDelete } from "@/hooks/useDelete";
import PageHeader from "@/components/custom/PageHeader";
import DeleteConfirmDialog from "@/components/custom/DeleteConfirmDialog";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { useTranslation } from "react-i18next";
import { usePermissions } from "@/hooks/usePermissions";

const BusesPage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { canEdit, canDelete } = usePermissions();
    const moduleName = "buses"; // Based on navigation.jsx

    // لجلب البيانات
    const { data, isLoading, error, refetch } = useGet(["buses"], "/api/admin/buses");

    // Deletion State
    const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
    const [itemToDelete, setItemToDelete] = React.useState(null);
    const deleteMutation = useDelete("/api/admin/buses", ["buses"]);

    // QR Modal State
    const [qrModalOpen, setQrModalOpen] = React.useState(false);
    const [selectedQr, setSelectedQr] = React.useState(null);

    const handleQrClick = (qrUrl) => {
        setSelectedQr(qrUrl);
        setQrModalOpen(true);
    };

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
        () => getBusesColumns(t, handleQrClick),
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
                addPath="/buses/add"
                addText={t('add_new_bus')}
                moduleName={moduleName}
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
                            onEdit={canEdit(moduleName) ? handleEdit : null}
                            onDelete={canDelete(moduleName) ? handleDeleteClick : null}
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

            {/* QR Preview Modal */}
            <Dialog open={qrModalOpen} onOpenChange={setQrModalOpen}>
                <DialogContent className="max-w-xs md:max-w-sm bg-white rounded-3xl p-6 border-none shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                    <DialogHeader className="mb-4">
                        <DialogTitle className="text-center text-lg font-bold text-slate-800 flex items-center justify-center gap-2">
                            <span className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                                <QrCode size={18} />
                            </span>
                            {t('qr_code_preview')}
                        </DialogTitle>
                    </DialogHeader>

                    <div className="flex flex-col items-center gap-6">
                        <div className="w-full aspect-square bg-slate-50 rounded-2xl flex items-center justify-center p-6 border-2 border-dashed border-slate-200 transition-all hover:bg-white hover:border-blue-200">
                            {selectedQr ? (
                                <img
                                    src={selectedQr}
                                    alt="QR Preview"
                                    className="w-full h-full object-contain drop-shadow-md"
                                />
                            ) : (
                                <div className="text-slate-400 text-sm italic">{t('no_qr_available')}</div>
                            )}
                        </div>

                        {selectedQr && (
                            <Button
                                onClick={() => {
                                    const link = document.createElement('a');
                                    link.href = selectedQr;
                                    link.download = `bus-qr-${Date.now()}.png`;
                                    link.click();
                                }}
                                className={`w-full h-11 rounded-xl font-bold flex items-center justify-center gap-2 text-white ${THEME.colors.primary} hover:opacity-95 shadow-lg shadow-blue-900/10 transition-all active:scale-95`}
                            >
                                <Download size={18} />
                                {t('download_qr')}
                            </Button>
                        )}

                        <Button
                            variant="ghost"
                            onClick={() => setQrModalOpen(false)}
                            className="text-slate-500 font-medium hover:bg-slate-50 w-full"
                        >
                            {t('close')}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default BusesPage;