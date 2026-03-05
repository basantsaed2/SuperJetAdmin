import { useNavigate } from "react-router-dom";
import FormHeader from "@/components/custom/FormHeader";
import { useTranslation } from "react-i18next";
import { useGet } from "@/hooks/useGet";
import { Warehouse, Bus, Power, PowerOff, Wrench, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const GaragesStatsPage = () => {
    const { data, isLoading } = useGet(["garages-stats"], "/api/admin/dashboard/garages-stats");
    const { t } = useTranslation();
    const navigate = useNavigate();
    const garages = data?.data?.garages || [];

    return (
        <div className="p-6 space-y-8 animate-in fade-in duration-500">
            <FormHeader
                title={
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
                            <Warehouse size={24} />
                        </div>
                        {t('garages_distribution')}
                    </div>
                }
                onBackClick={() => navigate("/dashboard")}
            />

            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {garages.map((garage) => (
                    <motion.div
                        key={garage.garageId}
                        whileHover={{ y: -5, shadow: "0 20px 25px -5px rgb(0 0 0 / 0.1)" }}
                        onClick={() => navigate(`/dashboard/garages/${garage.garageId}/buses`)}
                        className={cn(
                            "relative group flex flex-col p-6 bg-white border border-slate-100 rounded-2xl cursor-pointer transition-all duration-300",
                            "hover:border-blue-200"
                        )}
                    >
                        {/* Header Part */}
                        <div className="flex justify-between items-start mb-6">
                            <div className="space-y-1">
                                <h3 className="font-bold text-xl text-slate-800 group-hover:text-blue-600 transition-colors">
                                    {garage.garageName}
                                </h3>
                                <div className="flex items-center gap-1.5 text-slate-400 text-sm">
                                    <Bus size={14} />
                                    <span>{t('total_capacity')}: {garage.totalBuses}</span>
                                </div>
                            </div>
                            <div className="p-2.5 rounded-xl bg-slate-50 text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-500 transition-all rtl-mirror">
                                <ChevronRight size={20} />
                            </div>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-3 gap-3">
                            <div className="flex flex-col items-center p-3 rounded-xl bg-green-50/50 border border-green-100/30">
                                <Power className="w-4 h-4 text-green-500 mb-1" />
                                <span className="text-lg font-bold text-green-700 leading-none">{garage.activeCount}</span>
                                <span className="text-[10px] uppercase font-black tracking-tighter text-green-600/70 mt-1">{t('active')}</span>
                            </div>

                            <div className="flex flex-col items-center p-3 rounded-xl bg-orange-50/50 border border-orange-100/30">
                                <Wrench className="w-4 h-4 text-orange-500 mb-1" />
                                <span className="text-lg font-bold text-orange-700 leading-none">{garage.maintenanceCount}</span>
                                <span className="text-[10px] uppercase font-black tracking-tighter text-orange-600/70 mt-1">{t('maintenance')}</span>
                            </div>

                            <div className="flex flex-col items-center p-3 rounded-xl bg-slate-50/50 border border-slate-100/30">
                                <PowerOff className="w-4 h-4 text-slate-400 mb-1" />
                                <span className="text-lg font-bold text-slate-700 leading-none">{garage.inactiveCount}</span>
                                <span className="text-[10px] uppercase font-black tracking-tighter text-slate-500/70 mt-1">{t('inactive')}</span>
                            </div>
                        </div>

                        {/* Bottom Glow */}
                        <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-blue-500/0 to-transparent group-hover:via-blue-500/20 transition-all duration-500" />
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default GaragesStatsPage;
