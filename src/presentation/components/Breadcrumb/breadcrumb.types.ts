import type { urlRouters } from "@/presentation/router/router.definitions";

export type CrumbKey = keyof typeof urlRouters;
export interface BreadcrumbProps {
  crumbs?: CrumbKey[];
}
