import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001',
    headers: { 'Content-Type': 'application/json' }
});

export interface ChatResponse {
    response: string;
    session_id: string;
    data_accessed?: string[];
}

export const sendChatMessage = async (
    userId: string,
    message: string,
    sessionId?: string
): Promise<ChatResponse> => {
    const response = await api.post<ChatResponse>(`/api/ml/chat/${userId}`, {
        message,
        session_id: sessionId
    });
    return response.data;
};

export const clearChatSession = async (userId: string, sessionId: string): Promise<void> => {
    await api.delete(`/api/ml/chat/${userId}/session/${sessionId}`);
};
