import type { APIRoute } from 'astro'
import { env } from 'cloudflare:workers'

export const prerender = false

export const POST: APIRoute = async ({ request }) => {
  const apiKey = (env as unknown as Record<string, string | undefined>)['RESEND_API_KEY'] ?? import.meta.env.RESEND_API_KEY

  if (!apiKey) {
    return new Response(JSON.stringify({ error: 'Serviço de e-mail não configurado.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  let body: Record<string, string>
  try {
    body = await request.json()
  } catch {
    return new Response(JSON.stringify({ error: 'Requisição inválida.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const { name, email, phone, subject, message } = body

  if (!name?.trim() || !email?.trim() || !subject?.trim() || !message?.trim()) {
    return new Response(JSON.stringify({ error: 'Preencha todos os campos obrigatórios.' }), {
      status: 422,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return new Response(JSON.stringify({ error: 'E-mail inválido.' }), {
      status: 422,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'Tua Casa Segura <noreply@tuacasasegura.com.br>',
      to: ['contato@tuacasasegura.com.br'],
      reply_to: email,
      subject: `[Contato] ${subject}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
          <h2 style="color: #1c1917; margin-bottom: 24px;">Nova mensagem de contato</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; color: #78716c; font-size: 14px; width: 100px;">Nome</td>
              <td style="padding: 8px 0; color: #1c1917; font-size: 14px;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #78716c; font-size: 14px;">E-mail</td>
              <td style="padding: 8px 0; color: #1c1917; font-size: 14px;">${email}</td>
            </tr>
            ${phone ? `<tr>
              <td style="padding: 8px 0; color: #78716c; font-size: 14px;">Telefone</td>
              <td style="padding: 8px 0; color: #1c1917; font-size: 14px;">${phone}</td>
            </tr>` : ''}
            <tr>
              <td style="padding: 8px 0; color: #78716c; font-size: 14px;">Assunto</td>
              <td style="padding: 8px 0; color: #1c1917; font-size: 14px;">${subject}</td>
            </tr>
          </table>
          <hr style="border: none; border-top: 1px solid #e7e5e4; margin: 24px 0;" />
          <h3 style="color: #1c1917; font-size: 14px; margin-bottom: 12px;">Mensagem</h3>
          <p style="color: #1c1917; font-size: 14px; line-height: 1.6; white-space: pre-wrap;">${message}</p>
        </div>
      `,
    }),
  })

  if (!res.ok) {
    const errBody = await res.text()
    console.error('[contact] Resend error:', errBody)
    return new Response(JSON.stringify({ error: 'Erro ao enviar mensagem.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  })
}
