import * as React from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
    FileText,
    Download,
    FileSpreadsheet,
    Warehouse,
    Wrench,
    Bus,
    AlertCircle,
    Loader2,
    Filter
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { GenericDataTable } from "@/components/custom/GenericDataTable";
import { getMaintenanceReportColumns } from "./MaintenanceReportColumns";
import { THEME } from "@/utils/theme";
import { useGet } from "@/hooks/useGet";
import PageHeader from "@/components/custom/PageHeader";
import { useTranslation } from "react-i18next";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

const MaintenanceReport = () => {
    const { t, i18n } = useTranslation();

    // Filter states
    const [garageId, setGarageId] = React.useState("all");
    const [maintenanceTypeId, setMaintenanceTypeId] = React.useState("all");
    const [busId, setBusId] = React.useState("all");

    // Dialog state
    const [isDialogOpen, setIsDialogOpen] = React.useState(false);
    const [selectedMaintenances, setSelectedMaintenances] = React.useState([]);

    const handleViewMaintenances = (maintenances) => {
        setSelectedMaintenances(maintenances);
        setIsDialogOpen(true);
    };

    // Fetch filter options
    const { data: garagesData } = useGet(["garages"], "/api/admin/garages");
    const { data: maintenanceTypesData } = useGet(["maintenanceTypes"], "/api/admin/maintenanceTypes");
    const { data: busesData } = useGet(["buses"], "/api/admin/buses");

    // Memoize options
    const garages = React.useMemo(() => garagesData?.data?.garages || garagesData?.garages || [], [garagesData]);
    const maintenanceTypes = React.useMemo(() => maintenanceTypesData?.data?.maintenanceTypes || maintenanceTypesData?.maintenanceTypes || [], [maintenanceTypesData]);
    const buses = React.useMemo(() => busesData?.data?.buses || busesData?.buses || [], [busesData]);

    // Construct query params
    const queryParams = React.useMemo(() => {
        const params = new URLSearchParams();
        if (garageId !== "all") params.append("garageId", garageId);
        if (maintenanceTypeId !== "all") params.append("maintenanceTypeId", maintenanceTypeId);
        if (busId !== "all") params.append("busId", busId);
        return params.toString();
    }, [garageId, maintenanceTypeId, busId]);

    // Fetch report data
    const { data: reportData, isLoading, error, refetch } = useGet(
        ["maintenanceReport", garageId, maintenanceTypeId, busId],
        `/api/admin/dashboard/reports/maintenance${queryParams ? `?${queryParams}` : ''}`
    );

    const reports = React.useMemo(() => reportData?.data?.reports || reportData?.reports || [], [reportData]);

    const columns = React.useMemo(() => getMaintenanceReportColumns(t, handleViewMaintenances), [t]);

    const handleExportExcel = () => {
        if (reports.length === 0) return;

        const headers = [
            t('bus_number'),
            t('plate_number'),
            t('bus_type'),
            t('driver_name'),
            t('check_in_time'),
            t('garage'),
            t('reported_maintenances')
        ];

        const rows = reports.map(r => [
            r.busNumber,
            r.plateNumber,
            r.busType,
            r.driverName || '',
            r.checkInTime ? new Date(r.checkInTime).toLocaleString() : '',
            r.garageName,
            (r.reportedMaintenances || []).join(', ')
        ]);

        const csvContent = [
            headers.join(','),
            ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
        ].join('\n');

        const blob = new Blob(["\ufeff" + csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `maintenance_report_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleExportPDF = () => {
        if (reports.length === 0) return;

        const doc = new jsPDF();

        // Add Title
        doc.setFontSize(20);
        doc.text(t('maintenance_report'), 14, 22);

        // Prepare table data
        const headers = [[
            t('bus_number'),
            t('plate_number'),
            t('bus_type'),
            t('driver_name'),
            t('garage'),
            t('check_in_time')
        ]];

        const data = reports.map(r => [
            r.busNumber,
            r.plateNumber,
            r.busType,
            r.driverName || '---',
            r.garageName,
            r.checkInTime ? new Date(r.checkInTime).toLocaleString() : '---'
        ]);

        // AutoTable plugin
        autoTable(doc, {
            startY: 30,
            head: headers,
            body: data,
            theme: 'striped',
            headStyles: { fillColor: [0, 51, 102] }, // Matches THEME primary color
            styles: { fontSize: 8, font: "helvetica" },
        });

        doc.save(`maintenance_report_${new Date().toISOString().split('T')[0]}.pdf`);
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500 pb-10">
            <PageHeader
                icon={FileText}
                title={t('maintenance_report')}
                subtitle={t('monitor_bus_maintenance_status')}
                actions={
                    <div className="flex gap-2">
                        <Button
                            onClick={handleExportExcel}
                            disabled={reports.length === 0}
                            size="sm"
                            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-md h-9 transition-all active:scale-95"
                        >
                            <FileSpreadsheet className="mr-2 h-4 w-4" /> {t('export_excel')}
                        </Button>
                        {/* <Button
                            onClick={handleExportPDF}
                            disabled={reports.length === 0}
                            size="sm"
                            className="bg-rose-600 hover:bg-rose-700 text-white font-bold shadow-md h-9 transition-all active:scale-95"
                        >
                            <Download className="mr-2 h-4 w-4" /> {t('export_pdf', 'Export PDF')}
                        </Button> */}
                    </div>
                }
            />

            {/* Filters Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white/40 backdrop-blur-md p-4 rounded-xl border border-white/20 shadow-lg ring-1 ring-black/5">
                <div className="space-y-2">
                    <label className="text-[11px] font-bold text-slate-500 uppercase flex items-center gap-1.5 px-1">
                        <Warehouse className="w-3 h-3" /> {t('garage')}
                    </label>
                    <Select value={garageId} onValueChange={setGarageId} dir={i18n.dir()}>
                        <SelectTrigger className="bg-white/80 border-slate-200 shadow-sm transition-all focus:ring-2 focus:ring-blue-500/20">
                            <SelectValue placeholder={t('select_garage')} />
                        </SelectTrigger>
                        <SelectContent className="bg-white z-[9999]">
                            <SelectItem value="all">{t('all')}</SelectItem>
                            {garages.map((g) => (
                                <SelectItem key={g.id} value={g.id}>{g.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <label className="text-[11px] font-bold text-slate-500 uppercase flex items-center gap-1.5 px-1">
                        <Wrench className="w-3 h-3" /> {t('maintenance_type')}
                    </label>
                    <Select value={maintenanceTypeId} onValueChange={setMaintenanceTypeId} dir={i18n.dir()}>
                        <SelectTrigger className="bg-white/80 border-slate-200 shadow-sm transition-all focus:ring-2 focus:ring-blue-500/20">
                            <SelectValue placeholder={t('select_maintenance_type')} />
                        </SelectTrigger>
                        <SelectContent className="bg-white z-[9999]">
                            <SelectItem value="all">{t('all')}</SelectItem>
                            {maintenanceTypes.map((mt) => (
                                <SelectItem key={mt.id} value={mt.id}>{mt.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <label className="text-[11px] font-bold text-slate-500 uppercase flex items-center gap-1.5 px-1">
                        <Bus className="w-3 h-3" /> {t('bus')}
                    </label>
                    <Select value={busId} onValueChange={setBusId} dir={i18n.dir()}>
                        <SelectTrigger className="bg-white/80 border-slate-200 shadow-sm transition-all focus:ring-2 focus:ring-blue-500/20">
                            <SelectValue placeholder={t('select_bus')} />
                        </SelectTrigger>
                        <SelectContent className="bg-white z-[9999]">
                            <SelectItem value="all">{t('all')}</SelectItem>
                            {buses.map((b) => (
                                <SelectItem key={b.id} value={b.id}>{b.busNumber}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Table Content */}
            <div className="bg-white rounded-xl shadow-xl border border-slate-100 min-h-[400px] relative overflow-hidden ring-1 ring-black/5">
                {isLoading ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/60 backdrop-blur-[2px] z-10">
                        <Loader2 className="h-10 w-10 animate-spin text-blue-600 mb-4" />
                        <p className="text-sm font-semibold text-slate-600 animate-pulse">{t('loading')}...</p>
                    </div>
                ) : error ? (
                    <div className="flex flex-col items-center justify-center h-80 text-center p-6 bg-slate-50/50">
                        <div className="bg-red-50 p-4 rounded-full mb-4">
                            <AlertCircle className="h-10 w-10 text-red-500" />
                        </div>
                        <h3 className="font-bold text-slate-800 text-lg mb-2">{t('error')}</h3>
                        <p className="text-slate-500 text-sm mb-6 max-w-xs mx-auto">
                            {error?.response?.data?.message || error?.message || t('could_not_load_data')}
                        </p>
                        <Button
                            variant="outline"
                            onClick={() => refetch()}
                            className="bg-white border-slate-200 hover:bg-slate-50 shadow-sm font-bold"
                        >
                            {t('retry')}
                        </Button>
                    </div>
                ) : (
                    <div className="p-4">
                        <GenericDataTable
                            columns={columns}
                            data={reports}
                        />
                    </div>
                )}
            </div>

            {/* Maintenance Items Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
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
                                    <AlertCircle className="w-10 h-10 mx-auto mb-2 opacity-20" />
                                    <p>{t('no_records_found')}</p>
                                </div>
                            )}
                        </div>
                        <div className="mt-8 flex justify-end">
                            <Button
                                onClick={() => setIsDialogOpen(false)}
                                className="bg-[#003366] hover:bg-[#002244] text-white px-8 rounded-xl font-bold transition-all active:scale-95"
                            >
                                {t('close')}
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {!isLoading && !error && (
                <div className="flex items-center gap-2 px-2">
                    <div className="h-1 w-1 rounded-full bg-slate-400" />
                    <p className="text-[11px] text-slate-400 uppercase tracking-widest font-semibold font-mono">
                        {t('total_records')}: <span className="text-blue-600 font-bold ml-1">{reports.length}</span>
                    </p>
                </div>
            )}
        </div>
    );
};

export default MaintenanceReport;
