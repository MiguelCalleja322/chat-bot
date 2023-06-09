import { defineStore } from "pinia";
import axios from "axios";
const name = "api/chat";

export const useChatStore = defineStore("chat", {
    state: () => ({
        chat: null,
        error: null,
    }),

    actions: {
        async index() {
            await axios
                .get(`${name}`)
                .then((response) => {
                    this.chat = response.data;
                })
                .catch((error) => {});
        },

        async chatUsingML(chatData) {
            await axios
                .post(`${name}/chatUsingML`, chatData)
                .then((response) => {})
                .catch((error) => {
                    this.error = error;
                });
        },

        async chatUsingChatGPT(chatData) {
            await axios
                .post(`${name}/chatUsingChatGPT`, chatData)
                .then((response) => {})
                .catch((error) => {
                    this.error = error;
                });
        },

        async delete() {
            await axios
                .post(`${name}/delete`)
                .then((response) => {
                    this.auth = 0;
                })
                .catch((error) => {
                    this.error = error;
                });
        },
    },

    getters: {
        getChat(state) {
            return state.chat;
        },

        getError(state) {
            return state.error;
        },
    },
});
