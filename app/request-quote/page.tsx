import { permanentRedirect } from "next/navigation";

/** Preserve bookmarks and old campaign links; keep /contact canonical. */
export default function RequestQuoteRedirect() {
  permanentRedirect("/contact?type=quote");
}
