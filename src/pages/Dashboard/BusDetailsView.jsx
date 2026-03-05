import { FileText, Hash, ShieldCheck, MapPin, Bus, Users, Clock } from "lucide-react";
import { useTranslation } from "react-i18next";

export const BusDetailsView = ({ busInfo }) => {
    const { t } = useTranslation();

    if (!busInfo) return null;

    return (
        <div className="space-y-6 py-4 border-t">
            {/* القسم الأول: معلومات الحافلة الأساسية */}
            <div className="grid grid-cols-2 gap-4">
                <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-50">
                    <Hash className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                        <p className="text-xs text-slate-500">{t('bus_number')}</p>
                        <p className="font-bold text-[#003366]">{busInfo.busNumber || "---"}</p>
                    </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-50">
                    <FileText className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                        <p className="text-xs text-slate-500">{t('plate_number')}</p>
                        <p className="font-bold text-[#003366]">{busInfo.plateNumber || "---"}</p>
                    </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-50">
                    <Users className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                        <p className="text-xs text-slate-500">{t('max_seats')}</p>
                        <p className="font-bold text-[#003366]">{busInfo.maxSeats} {t('seats')}</p>
                    </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-50">
                    <Clock className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                        <p className="text-xs text-slate-500">{t('last_check_in')}</p>
                        <p className="font-bold text-[#003366]">
                            {busInfo.checkInTime ? new Date(busInfo.checkInTime).toLocaleTimeString() : "---"}
                        </p>
                    </div>
                </div>
            </div>

            {/* القسم الثاني: تفاصيل إضافية أو الوصف */}
            <div className="p-4 border rounded-xl border-dashed border-slate-200">
                <h4 className="text-sm font-semibold mb-2 flex items-center gap-2 text-slate-700">
                    <Bus className="h-4 w-4" />
                    {t('additional_info')}
                </h4>
                <p className="text-sm text-slate-600 leading-relaxed">
                    {busInfo.description || t('no_description_available')}
                </p>
            </div>
        </div>
    );
};