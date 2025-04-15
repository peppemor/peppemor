import { Instagram, Facebook, MessageCircle } from 'lucide-react';

function Contact() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">Get in Touch</h1>
        
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <p className="text-gray-600 mb-6 text-center">
            I'd love to hear from you! Whether you have questions about my prints, 
            custom orders, or just want to share your thoughts about Naples photography, 
            feel free to reach out through any of these channels.
          </p>

          <div className="space-y-6">
            <a 
              href="https://instagram.com/your-handle" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center p-4 border rounded-lg hover:bg-gray-50 transition duration-300"
            >
              <Instagram className="w-6 h-6 text-pink-600" />
              <span className="ml-4 text-gray-700">Follow me on Instagram</span>
            </a>

            <a 
              href="https://facebook.com/your-page" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center p-4 border rounded-lg hover:bg-gray-50 transition duration-300"
            >
              <Facebook className="w-6 h-6 text-blue-600" />
              <span className="ml-4 text-gray-700">Connect on Facebook</span>
            </a>

            <a 
              href="https://tiktok.com/@your-handle" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center p-4 border rounded-lg hover:bg-gray-50 transition duration-300"
            >
              <MessageCircle className="w-6 h-6 text-black" />
              <span className="ml-4 text-gray-700">Follow me on TikTok</span>
            </a>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-semibold mb-6">Send a Message</h2>
          <form className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                id="name"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                id="email"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
              <textarea
                id="message"
                rows={4}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              ></textarea>
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Contact;