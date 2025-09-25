import { Link } from 'react-router-dom';
import { FaUpload, FaPrint, FaShieldAlt, FaMobile, FaRocket, FaArrowRight } from 'react-icons/fa';

const Homepage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <FaPrint className="text-2xl text-blue-600 mr-2" />
              <span className="text-xl font-bold text-gray-900">PrintDoc Manager</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link 
                to="/upload" 
                className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
              >
                Upload Documents
              </Link>
              <Link 
                to="/user" 
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-200 text-sm font-medium"
              >
                Shop Owner Login
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Streamline Your Document
              <span className="text-blue-600"> Printing Process</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              A seamless platform for customers to upload documents and shop owners to manage, 
              view, and print them efficiently. Fast, secure, and built for modern businesses.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/upload" 
                className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition duration-200"
              >
                <FaUpload className="mr-2" />
                Upload Documents Now
              </Link>
              <Link 
                to="/user" 
                className="inline-flex items-center justify-center px-8 py-3 border border-blue-600 text-base font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50 transition duration-200"
              >
                Shop Owner Access
                <FaArrowRight className="ml-2" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Why Choose Our Platform?</h2>
            <p className="text-gray-600 mt-4">Designed for both customers and shop owners</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="text-center p-6">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaUpload className="text-2xl text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Easy Document Upload</h3>
              <p className="text-gray-600">
                Customers can upload documents instantly via direct links or general upload. 
                Support for PDF, images, Word, Excel, and more.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="text-center p-6">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaPrint className="text-2xl text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Smart Print Management</h3>
              <p className="text-gray-600">
                Shop owners get a organized dashboard to view, manage, and print documents 
                with just a few clicks.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="text-center p-6">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaShieldAlt className="text-2xl text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Secure & Private</h3>
              <p className="text-gray-600">
                Your documents are protected with secure uploads and private access. 
                Only authorized shop owners can view your files.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">How It Works</h2>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8">
            {/* Step 1 */}
            <div className="text-center">
              <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">1</div>
              <h3 className="font-semibold mb-2">Upload Documents</h3>
              <p className="text-sm text-gray-600">
                Use the upload page or your shop's specific link to submit documents
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center">
              <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">2</div>
              <h3 className="font-semibold mb-2">Automatic Organization</h3>
              <p className="text-sm text-gray-600">
                Documents are automatically sorted and organized for the shop owner
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">3</div>
              <h3 className="font-semibold mb-2">Shop Owner Review</h3>
              <p className="text-sm text-gray-600">
                Shop owner reviews documents in their secure dashboard
              </p>
            </div>

            {/* Step 4 */}
            <div className="text-center">
              <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">4</div>
              <h3 className="font-semibold mb-2">Ready for Printing</h3>
              <p className="text-sm text-gray-600">
                Documents are prepared and ready for high-quality printing
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <FaRocket className="text-4xl mx-auto mb-4" />
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-blue-100 mb-8 text-lg">
            Join hundreds of shop owners and customers who are simplifying their document printing workflow
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/upload" 
              className="bg-white text-blue-600 px-8 py-3 rounded-md font-semibold hover:bg-gray-100 transition duration-200"
            >
              Upload Your First Document
            </Link>
            <Link 
              to="/user" 
              className="border border-white text-white px-8 py-3 rounded-md font-semibold hover:bg-blue-700 transition duration-200"
            >
              Shop Owner Login
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <FaPrint className="text-xl text-blue-400 mr-2" />
              <span className="text-lg font-semibold">PrintDoc Manager</span>
            </div>
            
          </div>
          
        </div>
      </footer>
    </div>
  );
};

export default Homepage;