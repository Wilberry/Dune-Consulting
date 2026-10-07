export type FAQItem = {
  id?: string;
  question: string;
  answer: string;
  sortOrder?: number;
  isActive?: boolean;
};

export const faqDefaultItems: FAQItem[] = [
  {
    question: "What does Dune Consulting do?",
    answer:
      "Dune Consulting is a Health, Safety, Environment, Quality, and Risk Management consultancy. We help organisations create safer workplaces through professional training, event safety management, HSE personnel outsourcing, compliance support, and strategic safety consulting.",
  },
  {
    question: "Which industries do you serve?",
    answer:
      "We work with organisations across multiple sectors, including construction, oil and gas, manufacturing, education, healthcare, hospitality, logistics, government agencies, and event management.",
  },
  {
    question: "What HSE training programmes do you offer?",
    answer:
      "We provide industry-relevant HSE training programmes ranging from introductory safety awareness to advanced professional development. Training may be delivered on-site, online, or at a designated training location, depending on the client’s needs.",
  },
  {
    question: "What is the HSE Mentorship Programme?",
    answer:
      "The HSE Mentorship Programme supports aspiring and early-career safety professionals through practical guidance, career coaching, industry insights, and real-world knowledge from experienced HSE professionals.",
  },
  {
    question: "Do you provide HSE personnel for companies?",
    answer:
      "Yes. We recruit, train, and deploy qualified HSE professionals for short-term, long-term, and project-based assignments, helping organisations access competent safety personnel when needed.",
  },
  {
    question: "What is Event Safety Management?",
    answer:
      "Event Safety Management involves planning and coordinating the safety requirements of an event. This includes risk assessment, crowd safety, emergency planning, incident prevention, and compliance with relevant safety standards.",
  },
  {
    question: "Can you customise training for our organisation?",
    answer:
      "Yes. We develop customised training programmes based on an organisation’s operations, workforce, industry risks, regulatory requirements, and learning objectives.",
  },
  {
    question: "Do you support regulatory compliance?",
    answer:
      "Yes. We help organisations understand applicable HSE requirements, conduct risk assessments, improve workplace safety systems, and implement practical measures that support compliance and operational excellence.",
  },
  {
    question: "How can I register for a training programme?",
    answer:
      "You can register through the website contact form, phone, email, or the company’s official social media channels. The Dune Consulting team will guide you through the available programmes and registration process.",
  },
  {
    question: "Why should I choose Dune Consulting?",
    answer:
      "Dune Consulting combines technical expertise, practical industry experience, and a strong commitment to safety excellence. Our solutions are designed to reduce risk, strengthen compliance, improve workforce competence, and support sustainable organisational performance.",
  },
];

export function normalizeFaqItems(
  items: Array<Partial<FAQItem> | null | undefined>,
): FAQItem[] {
  return items
    .map((item) => {
      const question = String(item?.question ?? "").trim();
      const answer = String(item?.answer ?? "").trim();
      return { question, answer };
    })
    .filter((item) => item.question.length > 0 && item.answer.length > 0)
    .map((item) => ({
      ...item,
      question: item.question.replace(/\s+/g, " "),
      answer: item.answer.replace(/\s+/g, " "),
    }));
}

export async function getFaqItems(): Promise<FAQItem[]> {
  try {
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("faq_items")
      .select("id, question, answer, sort_order, is_active")
      .eq("is_active", true)
      .order("sort_order", { ascending: true, nullsFirst: false })
      .order("created_at", { ascending: true });

    if (error) throw error;

    const normalized = normalizeFaqItems(
      (data ?? []).map((item) => ({
        id: item.id,
        question: item.question,
        answer: item.answer,
        sortOrder: item.sort_order,
        isActive: item.is_active,
      })),
    );

    return normalized.length > 0 ? normalized : faqDefaultItems;
  } catch (error) {
    console.warn(
      "Unable to load FAQ items from Supabase. Falling back to the default seed.",
      error,
    );
    return faqDefaultItems;
  }
}

export async function getAdminFaqItems(): Promise<FAQItem[]> {
  try {
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("faq_items")
      .select("id, question, answer, sort_order, is_active")
      .order("sort_order", { ascending: true, nullsFirst: false })
      .order("created_at", { ascending: true });

    if (error) throw error;

    return normalizeFaqItems(
      (data ?? []).map((item) => ({
        id: item.id,
        question: item.question,
        answer: item.answer,
        sortOrder: item.sort_order,
        isActive: item.is_active,
      })),
    );
  } catch (error) {
    console.warn(
      "Unable to load admin FAQ items from Supabase. Falling back to the default seed.",
      error,
    );
    return faqDefaultItems;
  }
}
