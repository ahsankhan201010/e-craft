const Buyer = require("../models/buyerModel")

exports.fetchBuyers = async (req,res) => {
    try {
        res.status(200).json({
            status: "success",
            msg: "fetch buyers"
        })
    } catch (error) {
        
    }
}

exports.addBuyer = async (buyerProfile) => {
    try {
        var buyer = await Buyer.create(buyerProfile)
        return buyer
    } catch (error) {
        return new Error(error.message)
    }
}

exports.fetchBuyer = async (buyerId) => {
    try {
      var buyer = await Buyer.find({ userId: buyerId });
      return buyer;
    } catch (error) {
      return new Error(error.message);
    }
  };