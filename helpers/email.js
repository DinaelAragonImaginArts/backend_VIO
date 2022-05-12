import sgMail from '@sendgrid/mail';


export const emailRegistro = async (datos) => {
  const { email, nombre, token } = datos;

  //Informacion del email 

  const info = {
    from: 'dinaelaragon@agos.mx',
    to: email,
    subject: "TimeApp - Comprueba tu cuenta",
    text: "Comprueba tu cuenta en UpTask",
    html: `<p>Hola: ${nombre} Comprueba tu cuenta en TimeApp</p>
          <p>Tu cuenta ya esta casi lista, solo debes comprobarla en el siguiente enlace: </p>
          <a href="${process.env.FRONTEND_URL}/confirmar/${token}">Comprobar cuenta</a>
          
          <p>Si tu no creaste esta cuenta, puedes ignorar el mensaje</p>
          
          
          `
  };
  sgMail.setApiKey(process.env.SENDGRID_API_KEY)

  sgMail
    .send(info)
    .then(() => {
      console.log('Email sent')
    })
    .catch((error) => {
      console.error(error)
    })
};



export const emailOlvidePassword = async (datos) => {
  const { email, nombre, token } = datos;
  //Informacion del email 

  const info = {
    from: 'dinaelaragon@agos.mx',
    to: email,
    subject: "TimeApp - Reestablece tu password",
    text: "Reestablece tu password",
    html: `<p>Hola: ${nombre} Restablece tu password</p>
        <p>Sigue el siguiente enlace para generar un nuevo password: </p>
        <a href="${process.env.FRONTEND_URL}/olvide-password/${token}">Reestablecer password</a>
        
        <p>Si tu no solicitaste este email, ignoralo</p>
        
        
        `,
  }
  sgMail.setApiKey(process.env.SENDGRID_API_KEY)

  sgMail
    .send(info)
    .then(() => {
      console.log('Email sent')
    })
    .catch((error) => {
      console.error(error)
    })
};
