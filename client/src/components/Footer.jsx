const Footer = () => {
    return (
      <footer className="max-w-7xl mx-auto px-4 py-8 border-t">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand and Description */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-red-500">TOPCAR</h2>
            <p className="text-gray-600 text-sm">
              Website to buy, sell and rent new and used cars with famous brands such as Bentley, Mercedes, Audi, Porches,
              Honda...
            </p>
  
            {/* Social Media Icons */}
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
  
          {/* Carvago Column */}
          <div>
            <h3 className="font-medium text-gray-800 mb-4">Carvago</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-500 hover:text-gray-700 text-sm">
                  Buy
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-500 hover:text-gray-700 text-sm">
                  Reviews
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-500 hover:text-gray-700 text-sm">
                  Site map
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-500 hover:text-gray-700 text-sm">
                  How it works
                </a>
              </li>
            </ul>
          </div>
  
          {/* Services Column */}
          <div>
            <h3 className="font-medium text-gray-800 mb-4">Services</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-500 hover:text-gray-700 text-sm">
                  Delivery
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-500 hover:text-gray-700 text-sm">
                  CarAudit
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-500 hover:text-gray-700 text-sm">
                  Warranty
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-500 hover:text-gray-700 text-sm">
                  Financing
                </a>
              </li>
            </ul>
          </div>
  
          {/* Company Column */}
          <div>
            <h3 className="font-medium text-gray-800 mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-500 hover:text-gray-700 text-sm">
                  About us
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-500 hover:text-gray-700 text-sm">
                  Contact us
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-500 hover:text-gray-700 text-sm">
                  Terms of use
                </a>
              </li>
            </ul>
          </div>
        </div>
  
        {/* Copyright */}
        <div className="mt-12 pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-500">Topcar 2023 all right reserved</p>
        </div>
      </footer>
    )
  }
  
  export default Footer
  
  