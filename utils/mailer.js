var nodemailer = require('nodemailer'); 

module.exports.sendMail = (to, id) => {
    let transport = nodemailer.createTransport({
        host: 'smtp.mailtrap.io',
        port: 2525,
        auth: {
           user: '336bf1191e780f',
           pass: 'b5eb5794ae77a0'
        }
    });

    const message = {
        from: 'admin@blogit.com',
        to: 'user@email.com',
        subject: 'Activate your account',
        html: `<h1>Let\'s complete the final step</h1><p>Click the following link to activate your account</p><a href="localhost:3000/validate/${id}">Click me to activate!</a>`
    };

    transport.sendMail(message, function(err, info) {
        if (err) {
          console.log(err)
        } else {
          console.log(info);
        }
    });
}