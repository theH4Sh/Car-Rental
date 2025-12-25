import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer className="max-w-7xl mx-auto px-4 py-8 border-t">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-red-500">TOPCAR</h2>
          <p className="text-gray-600 text-sm">
            Website to buy, sell and rent new and used cars with famous brands such as Bentley, Mercedes, Audi, Porches,
            Honda...
          </p>

          <div className="flex space-x-4 mt-4">
            <a href="#" className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-600">IG</span>
            </a>
            <a href="#" className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-600">FB</span>
            </a>
            <a href="#" className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-600">TW</span>
            </a>
            <a href="#" className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-600">YT</span>
            </a>
            <a href="#" className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-600 text-sm font-bold">TT</span>
            </a>
          </div>
        </div>

        <div>
          <h3 className="font-medium text-gray-800 mb-4">Explore</h3>
          <ul className="space-y-2">
            <li>
              <Link to="/rent" className="text-gray-500 hover:text-gray-700 text-sm">
                Rent a car
              </Link>
            </li>
            <li>
              <Link to="/" className="text-gray-500 hover:text-gray-700 text-sm">
                Home
              </Link>
            </li>
            <li>
              <Link to="/about" className="text-gray-500 hover:text-gray-700 text-sm">
                How it works
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="font-medium text-gray-800 mb-4">Services</h3>
          <ul className="space-y-2">
            <li>
              <Link to="/rent" className="text-gray-500 hover:text-gray-700 text-sm">
                Browse fleet
              </Link>
            </li>
            <li>
              <Link to="/contact" className="text-gray-500 hover:text-gray-700 text-sm">
                Support
              </Link>
            </li>
            <li>
              <Link to="/about" className="text-gray-500 hover:text-gray-700 text-sm">
                About TOPCAR
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="font-medium text-gray-800 mb-4">Company</h3>
          <ul className="space-y-2">
            <li>
              <Link to="/about" className="text-gray-500 hover:text-gray-700 text-sm">
                About us
              </Link>
            </li>
            <li>
              <Link to="/contact" className="text-gray-500 hover:text-gray-700 text-sm">
                Contact us
              </Link>
            </li>
            <li>
              <Link to="/rent" className="text-gray-500 hover:text-gray-700 text-sm">
                Rent a car
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="mt-12 pt-4 border-t border-gray-200">
        <p className="text-xs text-gray-500">Topcar 2023 all right reserved</p>
      </div>
    </footer>
  )
}

export default Footer
