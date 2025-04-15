import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div 
        className="h-screen bg-cover bg-center relative"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1516483638261-f4dbaf036963?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80")'
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="text-center text-white px-4">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">Napoli in Frame</h1>
            <p className="text-xl md:text-2xl mb-8">Capturing the soul of Naples through my lens</p>
            <Link 
              to="/gallery" 
              className="bg-white text-gray-900 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition duration-300"
            >
              Explore Gallery
            </Link>
          </div>
        </div>
      </div>

      {/* About Section */}
      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-6">The Beauty of Naples</h2>
            <p className="text-gray-600 mb-4">
              Through my lens, I capture the vibrant spirit of Naples - from the narrow alleys of the Spanish Quarter 
              to the majestic views of Mount Vesuvius. Each photograph tells a story of daily life, tradition, and 
              the timeless beauty of this historic city.
            </p>
            <p className="text-gray-600">
              My collection features authentic moments of Neapolitan life, architectural marvels, and breathtaking 
              landscapes that make Naples unique. Every print is carefully produced to bring the warmth and character 
              of Naples into your space.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <img 
              src="https://images.unsplash.com/photo-1534445967719-8ae7b972b1a5?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
              alt="Naples Street"
              className="rounded-lg shadow-lg"
            />
            <img 
              src="https://images.unsplash.com/photo-1499346030926-9a72daac6c63?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
              alt="Naples Coast"
              className="rounded-lg shadow-lg"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;