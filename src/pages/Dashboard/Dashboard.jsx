import { Bus, Activity, Wrench } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom"; // شلنا الـ Outlet
import { useGet } from "@/hooks/useGet";
import StatCard from "./StatCard";

const Dashboard = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { data, isLoading } = useGet(["dashboard-stats"], "/api/admin/dashboard");
    const stats = data?.data?.dashboard;

    // حالة التحميل (عشان لو الداتا لسه بتيجي)
    if (isLoading) return <div className="p-6 text-center">Loading...</div>;

    return (
        <div className="p-6 space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-[#003366]">{t('fleet_overview')}</h1>
                <p className="text-slate-500">{t('real_time_monitoring')}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* كارت كل الأتوبيسات */}
                <StatCard
                    title={t('total_buses')}
                    value={stats?.totalBuses || 0}
                    icon={Bus}
                    colorClass="bg-blue-100"

                />
                {/* كارت الأتوبيسات النشطة */}
                <StatCard
                    title={t('active_buses')}
                    value={stats?.activeBuses || 0}
                    icon={Activity}
                    colorClass="bg-green-100"

                />
                {/* كارت أتوبيسات الصيانة */}
                <StatCard
                    title={t('maintenance')}
                    value={stats?.maintenanceBuses || 0}
                    icon={Wrench}
                    colorClass="bg-orange-100"
                    onClick={() => navigate("/dashboard/garages?filter=maintenance")}
                />
            </div>
        </div>
    );
};

export default Dashboard;