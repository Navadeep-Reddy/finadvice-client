import axios from 'axios';

const api = axios.create({
    // Updated fallback to port 8000 (ML Service)
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
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
    // Note: Removed /api/ml prefix as ML service uses /api/ml/* routes directly 
    // BUT we need to check if ML service expects /api/ml prefix or not.
    // Based on main.py: app.include_router(chat.router, prefix="/api/ml", tags=["Chat"])
    // So the path is indeed /api/ml/chat/${userId}
    
    const response = await api.post<ChatResponse>(`/api/ml/chat/${userId}`, {
        message,
        session_id: sessionId
    });
    return response.data;
};

export const clearChatSession = async (userId: string, sessionId: string): Promise<void> => {
    await api.delete(`/api/ml/chat/${userId}/session/${sessionId}`);
};