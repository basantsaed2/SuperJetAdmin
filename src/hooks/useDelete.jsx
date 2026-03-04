// src/hooks/useDelete.jsx
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '../api/axiosInstance';
import { toast } from 'sonner';

export const useDelete = (url, queryKeyToInvalidate, successMessage) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id) => {
            // Typically deletes at /endpoint/:id
            const { data } = await axiosInstance.delete(`${url}/${id}`);
            return data;
        },
        onSuccess: (data) => {
            const msg = typeof successMessage === 'function' 
                ? successMessage(data) 
                : successMessage || 'Deleted successfully';
            toast.success(msg);
            
            if (queryKeyToInvalidate) {
                queryClient.invalidateQueries({ queryKey: queryKeyToInvalidate });
            }
        },
        onError: (error) => {
            const message = error.response?.data?.message || 'Failed to delete';
            toast.error(message);
        },
    });
};