const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  try {
      var {to, subject, content} = options;
    //create transport
    var transport = nodemailer.createTransport({
        host: process.env.EMAIL_SERVICE_HOST, //mail trap
        port: process.env.EMAIL_SERVICE_PORT,
        auth: {
          user: process.env.EMAIL_SERVICE_USER,
          pass: process.env.EMAIL_SERVICE_PASSWORD
        },
        // requireTLS: true
      });
    //define email options
    var mailOptions = {
        from: "e-creaft@service.com",
        to,
        subject,
        text: content,
        // html: <h1></h1>
    }
    //send email
    await transport.sendMail(mailOptions);
  } catch (error) {
    console.log(error);
  }
};

module.exports = sendEmail
