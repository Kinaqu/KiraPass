import { ButtonLink } from "@/components/ButtonLink";
import { SiteShell } from "@/components/SiteShell";

export default function NotFound() {
  return (
    <SiteShell>
      <section className="mx-auto max-w-3xl px-5 py-20 text-center sm:px-8">
        <h1 className="text-5xl font-black">Not found</h1>
        <p className="mt-4 text-white/65">The requested KiraPass page or ticket does not exist.</p>
        <ButtonLink href="/events/frontier-night" className="mt-8">
          Back to demo event
        </ButtonLink>
      </section>
    </SiteShell>
  );
}
