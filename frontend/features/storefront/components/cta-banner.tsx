import Link from "next/link";

export function CtaBanner() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-4 lg:px-6">
      <div className="relative overflow-hidden rounded-3xl bg-neutral-950 text-white">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://picsum.photos/seed/cta-security-camera/1400/600?grayscale"
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.35)_0%,rgba(0,0,0,0.9)_75%)]" />

        <div className="relative z-10 mx-auto flex max-w-2xl flex-col items-center px-6 py-16 text-center sm:py-20">
          <h2 className="text-2xl leading-tight font-bold tracking-tight uppercase sm:text-4xl">
            La sécurité intelligente,
            <br />
            à portée de main
          </h2>
          <p className="mt-5 max-w-md text-sm text-white/75">
            Découvrez toutes nos marques et collections de caméras, alarmes et
            systèmes connectés pour protéger ce qui compte le plus.
          </p>
          <Link
            href="/about"
            className="mt-8 inline-flex items-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-neutral-950 transition-transform hover:scale-105"
          >
            En savoir plus
          </Link>
        </div>
      </div>
    </section>
  );
}
