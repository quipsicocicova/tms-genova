import nodemailer from 'nodemailer';

// Mount at /api/contact. This handler can also be used by a production Node server.
export function createContactHandler(env = process.env) {
  const attempts = new Map();
  const configured = ['SMTP_HOST', 'SMTP_PORT', 'SMTP_USER', 'SMTP_PASS', 'SMTP_FROM'].every(key => env[key]);
  const transport = configured ? nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: Number(env.SMTP_PORT),
    secure: Number(env.SMTP_PORT) === 465,
    requireTLS: Number(env.SMTP_PORT) !== 465,
    auth: { user: env.SMTP_USER, pass: env.SMTP_PASS },
    connectionTimeout: 10000,
    socketTimeout: 15000,
  }) : null;

  return async (req, res) => {
    res.setHeader('Cache-Control', 'no-store');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    const reply = (code, message) => {
      res.writeHead(code, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({ message }));
    };
    if (req.method !== 'POST') return reply(405, 'Metodo non consentito.');
    let origin;
    try { origin = new URL(req.headers.origin); } catch { return reply(403, 'Richiesta non consentita.'); }
    if (origin.host !== req.headers.host || !['http:', 'https:'].includes(origin.protocol)) return reply(403, 'Richiesta non consentita.');
    if (req.headers['content-type'] !== 'application/json') return reply(415, 'Formato non supportato.');
    if (!transport) return reply(503, 'Il modulo non è ancora attivo. Per informazioni chiama lo studio allo 010 375 3411.');

    const now = Date.now();
    for (const [key, value] of attempts) if (value.reset <= now) attempts.delete(key);
    const ip = req.socket.remoteAddress;
    const attempt = attempts.get(ip) ?? { count: 0, reset: now + 15 * 60 * 1000 };
    if (attempt.count >= 5 || attempts.size > 10000) return reply(429, 'Troppe richieste. Riprova tra qualche minuto o telefona allo studio.');
    attempt.count++;
    attempts.set(ip, attempt);

    let data;
    try {
      let size = 0;
      const chunks = [];
      for await (const chunk of req) {
        size += chunk.length;
        if (size > 24000) return reply(413, 'Il messaggio è troppo lungo.');
        chunks.push(chunk);
      }
      data = JSON.parse(Buffer.concat(chunks).toString('utf8'));
    } catch { return reply(400, 'Richiesta non valida.'); }
    if (data.website) return reply(400, 'Richiesta non valida.');
    const valid = (key, max, required = true) => typeof data[key] === 'string' && data[key].length <= max && (!required || data[key].trim().length > 0);
    if (!valid('name', 100) || !valid('email', 254) || !valid('phone', 40, false) || !valid('message', 3000) || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email) || /[\r\n]/.test(data.email)) {
      return reply(400, 'Controlla nome, indirizzo email e messaggio.');
    }
    try {
      const result = await transport.sendMail({
        from: env.SMTP_FROM,
        to: 'centrotmsgenova@gmail.com',
        replyTo: data.email.trim(),
        subject: 'Richiesta dal sito Centro TMS Genova',
        text: `Nome: ${data.name.trim()}\nEmail: ${data.email.trim()}\nTelefono: ${data.phone.trim() || 'Non indicato'}\n\n${data.message.trim()}`,
      });
      if (!result.accepted?.length) throw new Error('Message not accepted');
      reply(200, 'La tua richiesta è stata inviata al centro. Grazie per averci contattato.');
    } catch {
      // Do not log messages, personal data or SMTP credentials.
      reply(502, 'Invio non riuscito. Riprova più tardi oppure chiama lo studio allo 010 375 3411.');
    }
  };
}
