import { Expert } from '@/types/expert';
import { useMutation, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useEffect, useState } from 'react';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL;

export const useExpertResponse = (chatId: number, expertId: number) => {
  const [response, setResponse] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!chatId || !expertId) return;

    const controller = new AbortController();

    (async () => {
      setIsLoading(true);
      setError(null);

      try {
        await axios({
          method: 'POST',
          url: `${API_BASE_URL}/chats/${chatId}/experts/${expertId}/respond`,
          responseType: 'stream',
          signal: controller.signal,
          onDownloadProgress: ({ event }) => {
            const data = event.target.response;
            data && setResponse(data);
          },
        });
      } catch (err) {
        if (!axios.isCancel(err)) {
          console.error('err', err);
          setError(err as Error);
        }
      } finally {
        setIsLoading(false);
      }
    })();

    return () => controller.abort();
  }, [chatId, expertId]);

  return { data: response, isLoading, error };
};

export const useGetMessages = (chatId?: number) => {
  return useQuery({
    queryKey: ['messages', chatId],
    queryFn: async () => {
      if (!chatId) return [];
      const response = await axios.get(`${API_BASE_URL}/chats/${chatId}/messages/`);
      return response.data;
    },
    enabled: !!chatId,
  });
};

export const useGetExperts = () => {
  return useQuery<Expert[]>({
    queryKey: ['experts'],
    queryFn: async () => {
      const response = await axios.get<Expert[]>(`${API_BASE_URL}/experts/`);
      return response.data;
    },
  });
};

export const useGetUserChats = (userId: number = 1) => {
  return useQuery({
    queryKey: ['userChats', userId],
    queryFn: async () => {
      const response = await axios.get(`${API_BASE_URL}/users/${userId}/chats/`);
      return response.data;
    },
  });
};

interface AddMessageParams {
  content: string;
  chartId: number;
}

export const useAddMessage = () => {
  const mutation = useMutation<unknown, Error, AddMessageParams>({
    mutationFn: async (params: AddMessageParams, userId: number = 1) => {
      const response = await axios.post(
        `${API_BASE_URL}/chats/${params.chartId}/messages/?user_id=${userId}&content=${params.content}`
      );
      return response.data;
    },
  });

  return {
    mutateAsync: mutation.mutateAsync,
    isLoading: mutation.isPending,
  };
};

export const useCreateChatRoom = () => {
  return useMutation({
    mutationFn: async (userId: number = 1) => {
      const response = await axios.post(`${API_BASE_URL}/chats/?user_id=${userId}`);
      return response.data;
    },
  });
};
