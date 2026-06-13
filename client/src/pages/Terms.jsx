import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faScaleBalanced } from "@fortawesome/free-solid-svg-icons";

export default function Terms() {
  const content = {
    title: "Terms of Service",
    subtitle:
      "Rules, obligations, and conditions governing the use of the Koloseum platform.",
    updatedAt: "2026-05-28",
    icon: faScaleBalanced,
    sections: [
      {
        title: "Acceptance of Terms",
        body: "By accessing or using Koloseum, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree, you may not use the platform.",
      },
      {
        title: "User Responsibilities",
        body: "You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.",
      },
      {
        title: "Platform Content",
        body: "All content posted on Koloseum remains the responsibility of the user who created it. However, by posting content, you grant Koloseum a limited license to display and distribute it within the platform.",
      },
      {
        title: "Account Assistance",
        body: "If you suspect that your account has been compromised or encounter any account-related issues that cannot be resolved through the app's built-in features, please contact the administrator at +62 823-3ad2-4dah26 for further assistance.",
      },
      {
        title: "Termination",
        body: "We reserve the right to suspend or terminate access to the platform if any violation of these terms is detected.",
      },
    ],
  };

  return (
    <div className="bg-background flex min-h-dvh items-center justify-center px-6 py-12">
      <div className="bg-surface border-border rounded-card w-full max-w-3xl overflow-hidden border shadow-sm">
        {/* Top Accent */}
        <div className="from-border via-brand to-accent h-2 w-full bg-linear-to-r" />

        <div className="px-8 py-10">
          {/* Header */}
          <div className="flex items-start gap-4">
            <div className="bg-surface border-border rounded-card flex h-12 w-12 items-center justify-center border">
              <FontAwesomeIcon icon={content.icon} className="text-brand" />
            </div>

            <div>
              <h1 className="font-heading text-text text-3xl font-semibold">
                {content.title}
              </h1>
              <p className="text-text-soft mt-1 text-sm">{content.subtitle}</p>
            </div>
          </div>

          {/* Divider */}
          <div className="my-8 flex items-center gap-3">
            <div className="bg-border h-px flex-1" />
            <div className="bg-accent h-2 w-2 rounded-full" />
            <div className="bg-border h-px flex-1" />
          </div>

          {/* Sections */}
          <div className="space-y-6">
            {content.sections.map((section) => (
              <div
                key={section.title}
                className="border-border border-b pb-5 last:border-none"
              >
                <h2 className="font-body text-text mb-2 text-base font-semibold">
                  {section.title}
                </h2>
                <p className="text-text-soft font-body text-sm leading-6">
                  {section.body}
                </p>
              </div>
            ))}
          </div>

          {/* Footer meta */}
          <div className="mt-8 text-right">
            <p className="text-text-soft text-xs">
              Last updated: {content.updatedAt}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
