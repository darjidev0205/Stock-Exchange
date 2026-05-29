import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { resetPassword } from '../store/slices/authSlice';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(resetPassword(email)).unwrap();
      setSent(true);
    } catch {
      setSent(true);
    }
  };

  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center px-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md glass-card p-8">
        <div className="text-center mb-8">
          <Link to="/" className="text-2xl font-bold neon-text">NexTrade AI</Link>
          <p className="text-gray-500 mt-2">Reset your password</p>
        </div>

        {sent ? (
          <div className="text-center">
            <p className="text-emerald-400 mb-4">If an account exists, a reset link has been sent.</p>
            <Link to="/login"><Button variant="secondary">Back to Login</Button></Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required />
            <Button type="submit" className="w-full">Send Reset Link</Button>
          </form>
        )}
      </motion.div>
    </div>
  );
}
