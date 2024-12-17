import { useMutation, useQuery } from '@tanstack/react-query';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

export const useExpertResponse = (chatId: number, expertId: number) => {
  return useQuery({
    queryKey: ['expertResponse', chatId, expertId],
    queryFn: async () => {
      const response = await axios.post(
        `${API_BASE_URL}/chats/${chatId}/experts/${expertId}/respond`,
        {},
        {
          responseType: 'stream',
          onDownloadProgress: progressEvent => {
            // 處理串流資料
            const chunk = progressEvent.event.target.response;
            if (chunk) {
              return chunk;
            }
          },
        }
      );
      return response.data;
    },
    enabled: !!chatId && !!expertId,
  });
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
