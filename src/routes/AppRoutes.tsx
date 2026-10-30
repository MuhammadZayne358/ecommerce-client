import { BrowserRouter, Route, Routes } from "react-router-dom";

import Home from "../pages/shop/Home";
import Products from "../pages/shop/Products";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";

import MainLayout from "../components/layout/MainLayout";

import ProtectedRoute from "./ProtectedRoute";
import AdminRoute from "./AdminRoute";
import ProductDetails from "../pages/shop/ProductDetails";
import Cart from "../pages/shop/Cart";
import Checkout from "../pages/shop/Checkout";
import OrderSuccess from "../pages/shop/OrderSuccess";
import MyOrders from "../pages/shop/MyOrders";
import AdminLayout from "../components/admin/AdminLayout";
import Dashboard from "../pages/admin/Dashboard";
import AdminProducts from "../pages/admin/Products";
import AdminCategories from "../pages/admin/Categories";
import AdminOrders from "../pages/admin/Order";
import CreateProducts from "../pages/admin/CreateProduct";
import EditProduct from "../pages/admin/EditProduct";
import CreateCategory from "../pages/admin/CreateCategory";
import EditCategory from "../pages/admin/EditCategory";
import OrderDetails from "../pages/shop/OrderDetails";
import OrderDetailsAdmin from "../pages/admin/AdminOrderDetails";
import About from "../pages/shop/About";
import Contact from "../pages/shop/Contact";
import AdminContacts from "../pages/admin/Admincontacts";
import AuthLayout from "../components/layout/AuthLayout";
import Profile from "../pages/shop/Profile";
import ForgotPassword from "../pages/auth/Forgotpassword";
import ResetPassword from "../pages/auth/Resetpassword";
import NotFound from "../pages/shop/NotFound";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetails />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/profile" element={<Profile />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/orders" element={<MyOrders />} />
            <Route path="/orders/:id" element={<OrderDetails />} />
            <Route path="/order-success/:id" element={<OrderSuccess />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Route>

        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Route>

        <Route element={<AdminRoute />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />

            <Route path="products" element={<AdminProducts />} />
            <Route path="products/create" element={<CreateProducts />} />
            <Route path="products/edit/:id" element={<EditProduct />} />

            <Route path="categories" element={<AdminCategories />} />
            <Route path="categories/create" element={<CreateCategory />} />
            <Route path="categories/edit/:id" element={<EditCategory />} />

            <Route path="orders" element={<AdminOrders />} />
            <Route path="orders/:id" element={<OrderDetailsAdmin />} />

            <Route path="admincontacts" element={<AdminContacts />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
