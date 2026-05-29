import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useAuth } from "../contexts/AuthContext";
import NotificationService from "../services/NotificationService";
import socket from "../services/Socket";
import { getErrorMessage } from "./../utils/boardHelpers";

export default function useNotification() {
	const { isAuthenticated, currentUser } = useAuth();
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

			setNotifications(data.notifications || []);
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

			setUnreadCount(data.meta?.total || 0);
		} catch (error) {
			console.log(error);
		}
	}, []);

	const markAsRead = useCallback(async (notificationId) => {
		try {
			await NotificationService.markAsRead(notificationId);

			setNotifications((prev) =>
				prev.map((notification) =>
					notification.id === notificationId
						? { ...notification, isRead: true }
						: notification,
				),
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

			setNotifications((prev) =>
				prev.map((notification) => ({
					...notification,
					isRead: true,
				})),
			);

			setUnreadCount(0);
		} catch (error) {
			console.log(error);
			toast.error(getErrorMessage(error));
		}
	}, []);

	useEffect(() => {
		if (!isAuthenticated) return;

		fetchUnreadCount();
		fetchNotifications();
	}, [isAuthenticated, fetchUnreadCount, fetchNotifications]);

	useEffect(() => {
		if (!isAuthenticated || !currentUser?.id) return;

		const token = localStorage.getItem("access_token");

		if (!socket.connected) {
			socket.connect();
		}

		socket.emit("notification:join", { token });

		const handleNewNotification = ({ notification }) => {
			if (!notification) return;

			setNotifications((prev) => {
				const isExist = prev.some((item) => item.id === notification.id);

				if (isExist) return prev;

				return [notification, ...prev].slice(0, 20);
			});

			if (!notification.isRead) {
				setUnreadCount((prev) => prev + 1);
			}

			toast.info(
				notification.message || notification.title || "New notification",
			);
		};

		socket.on("notification:new", handleNewNotification);

		return () => {
			socket.off("notification:new", handleNewNotification);
			socket.emit("notification:leave", { userId: currentUser.id });
		};
	}, [isAuthenticated, currentUser?.id]);

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
