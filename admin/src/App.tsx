
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import type React from 'react';
import Profile from './Profile';

const API_URL = 'http://localhost:3000';

function LoginRegister() {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    try {
      const res = await fetch(`${API_URL}/auth/${mode}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(
          mode === 'register' ? { email, password, name } : { email, password }
        ),
      });
      const data = await res.json();
      if (data.access_token) {
        localStorage.setItem('token', data.access_token);
        setMessage('Success! Redirecting...');
        setTimeout(() => navigate('/profile'), 500);
      } else {
        setMessage(data.message || 'Error');
      }
    } catch (err) {
      setMessage('Network error');
    }
  };

  if (localStorage.getItem('token')) {
    return <Navigate to="/profile" replace />;
  }

  return (
    <div style={{ maxWidth: 400, margin: '2rem auto', fontFamily: 'sans-serif' }}>
      <h2>{mode === 'login' ? 'Login' : 'Register'}</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          style={{ display: 'block', marginBottom: 8, width: '100%' }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          style={{ display: 'block', marginBottom: 8, width: '100%' }}
        />
        {mode === 'register' && (
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={e => setName(e.target.value)}
            style={{ display: 'block', marginBottom: 8, width: '100%' }}
          />
        )}
        <button type="submit" style={{ width: '100%', marginBottom: 8 }}>
          {mode === 'login' ? 'Login' : 'Register'}
        </button>
      </form>
      <button onClick={() => setMode(mode === 'login' ? 'register' : 'login')} style={{ width: '100%', marginBottom: 8 }}>
        Switch to {mode === 'login' ? 'Register' : 'Login'}
      </button>
      {message && <pre style={{ marginTop: 16, color: 'crimson' }}>{message}</pre>}
    </div>
  );
}

function RequireAuth({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem('token');
  if (!token) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginRegister />} />
      <Route path="/register" element={<LoginRegister />} />
      <Route path="/profile" element={<RequireAuth><Profile /></RequireAuth>} />
      <Route path="*" element={<Navigate to="/profile" replace />} />
    </Routes>
  );
}

export default App;
