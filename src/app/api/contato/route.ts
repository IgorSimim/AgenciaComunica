import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

export async function POST(req: NextRequest) {
  try {
    const { nome, email, mensagem } = await req.json()

    if (!nome || !email || !mensagem) {
      return NextResponse.json(
        { ok: false, error: 'Todos os campos são obrigatórios.' },
        { status: 400 }
      )
    }

    // Validação simples de Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { ok: false, error: 'Email inválido.' },
        { status: 400 }
      )
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
      tls: {
        rejectUnauthorized: false,
      },
    })

    // Testa conexão com o Gmail
    await transporter.verify().then(() => {
      console.log('Conexão com Gmail OK')
    }).catch((err) => {
      console.error('Erro ao conectar com Gmail:', err)
    })

    await transporter.sendMail({
      from: process.env.EMAIL,
      to: email,
      subject: `Sua mensagem foi recebida pela Agência Comunica!`,
      text: `
                Olá ${nome},

                Agradecemos pelo seu contato! 📨

                Nossa equipe da Agência Comunica recebeu sua mensagem e está pronta para ajudar! Aqui está um resumo do seu contato:

                - Nome: ${nome}
                - E-mail: ${email}
                - Mensagem: ${mensagem}
                

                Em breve, nossa equipe entrará em contato com você para discutir como podemos apoiar no seu projeto. Fique tranquilo(a), estamos à disposição para tirar todas as suas dúvidas.

                Se preferir, entre em contato diretamente conosco através de nossos canais:
                - E-mail: agenciacomunicamktdigital@gmail.com
                - Telefone: (053) 99139-3855

                Até logo, e nos vemos em breve! 😉

                Atenciosamente,
                Equipe Agência Comunica
                `,
      html: `
                <p>Olá <strong>${nome}</strong>,</p>

                <p>Agradecemos pelo seu contato! 📨</p>

                <p>Nossa equipe da <strong>Agência Comunica</strong> recebeu sua mensagem e está pronta para ajudar! Aqui está um resumo do seu contato:</p>

                <ul>
                    <li><strong>Nome:</strong> ${nome}</li>
                    <li><strong>E-mail:</strong> ${email}</li>
                    <li><strong>Mensagem:</strong></li>
                    <p>${mensagem}</p>
                </ul>

                <p>Em breve, nossa equipe entrará em contato com você para discutir como podemos apoiar no seu projeto. Fique tranquilo(a), estamos à disposição para tirar todas as suas dúvidas.</p>

                <p>Se preferir, entre em contato diretamente conosco através de nossos canais:</p>
                <ul>
                    <li><strong>E-mail:</strong> agenciacomunicamktdigital@gmail.com</li>
                    <li><strong>Telefone:</strong> (053) 99139-3855</li>
                </ul>

                <p>Até logo, e nos vemos em breve! 😉</p>

                <p>Atenciosamente,<br/>
                   Equipe <strong>Agência Comunica</strong></p>
            `,
    })

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Erro ao enviar email:', error)
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : 'Erro desconhecido' },
      { status: 500 }
    )
  }
}