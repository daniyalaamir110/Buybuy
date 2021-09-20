const { createTransport } = require("nodemailer");
const { compile } = require("handlebars");
const { readFile } = require("fs");
const { email, pass } = require("./config");

const readHTML = (path, cb) => {
  readFile(path, { encoding: "utf-8" }, (err, html) => {
    if (err) {
      throw err;
    } else {
      return cb(null, html);
    }
  });
};

const transporter = createTransport({
  service: "gmail",
  auth: {
    user: email,
    pass: pass
  }
});

const mail = (email, file, replacements) => {
  readHTML(process.cwd() + "/mail-templates/" + file, (err, html) => {
    const template = compile(html);
    const body = template(replacements);
    const mailOptions = {
      from: email,
      to: email,
      subject: "Signed up successfully",
      html: body,
    };
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.log(err);
      } else {
        console.log("Email sent: " + info.response);
      };
    });
  });
};

module.exports = mail;
