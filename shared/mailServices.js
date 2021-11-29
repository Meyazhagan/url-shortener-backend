const nodemailer = require("nodemailer");
const config = require("config");

console.log(config.get("mail.username"));
// const

const sendMail = async (email, subject, text) => {
  var transporter = nodemailer.createTransport({
    service: "outlook",
    auth: {
      user: config.get("mail.username"),
      pass: config.get("mail.password"),
    },
  });

  var mailOptions = {
    from: config.get("mail.username"),
    to: email,
    subject: subject,
    text: text,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log("Error in sending mail", error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};

module.exports = sendMail;
