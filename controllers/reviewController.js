const Review = require("../models/reviewModel")

exports.postReview =async (req,res) => {
    try {
        var {artId} = req.params;
        var {_id: userId} = req.user;
        //appending two fields
        req.body.art = artId;
        req.body.reviewedBy = userId
        var review = await Review.create(req.body)
        res.status(200).json({
            status: "success",
            data: {
                review
            }
        })
    } catch (error) {
        console.log(error)
        res.status(400).json({
            error: error.message
        })

    }
}

exports.getReviews =async (req,res) => {
    try {
       console.log(req.params)
        res.status(200).json({
            status: "success",
            msg: 'get reviews'
        })
    } catch (error) {
        console.log(error)
        res.status(400).json({
            error: error.message
        })
    }
}

// exports.fetchReviewsOfSpecificArt = 