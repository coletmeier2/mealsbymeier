import type { OrderWithItems } from "@/modules/orders/types"

function formatPrice(cents: number) {
  return `$${(cents / 100).toFixed(2)}`
}

export function orderConfirmationHtml(order: OrderWithItems): string {
  const itemRows = order.items
    .map(
      (item) => `
      <tr>
        <td style="padding: 10px 0; border-bottom: 1px solid #e8e0d0; color: #3d3530; font-size: 14px;">
          ${item.product.name}
        </td>
        <td style="padding: 10px 0; border-bottom: 1px solid #e8e0d0; color: #3d3530; font-size: 14px; text-align: center;">
          ${item.quantity}
        </td>
        <td style="padding: 10px 0; border-bottom: 1px solid #e8e0d0; color: #3d3530; font-size: 14px; text-align: right;">
          ${formatPrice(item.priceAtTime)}
        </td>
      </tr>`
    )
    .join("")

  const fulfillmentLine =
    order.fulfillmentType === "DELIVERY" && order.deliveryAddress
      ? `Delivery to: ${order.deliveryAddress}`
      : "Pickup — I'll reach out to coordinate a time."

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Order Confirmed</title>
</head>
<body style="margin: 0; padding: 0; background-color: #faf8f5; font-family: sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #faf8f5; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border: 1px solid #e8e0d0;">

          <!-- Header -->
          <tr>
            <td style="background-color: #1a1410; padding: 32px 40px; text-align: center;">
              <p style="margin: 0; color: #c8a96e; font-size: 11px; letter-spacing: 3px; text-transform: uppercase;">
                MealsByMeier
              </p>
              <h1 style="margin: 12px 0 0; color: #f5f0e8; font-size: 28px; font-weight: 300; letter-spacing: 2px;">
                Order Confirmed
              </h1>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding: 40px;">

              <p style="margin: 0 0 24px; color: #3d3530; font-size: 15px; line-height: 1.6;">
                Hi ${order.customerName},
              </p>
              <p style="margin: 0 0 32px; color: #3d3530; font-size: 15px; line-height: 1.6;">
                Thank you for your order. Your payment was successful and I&apos;ll be in touch shortly to coordinate ${order.fulfillmentType === "DELIVERY" ? "delivery" : "pickup"}.
              </p>

              <!-- Order summary -->
              <p style="margin: 0 0 12px; color: #c8a96e; font-size: 11px; letter-spacing: 3px; text-transform: uppercase;">
                Order Summary
              </p>
              <table width="100%" cellpadding="0" cellspacing="0" style="border-top: 1px solid #e8e0d0;">
                <thead>
                  <tr>
                    <th style="padding: 10px 0; text-align: left; color: #8a8070; font-size: 11px; font-weight: normal; letter-spacing: 1px; text-transform: uppercase; border-bottom: 1px solid #e8e0d0;">Item</th>
                    <th style="padding: 10px 0; text-align: center; color: #8a8070; font-size: 11px; font-weight: normal; letter-spacing: 1px; text-transform: uppercase; border-bottom: 1px solid #e8e0d0;">Qty</th>
                    <th style="padding: 10px 0; text-align: right; color: #8a8070; font-size: 11px; font-weight: normal; letter-spacing: 1px; text-transform: uppercase; border-bottom: 1px solid #e8e0d0;">Price</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemRows}
                </tbody>
                <tfoot>
                  <tr>
                    <td colspan="2" style="padding: 14px 0 0; color: #3d3530; font-size: 14px; font-weight: 600;">Total</td>
                    <td style="padding: 14px 0 0; text-align: right; color: #3d3530; font-size: 14px; font-weight: 600;">
                      ${formatPrice(order.totalAmount)}
                    </td>
                  </tr>
                </tfoot>
              </table>

              <!-- Fulfillment -->
              <div style="margin-top: 32px; padding: 16px; background-color: #faf8f5; border: 1px solid #e8e0d0;">
                <p style="margin: 0 0 4px; color: #c8a96e; font-size: 11px; letter-spacing: 3px; text-transform: uppercase;">
                  Fulfillment
                </p>
                <p style="margin: 0; color: #3d3530; font-size: 14px; line-height: 1.6;">
                  ${fulfillmentLine}
                </p>
              </div>

              <p style="margin: 32px 0 0; color: #8a8070; font-size: 13px; line-height: 1.6;">
                Questions? Reply to this email and I&apos;ll get back to you.
              </p>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 24px 40px; border-top: 1px solid #e8e0d0; text-align: center;">
              <p style="margin: 0; color: #8a8070; font-size: 11px; letter-spacing: 2px; text-transform: uppercase;">
                MealsByMeier &mdash; Baked to Order
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim()
}
