// src/hooks/useUpdate.jsx
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '../api/axiosInstance';
import { toast } from 'sonner';

export const useUpdate = (url, queryKeyToInvalidate) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, updatedData }) => {
            const { data } = await axiosInstance.put(`${url}/${id}`, updatedData);
            return data;
        },
        onSuccess: () => {
            toast.success('Updated successfully');
            if (queryKeyToInvalidate) {
                queryClient.invalidateQueries({ queryKey: queryKeyToInvalidate });
            }
        },
        onError: (error) => {
            const message = error.response?.data?.message || 'Update failed';
            toast.error(message);
        },
    });
};