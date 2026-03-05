import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const StatCard = ({ title, value, icon: Icon, colorClass, onClick, subtitle }) => (
    <motion.div
        whileHover={{ y: -5 }}
        onClick={onClick}
        className={cn(
            "relative overflow-hidden cursor-pointer p-6 rounded-2xl border border-white/60 shadow-sm transition-all bg-white",
            "hover:shadow-md active:scale-95"
        )}
    >
        {/* Background Pattern/Glow */}
        <div className={cn("absolute -right-4 -top-4 w-24 h-24 rounded-full opacity-10", colorClass)} />

        <div className="flex justify-between items-start">
            <div className="space-y-3">
                <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">{title}</p>
                <div className="flex items-baseline gap-2">
                    <h2 className="text-3xl font-bold text-slate-800">{value}</h2>
                    {subtitle && <span className="text-xs font-semibold text-slate-400">{subtitle}</span>}
                </div>
            </div>

            <div className={cn("p-3 rounded-xl", colorClass.replace('bg-', 'text-').replace('100', '600'), colorClass)}>
                <Icon className="w-6 h-6" />
            </div>
        </div>
    </motion.div>
);

export default StatCard;
