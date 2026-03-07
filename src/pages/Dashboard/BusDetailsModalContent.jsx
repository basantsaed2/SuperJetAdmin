import * as React from "react";
import { useGet } from "@/hooks/useGet";
import { Loader2, AlertTriangle } from "lucide-react";
import { useTranslation } from "react-i18next";
import { BusDetailsView } from "./BusDetailsView";

const BusDetailsModalContent = ({ busId }) => {
    const { t } = useTranslation();

    const { data, isLoading, error } = useGet(
        ["bus-details-modal", busId],
        `/api/admin/dashboard/buses/${busId}/checkin-details`,
        { enabled: !!busId }
    );

    if (isLoading) return (
        <div className="h-64 flex flex-col items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <p className="mt-4 text-slate-500 text-sm">{t('loading_details')}...</p>
        </div>
    );

    if (error) return (
        <div className="h-64 flex flex-col items-center justify-center text-red-500">
            <AlertTriangle className="h-8 w-8 mb-2" />
            <p>{t('error_loading_data')}</p>
        </div>
    );

    const busInfo = data?.data?.bus;

    return <BusDetailsView busInfo={busInfo} />;
};

export default BusDetailsModalContent;
