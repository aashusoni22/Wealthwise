import conf from "../conf/conf";
import { Client, Account, ID } from "appwrite";

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
      const currentUser = await this.getCurrentUser();
      if (currentUser) {
        console.log("User is already logged in:", currentUser);
        return currentUser; // Use existing session
      }

      // If no session exists, create a new one
      return await this.account.createEmailPasswordSession(email, password);
    } catch (error) {
      if (error.message.includes("session is active")) {
        console.log(
          "Session already active. Logging out and logging in again."
        );
        await this.logout(); // Log out the current session
        return await this.account.createEmailPasswordSession(email, password);
      } else if (error.code === 401) {
        // Handle unauthorized errors
        console.log("Invalid login credentials");
        throw new Error("Invalid email or password.");
      } else {
        console.log("Appwrite service :: login :: error", error);
        throw error; // Re-throw the error for further handling
      }
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
      return null; // Return null if there's an issue (e.g., not logged in)
    }
  }

  // logout user
  async logout() {
    try {
      const currentUser = await this.getCurrentUser(); // Check if user is logged in
      if (!currentUser) {
        console.log("No active session found. Skipping logout.");
        return;
      }
      await this.account.deleteSessions(); // Only call this if a session exists
    } catch (error) {
      console.log("Appwrite service :: logout :: error", error);
    }
  }
}

const authService = new AuthService();

export default authService;
