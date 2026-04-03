import { Resend } from 'resend';
import { NextResponse } from 'next/server';

const resendApiKey = process.env.RESEND_API_KEY;
const resend = new Resend(resendApiKey);

if (!resendApiKey) {
  console.warn('CRÍTICO: RESEND_API_KEY não encontrada no process.env. Reinicie o servidor se você acabou de adicioná-la ao .env.local');
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { services, parameters, results, contact } = body;

    // Build HTML for the email
    const htmlHeader = `
      <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
        <h2 style="color: #00F2FE; background: #000; padding: 10px; display: inline-block; border-radius: 4px;">NOVA PROPOSTA GERADA</h2>
        <p style="font-size: 14px; color: #666;">ID do Protocolo: ${Math.floor(Math.random() * 999999).toString().padStart(6, '0')}</p>
        <hr style="border: 0.5px solid #eee; margin: 20px 0;">
    `;

    const htmlContact = `
        <h3 style="color: #333; margin-top: 0;">Dados do Cliente</h3>
        <ul style="list-style: none; padding: 0;">
          <li><strong>Nome:</strong> ${contact.name}</li>
          <li><strong>Email:</strong> ${contact.email}</li>
          <li><strong>Telefone:</strong> ${contact.phone}</li>
          <li><strong>Observações:</strong> ${contact.observations || 'Nenhuma'}</li>
        </ul>
        <hr style="border: 0.5px solid #eee; margin: 20px 0;">
    `;

    const htmlProject = `
        <h3 style="color: #333;">Definição do Projeto</h3>
        <p><strong>Serviços Selecionados:</strong> ${services.join(', ')}</p>
        <ul style="list-style: none; padding: 0;">
          <li><strong>Prazo:</strong> ${parameters.prazo}</li>
          <li><strong>Investimento:</strong> ${parameters.investimento}</li>
          <li><strong>Escala:</strong> ${parameters.escala}</li>
        </ul>
        <hr style="border: 0.5px solid #eee; margin: 20px 0;">
    `;

    const htmlResults = `
        <h3 style="color: #333;">Estimativa Técnica</h3>
        <div style="background: #f9f9f9; padding: 15px; border-radius: 8px;">
          <p style="margin: 5px 0;"><strong>Total de Horas:</strong> ${results.horas} horas</p>
          <p style="margin: 5px 0;"><strong>Tempo Estimado:</strong> ${results.semanas} semanas</p>
          <p style="margin: 5px 0; font-size: 18px; color: #000;"><strong>Investimento Estimado:</strong> ${results.preco}</p>
        </div>
        <p style="font-size: 11px; color: #999; margin-top: 20px;">*Este é um resumo gerado automaticamente pelo Proposal Builder do Portfólio.</p>
      </div>
    `;

    const { data, error } = await resend.emails.send({
      from: 'Portfolio <onboarding@resend.dev>',
      to: ['wao2ster@gmail.com'],
      subject: `Nova Proposta: ${contact.name} - ${contact.email}`,
      html: `${htmlHeader}${htmlContact}${htmlProject}${htmlResults}`,
    });

    if (error) {
      console.error('Resend Error:', error);
      return NextResponse.json({ error: error.message || 'Erro desconhecido no Resend' }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
