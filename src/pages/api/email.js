import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Método no permitido" });
    return;
  }

  const { email, codigo } = req.body;

  if (!email || !codigo) {
    res.status(400).json({ error: "Faltan parámetros" });
    return;
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: email,
    subject: "Código de verificación",
    html: `<p>Tu código de verificación es: <b>${codigo}</b></p>`,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Correo enviado" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error enviando correo" });
  }
}
