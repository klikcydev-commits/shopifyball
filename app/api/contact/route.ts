import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

const SMTP_USER = process.env.SMTP_USER || 'contact@lemah.store'
const SMTP_PASS = process.env.SMTP_PASS
const CONTACT_TO = process.env.CONTACT_TO || SMTP_USER
const CONTACT_BCC = process.env.CONTACT_BCC
const SMTP_PORT = Number(process.env.SMTP_PORT) || 587
const USE_SSL = SMTP_PORT === 465

export async function POST(request: Request) {
  if (process.env.NODE_ENV === 'development') {
    console.log('[Contact] POST received. SMTP_USER set:', !!SMTP_USER, 'SMTP_PASS set:', !!SMTP_PASS, 'port:', SMTP_PORT)
  }
  if (!SMTP_PASS) {
    console.error('[Contact] SMTP_PASS is not set')
    return NextResponse.json(
      { error: 'Email is not configured. Please set SMTP_PASS in environment.' },
      { status: 503 }
    )
  }

  let body: { name?: string; email?: string; phone?: string; subject?: string; message?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const { name, email, phone, subject, message } = body
  if (!name?.trim() || !email?.trim() || !message?.trim()) {
    return NextResponse.json(
      { error: 'Name, email, and message are required' },
      { status: 400 }
    )
  }

  const transporter = nodemailer.createTransport({
    host: 'smtp.hostinger.com',
    port: SMTP_PORT,
    secure: USE_SSL,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  })

  const mailSubject = subject?.trim() ? `[LeMah] ${subject.trim()}` : `[LeMah] Contact from ${name.trim()}`
  const phoneLine = phone?.trim() ? `\nPhone: ${phone.trim()}` : ''
  const text = `Name: ${name.trim()}\nEmail: ${email.trim()}${phoneLine}\nSubject: ${subject?.trim() || '(none)'}\n\nMessage:\n${message.trim()}`
  const phoneHtml = phone?.trim() ? `<p><strong>Phone:</strong> ${escapeHtml(phone.trim())}</p>` : ''
  const html = `
    <p><strong>Name:</strong> ${escapeHtml(name.trim())}</p>
    <p><strong>Email:</strong> ${escapeHtml(email.trim())}</p>
    ${phoneHtml}
    <p><strong>Subject:</strong> ${escapeHtml(subject?.trim() || '(none)')}</p>
    <hr />
    <p>${escapeHtml(message.trim()).replace(/\n/g, '<br />')}</p>
  `

  try {
    const mailOptions: nodemailer.SendMailOptions = {
      from: `"LeMah Contact" <${SMTP_USER}>`,
      to: CONTACT_TO,
      replyTo: email.trim(),
      subject: mailSubject,
      text,
      html,
    }
    if (CONTACT_BCC?.trim()) {
      mailOptions.bcc = CONTACT_BCC.trim()
    }
    if (process.env.NODE_ENV === 'development') {
      console.log('[Contact] Sending to:', CONTACT_TO, 'from:', SMTP_USER, 'port:', SMTP_PORT)
    }
    await transporter.sendMail(mailOptions)
    if (process.env.NODE_ENV === 'development') {
      console.log('[Contact] Email sent successfully to:', CONTACT_TO)
    }
    return NextResponse.json({ success: true })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err)
    const code = err && typeof err === 'object' && 'code' in err ? (err as { code?: string }).code : undefined
    console.error('[Contact] Send failed:', message, 'code:', code)

    // Sanitized message for client (avoid leaking credentials)
    let userMessage = 'Failed to send message. Please try again or email us directly.'
    if (message.includes('Invalid login') || message.includes('authentication') || code === 'EAUTH') {
      userMessage = 'Email login failed. Please check SMTP username and password in server settings.'
    } else if (message.includes('ECONNREFUSED') || message.includes('ENOTFOUND')) {
      userMessage = 'Could not reach the mail server. In .env.local set SMTP_PORT=465 and restart.'
    } else if (process.env.NODE_ENV === 'development') {
      userMessage = `SMTP error: ${message.slice(0, 100)}`
    }

    return NextResponse.json(
      { error: userMessage },
      { status: 500 }
    )
  }
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}
