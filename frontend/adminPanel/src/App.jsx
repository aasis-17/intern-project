import  { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import PageProtector from "./layouts/pageProtector/PageProtector";
// import RtlLayout from "./layouts/rtl";
import AdminLayout from "./layouts/admin";
// import AuthLayout from "./layouts/auth";
import SignIn from "./views/auth/SignIn";
import { useDispatch } from "react-redux";
import { setUserData } from "./store/authSlice";
import { useGetCurrentUserQuery } from "./services/apiSlice";
import Loader from "./layouts/loader/Loader";
const App = () => {
  
  const dispatch = useDispatch()
  const {data, isLoading, isError, isSuccess, error} = useGetCurrentUserQuery()

  useEffect(()=>{
    isSuccess && dispatch(setUserData(data?.data))
  },[isSuccess])
  

  if(isLoading)return <Loader />
  return (
    <Routes>
      <Route path="/" element={<SignIn />} />
      {/* <Route path="auth/*" element={<AuthLayout />} /> */}
      <Route path="admin/*" element={<PageProtector><AdminLayout /></PageProtector>} />
      {/* <Route path="rtl/*" element={<RtlLayout />} /> */}
      {/* <Route path="/" element={<Navigate to="/admin" replace />} /> */}
    </Routes>
  );
};

export default App;
