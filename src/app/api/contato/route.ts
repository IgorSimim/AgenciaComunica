import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

function escapeHtml(value: string) {
  const escapedCharacters: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  }
  return value.replace(/[&<>"']/g, (character) => escapedCharacters[character])
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { nome, email, mensagem } = body

    if (!nome || !email || !mensagem) {
      return NextResponse.json(
        { ok: false, message: 'Nome, email e mensagem válidos são obrigatórios.' },
        { status: 400 }
      )
    }

    // Validação simples de Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { ok: false, message: 'Email inválido.' },
        { status: 400 }
      )
    }

    if (!process.env.EMAIL || !process.env.GMAIL_APP_PASSWORD) {
      console.error('Configuração de email incompleta')
      return NextResponse.json(
        { ok: false, message: 'Serviço de contato temporariamente indisponível.' },
        { status: 503 }
      )
    }

    const nomeHtml = escapeHtml(nome.trim())
    const emailHtml = escapeHtml(email.trim())
    const mensagemHtml = escapeHtml(mensagem.trim()).replace(/\r?\n/g, '<br/>')

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    })

    try {
      await transporter.sendMail({
        from: process.env.EMAIL,
        to: process.env.EMAIL,
        replyTo: email.trim(),
        subject: `Novo contato pelo site: ${nome.trim()}`,
        text: `
          Novo contato recebido pelo site da Agência Comunica.

          Nome: ${nome.trim()}
          E-mail: ${email.trim()}

          Mensagem:
          ${mensagem.trim()}
        `,
        html: `
          <h2>Novo contato recebido pelo site</h2>
          <p><strong>Nome:</strong> ${nomeHtml}</p>
          <p><strong>E-mail:</strong> ${emailHtml}</p>
          <p><strong>Mensagem:</strong></p>
          <p>${mensagemHtml}</p>
        `,
      })
    } catch (error) {
      console.error('Erro ao enviar confirmação de contato:', error)
      return NextResponse.json(
        { ok: false, message: 'Não foi possível enviar a confirmação agora.' },
        { status: 502 }
      )
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { ok: false, message: 'Corpo da requisição inválido.' },
        { status: 400 }
      )
    }
    console.error('Erro ao processar contato:', error)
    return NextResponse.json(
      { ok: false, message: 'Não foi possível processar sua mensagem agora.' },
      { status: 500 }
    )
  }
}