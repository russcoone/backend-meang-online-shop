import { transport } from '../config/mailer';
import { IMailOption } from '../interfaces/email.interface';

class Mailservice {
  send(mail: IMailOption) {
    return new Promise((resolve, reject) => {
      transport.sendMail(
        {
          from: '"🛍️ vickystore365 🛍️"  <vickystore365@gmail.com >',
          to: mail.to,
          subject: mail.subject,
          html: mail.html,
        },
        (error, _) => {
          error
            ? reject({
                status: false,
                message: error,
              })
            : resolve({
                status: true,
                message: 'Email correctamente enviado ' + mail.to,
                mail,
              });
        }
      );
    });
  }
}

export default Mailservice;
