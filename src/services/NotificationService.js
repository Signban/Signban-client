import api from "./api";

class NotificationService {
  static async getNotifications(params = {}) {
    const { data } = await api.get("/notifications", { params });
    return data;
  }

  static async markAsRead(notificationId) {
    const { data } = await api.patch(`/notifications/${notificationId}/read`);
    return data;
  }

  static async markAllAsRead() {
    const { data } = await api.patch("/notifications/read-all");
    return data;
  }
}

export default NotificationService;
