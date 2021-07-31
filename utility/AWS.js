const AWS = require("aws-sdk");
const S3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY
})

exports.awsImageuploader = (file, filename) => {
    var {buffer, mimetype} = file;
    var awsParams = {
        Bucket: process.env.AWS_S3_BUCKET,
        Key: filename,
        Body: buffer,
        ContentType: mimetype
    }
    return new Promise((resolve,reject) => {
        S3.upload(awsParams,(err,data) => {
            if(err) reject(err)
            resolve(data)
        })
    })
}