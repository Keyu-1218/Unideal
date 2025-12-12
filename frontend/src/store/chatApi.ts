import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "@/store/store";

// === TYPES ===
export interface Message {
  id: number;
  conversation: number;
  sender: number;
  content: string;
  created_at: string;
}

export interface Conversation {
  id: number;
  product: number;
  buyer: number;
  seller: number;
  title: string;
  short_description: string;
  price: string;
  is_buyer: boolean;
}

export interface GetConversationsResponse {
  conversations: Conversation[];
}

export interface SendMessageRequest {
  conversationId: number;
  content: string;
}

export interface GetMessagesResponse {
  messages: Message[];
}

export interface StartConversationResponse {
  message: string;
  id: number;
}

// === API ===
export const chatApi = createApi({
  reducerPath: "chatApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_BASE_DEV_URL || "http://localhost:5000",
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Messages", "Conversations"],
  endpoints: (builder) => ({
    getConversations: builder.query<Conversation[], void>({
      query: () => "/products/conversations",
      transformResponse: (response: GetConversationsResponse) =>
        response.conversations,
      providesTags: ["Conversations"],
    }),

    getMessages: builder.query<Message[], number>({
      query: (conversationId) =>
        `/products/conversations/${conversationId}/messages`,
      transformResponse: (response: GetMessagesResponse) => response.messages,
      providesTags: (result, error, conversationId) => [
        { type: "Messages", id: conversationId },
      ],
    }),

    sendMessage: builder.mutation<void, SendMessageRequest>({
      query: ({ conversationId, content }) => ({
        url: `/products/conversations/${conversationId}/messages`,
        method: "POST",
        body: { content },
      }),
      async onQueryStarted(
        { conversationId, content },
        { dispatch, queryFulfilled, getState }
      ) {
        const state = getState() as RootState;
        const userId = state.auth.user?.id;

        if (!userId) return;

        const tempMessage: Message = {
          id: -Date.now(),
          conversation: conversationId,
          sender: userId,
          content,
          created_at: new Date().toISOString(),
        };

        const patchResult = dispatch(
          chatApi.util.updateQueryData(
            "getMessages",
            conversationId,
            (draft) => {
              draft.push(tempMessage);
            }
          )
        );

        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
      invalidatesTags: (result, error, { conversationId }) => [
        { type: "Messages", id: conversationId },
      ],
    }),

    startConversation: builder.mutation<StartConversationResponse, number>({
      query: (productId) => ({
        url: `/products/${productId}/start-conversation`,
        method: "POST",
      }),
      invalidatesTags: ["Conversations"],
    }),
  }),
});

export const {
  useGetConversationsQuery,
  useGetMessagesQuery,
  useSendMessageMutation,
  useStartConversationMutation,
} = chatApi;
