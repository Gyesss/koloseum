import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShieldHalved } from "@fortawesome/free-solid-svg-icons";

export default function Privacy() {
  const content = {
    title: "Privacy Policy",
    subtitle:
      "How Koloseum collects, uses, and protects your personal information.",
    updatedAt: "2026-05-28",
    icon: faShieldHalved,
    sections: [
      {
        title: "Information We Collect",
        body: "We collect essential account data such as username, email address, profile details, and usage activity necessary to operate the platform.",
      },
      {
        title: "How We Use Data",
        body: "Your information is used to provide, maintain, and improve the Koloseum experience, including personalization and security enforcement.",
      },
      {
        title: "Data Sharing",
        body: "We do not sell your personal data. Information may be shared only when required by law or to protect platform integrity.",
      },
      {
        title: "Data Security",
        body: "We implement reasonable technical and organizational measures to protect user data from unauthorized access or misuse.",
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
