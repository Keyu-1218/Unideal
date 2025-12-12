import axios from "axios";

export const startConversation = async (productId: number, token: string): Promise<number> => {
    const postResponse = await axios.post(`http://localhost:5000/products/${productId}/start-conversation`, {}, {
        headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${token}`,
        },
    });
    return postResponse.data.id;
};

export const getConversations = async (token: string): Promise<any[]> => {
    const response = await axios.get(`http://localhost:5000/products/conversations`, {
        headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${token}`,
        },
    });
    return response.data.conversations;
};