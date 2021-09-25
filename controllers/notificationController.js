const Notification = require("../models/notificationModel");

// exports.pushNotification = async (req, res) => {
//   try {
//     var notification = await Notification.create(req.body);
//     res.status(200).json({
//       status: "success",
//       data: {
//         notification,
//       },
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(400).json(error);
//   }
// };

exports.pushNotification = async (data) => {
  try {
    var notification = await Notification.create(data);
  } catch (error) {
    console.log(error);
  }
};
