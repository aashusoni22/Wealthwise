import conf from "../conf/conf";
import {
  Client,
  Databases,
  ID,
  Storage,
  Permission,
  Role,
  Query,
} from "appwrite";

export class AppService {
  client = new Client();
  databases;
  storage;

  constructor() {
    this.client
      .setEndpoint(conf.appwriteUrl)
      .setProject(conf.appwriteProjectId);
    this.databases = new Databases(this.client);
    this.storage = new Storage(this.client);
  }

  // EXPENSE MANAGEMENT

  //creaet a new expense
  async createExpense({
    title,
    amount,
    category,
    description,
    paymentMethod,
    date,
    status,
    userId,
  }) {
    try {
      return await this.databases.createDocument(
        conf.appwriteDatabaseId,
        conf.appwriteExpensesCollectionId,
        ID.unique(),
        {
          title,
          amount: parseFloat(amount),
          category,
          description,
          paymentMethod,
          date,
          status,
          userId,
        },
        [
          Permission.read(Role.user(userId)),
          Permission.update(Role.user(userId)),
          Permission.delete(Role.user(userId)),
        ]
      );
    } catch (error) {
      console.error("Appwrite service :: createExpense :: error", error);
      throw error;
    }
  }

  //get all expenses
  async getAllExpenses(userId) {
    try {
      return await this.databases.listDocuments(
        conf.appwriteDatabaseId,
        conf.appwriteExpensesCollectionId,
        [Query.equal("userId", userId), Query.orderDesc("$createdAt")]
      );
    } catch (error) {
      console.error("Appwrite service :: getAllExpenses :: error", error);
      throw error;
    }
  }

  // Update an expense
  async updateExpense(
    expenseId,
    { title, amount, category, description, date },
    userId
  ) {
    try {
      return await this.databases.updateDocument(
        conf.appwriteDatabaseId,
        conf.appwriteExpensesCollectionId,
        expenseId,
        {
          title,
          amount,
          category,
          description,
          date,
        },
        [
          Permission.read(Role.user(userId)),
          Permission.update(Role.user(userId)),
          Permission.delete(Role.user(userId)),
        ]
      );
    } catch (error) {
      console.error("Appwrite service :: updateExpense :: error", error);
      throw error;
    }
  }

