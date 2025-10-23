import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [employees, setEmployees] = useState([]);
  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    birthdate: '',
    salary: ''
  });

  useEffect(() => {
    async function fetchEmployees() {
      try {
        const res = await axios.get('http:// :4000/employees');
        setEmployees(res.data);
      } catch (err) {
        console.error(err);
      }
    }
    fetchEmployees();
  }, []);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:4000/employees', form);
      const res = await axios.get('http://localhost:4000/employees');
      setEmployees(res.data);
      setForm({ first_name: '', last_name: '', email: '', birthdate: '', salary: '' });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ margin: '20px' }}>
      <h1>Employees</h1>

      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>ID</th><th>First Name</th><th>Last Name</th><th>Email</th><th>Birthdate</th><th>Salary</th>
          </tr>
        </thead>
        <tbody>
          {employees.map(emp => (
            <tr key={emp.employee_id}>
              <td>{emp.employee_id}</td>
              <td>{emp.first_name || '-'}</td>
              <td>{emp.last_name || '-'}</td>
              <td>{emp.email || '-'}</td>
              <td>{emp.birthdate ? new Date(emp.birthdate).toLocaleDateString() : '-'}</td>
              <td>{emp.salary !== null ? emp.salary.toFixed(2) : '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
        <input name="first_name" value={form.first_name} onChange={handleChange} placeholder="First Name" />
        <input name="last_name" value={form.last_name} onChange={handleChange} placeholder="Last Name" />
        <input name="email" value={form.email} onChange={handleChange} placeholder="Email" />
        <input name="birthdate" type="date" value={form.birthdate} onChange={handleChange} placeholder="Birthdate" />
        <input name="salary" type="number" step="0.01" value={form.salary} onChange={handleChange} placeholder="Salary" />
        <button type="submit">Add Employee</button>
      </form>

    
    </div>
  );
}

export default App;