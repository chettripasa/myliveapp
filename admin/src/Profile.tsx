import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const API_URL = 'http://localhost:3000';


export default function Profile() {
  const [user, setUser] = useState<any>(null);
  const [wallet, setWallet] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [amount, setAmount] = useState('');
  const [action, setAction] = useState<'credit' | 'debit'>('credit');
  const [walletMsg, setWalletMsg] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    // Fetch user info
    fetch(`${API_URL}/user/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => {
        if (data.id) setUser(data);
        else setError('Invalid token or user not found');
      })
      .catch(() => setError('Network error'));
    // Fetch wallet info
    fetch(`${API_URL}/wallet/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => {
        if (data.id) {
          setWallet(data);
          setTransactions(data.transactions || []);
        }
      });
    setLoading(false);
  }, [navigate]);

  const handleWalletAction = async (e: React.FormEvent) => {
    e.preventDefault();
    setWalletMsg('');
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      const res = await fetch(`${API_URL}/wallet/${action}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ amount: parseFloat(amount) }),
      });
      const data = await res.json();
      if (data.balance !== undefined) {
        setWallet((w: any) => ({ ...w, balance: data.balance }));
        setWalletMsg(`${action} successful!`);
        // Refresh transactions
        fetch(`${API_URL}/wallet/transactions`, {
          headers: { Authorization: `Bearer ${token}` },
        })
          .then(res => res.json())
          .then(setTransactions);
      } else {
        setWalletMsg(data.message || 'Error');
      }
    } catch {
      setWalletMsg('Network error');
    }
  };


  if (loading) return <div>Loading...</div>;
  if (error) return <div style={{ color: 'crimson' }}>{error}</div>;
  if (!user) return null;

  return (
    <div style={{ maxWidth: 400, margin: '2rem auto', fontFamily: 'sans-serif' }}>
      <h2>Profile</h2>
      <pre style={{ background: '#f4f4f4', padding: 16, borderRadius: 8 }}>{JSON.stringify(user, null, 2)}</pre>
      {wallet && (
        <div style={{ marginTop: 24 }}>
          <h3>Wallet</h3>
          <div>Balance: <b>{wallet.balance}</b></div>
          <form onSubmit={handleWalletAction} style={{ marginTop: 12 }}>
            <input
              type="number"
              step="0.01"
              placeholder="Amount"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              style={{ width: '60%', marginRight: 8 }}
              required
            />
            <select value={action} onChange={e => setAction(e.target.value as 'credit' | 'debit')}>
              <option value="credit">Credit</option>
              <option value="debit">Debit</option>
            </select>
            <button type="submit" style={{ marginLeft: 8 }}>Submit</button>
          </form>
          {walletMsg && <div style={{ color: 'crimson', marginTop: 8 }}>{walletMsg}</div>}
          <h4 style={{ marginTop: 24 }}>Transactions</h4>
          <div style={{ maxHeight: 200, overflowY: 'auto', background: '#fafafa', padding: 8, borderRadius: 6 }}>
            {transactions.length === 0 && <div>No transactions</div>}
            {transactions.map((tx, i) => (
              <div key={tx.id || i} style={{ fontSize: 14, marginBottom: 6 }}>
                <b>{tx.type}</b> {tx.amount} on {new Date(tx.createdAt).toLocaleString()}
              </div>
            ))}
          </div>
        </div>
      )}
      <button onClick={() => { localStorage.removeItem('token'); navigate('/login'); }} style={{ width: '100%', marginTop: 16 }}>
        Logout
      </button>
    </div>
  );
}
