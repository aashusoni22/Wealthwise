const conf = {
  appwriteUrl: String(import.meta.env.VITE_APPWRITE_URL),
  appwriteProjectId: String(import.meta.env.VITE_APPWRITE_PROJECT_ID),
  appwriteDatabaseId: String(import.meta.env.VITE_APPWRITE_DATABASE_ID),
  appwriteExpensesCollectionId: String(
    import.meta.env.VITE_APPWRITE_EXPENSES_COLLECTION_ID
  ),
  appwriteIncomeCollectionId: String(
    import.meta.env.VITE_APPWRITE_INCOME_COLLECTION_ID
  ),
  appwriteGoalsCollectionId: String(
    import.meta.env.VITE_APPWRITE_GOALS_COLLECTION_ID
  ),
  appwriteProfilePictureBucketId: String(
    import.meta.env.VITE_APPWRITE_PROFILEPICTURE_BUCKET_ID
  ),
  appwriteReceiptsBucketId: String(
    import.meta.env.VITE_APPWRITE_RECEIPTS_BUCKET_ID
  ),
  appwriteBudgetsCollectionId: String(
    import.meta.env.VITE_APPWRITE_BUDGETS_COLLECTION_ID
  ),
};

export default conf;
