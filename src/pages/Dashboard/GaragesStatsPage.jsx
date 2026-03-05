import { useGet } from "@/hooks/useGet";
import { Badge } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const GaragesStatsPage = () => {
    const { data, isLoading } = useGet(["garages-stats"], "/api/admin/dashboard/garages-stats");
    const { t } = useTranslation();
    const navigate = useNavigate();
    const garages = data?.data?.garages || [];

    return (
        <div className="p-6 space-y-6">
            <h2 className="text-xl font-bold">{t('garages_distribution')}</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {garages.map((garage) => (
                    <div
                        key={garage.garageId}
                        onClick={() => navigate(`/dashboard/garages/${garage.garageId}/buses`)}
                        className="p-5 bg-white border rounded-xl hover:border-blue-400 cursor-pointer flex justify-between items-center transition-colors"
                    >
                        <div>
                            <h3 className="font-bold text-lg text-slate-700">{garage.garageName}</h3>
                            <p className="text-xs text-slate-400">{t('total_capacity')}: {garage.totalBuses}</p>
                        </div>
                        <div className="flex gap-4">
                            <Badge color="green">{garage.activeCount} {t('active')}</Badge>
                            <Badge color="orange">{garage.maintenanceCount} {t('service')}</Badge>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default GaragesStatsPage;
