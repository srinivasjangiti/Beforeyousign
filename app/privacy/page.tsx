import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Privacy Policy for BeforeYouSign. Learn how your data is collected, used, and protected.",
};

const EFFECTIVE_DATE = "July 5, 2026";
const CREATOR = "Srinivas Jangiti";
const CONTACT_EMAIL = "srinivasajan.work@gmail.com";

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-stone-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
        {/* Header */}
        <div className="mb-10 border-b border-stone-200 pb-8">
          <span className="text-xs font-mono uppercase tracking-widest text-stone-400">
            Legal
          </span>
          <h1 className="mt-2 text-3xl sm:text-4xl font-bold text-stone-900 leading-tight">
            Privacy Policy
          </h1>
          <p className="mt-3 text-sm text-stone-500">
            Effective Date: {EFFECTIVE_DATE}
          </p>
        </div>

        <div className="prose prose-stone max-w-none space-y-8 text-stone-700 text-[15px] leading-7">

          <section>
            <p>
              This Privacy Policy describes how BeforeYouSign (the
              &quot;Platform&quot;), operated by {CREATOR} (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;), collects,
              uses, stores, and protects information when you use the Platform.
              By using the Platform, you consent to the practices described herein.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-stone-900 mb-3">1. Information We Collect</h2>
            <p>We may collect the following categories of information:</p>
            <ul className="list-disc pl-5 mt-3 space-y-2">
              <li><strong>Account Information:</strong> Name, email address, and authentication credentials provided during registration via third-party authentication providers (e.g., Clerk).</li>
              <li><strong>Uploaded Documents:</strong> Contract text or files you voluntarily submit for analysis. These are processed solely to generate your requested output and are not sold or disclosed to third parties.</li>
              <li><strong>Usage Data:</strong> Log data, IP addresses, browser type, pages visited, and interaction timestamps, collected automatically for operational and security purposes.</li>
              <li><strong>Communications:</strong> Any information you provide when contacting us.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-stone-900 mb-3">2. How We Use Your Information</h2>
            <ul className="list-disc pl-5 mt-3 space-y-2">
              <li>To provide, operate, and improve the Platform&apos;s features and functionality.</li>
              <li>To process your uploaded documents and return AI-generated analysis.</li>
              <li>To maintain the security and integrity of the Platform.</li>
              <li>To comply with legal obligations.</li>
            </ul>
            <p className="mt-4">
              We do <strong>not</strong> sell, rent, trade, or otherwise monetise your personal
              data or uploaded documents to any third party.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-stone-900 mb-3">3. Data Retention</h2>
            <p>
              Uploaded documents are processed transiently and are not
              persistently stored beyond the duration necessary to generate
              your analysis, unless explicitly saved by you within the Platform.
              Account information is retained until you request deletion.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-stone-900 mb-3">4. Third-Party Services</h2>
            <p>
              The Platform may use third-party services including but not
              limited to authentication providers, cloud infrastructure, and AI
              model APIs. These third parties operate under their own privacy
              policies. {CREATOR} is not responsible for the privacy practices
              of third-party services.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-stone-900 mb-3">5. Security</h2>
            <p>
              We implement commercially reasonable technical and organisational
              measures to protect your information. However, no method of
              transmission or storage is 100% secure, and {CREATOR} cannot
              guarantee absolute security. You assume the risk inherent in
              transmitting information over the internet.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-stone-900 mb-3">6. Your Rights</h2>
            <p>
              Depending on your jurisdiction, you may have rights to access,
              correct, or delete your personal data. To exercise any such
              right, contact us at{" "}
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="text-stone-900 underline"
              >
                {CONTACT_EMAIL}
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-stone-900 mb-3">7. Limitation of Liability</h2>
            <p>
              To the fullest extent permitted by applicable law, {CREATOR}
              shall not be liable for any damages arising from any breach of
              data security, unauthorised access, or any incident involving
              your personal data, including but not limited to indirect,
              incidental, special, consequential, or punitive damages.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-stone-900 mb-3">8. Changes to This Policy</h2>
            <p>
              We reserve the right to update this Privacy Policy at any time.
              Continued use of the Platform after changes constitutes your
              acceptance of the updated policy.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-stone-900 mb-3">9. Contact</h2>
            <p>
              For any privacy-related queries, contact:{" "}
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="text-stone-900 underline"
              >
                {CONTACT_EMAIL}
              </a>
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
