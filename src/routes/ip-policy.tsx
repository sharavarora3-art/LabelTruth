import { createFileRoute } from "@tanstack/react-router";

import { Clause, LegalPage } from "@/components/LegalPage";

export const Route = createFileRoute("/ip-policy")({
  head: () => ({
    meta: [
      { title: "Intellectual Property Policy — EcoTruth Group" },
      {
        name: "description",
        content:
          "EcoTruth Group reserves all intellectual property rights in LabelTruth, the P:C ratio and its methodology. Copying the application may attract legal notices.",
      },
      { property: "og:title", content: "Intellectual Property Policy — EcoTruth Group" },
      {
        property: "og:description",
        content:
          "All rights in LabelTruth, the Product-to-Claim ratio and the LabelTruth methodology are reserved by EcoTruth Group.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: IpPolicy,
});

function IpPolicy() {
  return (
    <LegalPage
      title="Intellectual Property Policy"
      updated="5 August 2026"
      intro="LabelTruth is owned and operated by EcoTruth Group, the stakeholding entity behind the product. This policy sets out the rights EcoTruth Group reserves and how it responds to copying."
    >
      <Clause heading="1. Ownership and reservation of rights">
        <p>
          EcoTruth Group reserves all intellectual property rights in and to LabelTruth. This
          includes, without limitation, the LabelTruth name and logo, the Product-to-Claim (P:C)
          ratio and its name, the trust score, the confidence-band framework, the LabelTruth
          evaluation methodology, the scoring prompts and rule sets, the interface design, the source
          code, the copy on this site and all databases of audited products.
        </p>
        <p>
          No licence to any of the above is granted by implication, estoppel or otherwise. Use of the
          service does not transfer any ownership to you.
        </p>
      </Clause>

      <Clause heading="2. Prohibited copying">
        <p>You may not, without prior written permission from EcoTruth Group:</p>
        <p>
          build, publish or distribute the same or a substantially similar application; replicate the
          P:C ratio, trust score or confidence framework under any name; copy the LabelTruth
          interface, layout, wording or scoring presentation; use the LabelTruth name, marks or
          look-and-feel in a competing product; or train a model on LabelTruth outputs to reproduce
          its scoring.
        </p>
      </Clause>

      <Clause heading="3. Enforcement — legal notices">
        <p>
          Where EcoTruth Group identifies an application, service or feature that copies LabelTruth or
          its methodology,{" "}
          <strong>
            legal notices may be sent to the operator, its hosting provider and the app stores
            distributing it
          </strong>
          , and EcoTruth Group may pursue takedown, injunctive relief, damages and account of profits
          in any competent jurisdiction. EcoTruth Group reserves the right to act without prior
          warning where infringement is ongoing.
        </p>
      </Clause>

      <Clause heading="4. Permitted use">
        <p>
          You may use your own scan results for personal, non-commercial purposes and may cite
          LabelTruth in commentary, journalism or research with clear attribution to EcoTruth Group.
          Commercial or bulk use requires a paid API Program subscription and the licence granted
          within it.
        </p>
      </Clause>

      <Clause heading="5. Third-party rights">
        <p>
          Brand names, packaging and marks of audited products belong to their respective owners and
          are shown for identification and commentary. If you own a mark and believe our use exceeds
          that purpose, write to ip@ecotruthgroup.example.
        </p>
      </Clause>

      <Clause heading="6. Reporting infringement">
        <p>
          To report copying of LabelTruth, or to request a licence, contact
          ip@ecotruthgroup.example with the URLs, screenshots and a description of the overlap.
        </p>
      </Clause>
    </LegalPage>
  );
}
