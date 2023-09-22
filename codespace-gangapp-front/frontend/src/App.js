import "./App.css";
import { Routes, Route } from "react-router-dom";
import Login from "./components/Login/Login";
import Signup from "./components/Signup/Signup";
import Profile from "./components/Profile/Profile";
import Home from "./components/Profile/Home/Home";
import Lists from "./components/Profile/Lists/Lists";
import Sales from "./components/Profile/Sales/Sales";
import NewList from "./components/Profile/NewList/NewList";
import SingleList from "./components/Profile/Lists/SingleList/SingleList";
import CreateProducts from "./components/Admin/CreateProducts/CreateProducts";
import EditProducts from "./components/Admin/EditProducts/EditProducts";
import HomeAdmin from "./components/Admin/HomeAdmin/HomeAdmin";
import Market from "./components/Profile/Market/Market";
import Products from "./components/Admin/Products/Products";
import NotFound from "./components/NotFound/NotFound";
import YourProfile from "./components/Profile/YourProfile/YourProfile";
import UsedSale from "./components/Profile/Sales/UsedSale/Used";
import Faq from "./components/Profile/Faq/Faq";

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/profile" element={<Profile />}>
          <Route index element={<Home />} />
          <Route path="admin" element={<HomeAdmin />} />
          <Route path="admin/products" element={<Products />} />
          <Route path="admin/create" element={<CreateProducts />} />
          <Route path="admin/edit" element={<EditProducts />} />
          <Route path="new" element={<NewList />} />
          <Route path="market" element={<Market />} />
          <Route path="list/:id_user" element={<Lists />} />
          <Route path="lists/:id" element={<SingleList />} />
          <Route path="sales" element={<Sales />} />
          <Route path="sales/used" element={<UsedSale />} />
          <Route path="yourprofile" element={<YourProfile />} />
          <Route path="faq" element={<Faq />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

export default App;
