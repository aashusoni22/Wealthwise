# WeatlhWise 💰

> A modern financial management application to track expenses, manage income, and achieve your financial goals.

![Made with React](https://img.shields.io/badge/Made_with-React-61DAFB?style=flat-square&logo=react)
![Powered by Appwrite](https://img.shields.io/badge/Powered_by-Appwrite-FD366E?style=flat-square&logo=appwrite)
![Styled with Tailwind](https://img.shields.io/badge/Styled_with-Tailwind-38B2AC?style=flat-square&logo=tailwind-css)
![License](https://img.shields.io/badge/License-MIT-green.svg?style=flat-square)

Live Demo: [https://wealthwise-eta.vercel.app](https://wealthwise-eta.vercel.app/)

## ✨ Features

- 📊 **Interactive Dashboard** - Get a quick overview of your finances
- 💳 **Expense Tracking** - Monitor and categorize your spending
- 💸 **Income Management** - Track your earnings from multiple sources
- 🎯 **Financial Goals** - Set and track your financial objectives
- 📈 **Visual Analytics** - Understand your money flow with intuitive charts
- 🔐 **Secure Authentication** - Keep your financial data safe
- 📱 **Responsive Design** - Works seamlessly on desktop and mobile

## 🚀 Tech Stack

### Frontend
- [React](https://reactjs.org/) - A JavaScript library for building user interfaces
- [Redux](https://redux.js.org/) - State management
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Recharts](https://recharts.org/) - Composable charting library
- [Framer Motion](https://www.framer.com/motion/) - Animation library
- [React Hook Form](https://react-hook-form.com/) - Form validation

### Backend
- [Appwrite](https://appwrite.io/) - Backend server providing auth, database, and storage

### Build Tools
- [Vite](https://vitejs.dev/) - Next generation frontend tooling
- [ESLint](https://eslint.org/) - Code linting
- [PostCSS](https://postcss.org/) - CSS transformations

## 📦 Installation

1. Clone the repository:
```bash
git clone https://github.com/aashusoni22/WeatlhWise.git
cd WeatlhWise
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory and add your Appwrite credentials:
```env
VITE_APPWRITE_URL="YOUR_APPWRITE_URL"
VITE_APPWRITE_PROJECT_ID="YOUR_PROJECT_ID"
VITE_APPWRITE_DATABASE_ID="YOUR_DATABASE_ID"
VITE_APPWRITE_EXPENSES_COLLECTION_ID="YOUR_EXPENSES_COLLECTION_ID"
VITE_APPWRITE_INCOME_COLLECTION_ID="YOUR_INCOME_COLLECTION_ID"
VITE_APPWRITE_GOALS_COLLECTION_ID="YOUR_GOALS_COLLECTION_ID"
VITE_APPWRITE_PROFILEPICTURE_BUCKET_ID="YOUR_PROFILE_PICTURE_BUCKET_ID"
VITE_APPWRITE_RECEIPTS_BUCKET_ID="YOUR_RECEIPTS_BUCKET_ID"
VITE_APPWRITE_BUDGETS_COLLECTION_ID="YOUR_BUDGETS_COLLECTION_ID"
```

4. Start the development server:
```bash
npm run dev
```

## 🏗️ Project Structure

```
WeatlhWise/
├── src/
│   ├── appwrite/     # Appwrite configuration and services
│   ├── components/   # Reusable React components
│   ├── hooks/        # Custom React hooks
│   ├── pages/        # Page components
│   ├── store/        # Redux store configuration
│   └── utils/        # Utility functions
```

## 🛠️ Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Appwrite instance (local or cloud)

### Development
1. Start the development server:
```bash
npm run dev
```

2. Build for production:
```bash
npm run build
```


## 📱 Screenshots

<div align="center">
🎯 Dashboard Overview
<table>
<tr>
    <td width="50%">
        <img src="https://github.com/user-attachments/assets/01c61ff2-7d3e-4d83-917e-35de4f3cdcb1" alt="New User Landing Page"/>
        <p align="center"><i>New User Landing Page</i></p>
    </td>
    <td width="50%">
    <img src="https://github.com/user-attachments/assets/90ea1664-722a-45f0-9a49-8c768ed0c076" width="500px" alt="Dashboard Overview"/>
        <p align="center"><i>Dashboard</i></p>
    </td>
</tr>
</table>
💰 Financial Management
<table>
<tr>
    <td width="50%">
        <img src="https://github.com/user-attachments/assets/aae00b76-101d-41af-9ba2-3f28796e8fbc" alt="Financial Analytics"/>
        <p align="center"><i>Income Dashboard</i></p>
    </td>
    <td width="50%">
        <img src="https://github.com/user-attachments/assets/73f984cf-ca00-4413-81d6-0fc6af68c369" alt="Reports Dashboard"/>
        <p align="center"><i>Expense Dashboard</i></p>
    </td>
</tr>
</table>
🎨 Additional Features
<table>
<tr>
    <td width="50%">
        <img src="https://github.com/user-attachments/assets/6fd7a9ab-1b2e-4ca0-a34f-f979ee0aa834" alt="Budget Planning"/>
        <p align="center"><i>Budget Planning</i></p>
    </td>
    <td width="50%">
        <img src="https://github.com/user-attachments/assets/b9735ad8-ca2a-42a1-89b1-9f4a1a878fcc" alt="Goals Tracking"/>
        <p align="center"><i>Goals Tracking</i></p>
    </td>
</tr>
</table>
</div>


## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Appwrite](https://appwrite.io/) for the backend infrastructure
- [Tailwind CSS](https://tailwindcss.com/) for the styling system
- [React Icons](https://react-icons.github.io/react-icons/) for the icons

## 📧 Contact

Aashutosh Soni - [LinkedIn](https://www.linkedin.com/in/aashutosh22/)

Project Link: [https://github.com/aashusoni22/WeatlhWise](https://github.com/aashusoni22/WeatlhWise)
