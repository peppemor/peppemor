interface PathConstantsType {
    BASENAME: string;
    INDEX: string;
    GALLERY: string;
    CONTACT: string;
    LOGIN: string;
    CART: string;
    ACCOUNT: string;
    ITINERARY_LIST: string;
    ITINERARY_DETAILS: string;
    ITINERARY_ADMIN: string;
  }
  
  const PathConstants: PathConstantsType = {
    BASENAME: '/',
    INDEX:'/',
    GALLERY: "/gallery",
    CONTACT: "/contact",
    LOGIN: "/authform",
    CART: "/cart",
    ACCOUNT: "/account",
    ITINERARY_LIST: "/itineraries",
    ITINERARY_DETAILS: "/itineraries/:id",
    ITINERARY_ADMIN: "/itinerariesadmin",
  };
  
  export default PathConstants;
  