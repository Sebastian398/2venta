import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import jwt from 'jsonwebtoken';

export default function VerifyEmail() {
  const router = useRouter();
  const { token } = router.query;
  const [message, setMessage] = useState('Verificando...');

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.NEXT_PUBLIC_JWT_SECRET);
        // Aquí marca el usuario como verificado en DB o localStorage
        setMessage('Correo verificado correctamente. Redirigiendo...');
        setTimeout(() => router.push('/login'), 2000);
      } catch (e) {
        setMessage('Token inválido o expirado.');
      }
    }
  }, [token, router]);

  return <div className="text-center p-8">{message}</div>;
}
