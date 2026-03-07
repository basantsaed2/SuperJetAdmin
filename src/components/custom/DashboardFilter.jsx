import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, Filter, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import i18n from '@/i18n';

const DashboardFilter = ({ value, onChange, options, className }) => {
    const { t } = useTranslation();
    const [searchTerm, setSearchTerm] = useState("");

    const filteredOptions = useMemo(() => {
        return options.filter(opt => opt.toLowerCase().includes(searchTerm.toLowerCase()));
    }, [options, searchTerm]);

    return (
        <div className={cn("flex items-center gap-3 bg-white/50 backdrop-blur-sm p-1.5 rounded-xl border border-slate-200 shadow-sm w-full md:w-64 self-end md:self-auto group transition-all hover:border-blue-300", className)}>
            <DropdownMenu onOpenChange={(open) => open && setSearchTerm("")}>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="w-full justify-between h-9 px-3 font-bold text-slate-700 hover:bg-transparent">
                        <div className="flex items-center gap-2 truncate">
                            <Filter size={16} className="text-slate-400 group-hover:text-blue-500 transition-colors" />
                            <span>{value === 'all' ? t('all') : value}</span>
                        </div>
                        <ChevronRight size={16} className="text-slate-400 rotate-90" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                    align={t('dir') === 'rtl' ? 'end' : 'start'}
                    className="w-[var(--radix-dropdown-menu-trigger-width)] z-[9999] bg-white border-slate-100 shadow-xl rounded-xl overflow-hidden p-0"
                >
                    <div className="p-2 border-b border-slate-50 sticky top-0 bg-white/80 backdrop-blur-md z-10 text-start" dir={t('dir')}>
                        <div className="relative" dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>
                            <Search className="absolute ltr:left-3 rtl:right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <Input
                                placeholder={t('search_by')}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="h-9 text-xs ltr:pl-10 rtl:pr-10 ltr:pr-3 rtl:pl-3 bg-slate-50 border-transparent focus-visible:ring-1 focus-visible:ring-blue-500/20"
                            />
                        </div>
                    </div>
                    <div className="max-h-64 overflow-y-auto p-1" dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>
                        <DropdownMenuItem
                            onClick={() => onChange('all')}
                            className={cn(
                                "font-bold py-2.5 px-3 focus:bg-blue-50 focus:text-blue-600 cursor-pointer rounded-lg transition-colors ltr:text-left rtl:text-right",
                                value === 'all' && "bg-blue-50 text-blue-600"
                            )}
                        >
                            {t('all')}
                        </DropdownMenuItem>
                        {filteredOptions.map((opt) => (
                            <DropdownMenuItem
                                key={opt}
                                onClick={() => onChange(opt)}
                                className={cn(
                                    "font-bold py-2.5 px-3 focus:bg-blue-50 focus:text-blue-600 cursor-pointer rounded-lg transition-colors ltr:text-left rtl:text-right",
                                    value === opt && "bg-blue-50 text-blue-600"
                                )}
                            >
                                {opt}
                            </DropdownMenuItem>
                        ))}
                        {filteredOptions.length === 0 && searchTerm && (
                            <div className="p-4 text-center text-xs text-slate-400 font-medium">
                                {t('no_records_found')}
                            </div>
                        )}
                    </div>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
};

export default DashboardFilter;
