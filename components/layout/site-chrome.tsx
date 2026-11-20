import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { getCompanyContactDetails } from "@/lib/company-contact";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { SiteChromeContent } from "./site-chrome-content";

export async function SiteChrome({ children }: { children: React.ReactNode }) {
  const contactDetails = await getCompanyContactDetails();

  return (
    <SiteChromeContent
      header={<Header />}
      footer={<Footer contactDetails={contactDetails} />}
      whatsapp={<WhatsAppButton phone={contactDetails.telephone} />}
    >
      {children}
    </SiteChromeContent>
  );
}