  // Delete an expense
  async deleteExpense(expenseId, userId) {
    try {
      return await this.databases.deleteDocument(
        conf.appwriteDatabaseId,
        conf.appwriteExpensesCollectionId,
        expenseId
      );
    } catch (error) {
      console.error("Appwrite service :: deleteExpense :: error", error);
      throw error;
    }
  }
  //get total expenses for a specific month
  async getTotalExpensesForMonth(year, month) {
    try {
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0);
      const expenses = await this.getAllExpenses();
      const totalExpenses = expenses.documents.reduce(
        (acc, expense) =>
          acc +
          (expense.date >= startDate && expense.date <= endDate
            ? expense.amount
            : 0),
        0
      );
      return totalExpenses;
    } catch (error) {
      console.error(
        "Appwrite service :: getTotalExpensesForMonth :: error",
        error
      );
      throw error;
    }
  }
  //get total expenses for a specific category
  async getTotalExpensesForCategory(category) {
    try {
      const expenses = await this.getAllExpenses();
      const totalExpenses = expenses.documents.reduce(
        (acc, expense) =>
          expense.category === category ? acc + expense.amount : acc,
        0
      );
      return totalExpenses;
    } catch (error) {
      console.error(
        "Appwrite service :: getTotalExpensesForCategory :: error",
        error
      );
      throw error;
    }
  }
  //get total expenses for a specific date range
  async getTotalExpensesForDateRange(startDate, endDate) {
    try {
      const expenses = await this.getAllExpenses();
      const totalExpenses = expenses.documents.reduce(
        (acc, expense) =>
          expense.date >= startDate && expense.date <= endDate
            ? acc + expense.amount
            : acc,
        0
      );
      return totalExpenses;
    } catch (error) {
      console.error(
        "Appwrite service :: getTotalExpensesForDateRange :: error",
        error
      );
      throw error;
    }
  }

  // INCOME MANAGEMENT

  //create a new income
  async createIncome({ title, amount, source, description, date, userId }) {
    try {
      // Validate userId format before using it
      if (!userId || typeof userId !== "string" || userId.length > 36) {
        throw new Error("Invalid user ID format");
      }

      const formattedDate = new Date(date).toISOString().split("T")[0];

      // Create a sanitized version of the userId for permissions
      // Ensure it only contains allowed characters (alphanumeric, period, hyphen, underscore)
      const sanitizedUserId = userId.replace(/[^a-zA-Z0-9._-]/g, "");

      return await this.databases.createDocument(
        conf.appwriteDatabaseId,
        conf.appwriteIncomeCollectionId,
        ID.unique(),
        {
          title,
          amount: parseFloat(amount),
          source,
          description,
          date: formattedDate,
          userId,
        },
        [
          Permission.read(`user:${sanitizedUserId}`),
          Permission.update(`user:${sanitizedUserId}`),
          Permission.delete(`user:${sanitizedUserId}`),
        ]
      );
    } catch (error) {
      console.error("Appwrite service :: createIncome :: error", error);
      throw error;
    }
  }

  //get all incomes
  async getAllIncomes() {
    try {
      return await this.databases.listDocuments(
        conf.appwriteDatabaseId,
        conf.appwriteIncomeCollectionId
      );
    } catch (error) {
      console.error("Appwrite service :: getAllIncomes :: error", error);
      throw error;
    }
  }

  //Delete an income
  async deleteIncome(incomeId) {
    try {
      await this.databases.deleteDocument(
        conf.appwriteDatabaseId,
        conf.appwriteIncomeCollectionId,
        incomeId
      );
      return true;
    } catch (error) {
      console.error("Appwrite service :: deleteIncome :: error", error);
      throw error;
    }
  }

  //Update an income
  async updateIncome(incomeId, { title, amount, category, description, date }) {
    try {
      return await this.databases.updateDocument(
        conf.appwriteDatabaseId,
        conf.appwriteIncomeCollectionId,
        incomeId,
        { title, amount, category, description, date }
      );
    } catch (error) {
      console.error("Appwrite service :: updateIncome :: error", error);
      throw error;
    }
  }

  //get total incomes for a specific month
  async getTotalIncomeForMonth(year, month) {
    try {
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0);
      const incomes = await this.getAllIncomes();
      const totalIncome = incomes.reduce(
        (acc, income) =>
          acc +
          (income.date >= startDate && income.date <= endDate
            ? income.amount
            : 0)
      );
      return totalIncome;
    } catch (error) {
      console.error(
        "Appwrite service :: getTotalIncomeForMonth :: error",
        error
      );
      throw error;
    }
  }
  //get total incomes for a specific category
  async getTotalIncomeByCategory(category) {
    try {
      const incomes = await this.getAllIncomes();
      const totalIncome = incomes.reduce((acc, income) =>
        income.category == category ? acc + income.amount : 0
      );
      return totalIncome;
    } catch (error) {
      console.error(
        "Appwrite service :: getTotalIncomeByCategory :: error",
        error
      );
      throw error;
    }
  }
  //get total incomes for a specific date range
  async getTotalIncomeByDateRange(startDate, endDate) {
    try {
      const incomes = await this.getAllIncomes();
      const totalIncome = incomes.reduce((acc, income) =>
        income.date >= startDate && income.date <= endDate
          ? acc + income.amount
          : 0
      );
      return totalIncome;
    } catch (error) {
      console.error(
        "Appwrite service :: getTotalIncomeByDateRange :: error",
        error
      );
      throw error;
    }
  }

  // GOALS MANAGEMENT

  //create a new goal
  async createGoal({ title, amount, dueDate, progress }) {
    try {
      return await this.databases.createDocument(
        conf.appwriteDatabaseId,
        conf.appwriteGoalsCollectionId,
        ID.unique(),
        {
          title,
          amount,
          dueDate,
          progress,
        }
      );
    } catch (error) {
      console.error("Appwrite service :: createGoal :: error", error);
      throw error;
    }
  }

  //get all goals
  async getAllGoals() {
    try {
      return await this.databases.listDocuments(
        conf.appwriteDatabaseId,
        conf.appwriteGoalsCollectionId
      );
    } catch (error) {
      console.error("Appwrite service :: getAllGoals :: error", error);
      throw error;
    }
  }

  //Delete a goal
  async deleteGoal(goalId) {
    try {
      return await this.databases.deleteDocument(
        conf.appwriteDatabaseId,
        conf.appwriteGoalsCollectionId,
        goalId
      );
    } catch (error) {
      console.error("Appwrite service :: deleteGoal :: error", error);
      return false;
    }
  }

  //Update a goal
  async updateGoal(goalId, { title, amount, dueDate, progress }) {
    try {
      return await this.databases.updateDocument(
        conf.appwriteDatabaseId,
        conf.appwriteGoalsCollectionId,
        goalId,
        {
          title,
          amount,
          dueDate,
          progress,
        }
      );
    } catch (error) {
      console.error("Appwrite service :: updateGoal :: error", error);
      return false;
    }
  }

  //STORAGE MANAGEMENT

  //upload profile picture
  async uploadProfilePicture(file) {
    try {
      const result = await this.storage.createFile(
        conf.appwriteProfilePictureBucketId,
        ID.unique(),
        file
      );
      return result;
    } catch (error) {
      console.error("Appwrite service :: uploadProfilePicture :: error", error);
      return false;
    }
  }

  //delete profile picture
  async deleteProfilePicture(fileId) {
    try {
      await this.storage.deleteFile(
        conf.appwriteProfilePictureBucketId,
        fileId
      );
      return true;
    } catch (error) {
      console.error("Appwrite service :: deleteProfilePicture :: error", error);
      return false;
    }
  }

  //preview profile picture
  getProfilePicture(fileId) {
    return this.storage.getFilePreview(
      conf.appwriteProfilePictureBucketId,
      fileId,
      100,
      100
    );
  }

  //upload receipts
  async uploadReceipt(file) {
    try {
      const result = await this.storage.createFile(
        conf.appwriteReceiptsBucketId,
        ID.unique(),
        file
      );
      return result;
    } catch (error) {
      console.error("Appwrite service :: uploadReceipt :: error", error);
      return false;
    }
  }

  //delete receipt
  async deleteReceipt(fileId) {
    try {
      await this.storage.deleteFile(conf.appwriteReceiptsBucketId, fileId);
      return true;
    } catch (error) {
      console.error("Appwrite service :: deleteReceipt :: error", error);
      return false;
    }
  }

  //preview receipt
  getReceiptPreview(fileId) {
    return this.storage.getFilePreview(
      conf.appwriteReceiptsBucketId,
      fileId,
      100,
      100
    );
  }

  // BUDGETS MANAGEMENT
  async createBudget(data) {
    try {
      const promise = await this.databases.createDocument(
        conf.appwriteDatabaseId,
        conf.appwriteBudgetsCollectionId,
        ID.unique(),
        {
          userId: data.userId,
          category: data.category,
          amount: data.amount,
          totalBudget: data.totalBudget,
          month: new Date().toLocaleString("default", { month: "long" }),
          year: new Date().getFullYear(),
        }
      );
      return promise;
    } catch (error) {
      console.error("Appwrite service :: createBudget :: error", error);
      throw error;
    }
  }

  // Get budgets for current month
  async getCurrentBudgets(userId) {
    try {
      if (!userId) {
        throw new Error("User ID is required");
      }

      const currentMonth = new Date().toLocaleString("default", {
        month: "long",
      });
      const currentYear = new Date().getFullYear();

      const response = await this.databases.listDocuments(
        conf.appwriteDatabaseId,
        conf.appwriteBudgetsCollectionId,
        [
          Query.equal("userId", userId),
          Query.equal("month", currentMonth),
          Query.equal("year", currentYear),
        ]
      );
      return response;
    } catch (error) {
      console.error("Appwrite service :: getCurrentBudgets :: error", error);
      throw error;
    }
  }

  // Update budget
  async updateBudget(budgetId, data) {
    try {
      const promise = await this.databases.updateDocument(
        conf.appwriteDatabaseId,
        conf.appwriteBudgetsCollectionId,
        budgetId,
        {
          category: data.category,
          amount: data.amount,
          totalBudget: data.totalBudget,
        }
      );
      return promise;
    } catch (error) {
      console.error("Appwrite service :: updateBudget :: error", error);
      throw error;
    }
  }

  // Delete budget
  async deleteBudget(budgetId) {
    try {
      await this.databases.deleteDocument(
        conf.appwriteDatabaseId,
        conf.appwriteBudgetsCollectionId,
        budgetId
      );
      return true;
    } catch (error) {
      console.error("Appwrite service :: deleteBudget :: error", error);
      throw error;
    }
  }

  // Get budget history
  async getBudgetHistory(userId, months = 3) {
    try {
      const promise = await this.databases.listDocuments(
        conf.appwriteDatabaseId,
        conf.appwriteBudgetsCollectionId,
        [
          Query.equal("userId", userId),
          Query.orderDesc("year"),
          Query.orderDesc("$createdAt"),
          Query.limit(100),
        ]
      );
      return promise;
    } catch (error) {
      console.error("Appwrite service :: getBudgetHistory :: error", error);
      throw error;
    }
  }

  // UTILITY METHODS

  //get all categories
  async getAllExpenseCategories(userId) {
    try {
      // First get all expenses for the user
      const expenses = await this.getAllExpenses(userId);

      if (!expenses || !expenses.documents) {
        return [];
      }

      // Calculate totals and percentages for each category
      const categoryTotals = expenses.documents.reduce((acc, expense) => {
        const category = expense.category;
        if (!acc[category]) {
          acc[category] = {
            name: category,
            amount: 0,
            count: 0,
            percentage: 0,
          };
        }
        acc[category].amount += parseFloat(expense.amount);
        acc[category].count += 1;
        return acc;
      }, {});

      // Calculate total expenses
      const totalExpenses = Object.values(categoryTotals).reduce(
        (sum, cat) => sum + cat.amount,
        0
      );

      // Calculate percentages and format amounts
      const categories = Object.values(categoryTotals).map((category) => ({
        ...category,
        amount: parseFloat(category.amount.toFixed(2)),
        percentage: parseFloat(
          ((category.amount / totalExpenses) * 100).toFixed(1)
        ),
      }));

      // Sort by amount in descending order
      return categories.sort((a, b) => b.amount - a.amount);
    } catch (error) {
      console.error("Appwrite service :: getAllCategories :: error", error);
      throw error;
    }
  }
}

const appService = new AppService();

export default appService;
