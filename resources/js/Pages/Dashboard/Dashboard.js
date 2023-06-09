import axios from "axios";
import { ref, onMounted, defineComponent, reactive } from "vue";
import router from "../../routes";
import { useFaqStore } from "../../Store/faq";
import Cookies from "js-cookie";
import { useQandaStore } from "../../Store/qanda";

export default defineComponent({
    setup() {
        const user = ref();
        const faqs = ref();
        let isModalOpen = ref(false);
        const faqStore = useFaqStore();
        const qandaStore = useQandaStore();
        let updateID = ref(0);
        const faq = reactive({
            question: "",
            answer: "",
        });

        const faqUpdateData = reactive({
            question: "",
            answer: "",
        });

        const index = async () => {
            await faqStore.index();

            faqs.value = faqStore.getFaq;

            console.log(faqs.value.faqs[0]);
        };

        const openUpdateModal = async (id, question, answer) => {
            updateID = id;
            isModalOpen.value = true;
            console.log(isModalOpen.value);
            faqUpdateData.question = question;
            faqUpdateData.answer = answer;
        }
        
        const closeUpdateModal = async () => {
            updateID = 0;
            isModalOpen.value = false;
            faqUpdateData.question = '';
            faqUpdateData.answer = '';
        }

        onMounted(async () => {
            await axios
                .get("api/user")
                .then((res) => {
                    console.log(res);
                })
                .catch((error) => {
                    router.push("/admin_login");
                });

            await index();
        });

        const store = async () => {
            if (faq.question == "" && faq.answer == "") {
                alert("Question and answer must not be empty!");
                return;
            }

            const faqData = {
                question: faq.question,
                answer: faq.answer,
            };

            await faqStore.store(faqData);
            await index();
            faq.question = "";
            faq.answer = "";
        };

        const update = async () => {
            if (faqUpdateData.question == "" && faqUpdateData.answer == "") {
                alert("Question and answer must not be empty!");
                return;
            }

            const faqData = {
                question: faqUpdateData.question,
                answer: faqUpdateData.answer,
            };

            await faqStore.update(updateID, faqData);
            await index();
            updateID = 0;
            faqUpdateData.question = "";
            faqUpdateData.answer = "";
            isModalOpen.value = false;
        };

        const download = async () => {
            await qandaStore.download();
        };

        const destroy = async (id) => {
            await faqStore.delete(id);
            await index();
            faq.question = "";
            faq.answer = "";
        };

        return {
            openUpdateModal,
            closeUpdateModal,
            faqUpdateData,
            isModalOpen,
            update,
            faq,
            faqs,
            store,
            destroy,
            download
        };
    },
});
