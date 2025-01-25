import conf from "../conf/conf";
import { Client, Account, ID } from "appwrite";
import { SecurityUtils } from "../utils/security/index";

export class AuthService {
  client = new Client();
  account;

  constructor() {
    this.client
      .setEndpoint(conf.appwriteUrl)
      .setProject(conf.appwriteProjectId);
    this.account = new Account(this.client);
  }

  // Create a new account
  async createAccount({ name, email, password }) {
    try {
      const userAccount = await this.account.create(
        ID.unique(),
        email,
        password,
        name
      );

      return userAccount;
    } catch (error) {
      if (error.code === 409) {
        throw new Error("A user with this email already exists.");
      } else {
        console.log("Appwrite service :: createAccount :: error", error);
        throw error;
      }
    }
  }

  // login with email and password
  async login({ email, password }) {
    try {
      const sanitizedEmail = SecurityUtils.sanitizeInput(email);

      const currentUser = await this.getCurrentUser();
      if (currentUser) {
        return currentUser;
      }

      await this.account.createEmailPasswordSession(sanitizedEmail, password);
      const user = await this.getCurrentUser();

      if (user) {
        SecurityUtils.setSession(); // Set session when login successful
      }

      return user;
    } catch (error) {
      throw error;
    }
  }

  // get current user
  async getCurrentUser() {
    try {
      const user = await this.account.get();
      return user;
    } catch (error) {
      if (error.code === 401) {
        console.log(
          "User is not logged in or does not have an active session."
        );
      } else {
        console.log("Appwrite service :: getCurrentUser :: error", error);
      }
      return null;
    }
  }

  // Method to get the current user ID
  async getCurrentUserId() {
    try {
      const user = await this.account.get();
      return user.$id;
    } catch (error) {
      console.error("Appwrite service :: getCurrentUserId :: error", error);
      return null;
    }
  }

  // logout user
  async logout() {
    try {
      await this.account.deleteSessions();
      SecurityUtils.clearSession();
      localStorage.clear();
      window.location.reload();
    } catch (error) {
      console.error("Appwrite service :: logout :: error", error);
    }
  }

  // forgot password
  async forgotPassword(email) {
    try {
      await this.account.createRecovery(
        email,
        "http://localhost:5173/reset-password"
      );
      return true;
    } catch (error) {
      console.error("Appwrite service :: forgotPassword :: error", error);
      throw error;
    }
  }

  // reset password
  async resetPassword(userId, secret, newPassword, confirmPassword) {
    try {
      if (newPassword !== confirmPassword) {
        throw new Error("Passwords do not match");
      }

      await this.account.updateRecovery(
        userId,
        secret,
        newPassword,
        confirmPassword
      );
      return true;
    } catch (error) {
      console.error("Appwrite service :: resetPassword :: error", error);
      throw error;
    }
  }
}

const authService = new AuthService();

export default authService;
