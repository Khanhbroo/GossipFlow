import { create } from "zustand";
import { toast } from "sonner";
import { authService } from "@/services/authService";
import type { AuthState } from "@/types/store";

export const useAuthStore = create<AuthState>((set, get) => ({
  accessToken: null,
  user: null,
  loading: false,

  clearState: () => {
    set({ accessToken: null, user: null, loading: false });
  },

  signUp: async (username, password, email, firstName, lastName) => {
    try {
      set({ loading: true });

      // Call API
      await authService.signUp(username, password, email, firstName, lastName);

      toast.success(
        "Signed up successfully! You will be redirected to sign in page"
      );
    } catch (error) {
      console.error(error);
      toast.error("Failed to sign up");
    } finally {
      set({ loading: false });
    }
  },

  signIn: async (username, password) => {
    try {
      set({ loading: true });

      //   Call API
      const { accessToken } = await authService.signIn(username, password);
      set({ accessToken });

      // Set user data to the store
      await get().fetchMe();

      toast.success("Welcome back to GossipFlow 🎉");
    } catch (error) {
      console.error(error);
      toast.error("Failed to sign in");
    } finally {
      set({ loading: false });
    }
  },

  signOut: async () => {
    try {
      get().clearState();
      await authService.signOut();
      toast.success("Logout successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to sign out");
    }
  },

  fetchMe: async () => {
    try {
      set({ loading: true });
      const user = await authService.fetchMe();
      set({ user });
    } catch (error) {
      console.error(error);
      set({ user: null, accessToken: null });
      toast.error("Failed to fetch user data. Please try again!");
    } finally {
      set({ loading: false });
    }
  },
}));
