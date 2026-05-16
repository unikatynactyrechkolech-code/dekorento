import { Resend } from "resend";

const FROM = process.env.RESEND_FROM ?? "Dekorento <noreply@dekorento.cz>";

export type OrderEmailData = {
  to: string;
  full_name: string;
  order_number: string;
  items: { product_name: string; quantity: number; unit_price: number; subtotal: number }[];
  total: number;
  note?: string | null;
  rental_from?: string | null;
  rental_to?: string | null;
};

export async function sendOrderConfirmation(data: OrderEmailData) {
  if (!process.env.RESEND_API_KEY) {
    console.warn("RESEND_API_KEY není nastavený — email nebyl odeslán");
    return;
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  const itemsHtml = data.items
    .map(
      (i) =>
        `<tr>
          <td style="padding:8px 0;border-bottom:1px solid #f0f0f0">${i.quantity}× ${i.product_name}</td>
          <td style="padding:8px 0;border-bottom:1px solid #f0f0f0;text-align:right">${i.subtotal.toLocaleString("cs-CZ")} Kč</td>
        </tr>`
    )
    .join("");

  const rentalInfo =
    data.rental_from && data.rental_to
      ? `<p style="color:#555">📅 Termín: <strong>${formatDate(data.rental_from)} – ${formatDate(data.rental_to)}</strong></p>`
      : "";

  const html = `
<!DOCTYPE html>
<html lang="cs">
<head><meta charset="UTF-8"><title>Potvrzení objednávky</title></head>
<body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:#fafafa;margin:0;padding:0">
  <div style="max-width:580px;margin:40px auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,.06)">

    <div style="background:#000;padding:32px 40px">
      <h1 style="color:#fff;margin:0;font-size:24px;font-weight:900;letter-spacing:-0.5px">Dekorento</h1>
      <p style="color:#aaa;margin:4px 0 0;font-size:14px">Prémiová půjčovna fotopozadí a dekorací</p>
    </div>

    <div style="padding:40px">
      <h2 style="margin:0 0 8px;font-size:20px">Děkujeme za objednávku, ${data.full_name.split(" ")[0]}!</h2>
      <p style="color:#555;margin:0 0 24px">Objednávka <strong>${data.order_number}</strong> byla přijata. Brzy vás budeme kontaktovat ohledně potvrzení a platby.</p>

      ${rentalInfo}

      <table style="width:100%;border-collapse:collapse;margin:24px 0">
        <thead>
          <tr>
            <th style="text-align:left;font-size:12px;color:#999;text-transform:uppercase;padding-bottom:8px;border-bottom:2px solid #000">Položka</th>
            <th style="text-align:right;font-size:12px;color:#999;text-transform:uppercase;padding-bottom:8px;border-bottom:2px solid #000">Cena</th>
          </tr>
        </thead>
        <tbody>${itemsHtml}</tbody>
        <tfoot>
          <tr>
            <td style="padding-top:16px;font-weight:700;font-size:16px">Celkem</td>
            <td style="padding-top:16px;font-weight:700;font-size:16px;text-align:right">${data.total.toLocaleString("cs-CZ")} Kč</td>
          </tr>
        </tfoot>
      </table>

      ${data.note ? `<div style="background:#f8f8f8;border-radius:8px;padding:16px;margin-top:16px"><p style="margin:0;font-size:14px;color:#555">📝 <strong>Poznámka:</strong> ${data.note}</p></div>` : ""}

      <hr style="border:none;border-top:1px solid #f0f0f0;margin:32px 0">

      <p style="font-size:13px;color:#999;margin:0">
        Otázky? Napište nám na <a href="mailto:info@dekorento.cz" style="color:#000">info@dekorento.cz</a>
      </p>
    </div>

    <div style="background:#f8f8f8;padding:20px 40px;text-align:center">
      <p style="font-size:12px;color:#bbb;margin:0">© ${new Date().getFullYear()} Dekorento — Praha</p>
    </div>
  </div>
</body>
</html>`;

  await resend.emails.send({
    from: FROM,
    to: data.to,
    subject: `Potvrzení objednávky ${data.order_number} — Dekorento`,
    html,
  });
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("cs-CZ");
}
