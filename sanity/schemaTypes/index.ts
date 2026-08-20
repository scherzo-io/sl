import { blockContent } from "./blockContent";
import { navigation } from "./navigation";
import { page } from "./page";
import { partner } from "./partner";
import { person } from "./person";
import { project } from "./project";
import { projectCategory } from "./projectCategory";
import { redirect } from "./redirect";
import { seo } from "./seo";
import { service } from "./service";
import { siteSettings } from "./siteSettings";
import { testimonial } from "./testimonial";
import { video } from "./video";

export const schemaTypes = [
  project,
  projectCategory,
  page,
  service,
  person,
  testimonial,
  partner,
  video,
  siteSettings,
  navigation,
  redirect,
  seo,
  blockContent,
];
