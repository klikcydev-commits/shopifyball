import type { Metadata } from "next"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"

export const revalidate = 300

export const metadata: Metadata = {
  title: "Return and Refund Policy | Lemah",
  description: "Return and refund policy for purchases made through Lemah Store.",
}

const policyText = `This Return and Refund Policy applies to all purchases made through Lemah Store. By placing an order, you agree to this policy, to the maximum extent permitted by applicable law.

1. General Rule
All sales are final except where a return or refund is expressly approved by us under this policy or where otherwise required by applicable law.

2. Refund Request Window
Any refund request must be submitted within 2 calendar days from the confirmed delivery date.

3. Return Request Window
Any return request must be submitted within 14 calendar days from the confirmed delivery date.

4. Eligible Grounds
A refund or return will only be considered if:
the wrong item was delivered; or
the item arrived materially damaged; or
the item arrived with a material defect existing at the time of delivery.

We do not accept returns or refunds for:
change of mind,
dislike of the item,
incorrect selection, size, color, model, or variant chosen by the customer,
minor variations in color, finish, packaging, or appearance that do not affect normal use,
damage caused after delivery,
use, wear, washing, alteration, or mishandling after delivery.

5. Damaged, Defective, or Incorrect Items
If an item arrives damaged, defective, or incorrect, the customer must report it to contact@lemah.store within 5 hours of receiving the product.

The customer must include sufficient proof, including:
clear photos of the product,
clear photos of the outer packaging,
clear photos of the shipping label,
and any additional proof we reasonably request.

Claims submitted after the 5-hour period may be rejected to the maximum extent permitted by applicable law.

6. Return Conditions
No return will be accepted unless all of the following conditions are met:
prior written approval is obtained from us,
the item is unused,
the item is in the same condition in which it was delivered,
the item is returned in its original packaging,
all tags, accessories, inserts, and included materials are returned,
proof of purchase is provided.

We reserve the right to reject any return that does not satisfy these conditions.

7. No Exchanges
We do not offer exchanges.

8. Free Shipping and Shipping Cost Recovery
Products may be displayed or sold with free shipping. Free shipping is a promotional benefit only and does not mean shipping had no cost.

If any return or refund is approved, the customer agrees that:
the actual outbound shipping cost paid by the seller may be deducted from the refund, even where shipping was shown as free at checkout; and
the customer is responsible for the full return shipping cost.

Example: if the product price is AED 100 and the seller paid AED 25 to ship it, the approved refund may be AED 75, before any other lawful deductions.

9. Refund Amount
If a refund is approved, the refund will be limited to the purchase price actually paid for the item, less:
the original shipping cost actually paid by the seller,
the return shipping cost,
any non-refundable duties, taxes, customs, processing charges, or handling costs, where permitted by law.

Refunds will not exceed the amount actually received by us for the item, except where otherwise required by applicable law.

10. Inspection and Final Decision
All returned items are subject to inspection upon receipt.

We reserve the right to:
approve or reject a return,
approve or reject a refund,
issue a partial refund,
deny a claim where proof is insufficient,
refuse a return sent without prior authorization.

11. Non-Returnable / Non-Refundable Items
Unless otherwise required by law, the following are non-returnable and non-refundable:
custom or personalized items,
sale, clearance, discounted, or promotional items,
gift cards,
items used, worn, washed, altered, or damaged after delivery,
items returned without approval,
items missing packaging, tags, inserts, or accessories.

12. Return Procedure
To request a return or refund, email contact@lemah.store with:
full name,
order number,
delivery date,
reason for the request,
and all supporting photos/documents.

Do not send any item back unless you have received written return instructions from us.

13. Refund Method and Timing
Approved refunds will be made to the original payment method only, unless otherwise required by law.

Refund processing times may vary depending on banks, card issuers, payment gateways, and financial institutions. We are not responsible for delays caused by third-party payment providers.

14. Chargebacks
Before initiating a chargeback or payment dispute, the customer agrees to contact us first and allow a reasonable opportunity to review and respond to the issue.

15. Policy Updates
We may amend this policy at any time. The version published on our website at the time of the order will apply to that order, unless a different version is required by law.

16. Contact
Lemah Store
Email: contact@lemah.store

Last updated: March 7, 2026`

export default function ReturnAndRefundPolicyPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-background py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-navy mb-6">
            Return and Refund Policy
          </h1>
          <p className="text-muted-foreground mb-8">
            Please read this policy carefully before requesting a return or refund.
          </p>
          <div className="whitespace-pre-wrap text-sm leading-6 text-muted-foreground">
            {policyText}
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

