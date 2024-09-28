import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';

const LeadForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
  });

  // Fetch data to populate fields (e.g., fetching user data from API)
  useEffect(() => {
    // fetch('/wp-json/your-plugin/v1/get-lead-data') // API endpoint you create
    //   .then((response) => response.json())
    //   .then((data) => {
    //     setFormData(data); // Populate form fields with fetched data
    //   });
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();

    fetch('/wp-json/your-plugin/v1/submit-lead', {
      // API endpoint for submission
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-WP-Nonce': yourPluginData.nonce, // Use a nonce for security
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Lead submitted:', data);
      });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>Name:</label>
      <input
        type="text"
        name="name"
        value={formData.name}
        onChange={handleChange}
      />

      <label>Email:</label>
      <input
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
      />

      <label>Company:</label>
      <input
        type="text"
        name="company"
        value={formData.company}
        onChange={handleChange}
      />

      <button type="submit">Submit</button>
    </form>
  );
};

ReactDOM.render(<LeadForm />, document.getElementById('lead-form-root'));
