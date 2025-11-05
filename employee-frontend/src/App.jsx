import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [puppies, setPuppies] = useState([]);
  const [form, setForm] = useState({
    name: '',
    breed: '',
    weight_lbs: '',
    vaccinated: false
  });

  // Load all puppies when the page loads
  useEffect(() => {
    async function fetchPuppies() {
      try {
        const res = await axios.get('http://localhost:4000/puppies');
        setPuppies(res.data);
      } catch (err) {
        console.error('Error fetching puppies:', err);
      }
    }
    fetchPuppies();
  }, []);

  // Handle text input & checkbox changes
  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  };

  // Add a new puppy
  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:4000/puppies', {
        name: form.name,
        breed: form.breed,
        weight_lbs: form.weight_lbs ? parseFloat(form.weight_lbs) : null,
        vaccinated: form.vaccinated
      });

      const res = await axios.get('http://localhost:4000/puppies');
      setPuppies(res.data);

      setForm({ name: '', breed: '', weight_lbs: '', vaccinated: false });
    } catch (err) {
      console.error('Error adding puppy:', err);
    }
  };

  // Delete a puppy by ID
  const handleDelete = async id => {
    try {
      await axios.delete(`http://localhost:4000/puppies/${id}`);
      const res = await axios.get('http://localhost:4000/puppies');
      setPuppies(res.data);
    } catch (err) {
      console.error('Error deleting puppy:', err);
    }
  };

  return (
    <div style={{ margin: '20px' }}>
      <h1>Puppy Manager</h1>

      {/* Table */}
      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Breed</th>
            <th>Weight (lbs)</th>
            <th>Vaccinated</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {puppies.map(p => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td>{p.name}</td>
              <td>{p.breed || '-'}</td>
              <td>{p.weight_lbs || '-'}</td>
              <td>{p.vaccinated ? 'Yes' : 'No'}</td>
              <td>
                <button onClick={() => handleDelete(p.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Add Puppy Form */}
      <form onSubmit={handleSubmit} style={{ marginTop: '20px' }}>
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Name"
          required
        />
        <input
          name="breed"
          value={form.breed}
          onChange={handleChange}
          placeholder="Breed"
        />
        <input
          name="weight_lbs"
          type="number"
          step="0.01"
          value={form.weight_lbs}
          onChange={handleChange}
          placeholder="Weight (lbs)"
        />
        <label style={{ marginLeft: '10px' }}>
          <input
            name="vaccinated"
            type="checkbox"
            checked={form.vaccinated}
            onChange={handleChange}
          />{' '}
          Vaccinated
        </label>
        <button type="submit" style={{ marginLeft: '10px' }}>
          Add Puppy
        </button>
      </form>
    </div>
  );
}

export default App;
