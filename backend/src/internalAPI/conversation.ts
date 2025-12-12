import axios, { AxiosResponse } from "axios";
import MessageRepository from "../repository/message";


export const sendMessage = async (input: Omit<Parameters<MessageRepository["create"]>[0], "sender">, token?: string): Promise<AxiosResponse> => {
    const response = await axios.post(`http://localhost:5000/products/conversations/${input.conversation}/messages`, { content: input.content }, {
        headers: {
            'Content-Type': 'application/json',
            ...(token) ? { 'authorization': `Bearer ${token}` } : {},
        },
    });
    return response;
};

export const getMessages = async (conversationId: number, token?: string): ReturnType<MessageRepository["readByConversation"]> => {
    const response = await axios.get(`http://localhost:5000/products/conversations/${conversationId}/messages`, {
        headers: {
            'Content-Type': 'application/json',
            ...(token) ? { 'authorization': `Bearer ${token}` } : {},
        },
    });
    return response.data.messages;
}