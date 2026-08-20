import navigation from "@/content/copy/navigation.json";

export type NavChild = {
  label: string;
  href: string;
};

export type NavItem = {
  label: string;
  href: string;
  children?: readonly NavChild[];
};

export const nav: readonly NavItem[] = navigation.items;
