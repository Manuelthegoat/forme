import { Routes, Route, Navigate } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import StorefrontLayout from "./components/StorefrontLayout";
import AdminRoute from "./components/AdminRoute";
import AdminLayout from "./components/AdminLayout";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import About from "./pages/About";
import Lookbook from "./pages/Lookbook";
import Login from "./pages/admin/Login";
import AdminProducts from "./pages/admin/AdminProducts";
import ProductEditor from "./pages/admin/ProductEditor";
import Product from "./pages/Product";
import CheckoutSuccess from "./pages/CheckoutSuccess";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminSales from "./pages/admin/AdminSales";
import OrderDetail from "./pages/admin/OrderDetail";

export default function App() {
  return (
    <>
      <ScrollToTop />

      <Routes>
        {/* storefront */}
        <Route element={<StorefrontLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/product/:slug" element={<Product />} />
          <Route path="/about" element={<About />} />
          <Route path="/lookbook" element={<Lookbook />} />
          <Route path="/checkout/success" element={<CheckoutSuccess />} />
        </Route>

        {/* admin */}
        <Route path="/admin/login" element={<Login />} />
        <Route element={<AdminRoute />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin" element={<Navigate to="/admin/products" replace />} />
            <Route path="/admin/products" element={<AdminProducts />} />
            <Route path="/admin/products" element={<AdminProducts />} />
            <Route path="/admin/products/new" element={<ProductEditor />} />
            <Route path="/admin/products/:id" element={<ProductEditor />} />
            <Route path="/admin/orders" element={<AdminOrders />} />
            <Route path="/admin/sales" element={<AdminSales />} />
            <Route path="/admin/orders/:id" element={<OrderDetail />} />
          </Route>
        </Route>
      </Routes>
    </>
  );
}