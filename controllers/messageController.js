const Conversation = require("../models/conversationModel");
const Message = require("../models/messageModel");

exports.sendMessage = async (req, res) => {
  try {
    //fetch convo
    var { conversationId } = req.params;
    var {content} = req.body;
    var convo = await Conversation.findOne({
      _id: conversationId,
      members: req.user._id,
    });

    if (!convo)
      return res
        .status(400)
        .json({ status: "error", error: "something went wrong" });

    //else
    //shape data and create msg
    var {members} = convo;
    var receiver = members.find(member => `${member}` !== `${req.user._id}` )
    var message = await Message.create({
        conversationId,
        content,
        sender: req.user._id,
        receiver
    })
    res.status(200).json({
      status: "success",
      data: {
          message
      }
    });
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
};
