import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FileQuestion, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { THEME } from '@/utils/theme';

const NotFound = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h1 className="text-[120px] font-black text-transparent bg-clip-text bg-gradient-to-br from-blue-900 via-blue-600 to-emerald-500 leading-none mb-4 select-none drop-shadow-sm">
                404
            </h1>

            <div className="bg-slate-100 p-4 rounded-full mb-6">
                <FileQuestion className="w-10 h-10 text-slate-400" />
            </div>

            <h2 className="text-2xl font-bold text-slate-800 mb-3">
                {t('page_not_found', 'Page Not Found')}
            </h2>

            <p className="text-slate-500 max-w-sm mx-auto mb-8 font-medium">
                {t('page_not_found_message', 'The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.')}
            </p>

            <Button
                onClick={() => navigate('/dashboard')}
                size="lg"
                className={`text-white font-bold rounded-xl px-8 ${THEME.colors.primary} hover:opacity-95 shadow-xl shadow-blue-900/10 transition-all hover:-translate-y-0.5`}
            >
                <Home className="mr-2 h-5 w-5" />
                {t('back_to_dashboard', 'Back to Dashboard')}
            </Button>
        </div>
    );
};

export default NotFound;
