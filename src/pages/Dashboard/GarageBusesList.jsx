import * as React from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useGet } from "@/hooks/useGet";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Loader2, Bus } from "lucide-react";
import { GenericDataTable } from "@/components/custom/GenericDataTable";
import BusDetailsModalContent from "./BusDetailsModalContent";

const GarageBusesList = () => {
    const { id } = useParams();
    const { t } = useTranslation();
    const [selectedBusId, setSelectedBusId] = React.useState(null);
    const [isModalOpen, setIsModalOpen] = React.useState(false);

    const { data, isLoading } = useGet(
        ["garage-buses", id],
        `/api/admin/dashboard/garages/${id}/buses`
    );

    // تعريف الأعمدة للجدول
    const columns = [
        {
            accessorKey: "busNumber",
            header: t("bus_number"),
            cell: ({ row }) => (
                <div className="flex items-center gap-2">
                    <Bus className="h-4 w-4 text-slate-400" />
                    <span className="font-bold">{row.getValue("busNumber")}</span>
                </div>
            )
        },
        {
            accessorKey: "plateNumber",
            header: t("plate_number"),
        },
        {
            accessorKey: "checkInTime",
            header: t("last_check_in"),
            cell: ({ row }) => (
                <span className="text-xs text-slate-500">
                    {row.getValue("checkInTime") ? new Date(row.getValue("checkInTime")).toLocaleString() : "---"}
                </span>
            )
        }
    ];

    const handleView = (bus) => {
        setSelectedBusId(bus.busId);
        setIsModalOpen(true);
    };

    if (isLoading) return (
        <div className="p-20 flex flex-col items-center justify-center">
            <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
            <p className="text-slate-500 mt-2">{t('loading')}...</p>
        </div>
    );

    return (
        <div className="p-4 space-y-4">
            <GenericDataTable
                columns={columns}
                data={data?.data?.buses || []}
                onView={handleView} // هذا سيفعل زر العين في الجدول
            />

            {/* Modal عرض التفاصيل */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="max-w-2xl bg-white">
                    <DialogHeader>
                        <DialogTitle className="text-[#003366] flex items-center gap-2">
                            <Bus className="h-5 w-5" />
                            {t('bus_details')}
                        </DialogTitle>
                    </DialogHeader>

                    {selectedBusId && <BusDetailsModalContent busId={selectedBusId} />}
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default GarageBusesList;