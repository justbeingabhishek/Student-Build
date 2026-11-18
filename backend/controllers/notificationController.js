import mongoose from "mongoose";
import Notification from "../models/Notification.Model.js";

const getNotifications = async (req, res) => {
  try {
    const recipient = req.userid;
    const [notifications, unreadCount] = await Promise.all([
      Notification.find({ recipient })
        .populate("actor", "name profile")
        .populate("project", "title")
        .populate("application", "role")
        .sort({ createdAt: -1 })
        .limit(100)
        .lean(),
      Notification.countDocuments({ recipient, isRead: false }),
    ]);

    return res.status(200).json({
      success: true,
      notifications,
      unreadCount,
    });
  } catch (error) {
    console.error("Could not fetch notifications:", error);
    return res.status(500).json({
      success: false,
      message: "Could not fetch notifications",
    });
  }
};

const getUnreadNotificationCount = async (req, res) => {
  try {
    const unreadCount = await Notification.countDocuments({
      recipient: req.userid,
      isRead: false,
    });

    return res.status(200).json({
      success: true,
      unreadCount,
    });
  } catch (error) {
    console.error("Could not fetch unread notification count:", error);
    return res.status(500).json({
      success: false,
      message: "Could not fetch unread notification count",
    });
  }
};

const markNotificationRead = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid notification ID",
      });
    }

    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, recipient: req.userid },
      { $set: { isRead: true } },
      { new: true },
    );

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Notification marked as read",
    });
  } catch (error) {
    console.error("Could not update notification:", error);
    return res.status(500).json({
      success: false,
      message: "Could not update notification",
    });
  }
};

const markAllNotificationsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { recipient: req.userid, isRead: false },
      { $set: { isRead: true } },
    );

    return res.status(200).json({
      success: true,
      message: "All notifications marked as read",
    });
  } catch (error) {
    console.error("Could not update notifications:", error);
    return res.status(500).json({
      success: false,
      message: "Could not update notifications",
    });
  }
};

export {
  getNotifications,
  getUnreadNotificationCount,
  markNotificationRead,
  markAllNotificationsRead,
};
