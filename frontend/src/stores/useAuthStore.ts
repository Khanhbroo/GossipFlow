import { create } from "zustand";
import { toast } from "sonner";
import { authService } from "@/services/authService";
import type { AuthState } from "@/types/store";

export const useAuthStore = create<AuthState>((set, get) => ({
  accessToken: null,
  user: null,
  loading: false,

  signUp: async (username, password, email, firstName, lastName) => {
    try {
      set({ loading: true });

      // Call API
      await authService.signUp(username, password, email, firstName, lastName);

      toast.success(
        "Signed up successfully! You will be redirected to sign in page"
      );
    } catch (error) {
      console.log(error);
      toast.error("Failed to sign up");
    } finally {
      set({ loading: false });
    }
  },
}));
