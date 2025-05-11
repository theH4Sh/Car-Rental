import "./app.css";
import { Toaster } from 'react-hot-toast';
import { createBrowserRouter, createRoutesFromElements, Navigate, Route, RouterProvider } from 'react-router-dom'
import RootLayout from "./layout/RootLayout";
import Home from "./pages/Home"
import About from "./pages/About"
import Rent from "./pages/Rent";
import Contact from "./pages/Contact"
import Login from "./pages/Login";
import CarDetails from "./pages/CarDetails";
import Signup from "./pages/Signup";
import { useSelector } from "react-redux";


function App() {

  const auth = useSelector(state => state.user)

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path='/' element={<RootLayout />}>
        <Route index element={<Home />} />
        <Route path='about'element={<About />} />
        <Route path='rent'element={<Rent />} />
        <Route path='contact' element={<Contact />} />
        <Route path='login' element={auth.isAuthenticated ? <Navigate to='/' /> : <Login />} />
        <Route path='signup' element={auth.isAuthenticated ? <Navigate to='/' /> :<Signup />} />
        <Route path='details' element={<CarDetails />} />
      </Route>
    )
  )

  return (
    <>
      <Toaster />
      <RouterProvider router={router} />
    </>
  );
}

export default App;
