import { permanentRedirect } from "next/navigation";

export default function RequestQuoteRedirect() {
  permanentRedirect("/contact?type=quote");
}
