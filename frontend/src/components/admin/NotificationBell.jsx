import { useEffect, useState } from 'react';
import { FiBell } from 'react-icons/fi';
import API from '../../api/axios';
import { socket } from '../../App';
import { formatDateTime } from '../../utils/format';

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    API.get('/notifications').then(r => setNotifications(r.data.notifications || []));
    socket.on('new-order', () => {
      API.get('/notifications').then(r => setNotifications(r.data.notifications || []));
    });
  }, []);

  return (
    <div className="relative">
      <button onClick={() => setOpen(!open)} className="relative">
        <FiBell size={22} />
        {notifications.filter(n => !n.isRead).length > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
            {notifications.filter(n => !n.isRead).length}
          </span>
        )}
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
          <div className="p-3 border-b font-bold">Thông báo</div>
          {notifications.length === 0 ? (
            <p className="p-4 text-center text-gray-500">Không có thông báo</p>
          ) : notifications.map(n => (
            <div key={n._id} className={`p-3 border-b hover:bg-gray-50 ${!n.isRead ? 'bg-blue-50' : ''}`}>
              <p className="font-medium text-sm">{n.title}</p>
              <p className="text-xs text-gray-600">{n.message}</p>
              <p className="text-xs text-gray-400 mt-1">{formatDateTime(n.createdAt)}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
