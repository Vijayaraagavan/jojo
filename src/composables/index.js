import { useUserStore } from "@/stores/user";

export const clearAll = () => {
    const {setId} = useUserStore();
    setId('');
}