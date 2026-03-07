import { Bus, Activity, Wrench, LayoutDashboard } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom"; // شلنا الـ Outlet
import { useGet } from "@/hooks/useGet";
import StatCard from "./StatCard";
import FormHeader from "@/components/custom/FormHeader";

const Dashboard = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { data, isLoading } = useGet(["dashboard-stats"], "/api/admin/dashboard");
    const stats = data?.data?.dashboard;

    // حالة التحميل (عشان لو الداتا لسه بتيجي)
    if (isLoading) return <div className="p-6 text-center">{t('loading')}...</div>;

    return (
        <div className="p-6 space-y-8 animate-in fade-in duration-500">
            <FormHeader
                title={
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
                            <LayoutDashboard size={24} />
                        </div>
                        {t('control_panel')}
                    </div>
                }
                subtitle={t('monitoring_subtitle')}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {/* كارت كل الأتوبيسات */}
                <StatCard
                    title={t('total_buses')}
                    value={stats?.totalBuses || 0}
                    icon={Bus}
                    colorClass="bg-blue-100"
                    onClick={() => navigate("/buses")}
                />
                {/* كارت الأتوبيسات النشطة */}
                <StatCard
                    title={t('active_buses')}
                    value={stats?.activeBuses || 0}
                    icon={Activity}
                    colorClass="bg-green-100"

                />
                {/* كارت الأتوبيسات  الغير النشطة */}
                <StatCard
                    title={t('inactive_buses')}
                    value={stats?.inactiveBuses || 0}
                    icon={Activity}
                    colorClass="bg-red-100"

                />
                {/* كارت أتوبيسات الصيانة */}
                <StatCard
                    title={t('maintenance_buses')}
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