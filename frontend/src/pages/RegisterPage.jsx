import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { registerUser, googleLogin, devLogin, clearError } from '../store/slices/authSlice';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((s) => s.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(registerUser({ email, password, name })).unwrap();
      navigate('/dashboard');
    } catch {
      // error handled by slice
    }
  };

  const handleDemo = async () => {
    try {
      dispatch(clearError());
      await dispatch(devLogin({ email: 'demo@nextrade.ai', name: 'Demo Trader' })).unwrap();
      navigate('/dashboard');
    } catch {
      // error shown via auth.error in state
    }
  };

  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md glass-card p-8"
      >
        <div className="text-center mb-8">
          <Link to="/" className="text-2xl font-bold neon-text">NexTrade AI</Link>
          <p className="text-gray-500 mt-2">Create your trading account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Full Name" value={name} onChange={(e) => setName(e.target.value)} placeholder="John Doe" required />
          <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required />
          <Input label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Min 6 characters" minLength={6} required />
          {error && <p className="text-sm text-red-400">{error}</p>}
          <Button type="submit" className="w-full" loading={loading}>Create Account</Button>
        </form>

        <div className="mt-4 space-y-3">
          {error && <p className="text-sm text-red-400 text-center">{error}</p>}
          <Button variant="ghost" className="w-full" onClick={handleDemo} loading={loading}>
            Or try Demo Account
          </Button>
        </div>

        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account? <Link to="/login" className="text-cyan-400 hover:underline">Sign in</Link>
        </p>
      </motion.div>
    </div>
  );
}
