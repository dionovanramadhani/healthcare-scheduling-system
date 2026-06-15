import { Injectable } from '@nestjs/common';
import { Resend } from 'resend';

export interface SendScheduleConfirmationInput {
  to: string;
  customerName: string;
  doctorName: string;
  scheduledAt: Date;
  objective: string;
}

@Injectable()
export class EmailService {
  sendEmail(data: SendScheduleConfirmationInput) {
    const resend = new Resend(process.env.RESEND_API_KEY);

    const formattedDate = new Date(data.scheduledAt).toLocaleString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short',
    });

    resend.emails.send({
      from: 'onboarding@resend.dev',
      to: data.to,
      subject: `Konfirmasi Jadwal Temu: Dr. ${data.doctorName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
          <h2 style="color: #2c3e50; text-align: center; border-bottom: 2px solid #3498db; padding-bottom: 10px;">Konfirmasi Jadwal Temu</h2>
          <p>Halo <strong>${data.customerName}</strong>,</p>
          <p>Jadwal temu Anda berhasil dibuat dengan rincian sebagai berikut:</p>

          <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <tr style="background-color: #f8f9fa;">
              <td style="padding: 12px; border: 1px solid #dee2e6; font-weight: bold; width: 30%;">Dokter</td>
              <td style="padding: 12px; border: 1px solid #dee2e6;">Dr. ${data.doctorName}</td>
            </tr>
            <tr>
              <td style="padding: 12px; border: 1px solid #dee2e6; font-weight: bold;">Waktu</td>
              <td style="padding: 12px; border: 1px solid #dee2e6;">${formattedDate}</td>
            </tr>
            <tr style="background-color: #f8f9fa;">
              <td style="padding: 12px; border: 1px solid #dee2e6; font-weight: bold;">Tujuan / Keluhan</td>
              <td style="padding: 12px; border: 1px solid #dee2e6;">${data.objective}</td>
            </tr>
          </table>

          <p style="color: #7f8c8d; font-size: 14px; text-align: center; margin-top: 30px;">
            Terima kasih telah menggunakan layanan penjadwalan kesehatan kami.
          </p>
        </div>
      `,
    });
  }
}
