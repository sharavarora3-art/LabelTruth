import { createFileRoute } from "@tanstack/react-router";

import { Clause, LegalPage } from "@/components/LegalPage";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms & Conditions — LabelTruth by EcoTruth Group" },
      {
        name: "description",
        content:
          "The terms for using the LabelTruth scanner and the paid API Program, including acceptable use, payment, revenue share and liability.",
      },
      { property: "og:title", content: "Terms & Conditions — LabelTruth by EcoTruth Group" },
      {
        property: "og:description",
        content: "Rules for using the LabelTruth scanner, scores and API Program.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Terms,
});

function Terms() {
  return (
    <LegalPage
      title="Terms & Conditions"
      updated="5 August 2026"
      intro="These terms govern your use of the LabelTruth app, website and API, operated by EcoTruth Group. By scanning a pack or calling the API you accept them."
    >
      <Clause heading="1. The service">
        <p>
          LabelTruth reads photographs of packaged food and returns a verdict, a Product-to-Claim
          (P:C) ratio, a trust score, a claim breakdown and a confidence band. Results are automated
          estimates based on what is legible in your photo.
        </p>
      </Clause>

      <Clause heading="2. Not medical or regulatory advice">
        <p>
          Scores are informational. They are not medical, dietary, allergen or legal advice, and are
          not a substitute for the manufacturer&apos;s own declared information. Always read the
          physical label for allergens.
        </p>
      </Clause>

      <Clause heading="3. Acceptable use">
        <p>
          You may not scrape, resell or redistribute LabelTruth scores outside a paid API plan; use
          the service to build a competing scoring product; reverse engineer our methodology; or
          submit unlawful content.
        </p>
      </Clause>

      <Clause heading="4. API Program, payment and revenue share">
        <p>
          API access requires an active paid subscription. Quotas, rates and revenue-share tiers are
          those shown on the API Program page at the time you subscribe. Ad placement earnings are
          calculated from verified impressions attributed to your partner code and settled monthly;
          fraudulent or automated impressions void the payout and may end the account. Fees are
          non-refundable except where law requires.
        </p>
      </Clause>

      <Clause heading="5. Accuracy and third-party brands">
        <p>
          Product names and marks shown in coverage examples belong to their respective owners and
          appear for identification and commentary only. We correct factual errors on notice at
          corrections@ecotruthgroup.example.
        </p>
      </Clause>

      <Clause heading="6. Liability">
        <p>
          The service is provided &quot;as is&quot;. To the maximum extent permitted by law EcoTruth
          Group is not liable for indirect or consequential loss, and total liability for any claim is
          limited to the fees you paid in the preceding three months.
        </p>
      </Clause>

      <Clause heading="7. Suspension and changes">
        <p>
          We may suspend accounts that breach these terms and may change the service or these terms
          with notice on this page. Continued use after a change is acceptance of it.
        </p>
      </Clause>
    </LegalPage>
  );
}
