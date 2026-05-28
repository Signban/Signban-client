import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useAuth } from "../contexts/AuthContext";
import NotificationService from "../services/NotificationService";
import { getErrorMessage } from "./../utils/boardHelpers";

export default function useNotification() {
  const { isAuthenticated } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [meta, setMeta] = useState(null);

  const fetchNotifications = useCallback(async (params = {}) => {
    try {
      setLoading(true);
      const data = await NotificationService.getNotifications({
        limit: 20,
        ...params,
      });
      setNotifications(data.notifications);
      setMeta(data.meta);
    } catch (error) {
      console.log(error);
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchUnreadCount = useCallback(async () => {
    try {
      const data = await NotificationService.getNotifications({
        isRead: false,
        limit: 1,
      });
      setUnreadCount(data.meta.total);
    } catch (error) {
      console.log(error);
    }
  }, []);

  const markAsRead = useCallback(async (notificationId) => {
    try {
      await NotificationService.markAsRead(notificationId);
      setNotifications((prev) =>
        prev.map((n) => (n.id === notificationId ? { ...n, isRead: true } : n)),
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      console.log(error);
      toast.error(getErrorMessage(error));
    }
  }, []);

  const markAllAsRead = useCallback(async () => {
    try {
      await NotificationService.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (error) {
      console.log(error);
      toast.error(getErrorMessage(error));
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchUnreadCount();
      fetchNotifications();
    }
  }, [isAuthenticated, fetchUnreadCount]);

  return {
    notifications,
    unreadCount,
    loading,
    meta,
    fetchNotifications,
    fetchUnreadCount,
    markAsRead,
    markAllAsRead,
  };
}
