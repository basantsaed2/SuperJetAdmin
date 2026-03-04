// src/hooks/useGet.jsx
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../api/axiosInstance';

export const useGet = (key, url, options = {}) => {
    return useQuery({
        queryKey: key,
        queryFn: async () => {
            const { data } = await axiosInstance.get(url);
            return data;
        },
        ...options,
    });
};