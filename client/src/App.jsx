import "./app.css";
import { Toaster } from 'react-hot-toast';
import { createBrowserRouter, createRoutesFromElements, Navigate, Route, RouterProvider } from 'react-router-dom'
import RootLayout from "./layout/RootLayout";
import AdminLayout from "./layout/AdminLayout";
import RequireAdmin from "./components/RequireAdmin";
import Home from "./pages/Home"
import About from "./pages/About"
import Rent from "./pages/Rent";
import Contact from "./pages/Contact"
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import { useSelector } from "react-redux";
import CarPage from "./pages/CarPage";
import Profile from "./pages/Profile";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminCars from "./pages/admin/AdminCars";
import AdminBookings from "./pages/admin/AdminBookings";
import AdminUsers from "./pages/admin/AdminUsers";


function App() {

  const auth = useSelector(state => state.user)

  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route path='/' element={<RootLayout />}>
          <Route index element={<Home />} />
          <Route path='about' element={<About />} />
          <Route path='rent' element={<Rent />} />
          <Route path='contact' element={<Contact />} />
          <Route path='login' element={auth.isAuthenticated ? <Navigate to='/' /> : <Login />} />
          <Route path='signup' element={auth.isAuthenticated ? <Navigate to='/' /> : <Signup />} />
          <Route path='profile/:username' element={<Profile />} />
          <Route path='details/:id' element={<CarPage />} />
        </Route>

        <Route
          path='/admin'
          element={
            <RequireAdmin>
              <AdminLayout />
            </RequireAdmin>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path='cars' element={<AdminCars />} />
          <Route path='bookings' element={<AdminBookings />} />
          <Route path='users' element={<AdminUsers />} />
        </Route>
      </>
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
