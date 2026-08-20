/**
 * Assembled copy. JSON under content/copy/ is the source for Phase F.
 * Do not add strings here that are not in those files.
 */
import about from "@/content/copy/about.json";
import contact from "@/content/copy/contact.json";
import people from "@/content/copy/people.json";
import proofPoints from "@/content/copy/proof-points.json";
import propertyManagement from "@/content/copy/property-management.json";
import rfp from "@/content/copy/rfp.json";
import services from "@/content/copy/services.json";
import testimonials from "@/content/copy/testimonials.json";

export { about, contact, people, proofPoints, propertyManagement, rfp, services, testimonials };

export const aboutMission = about.mission;
export const aboutStory = about.story;
export const servicesIntro = services.intro;

const millworkPoint = proofPoints.items.find((i) => i.id === "millwork");
if (!millworkPoint) throw new Error("proof-points.json: missing millwork");
export const millworkLead = millworkPoint.text;

export function publishedTestimonials() {
  return testimonials.items.filter((t) => t.published);
}

export function personBySlug(slug: string) {
  return people.people.find((p) => p.slug === slug);
}
