import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { Login, SignUp, AuthLayout } from "./components";
import {
  Dashboard,
  ExpensePage,
  IncomePage,
  GoalsPage,
  BudgetPage,
} from "./pages";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store/store.js";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: (
          <AuthLayout authentication={true}>
            <Dashboard />
          </AuthLayout>
        ),
      },
      {
        path: "/",
        element: (
          <AuthLayout authentication={true}>
            <Dashboard />
          </AuthLayout>
        ),
      },
      {
        path: "/login",
        element: (
          <AuthLayout authentication={false}>
            <Login />
          </AuthLayout>
        ),
      },
      {
        path: "/signup",
        element: (
          <AuthLayout authentication={false}>
            <SignUp />
          </AuthLayout>
        ),
      },
      {
        path: "/expenses",
        element: (
          <AuthLayout authentication={true}>
            <ExpensePage />
          </AuthLayout>
        ),
      },
      {
        path: "/income",
        element: (
          <AuthLayout authentication={true}>
            <IncomePage />
          </AuthLayout>
        ),
      },
      {
        path: "/goals",
        element: (
          <AuthLayout authentication={true}>
            <GoalsPage />
          </AuthLayout>
        ),
      },
      {
        path: "/budgets",
        element: (
          <AuthLayout authentication={true}>
            <BudgetPage />
          </AuthLayout>
        ),
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </StrictMode>
);
