// src/hooks/usePost.jsx
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import axiosInstance from '../api/axiosInstance';
import { toast } from 'sonner';

export const usePost = (url, queryKeyToInvalidate, successMessage) => {
    const queryClient = useQueryClient();
    const { t } = useTranslation();

    return useMutation({
        mutationFn: async (newData) => {
            const { data } = await axiosInstance.post(url, newData);
            return data;
        },
        onSuccess: (data) => {
            const msg = typeof successMessage === 'function'
                ? successMessage(data)
                : successMessage || t('created_successfully');
            toast.success(msg);

            if (queryKeyToInvalidate) {
                queryClient.invalidateQueries({ queryKey: queryKeyToInvalidate });
            }
        },
        onError: (error) => {
            const message = error.response?.data?.message || t('something_went_wrong');
            toast.error(message);
        },
    });
};