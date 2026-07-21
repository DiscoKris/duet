import { notFound, redirect } from "next/navigation";
import { PresentationSlides } from "@/components/duet/PresentationSlides";
import { findRouteBySlug, presentationRoutes } from "@/data/presentationRoutes";

export function generateStaticParams() {
  return presentationRoutes
    .filter((route) => route.slug !== "home")
    .map((route) => ({ slug: route.slug }));
}

export default async function PresentationRoutePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  if (slug === "phase-one-result") {
    redirect("/phase-two");
  }

  if (slug === "final-four") {
    redirect("/the-final");
  }

  if (slug === "finale") {
    redirect("/thank-you");
  }

  const route = findRouteBySlug(slug);

  if (!route || route.slug === "home") {
    notFound();
  }

  return <PresentationSlides slug={route.slug} />;
}
