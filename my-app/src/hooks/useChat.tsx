import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { useEffect, useState } from 'react';

const API_BASE_URL = 'http://localhost:8000';

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

export const useSendMessage = () => {
  return useMutation({
    mutationFn: async ({
      chatId,
      userId,
      content,
    }: {
      chatId: number;
      userId: number;
      content: string;
    }) => {
      const response = await axios.post(`${API_BASE_URL}/chats/${chatId}/messages/`, {
        user_id: userId,
        content,
      });
      return response.data;
    },
  });
};
