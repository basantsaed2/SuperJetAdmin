import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { THEME } from '@/utils/theme';

const Unauthorized = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center animate-in fade-in zoom-in-95 duration-500">
            <div className="bg-red-50 p-6 rounded-full mb-6 relative">
                <div className="absolute inset-0 bg-red-100 rounded-full animate-ping opacity-75"></div>
                <ShieldAlert className="w-16 h-16 text-red-500 relative z-10" />
            </div>

            <h1 className="text-3xl font-black text-slate-800 mb-3 tracking-tight">
                {t('access_denied', 'Access Denied')}
            </h1>

            <p className="text-slate-500 max-w-md mx-auto mb-8 font-medium">
                {t('unauthorized_message', 'You do not have permission to view this page. Please contact your system administrator if you believe this is an error.')}
            </p>

            <div className="flex gap-4">
                <Button
                    variant="outline"
                    onClick={() => navigate(-1)}
                    className="border-slate-200 text-slate-600 hover:bg-slate-50"
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    {t('go_back', 'Go Back')}
                </Button>

                <Button
                    onClick={() => navigate('/dashboard')}
                    className={`text-white font-bold ${THEME.colors.primary} hover:opacity-90 shadow-lg`}
                >
                    {t('go_home', 'Go to Dashboard')}
                </Button>
            </div>
        </div>
    );
};

export default Unauthorized;
