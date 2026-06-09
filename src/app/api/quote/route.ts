import { Resend } from "resend";
import { NextResponse } from "next/server";

const BUSINESS_EMAIL = "hello@legacyepoxy.com"; // TODO: replace with real inbox

export const dynamic = "force-dynamic";

interface QuotePayload {
  name: string;
  phone: string;
  email: string;
  zip: string;
  projectType: string;
  message?: string;
}

export async function POST(request: Request) {
  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const body: QuotePayload = await request.json();

    if (!body.name || !body.phone || !body.email || !body.zip || !body.projectType) {
      return NextResponse.json(
        { error: "Please fill in all required fields." },
        { status: 400 }
      );
    }

    await resend.emails.send({
      from: "Legacy Epoxy Website <onboarding@resend.dev>",
      to: [BUSINESS_EMAIL],
      subject: `New Quote Request — ${body.projectType} — ${body.name}`,
      replyTo: body.email,
      html: `
        <h2>New Quote Request</h2>
        <table style="border-collapse:collapse;font-family:sans-serif;">
          <tr><td style="padding:6px 12px;font-weight:bold;">Name</td><td style="padding:6px 12px;">${escapeHtml(body.name)}</td></tr>
          <tr><td style="padding:6px 12px;font-weight:bold;">Phone</td><td style="padding:6px 12px;"><a href="tel:${escapeHtml(body.phone)}">${escapeHtml(body.phone)}</a></td></tr>
          <tr><td style="padding:6px 12px;font-weight:bold;">Email</td><td style="padding:6px 12px;"><a href="mailto:${escapeHtml(body.email)}">${escapeHtml(body.email)}</a></td></tr>
          <tr><td style="padding:6px 12px;font-weight:bold;">ZIP / City</td><td style="padding:6px 12px;">${escapeHtml(body.zip)}</td></tr>
          <tr><td style="padding:6px 12px;font-weight:bold;">Project</td><td style="padding:6px 12px;">${escapeHtml(body.projectType)}</td></tr>
          ${body.message ? `<tr><td style="padding:6px 12px;font-weight:bold;">Message</td><td style="padding:6px 12px;">${escapeHtml(body.message)}</td></tr>` : ""}
        </table>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Quote form error:", err);
    return NextResponse.json(
      { error: "Failed to send. Please call us directly." },
      { status: 500 }
    );
  }
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
