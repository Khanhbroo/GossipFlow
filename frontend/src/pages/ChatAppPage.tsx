import { useAuthStore } from "@/stores/useAuthStore";

import Logout from "@/components/auth/logout";
import { Button } from "@/components/ui/button";
import api from "@/lib/axios";
import { toast } from "sonner";

const ChatAppPage = () => {
  const user = useAuthStore((state) => state.user);

  const handleOnClick = async () => {
    try {
      await api.get("/user/test", { withCredentials: true });
      toast.success("Ok");
    } catch (error) {
      console.log(error);
      toast.error("Failed");
    }
  };

  return (
    <div>
      {user?.username}
      <Logout />

      <Button onClick={handleOnClick}>Test</Button>
    </div>
  );
};

export default ChatAppPage;
