import { Outlet } from 'react-router-dom';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar'

const RootLayout = () => {
    return ( 
        <div>
            <Navbar />
            <div className="shadow-sm md:shadow-none p-5 md:p-0 md:py-10">
                <Outlet />
            </div>
            <Footer />
        </div>
     );
}
 
export default RootLayout;