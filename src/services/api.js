export const fetchTickets = async () => {
    try {
      const response = await fetch('https://api.quicksell.co/v1/internal/frontend-assignment');
      const data = await response.json();
      console.log('Fetched API Data:', data); // Log the raw API response
      return data;
    } catch (error) {
      console.error('Failed to fetch tickets:', error);
      throw error;
    }
  };
  