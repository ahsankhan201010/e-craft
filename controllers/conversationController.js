const Conversation = require("./../models/conversationModel");
const Order = require("./../models/orderModel");
const Message = require("./../models/messageModel");

exports.fetchConversation = async (req, res) => {
  try {
    var { orderId } = req.params;
    var { conversationType } = req.body;
    var convo = await Conversation.findOne({
      members: req.user._id,
      orderId,
    });
    if (!convo) {
      console.log("convo not found");
      //fetch order
      var { buyer, artist } = await Order.findOne({
        _id: orderId,
        $or: [{ artist: req.user._id }, { buyer: req.user._id }],
      });
      var members = [buyer, artist];
      convo = await Conversation.create({
        members,
        conversationType,
        orderId,
      });
    }

    //fetch msgs
    var messages = await Message.find({
      conversationId: convo._id,
      $or: [{ sender: req.user._id }, { receiver: req.user._id }],
    });
    console.log(messages)
    res.status(200).json({
      status: "success",
      data: {
          conversation: convo,
          messages
      }
    });
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
};

exports.fetchConversations = async (req,res) => {
  try {
    var conversations = await Conversation.find({members: req.user._id})
    //messages
    res.status(200).json({
      status: "success",
      data: {
        conversations
      }
    })
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
}
