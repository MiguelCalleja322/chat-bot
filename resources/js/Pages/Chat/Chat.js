import { nextTick, onMounted, reactive, ref } from "vue";
import { useChatStore } from "../../Store/chat";

export default {
    setup() {
        const chats = ref();
        const messageExists = ref(false);
        const chatStore = useChatStore();
        let chatMode = ref('BSUML');
        const chat = reactive({
            question: "",
            answer: "",
        });

        const index = async () => {
            await chatStore.index();
            chats.value = chatStore.getChat;

            if (chats.value.chats.length > 0) {
                messageExists.value = true;
            } else {
                messageExists.value = false;
            }
        };

        const scrollToBottom = async () => {
            await window.scrollTo({
                top: document.documentElement.scrollHeight,
                behavior: "smooth",
            });
        };

        onMounted(async () => {
            await index();

            await nextTick();

            await scrollToBottom();
        });

        const clear = async () => {
            await chatStore.delete();
            await index();

            await scrollToBottom();
        };

        const store = async () => {

            if (chat.question == "") {
                alert("Question and answer must not be empty!");
                return;
            }

            const chatData = {
                question: chat.question,
            };

            if(chatMode.value == 'BSUML'){
                await chatStore.chatUsingML(chatData);
            }else{
                await chatStore.chatUsingChatGPT(chatData);
            }

            
            await index();
            chat.question = "";

            await scrollToBottom();
        };

        return {
            chatMode,
            messageExists,
            chat,
            chats,
            store,
            clear,
        };
    },
};
