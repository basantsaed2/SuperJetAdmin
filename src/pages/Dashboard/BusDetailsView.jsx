import {
    FileText, Hash, ShieldCheck, MapPin, Bus,
    Users, Clock, User, Calendar, Wrench, Info
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";

export const BusDetailsView = ({ busInfo }) => {
    const { t } = useTranslation();

    if (!busInfo) return null;
    const formatDate = (dateString) => {
        if (!dateString) return "---";
        return new Date(dateString).toLocaleDateString();
    };

    return (
        <div className={cn(
            "space-y-6 py-4 border-t",
            "max-h-[75vh] overflow-y-auto",
            "scrollbar-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        )}>
            <div className="grid grid-cols-2 gap-4">
                <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 border border-slate-100">
                    <Hash className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                        <p className="text-xs text-slate-500">{t('bus_number')}</p>
                        <p className="font-bold text-[#003366]">{busInfo.busNumber || "---"}</p>
                    </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 border border-slate-100">
                    <FileText className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                        <p className="text-xs text-slate-500">{t('plate_number')}</p>
                        <p className="font-bold text-[#003366]">{busInfo.plateNumber || "---"}</p>
                    </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 border border-slate-100">
                    <User className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                        <p className="text-xs text-slate-500">{t('driver_name')}</p>
                        <p className="font-bold text-[#003366]">{busInfo.driverName || t('unassigned')}</p>
                    </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 border border-slate-100">
                    <MapPin className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                        <p className="text-xs text-slate-500">{t('garage_name')}</p>
                        <p className="font-bold text-[#003366]">{busInfo.garageName || "---"}</p>
                    </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 border border-slate-100">
                    <ShieldCheck className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                        <p className="text-xs text-slate-500">{t('license_number')}</p>
                        <p className="font-bold text-[#003366]">{busInfo.licenseNumber || "---"}</p>
                    </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 border border-slate-100">
                    <Calendar className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                        <p className="text-xs text-slate-500">{t('license_expiry')}</p>
                        <p className="font-bold text-[#003366]">{formatDate(busInfo.licenseExpiryDate)}</p>
                    </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 border border-slate-100">
                    <Clock className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                        <p className="text-xs text-slate-500">{t('last_check_in')}</p>
                        <p className="font-bold text-[#003366] text-sm">
                            {busInfo.checkInTime ? (
                                <>
                                    <span className="block">{new Date(busInfo.checkInTime).toLocaleDateString()}</span>
                                    <span className="text-xs font-medium text-slate-500">
                                        {new Date(busInfo.checkInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </>
                            ) : "---"}
                        </p>
                    </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 border border-slate-100">
                    <Info className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                        <p className="text-xs text-slate-500">{t('status')}</p>
                        <span className={cn(
                            "text-[10px] px-2 py-0.5 rounded-full font-bold uppercase border",
                            busInfo.status === 'maintenance' ? "bg-amber-50 text-amber-700 border-amber-200" : "bg-green-50 text-green-700 border-green-200"
                        )}>
                            {t(busInfo.status || 'active')}
                        </span>
                    </div>
                </div>
            </div>

            {busInfo.reportedMaintenances?.length > 0 && (
                <div className="p-4 border rounded-xl bg-red-50/30 border-red-100">
                    <h4 className="text-sm font-semibold mb-3 flex items-center gap-2 text-red-700">
                        <Wrench className="h-4 w-4" />
                        {t('maintenance_reports')}
                    </h4>
                    <ul className="space-y-2">
                        {busInfo.reportedMaintenances.map((report, index) => (
                            <li key={index} className="text-sm text-slate-700 flex items-center gap-2">
                                <span className="h-1.5 w-1.5 rounded-full bg-red-400" />
                                {report}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            <div className="p-4 border rounded-xl border-dashed border-slate-200">
                <h4 className="text-sm font-semibold mb-2 flex items-center gap-2 text-slate-700">
                    <Bus className="h-4 w-4" />
                    {t('description')}
                </h4>
                <p className="text-sm text-slate-600 leading-relaxed">
                    {busInfo.description || t('no_description_available')}
                </p>
            </div>
        </div>
    );
};