const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export async function getUserOrders(_userId: string) {
  // TODO: implement backend endpoint /orders
  try {
    const response = await fetch(`${API_URL}/orders`, {
      credentials: 'include',
    });

    if (!response.ok) {
      return [];
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching orders:', error);
    return [];
  }
}