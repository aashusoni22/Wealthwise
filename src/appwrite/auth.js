import conf from "../conf/conf";
import { Client, Account, ID } from "appwrite";
import { SecurityUtils } from "../utils/security/index";

export class AuthService {
  client = new Client();
  account;
  static instance = null;
  static sessionCache = {
    user: null,
    lastCheck: 0,
    isValid: false,
  };
  static CACHE_DURATION = 30000; // 30 seconds

  constructor() {
    if (AuthService.instance) {
      return AuthService.instance;
    }
    this.client
      .setEndpoint(conf.appwriteUrl)
      .setProject(conf.appwriteProjectId);
    this.account = new Account(this.client);
    AuthService.instance = this;
  }

  // Input validation helper
  validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error("Invalid email format");
    }
    return SecurityUtils.sanitizeInput(email);
  }

  validatePassword(password) {
    if (password.length < 8) {
      throw new Error("Password must be at least 8 characters long");
    }
    if (!/[A-Z]/.test(password)) {
      throw new Error("Password must contain at least one uppercase letter");
    }
    if (!/[a-z]/.test(password)) {
      throw new Error("Password must contain at least one lowercase letter");
    }
    if (!/[0-9]/.test(password)) {
      throw new Error("Password must contain at least one number");
    }
    return password;
  }

  // Create a new account
  async createAccount({ name, email, password }) {
    try {
      const sanitizedEmail = this.validateEmail(email);
      const validatedPassword = this.validatePassword(password);

      const userAccount = await this.account.create(
        ID.unique(),
        sanitizedEmail,
        validatedPassword,
        SecurityUtils.sanitizeInput(name)
      );

      if (userAccount) {
        // Automatically log in the user after successful registration
        await this.login({
          email: sanitizedEmail,
          password: validatedPassword,
        });
      }

      return userAccount;
    } catch (error) {
      if (error.code === 409) {
        throw new Error("A user with this email already exists.");
      } else if (
        error.message.includes("Invalid email format") ||
        error.message.includes("Password must")
      ) {
        throw error;
      } else {
        console.error("Appwrite service :: createAccount :: error", error);
        throw new Error("Failed to create account. Please try again.");
      }
    }
  }

  // login with email and password
  async login({ email, password }) {
    try {
      const sanitizedEmail = this.validateEmail(email);

      const currentUser = await this.getCurrentUser();
      if (currentUser) {
        return currentUser;
      }

      await this.account.createEmailPasswordSession(sanitizedEmail, password);
      const user = await this.getCurrentUser();

      if (user) {
        SecurityUtils.setSession(user.$id);
        AuthService.sessionCache = {
          user,
          lastCheck: Date.now(),
          isValid: true,
        };
      }

      return user;
    } catch (error) {
      if (error.code === 401) {
        throw new Error("Invalid email or password");
      } else if (error.code === 429) {
        throw new Error("Too many login attempts. Please try again later.");
      } else {
        console.error("Appwrite service :: login :: error", error);
        throw new Error("Login failed. Please try again.");
      }
    }
  }

  // Google OAuth login
  async loginWithGoogle() {
    try {
      const successUrl = `${window.location.origin}/auth/success`;
      const failureUrl = `${window.location.origin}/auth/failure`;

      await this.account.createOAuth2Session("google", successUrl, failureUrl);
    } catch (error) {
      console.error("Appwrite service :: loginWithGoogle :: error", error);
      throw new Error("Failed to initiate Google login. Please try again.");
    }
  }

  // get current user with caching
  async getCurrentUser() {
    try {
      // Check cache first
      if (
        AuthService.sessionCache.user &&
        Date.now() - AuthService.sessionCache.lastCheck <
          AuthService.CACHE_DURATION
      ) {
        return AuthService.sessionCache.user;
      }

      const user = await this.account.get();
      AuthService.sessionCache = {
        user,
        lastCheck: Date.now(),
        isValid: true,
      };
      return user;
    } catch (error) {
      if (error.code === 401) {
        console.log(
          "User is not logged in or does not have an active session."
        );
        AuthService.sessionCache = {
          user: null,
          lastCheck: Date.now(),
          isValid: false,
        };
        return null;
      } else {
        console.error("Appwrite service :: getCurrentUser :: error", error);
        throw new Error("Failed to get user information");
      }
    }
  }

  // Method to get the current user ID
  async getCurrentUserId() {
    try {
      const user = await this.getCurrentUser();
      return user?.$id;
    } catch (error) {
      console.error("Appwrite service :: getCurrentUserId :: error", error);
      return null;
    }
  }

  // Check if session is valid with caching
  async isSessionValid() {
    try {
      // Check cache first
      if (
        Date.now() - AuthService.sessionCache.lastCheck <
        AuthService.CACHE_DURATION
      ) {
        return AuthService.sessionCache.isValid;
      }

      const user = await this.getCurrentUser();
      return !!user;
    } catch (error) {
      return false;
    }
  }

  // logout user
  async logout() {
    try {
      await this.account.deleteSessions();
      SecurityUtils.clearSession();
      // Only clear auth-related items from localStorage
      localStorage.removeItem("auth_token");
      localStorage.removeItem("user_id");
      // Clear cache
      AuthService.sessionCache = {
        user: null,
        lastCheck: Date.now(),
        isValid: false,
      };
      // Use a more graceful navigation approach
      window.location.href = "/login";
    } catch (error) {
      console.error("Appwrite service :: logout :: error", error);
      throw new Error("Failed to logout. Please try again.");
    }
  }

  // forgot password
  async forgotPassword(email) {
    try {
      const sanitizedEmail = this.validateEmail(email);
      const resetUrl = `${window.location.origin}/reset-password`;
      await this.account.createRecovery(sanitizedEmail, resetUrl);
      return true;
    } catch (error) {
      console.error("Appwrite service :: forgotPassword :: error", error);
      throw new Error(
        "Failed to process password reset request. Please try again."
      );
    }
  }

  // reset password
  async resetPassword(userId, secret, newPassword, confirmPassword) {
    try {
      if (newPassword !== confirmPassword) {
        throw new Error("Passwords do not match");
      }

      const validatedPassword = this.validatePassword(newPassword);

      await this.account.updateRecovery(
        userId,
        secret,
        validatedPassword,
        validatedPassword
      );
      return true;
    } catch (error) {
      console.error("Appwrite service :: resetPassword :: error", error);
      if (error.message.includes("Password must")) {
        throw error;
      }
      throw new Error("Failed to reset password. Please try again.");
    }
  }
}

// Export a singleton instance
const authService = new AuthService();
export default authService;
