// src/hooks/useUpdate.jsx
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import axiosInstance from '../api/axiosInstance';
import { toast } from 'sonner';

export const useUpdate = (url, queryKeyToInvalidate, successMessage) => {
    const queryClient = useQueryClient();
    const { t } = useTranslation();

    return useMutation({
        mutationFn: async ({ id, updatedData }) => {
            const { data } = await axiosInstance.put(`${url}/${id}`, updatedData);
            return data;
        },
        onSuccess: (data) => {
            const msg = typeof successMessage === 'function'
                ? successMessage(data)
                : successMessage || t('updated_successfully');
            toast.success(msg);

            if (queryKeyToInvalidate) {
                queryClient.invalidateQueries({ queryKey: queryKeyToInvalidate });
            }
        },
        onError: (error) => {
            console.error("Update Error Response:", error.response?.data);
            const data = error.response?.data;
            let errMsg = data?.message ||
                data?.error?.message ||
                data?.error ||
                data?.errors?.message ||
                (data?.errors && typeof data.errors === 'object' ? Object.values(data.errors)[0] : null);

            if (typeof errMsg === 'object' && errMsg !== null) {
                errMsg = errMsg.message || errMsg.error || JSON.stringify(errMsg);
            }

            const finalMessage = (typeof errMsg === 'string' ? errMsg : null) || error.message || t('update_failed');
            toast.error(finalMessage);
        },
    });
};