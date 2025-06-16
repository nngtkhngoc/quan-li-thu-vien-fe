import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import "./index.css";
import App from "./App.tsx";
import Homepage from "./pages/Client/Homepage.tsx";
import BookCatalogue from "./pages/Client/BookCatalogue.tsx";
import BorrowedBooks from "./pages/Client/BorrowedBooks.tsx";
import ClientNotifications from "./pages/Client/ClientNotifications.tsx";
import ClientReservations from "./pages/Client/ClientReservations.tsx";
import Auth from "./pages/Client/Auth.tsx";
import Layout from "./components/Admin/Layout.tsx";
import Dashboard from "./pages/Admin/Dashboard/Dashboard.tsx";
import Users from "./pages/Admin/Users.tsx";
import Books from "./pages/Admin/Books.tsx";
import BookItems from "./pages/Admin/BookItems.tsx";
import Borrows from "./pages/Admin/Borrows.tsx";
import Notifications from "./pages/Admin/Notifications/Notifications.tsx";
import Reviews from "./pages/Admin/Reviews/Reviews.tsx";
import Reservations from "./pages/Admin/Reservations.tsx";
import Login from "./pages/Admin/Login.tsx";
import BookDetailed from "./pages/Client/BookDetailed.tsx";
import Profile from "./pages/Client/Profile.tsx";
import Catalogs from "./pages/Admin/Catalogs.tsx";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />}>
            <Route index element={<Homepage />} />
            <Route path="/books" element={<BookCatalogue />} />
            <Route path="/books/:id" element={<BookDetailed />} />
            <Route path="/borrowed-books" element={<BorrowedBooks />} />
            <Route path="/notifications" element={<ClientNotifications />} />
            <Route path="/reservations" element={<ClientReservations />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/auth" element={<Auth />} />
          </Route>

          <Route path="/admin" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="/admin/users" element={<Users />} />
            <Route path="/admin/books" element={<Books />} />
            <Route path="/admin/book-items/:id" element={<BookItems />} />
            <Route path="/admin/borrows" element={<Borrows />} />
            <Route path="/admin/notifications" element={<Notifications />} />
            <Route path="/admin/reviews" element={<Reviews />} />
            <Route path="/admin/reservations" element={<Reservations />} />
            <Route path="/admin/catalogs" element={<Catalogs />} />
          </Route>

          <Route path="/admin/login">
            <Route index element={<Login />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>
);
