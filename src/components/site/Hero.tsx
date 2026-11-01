import { motion, useReducedMotion } from "motion/react";

import heroBedroom from "@/assets/hero-bedroom.jpg";
import community1 from "@/assets/community-1.jpg";
import community2 from "@/assets/community-2.jpg";
import community3 from "@/assets/community-3.jpg";
import { COHORT } from "@/lib/cohort";
import { ReserveButton } from "./ReserveButton";

const avatars = [community1, community2, community3];

export function Hero() {
  const reduced = useReducedMotion();

  return (
    <section className="relative isolate overflow-hidden bg-night text-night-foreground">
      {/* Full-bleed hero photo — right-weighted on desktop, full-width on mobile. */}
      <motion.div
        initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 1.04 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
        className="pointer-events-none absolute inset-y-0 right-0 -z-0 w-full md:w-[72%] lg:w-[68%]"
        aria-hidden
      >
        <img
          src={heroBedroom}
          alt=""
          width={2000}
          height={2500}
          fetchPriority="high"
          decoding="async"
          className="absolute inset-0 size-full object-cover object-center"
        />
        {/* MOBILE: heavier full scrim so overlaid text stays legible */}
        <div className="absolute inset-0 bg-night/55 md:hidden" />
        {/* DESKTOP: fade left so photo blends under the text column */}
        <div className="absolute inset-y-0 left-0 hidden w-1/2 bg-gradient-to-r from-night via-night/80 to-transparent md:block" />
        {/* Right edge fade on wide screens */}
        <div className="absolute inset-y-0 right-0 hidden w-24 bg-gradient-to-l from-night/40 to-transparent md:block" />
        {/* Top melts into nav */}
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-night to-transparent" />
        {/* Bottom melts into next section */}
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-night via-night/85 to-transparent" />
      </motion.div>

      {/* Content column — left-weighted, sits over the photo */}
      <div className="relative z-10 mx-auto grid min-h-[88vh] max-w-[1360px] grid-cols-1 gap-10 px-5 pt-32 pb-20 md:min-h-[92vh] md:grid-cols-12 md:gap-12 md:px-10 md:pt-40 md:pb-28">
        <div className="flex flex-col justify-center md:col-span-7 lg:col-span-6">
          <motion.p
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="eyebrow text-gold-dark"
          >
            The 21-Day Sleep Reset
          </motion.p>

          <motion.h1
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="editorial-xl mt-6 max-w-xl text-night-foreground"
          >
            <span className="block">Reclaim the hours</span>
            <em className="block italic font-normal text-gold-dark">
              before midnight.
            </em>
          </motion.h1>

          <motion.p
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="mt-7 max-w-md font-sans text-base leading-relaxed text-night-foreground/90 sm:text-[1.0625rem]"
          >
            A 21-night cohort reset for people who think for a living.
            Quieter evenings. Clearer mornings. Guided, together — never alone.
          </motion.p>

          <motion.div
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="mt-9 flex flex-col gap-4 sm:flex-row sm:items-center"
          >
            <ReserveButton variant="pill-on-dark" />
            <span className="font-sans text-sm text-night-foreground/75">
              Full refund if 21 nights change nothing.
            </span>
          </motion.div>

          <motion.div
            initial={reduced ? { opacity: 0 } : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.1, delay: 0.6 }}
            className="mt-10 flex items-center gap-4"
          >
            <div className="flex -space-x-2.5">
              {avatars.map((src, i) => (
                <span
                  key={i}
                  className="relative inline-block size-9 overflow-hidden rounded-full ring-2 ring-night"
                >
                  <img
                    src={src}
                    alt=""
                    aria-hidden
                    width={72}
                    height={72}
                    loading="eager"
                    className="size-full object-cover"
                  />
                </span>
              ))}
            </div>
            <p className="font-sans text-sm leading-snug text-night-foreground/80">
              <span className="text-night-foreground">150+ professionals</span>{" "}
              have reset their sleep with us
            </p>
          </motion.div>

          <motion.div
            initial={reduced ? { opacity: 0 } : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.1, delay: 0.8 }}
            className="mt-12 flex flex-wrap items-center gap-x-6 gap-y-1.5 border-t border-night-foreground/15 pt-6 font-sans text-sm text-night-foreground/80"
          >
            <span>
              <span className="text-night-foreground/60">Next cohort </span>
              <span className="text-night-foreground">{COHORT.startsOn}</span>
            </span>
            <span aria-hidden className="hidden size-1 rounded-full bg-night-foreground/40 sm:block" />
            <span>
              <span className="text-night-foreground/60">Place </span>
              <span className="text-night-foreground">{COHORT.price}, once</span>
            </span>
            <span aria-hidden className="hidden size-1 rounded-full bg-night-foreground/40 sm:block" />
            <span>
              <span className="text-night-foreground/60">Capacity </span>
              <span className="text-night-foreground">100 members</span>
            </span>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
