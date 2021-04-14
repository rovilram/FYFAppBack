const nodemailer = require('nodemailer');

exports.mailer = (email, link) => {
  const transporter = nodemailer.createTransport({
    service: process.env.SMTP_SERVICE,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
  const htmlMail = `<!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>VUELVE A SER UN FyFer!!!</title>
  </head>
  <body>
      <h1>VUELVE A SER UN FyFer!!!</h1>
  <div>
      <img src="https://pbs.twimg.com/profile_images/900209333509795840/FiWytW6W_400x400.jpg" alt="Bright future ahead">
  </div>
  <div>Sigue este enlace para recuperar tu contraseña: <a href="${link}">Link<a></div>
  </body>
  </html>`;

  let mailOptions = {
    from: 'fyferapp@gmail.com',
    to: email,
    subject: `${email} recupera tu contraseña`,
    text: `Link para recuperar contraseña: ${link}`,
    html: htmlMail,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      throw error;
    } else {
      console.log('Email sent: ' + info.response);
      return true;
    }
  });
};
