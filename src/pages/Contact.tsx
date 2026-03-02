import { useEffect, useState } from 'react';
import { Instagram, Facebook, MessageCircle } from 'lucide-react';
import Button from '../components/ui/Button.js';
import { useAuth } from '../contexts/AuthContext.js';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const Contact: React.FC = () => {
  // Separazione: stato dal Context, operazioni dagli hooks
  const { user, profile } = useAuth(); // Solo stato
  
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    if (profile) {
      setName(`${profile.firstName || ''} ${profile.lastName || ''}`.trim());
      setEmail(user?.email || '');
    }
  }, [profile, user]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  
    try {
      const response = await fetch(`${API_URL}/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, message }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data?.error || 'Failed to send message');
      }

      toast.success('Message sent successfully!');
      setName('');
      setEmail('');
      setMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message. Please try again.');
    }
  };

  // Handle input changes
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value); 
  };

  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value); 
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
      <section className="mb-12 text-center">
        <h1 className="font-serif md:text-3xl font-bold text-gray-800 mb-4">
          Get in Touch
        </h1>
      </section>
        
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
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="name" className="block text-md font-medium text-gray-700">Name</label>
              <input
              value={name}
              onChange={(e) => handleNameChange(e)}
              placeholder="Your Name"
              autoComplete="name"
              autoCapitalize="words"
              autoCorrect="off"
              spellCheck="false"
              type="text"
              id="name"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-md font-medium text-gray-700">Email</label>
              <input
                value={email}
                onChange={(e) => handleEmailChange(e)}
                placeholder="Your Email"
                type="email"
                id="email"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-md font-medium text-gray-700">Message</label>
              <textarea
                value={message}
                onChange={(e) => handleMessageChange(e)}
                placeholder="Your Message"
                autoComplete="off"
                id="message"
                rows={4}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              ></textarea>
            </div>
            <Button
              disabled={!name || !email || !message} 
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Send Message
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Contact;