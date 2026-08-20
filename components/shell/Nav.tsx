"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { nav, type NavItem } from "@/lib/nav";

function pathOf(href: string) {
  return href.split("#")[0] ?? href;
}

function isActive(pathname: string, href: string) {
  const path = pathOf(href);
  if (path === "/") return pathname === "/";
  return pathname === path || pathname.startsWith(`${path}/`);
}

function Item({
  item,
  onNavigate,
}: {
  item: NavItem;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const active = isActive(pathname, item.href);
  const childActive = item.children?.some((c) => isActive(pathname, c.href)) ?? false;
  const [open, setOpen] = useState(childActive);

  if (!item.children?.length) {
    return (
      <li>
        <Link
          href={item.href}
          onClick={onNavigate}
          className={`flex min-h-nav items-center justify-center px-3 text-center font-display text-md font-light ${
            active ? "text-red-on-dark" : "text-paper hover:text-red-on-dark"
          }`}
        >
          {item.label}
        </Link>
      </li>
    );
  }

  return (
    <li>
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className={`flex min-h-nav w-full items-center justify-center px-3 text-center font-display text-md font-light ${
          active || childActive ? "text-red-on-dark" : "text-paper hover:text-red-on-dark"
        }`}
      >
        {item.label}
      </button>
      {open ? (
        <ul>
          {item.children.map((child) => (
            <li key={child.href}>
              <Link
                href={child.href}
                onClick={onNavigate}
                className={`flex min-h-10 items-center justify-center px-4 text-center font-display text-sm font-light ${
                  isActive(pathname, child.href)
                    ? "text-red-on-dark"
                    : "text-paper hover:text-red-on-dark"
                }`}
              >
                {child.label}
              </Link>
            </li>
          ))}
        </ul>
      ) : null}
    </li>
  );
}

export function Nav({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <ul className="flex w-full flex-col">
      {nav.map((item) => (
        <Item key={item.href} item={item} onNavigate={onNavigate} />
      ))}
    </ul>
  );
}
