import { useAuthStore } from "@/stores/useAuthStore";

import Logout from "@/components/auth/logout";

const ChatAppPage = () => {
  const user = useAuthStore((state) => state.user);

  return (
    <div>
      {user?.username}
      <Logout />
    </div>
  );
};

export default ChatAppPage;
