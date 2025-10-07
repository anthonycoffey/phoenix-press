const API_URL = LOCALIZED.API_URL;

const PhoenixApi = {
  getQuote: async (payload) => {
    const response = await fetch(`${API_URL}/quote`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to fetch quote.');
    }
    return response.json();
  },

  createBooking: async (payload) => {
    const response = await fetch(`${API_URL}/bookings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      throw new Error('Booking submission failed');
    }
    return response.json();
  },

  submitLead: async (payload) => {
    const response = await fetch(`${API_URL}/submit-lead-form`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    return response.json();
  },

  updateLead: async (id, payload) => {
    const response = await fetch(`${API_URL}/submit-lead-form/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    return response.json();
  },
};

export default PhoenixApi;
