import { createFileRoute } from "@tanstack/react-router";

import { Clause, LegalPage } from "@/components/LegalPage";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — LabelTruth by EcoTruth Group" },
      {
        name: "description",
        content:
          "How LabelTruth handles label photos, scan history, API partner data and analytics, and what we never store.",
      },
      { property: "og:title", content: "Privacy Policy — LabelTruth by EcoTruth Group" },
      {
        property: "og:description",
        content: "What LabelTruth does and does not keep when you scan a packaged food label.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Privacy,
});

function Privacy() {
  return (
    <LegalPage
      title="Privacy Policy"
      updated="5 August 2026"
      intro="This page is maintained by EcoTruth Group to explain how the LabelTruth app and API handle information. It describes current practices in the app and is not an independent certification or audit."
    >
      <Clause heading="1. What we collect">
        <p>
          <strong>Label photos.</strong> Images you capture or upload are sent to our analysis
          service to be read and scored. They are processed to produce your result and are not used
          to build an advertising profile of you.
        </p>
        <p>
          <strong>Scan history.</strong> Your scan log is written to your own browser storage on your
          device. It is not uploaded to us, and clearing it in the app removes it.
        </p>
        <p>
          <strong>API partner data.</strong> For API Program subscribers we process the partner code,
          request metadata, volumes and billing details needed to run the account.
        </p>
      </Clause>

      <Clause heading="2. What we do not do">
        <p>
          We do not sell personal information. We do not require an account to scan a pack. We do not
          ask for health records, and LabelTruth results are guidance, not medical advice or a
          diagnosis.
        </p>
      </Clause>

      <Clause heading="3. Third parties">
        <p>
          Label reading is performed by an AI processing provider on our behalf under contract.
          Hosting, error reporting and payment processing are also handled by service providers. Each
          receives only what its function requires.
        </p>
      </Clause>

      <Clause heading="4. Retention">
        <p>
          Images submitted for scanning are retained only as long as needed to return your result and
          to investigate errors, then discarded. Account and billing records for API subscribers are
          kept for as long as the account is active and afterwards where law requires.
        </p>
      </Clause>

      <Clause heading="5. Your choices">
        <p>
          You can clear your scan history at any time from the History page. To ask about the data
          held for an API account, or to request deletion of an account, contact
          privacy@ecotruthgroup.example.
        </p>
      </Clause>

      <Clause heading="6. Children">
        <p>LabelTruth is not directed at children under 13 and we do not knowingly collect their data.</p>
      </Clause>

      <Clause heading="7. Changes">
        <p>
          We will update this page when practices change and revise the date above. Material changes
          affecting API subscribers are also sent to the account contact.
        </p>
      </Clause>
    </LegalPage>
  );
}
