import * as React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useGet } from "@/hooks/useGet";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Loader2, Bus, Warehouse, Wrench, Filter } from "lucide-react";
import DashboardFilter from "@/components/custom/DashboardFilter";
import { GenericDataTable } from "@/components/custom/GenericDataTable";
import BusDetailsModalContent from "./BusDetailsModalContent";
import FormHeader from "@/components/custom/FormHeader";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const GarageBusesList = () => {
    const { id } = useParams();
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [selectedBusId, setSelectedBusId] = React.useState(null);
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [selectedMaintenances, setSelectedMaintenances] = React.useState([]);
    const [isMaintenanceDialogOpen, setIsMaintenanceDialogOpen] = React.useState(false);

    const [filter, setFilter] = React.useState('all');
    const { data, isLoading } = useGet(
        ["garage-buses", id],
        `/api/admin/dashboard/garages/${id}/buses`
    );

    const maintenanceOptions = React.useMemo(() => {
        const list = data?.data?.buses || [];
        const items = new Set();
        list.forEach(b => {
            (b.reportedMaintenances || []).forEach(m => items.add(m));
        });
        return Array.from(items).sort();
    }, [data]);



    const buses = React.useMemo(() => {
        let list = data?.data?.buses || [];
        if (filter === 'all') return list;
        if (filter === 'maintenance') {
            return list.filter(b => b.status === 'maintenance' || (b.reportedMaintenances || []).length > 0);
        }
        return list.filter(b => (b.reportedMaintenances || []).includes(filter));
    }, [data, filter]);

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
            accessorKey: "driverName",
            header: t("driver_name"),
            cell: ({ row }) => (
                <span className="font-medium text-slate-600">
                    {row.getValue("driverName") || t("unassigned")}
                </span>
            )
        },
        {
            accessorKey: "reportedMaintenances",
            header: t('reported_maintenances'),
            cell: ({ row }) => {
                const maintenances = row.original.reportedMaintenances || [];
                return (
                    <div
                        className="flex flex-wrap gap-1 cursor-pointer hover:bg-slate-50 p-1 rounded-md border border-transparent hover:border-slate-200 transition-all group"
                        onClick={() => {
                            setSelectedMaintenances(maintenances);
                            setIsMaintenanceDialogOpen(true);
                        }}
                    >
                        {maintenances.length > 0 ? (
                            <>
                                {maintenances.slice(0, 1).map((m, idx) => (
                                    <span key={idx} className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-100">
                                        <Wrench className="w-2.5 h-2.5 mr-1" />
                                        {m}
                                    </span>
                                ))}
                                {maintenances.length > 1 && (
                                    <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
                                        +{maintenances.length - 1}
                                    </span>
                                )}
                            </>
                        ) : (
                            <span className="text-slate-400 text-xs">---</span>
                        )}
                    </div>
                );
            },
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
        <div className="p-4 space-y-4 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <FormHeader
                    title={
                        <div className="flex items-center gap-2">
                            <Warehouse className="h-5 w-5 text-blue-600" />
                            {t('garages')}
                        </div>
                    }
                    onBackClick={() => navigate("/dashboard/garages")}
                />

                <DashboardFilter
                    value={filter}
                    onChange={setFilter}
                    options={maintenanceOptions}
                />
            </div>
            <GenericDataTable
                columns={columns}
                data={buses}
                onView={handleView}
            />

            {/* Maintenance Items Dialog */}
            <Dialog open={isMaintenanceDialogOpen} onOpenChange={setIsMaintenanceDialogOpen}>
                <DialogContent className="bg-white max-w-md rounded-2xl border-none shadow-2xl p-0 overflow-hidden animate-in zoom-in-95 duration-200">
                    <DialogHeader className="p-6 bg-slate-50 border-b border-slate-100">
                        <DialogTitle className="flex items-center gap-2 text-[#003366] font-bold text-xl text-start">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <Wrench className="w-5 h-5 text-blue-600" />
                            </div>
                            {t('reported_maintenances')}
                        </DialogTitle>
                    </DialogHeader>
                    <div className="p-6">
                        <div className="space-y-3">
                            {selectedMaintenances.length > 0 ? (
                                selectedMaintenances.map((m, idx) => (
                                    <div
                                        key={idx}
                                        className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50/30 transition-all group"
                                    >
                                        <div className="h-2 w-2 rounded-full bg-blue-500 group-hover:scale-125 transition-transform" />
                                        <span className="text-slate-700 font-bold text-sm">{m}</span>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-10 text-slate-400">
                                    <p>{t('no_records_found')}</p>
                                </div>
                            )}
                        </div>
                        <div className="mt-8 flex justify-end">
                            <Button
                                onClick={() => setIsMaintenanceDialogOpen(false)}
                                className="bg-[#003366] hover:bg-[#002244] text-white px-8 rounded-xl font-bold transition-all active:scale-95"
                            >
                                {t('close')}
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="max-w-2xl bg-white">
                    <DialogHeader>
                        <DialogTitle className="text-[#003366] flex items-center gap-2">
                            <Bus className="h-5 w-5" />
                            {t('bus_details')}
                        </DialogTitle>
                    </DialogHeader>

                    {selectedBusId && <BusDetailsModalContent busId={selectedBusId} />}
                    <div className="mt-6 flex justify-end">
                        <Button
                            onClick={() => setIsModalOpen(false)}
                            className="bg-[#003366] hover:bg-[#002244] text-white px-8 rounded-xl font-bold transition-all active:scale-95"
                        >
                            {t('close')}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default GarageBusesList;