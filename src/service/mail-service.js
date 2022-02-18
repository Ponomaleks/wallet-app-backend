const nodemailer = require("nodemailer");

class MailService {
  constructor() {
    //инициализируем почтовый клиент
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });
  }
  // отправка письма для активации
  async sendActivationMail(to, link) {
    await this.transporter.sendMail({
      from: process.env.SMTP_USER,
      to,
      //при деплое перезаписать доменное имя в config
      subject: "Account activation на " + process.env.DOMAIN,
      text: "",
      html: `
                    <div>
                        <h1>To activate follow the link</h1>
                        <a href="${link}">${link}</a>
                    </div>
                `,
    });
  }
}

module.exports = new MailService();
