// api.js
export const fetchTickets = async () => {
  try {
    const response = await fetch(
      "https://api.quicksell.co/v1/internal/frontend-assignment"
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (
      !data ||
      typeof data !== "object" ||
      !Array.isArray(data.tickets) ||
      !Array.isArray(data.users)
    ) {
      throw new Error("Unexpected API response structure");
    }

    return data;
  } catch (error) {
    console.error("Failed to fetch tickets:", error.message);
    throw error; 
  }
};
