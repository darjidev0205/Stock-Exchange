import { useDispatch, useSelector } from 'react-redux';
import { addNotification, markRead } from '../../store/slices/notificationsSlice';
import { Bell, X } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { timeAgo } from '../../utils/formatters';

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const dispatch = useDispatch();
  const items = useSelector((s) => s.notifications.items);
  const unread = items.filter((n) => !n.read).length;

  useEffect(() => {
    const handler = (e) => {
      if (!ref.current?.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 rounded-xl hover:bg-white/5 transition-colors"
      >
        <Bell size={20} className="text-gray-400" />
        {unread > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-cyan-500 rounded-full text-[10px] font-bold flex items-center justify-center">
            {unread}
          </span>
        )}
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 glass-card p-3 z-50 max-h-96 overflow-y-auto">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-white">Notifications</h3>
            <button onClick={() => setOpen(false)}><X size={16} className="text-gray-500" /></button>
          </div>
          {items.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-4">No notifications yet</p>
          ) : (
            items.map((n) => (
              <div
                key={n.id}
                onClick={() => dispatch(markRead(n.id))}
                className={`p-3 rounded-lg mb-1 cursor-pointer transition-colors ${n.read ? 'opacity-60' : 'bg-white/5'}`}
              >
                <p className="text-sm font-medium text-white">{n.title}</p>
                <p className="text-xs text-gray-400 mt-0.5">{n.message}</p>
                <p className="text-xs text-gray-600 mt-1">{timeAgo(n.timestamp)}</p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export const useNotify = () => {
  const dispatch = useDispatch();
  return (title, message, type = 'info') => {
    dispatch(addNotification({ title, message, type }));
  };
};
