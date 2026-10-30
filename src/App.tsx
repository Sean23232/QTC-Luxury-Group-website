import { useEffect, useRef, useState, type FormEvent } from "react";

/* ---------- Small inline icon components (subtle line icons) ---------- */
const Icon = ({ path, className = "w-5 h-5" }: { path: string; className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.25"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    {path.split("|").map((d, i) => (
      <path key={i} d={d} />
    ))}
  </svg>
);

const icons = {
  car: "M5 17h14M5 17a2 2 0 0 1-2-2V11l2-5h14l2 5v4a2 2 0 0 1-2 2|M7 17v2|M17 17v2|M5 11h14",
  concierge:
    "M12 2l2 4 4 .6-3 3 .7 4.4L12 12l-3.7 2 .7-4.4-3-3 4-.6z|M4 20h16",
  event:
    "M12 2v4|M12 18v4|M4.93 4.93l2.83 2.83|M16.24 16.24l2.83 2.83|M2 12h4|M18 12h4|M4.93 19.07l2.83-2.83|M16.24 7.76l2.83-2.83",
  shield: "M12 2l8 3v7c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V5l8-3z|M9 12l2 2 4-4",
  clock: "M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z|M12 6v6l4 2",
  sparkle: "M12 2v6|M12 16v6|M2 12h6|M16 12h6|M5 5l3 3|M16 16l3 3|M5 19l3-3|M16 8l3-3",
  mapPin: "M12 22s-8-7-8-13a8 8 0 0 1 16 0c0 6-8 13-8 13z|M12 11a2 2 0 1 0 0-4 2 2 0 0 0 0 4z",
  phone: "M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.8.6 2.6a2 2 0 0 1-.4 2.1L8 9.7a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.5c.8.3 1.7.5 2.6.6A2 2 0 0 1 22 16.9z",
  mail: "M4 4h16c1 0 2 1 2 2v12c0 1-1 2-2 2H4c-1 0-2-1-2-2V6c0-1 1-2 2-2z|M22 6l-10 7L2 6",
  check: "M20 6L9 17l-5-5",
  arrow: "M5 12h14|M13 5l7 7-7 7",
  users: "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2|M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z|M23 21v-2a4 4 0 0 0-3-3.9|M16 3.1a4 4 0 0 1 0 7.8",
  calendar: "M3 7h18v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z|M3 7V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v2|M8 3v4|M16 3v4",
  user: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2|M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z",
  location: "M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z|M12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6z",
  chevronDown: "M6 9l6 6 6-6",
  menu: "M3 6h18|M3 12h18|M3 18h18",
  close: "M18 6L6 18|M6 6l12 12",
  star: "M12 2l3 7h7l-5.5 4.5L18 21l-6-4-6 4 1.5-7.5L2 9h7z",
  plane: "M17.8 19.2L16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z",
};

/* ---------- Fade-in wrapper using IntersectionObserver ---------- */
function FadeIn({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setTimeout(() => el.classList.add("visible"), delay);
            obs.unobserve(el);
          }
        });
      },
      { threshold: 0.12 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [delay]);
  return (
    <div ref={ref} className={`fade-in ${className}`}>
      {children}
    </div>
  );
}

/* ---------- Section header ---------- */
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 justify-center md:justify-start">
      <span className="h-px w-10 bg-champagne/50" />
      <span className="text-[0.7rem] tracking-[0.3em] uppercase text-champagne font-medium">
        {children}
      </span>
    </div>
  );
}

/* ---------- Navigation ---------- */
function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { href: "#services", label: "Services" },
    { href: "#fleet", label: "Fleet" },
    { href: "#concierge", label: "Concierge" },
    { href: "#lifestyle", label: "Lifestyle" },
    { href: "#about", label: "About" },
    { href: "#contact", label: "Contact" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-charcoal/85 backdrop-blur-xl border-b border-white/5 py-3"
          : "bg-transparent py-6"
      }`}
    >
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 flex items-center justify-between">
        {/* Logo */}
        <a href="#top" className="flex items-center gap-3 group">
          <div className="flex items-center justify-center w-10 h-10 border border-champagne/40 rounded-sm">
            <span className="font-serif text-champagne text-lg font-semibold tracking-wider">Q</span>
          </div>
          <div className="flex flex-col leading-none">
            <span className="font-serif text-[1.05rem] text-ivory tracking-wide">
              QTC Luxury Group
            </span>
            <span className="text-[0.6rem] tracking-[0.25em] uppercase text-ivory-muted mt-1 hidden sm:block">
              South Florida
            </span>
          </div>
        </a>

        {/* Desktop links */}
        <nav className="hidden lg:flex items-center gap-10">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="nav-link text-[0.8rem] tracking-wider uppercase text-ivory-dim font-medium"
            >
              {l.label}
            </a>
          ))}
        </nav>

        {/* CTA */}
        <div className="flex items-center gap-3">
          <a
            href="#book"
            className="hidden md:inline-flex btn-primary items-center px-6 py-3 rounded-sm text-[0.75rem] tracking-[0.2em] uppercase font-semibold"
          >
            <span>Book a Ride</span>
          </a>
          <button
            className="lg:hidden text-ivory p-2"
            onClick={() => setOpen(!open)}
            aria-label="Menu"
          >
            <Icon path={open ? icons.close : icons.menu} className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-charcoal/98 backdrop-blur-xl border-b border-white/5 px-6 py-8">
          <nav className="flex flex-col gap-5">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="text-sm tracking-widest uppercase text-ivory-dim hover:text-champagne transition"
              >
                {l.label}
              </a>
            ))}
            <a
              href="#book"
              onClick={() => setOpen(false)}
              className="btn-primary mt-4 inline-flex items-center justify-center px-6 py-3 rounded-sm text-[0.75rem] tracking-[0.2em] uppercase font-semibold"
            >
              <span>Book a Ride</span>
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}

/* ---------- Hero ---------- */
function Hero() {
  return (
    <section id="top" className="relative min-h-screen flex items-center grain overflow-hidden">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url(/images/hero-luxury.jpg)" }}
      />
      <div className="absolute inset-0 hero-overlay" />

      <div className="relative z-10 w-full max-w-[1400px] mx-auto px-6 md:px-10 pt-32 pb-20">
        <div className="max-w-3xl">
          <div className="hero-fade-1">
            <SectionLabel>QTC Luxury Group</SectionLabel>
          </div>

          <h1 className="hero-fade-2 mt-8 font-serif text-[clamp(2.5rem,6.5vw,5.25rem)] leading-[1.05] font-medium text-ivory tracking-tight">
            Exceptional Journeys.
            <br />
            <span className="italic font-normal text-champagne">Effortless</span> Living.
          </h1>

          <p className="hero-fade-3 mt-8 text-ivory-dim text-lg md:text-xl leading-relaxed max-w-2xl font-light">
            Luxury transportation, private concierge, and lifestyle management across
            Miami-Dade to Palm Beach County.
          </p>

          <div className="hero-fade-4 mt-10 flex flex-col sm:flex-row gap-4">
            <a
              href="#book"
              className="btn-primary inline-flex items-center justify-center gap-2 px-8 py-4 rounded-sm text-[0.75rem] tracking-[0.2em] uppercase font-semibold"
            >
              <span>Book Your Ride</span>
              <Icon path={icons.arrow} className="w-4 h-4" />
            </a>
            <a
              href="#concierge"
              className="btn-outline inline-flex items-center justify-center gap-2 px-8 py-4 rounded-sm text-[0.75rem] tracking-[0.2em] uppercase font-semibold"
            >
              <span>Request Concierge</span>
            </a>
          </div>

          <div className="hero-fade-4 mt-12 flex items-center gap-4 text-ivory-muted text-[0.7rem] tracking-[0.3em] uppercase">
            <span>Discreet</span>
            <span className="w-1 h-1 rounded-full bg-champagne/60" />
            <span>Punctual</span>
            <span className="w-1 h-1 rounded-full bg-champagne/60" />
            <span>Personalized</span>
          </div>
        </div>
      </div>

      {/* Scroll hint */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10 opacity-60">
        <span className="text-[0.65rem] tracking-[0.3em] uppercase text-ivory-muted">Scroll</span>
        <span className="w-px h-10 bg-gradient-to-b from-champagne to-transparent animate-pulse" />
      </div>
    </section>
  );
}

/* ---------- Booking form (conversion core) ---------- */
function Booking() {
  const [form, setForm] = useState({
    pickup: "",
    dropoff: "",
    date: "",
    time: "",
    passengers: "1",
    vehicle: "Luxury Sedan",
    notes: "",
    name: "",
    email: "",
    phone: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 6000);
  };

  const vehicles = [
    "Luxury Sedan",
    "Premium SUV",
    "Executive Sprinter",
    "Stretch Limousine",
    "Ultra-Luxury (Rolls-Royce)",
  ];

  return (
    <section id="book" className="relative py-24 md:py-32 px-6 md:px-10">
      <div className="max-w-[1200px] mx-auto">
        <FadeIn>
          <div className="text-center max-w-2xl mx-auto mb-14">
            <SectionLabel>Instant Reservation</SectionLabel>
            <h2 className="mt-6 font-serif text-[clamp(2rem,4vw,3.5rem)] leading-tight text-ivory">
              Reserve your journey
            </h2>
            <p className="mt-5 text-ivory-dim leading-relaxed">
              Tell us the details and we'll confirm your bespoke arrangements within minutes.
              Available 24/7 across South Florida.
            </p>
          </div>
        </FadeIn>

        <FadeIn delay={100}>
          <div className="glass-strong rounded-sm p-6 md:p-12 shadow-2xl relative">
            {/* Subtle corner accents */}
            <span className="absolute top-0 left-0 w-8 h-px bg-champagne/60" />
            <span className="absolute top-0 left-0 w-px h-8 bg-champagne/60" />
            <span className="absolute bottom-0 right-0 w-8 h-px bg-champagne/60" />
            <span className="absolute bottom-0 right-0 w-px h-8 bg-champagne/60" />

            {submitted ? (
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full border border-champagne/40 mb-6">
                  <Icon path={icons.check} className="w-7 h-7 text-champagne" />
                </div>
                <h3 className="font-serif text-3xl text-ivory mb-3">Request received</h3>
                <p className="text-ivory-dim max-w-md mx-auto">
                  A member of our concierge team will contact you shortly to confirm your reservation.
                </p>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
                <div>
                  <label className="luxury-label">Pickup Location</label>
                  <div className="relative">
                    <Icon path={icons.location} className="w-4 h-4 text-champagne absolute left-4 top-1/2 -translate-y-1/2" />
                    <input
                      required
                      name="pickup"
                      value={form.pickup}
                      onChange={onChange}
                      placeholder="Miami International Airport"
                      className="luxury-input w-full pl-11 pr-4 py-3.5 rounded-sm text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="luxury-label">Drop-off Location</label>
                  <div className="relative">
                    <Icon path={icons.location} className="w-4 h-4 text-champagne absolute left-4 top-1/2 -translate-y-1/2" />
                    <input
                      required
                      name="dropoff"
                      value={form.dropoff}
                      onChange={onChange}
                      placeholder="The Breakers, Palm Beach"
                      className="luxury-input w-full pl-11 pr-4 py-3.5 rounded-sm text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="luxury-label">Date</label>
                  <div className="relative">
                    <Icon path={icons.calendar} className="w-4 h-4 text-champagne absolute left-4 top-1/2 -translate-y-1/2" />
                    <input
                      required
                      type="date"
                      name="date"
                      value={form.date}
                      onChange={onChange}
                      className="luxury-input w-full pl-11 pr-4 py-3.5 rounded-sm text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="luxury-label">Time</label>
                  <div className="relative">
                    <Icon path={icons.clock} className="w-4 h-4 text-champagne absolute left-4 top-1/2 -translate-y-1/2" />
                    <input
                      required
                      type="time"
                      name="time"
                      value={form.time}
                      onChange={onChange}
                      className="luxury-input w-full pl-11 pr-4 py-3.5 rounded-sm text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="luxury-label">Passengers</label>
                  <div className="relative">
                    <Icon path={icons.users} className="w-4 h-4 text-champagne absolute left-4 top-1/2 -translate-y-1/2" />
                    <select
                      name="passengers"
                      value={form.passengers}
                      onChange={onChange}
                      className="luxury-input w-full pl-11 pr-4 py-3.5 rounded-sm text-sm appearance-none cursor-pointer"
                    >
                      {["1", "2", "3", "4", "5", "6", "7+"].map((n) => (
                        <option key={n} value={n} className="bg-charcoal">
                          {n} {n === "1" ? "Passenger" : "Passengers"}
                        </option>
                      ))}
                    </select>
                    <Icon path={icons.chevronDown} className="w-4 h-4 text-ivory-muted absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="luxury-label">Vehicle Preference</label>
                  <div className="relative">
                    <Icon path={icons.car} className="w-4 h-4 text-champagne absolute left-4 top-1/2 -translate-y-1/2" />
                    <select
                      name="vehicle"
                      value={form.vehicle}
                      onChange={onChange}
                      className="luxury-input w-full pl-11 pr-4 py-3.5 rounded-sm text-sm appearance-none cursor-pointer"
                    >
                      {vehicles.map((v) => (
                        <option key={v} value={v} className="bg-charcoal">
                          {v}
                        </option>
                      ))}
                    </select>
                    <Icon path={icons.chevronDown} className="w-4 h-4 text-ivory-muted absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                <div className="md:col-span-2 lg:col-span-3">
                  <label className="luxury-label">Special Requests</label>
                  <textarea
                    name="notes"
                    value={form.notes}
                    onChange={onChange}
                    rows={3}
                    placeholder="Champagne on arrival, child seats, preferred temperature, airport meet & greet…"
                    className="luxury-input w-full px-4 py-3.5 rounded-sm text-sm resize-none"
                  />
                </div>

                <div className="md:col-span-2 lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6 mt-2 pt-6 border-t border-white/5">
                  <div>
                    <label className="luxury-label">Full Name</label>
                    <div className="relative">
                      <Icon path={icons.user} className="w-4 h-4 text-champagne absolute left-4 top-1/2 -translate-y-1/2" />
                      <input
                        required
                        name="name"
                        value={form.name}
                        onChange={onChange}
                        placeholder="Your name"
                        className="luxury-input w-full pl-11 pr-4 py-3.5 rounded-sm text-sm"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="luxury-label">Email</label>
                    <div className="relative">
                      <Icon path={icons.mail} className="w-4 h-4 text-champagne absolute left-4 top-1/2 -translate-y-1/2" />
                      <input
                        required
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={onChange}
                        placeholder="you@domain.com"
                        className="luxury-input w-full pl-11 pr-4 py-3.5 rounded-sm text-sm"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="luxury-label">Phone</label>
                    <div className="relative">
                      <Icon path={icons.phone} className="w-4 h-4 text-champagne absolute left-4 top-1/2 -translate-y-1/2" />
                      <input
                        required
                        type="tel"
                        name="phone"
                        value={form.phone}
                        onChange={onChange}
                        placeholder="(305) 555-0123"
                        className="luxury-input w-full pl-11 pr-4 py-3.5 rounded-sm text-sm"
                      />
                    </div>
                  </div>
                </div>

                <div className="md:col-span-2 lg:col-span-3 flex flex-col md:flex-row md:items-center md:justify-between gap-5 mt-4">
                  <p className="text-[0.7rem] tracking-wider text-ivory-muted leading-relaxed">
                    <span className="inline-flex items-center gap-2 text-champagne">
                      <Icon path={icons.clock} className="w-3.5 h-3.5" />
                      Available 24/7
                    </span>
                    <span className="mx-2">•</span>
                    Serving Miami-Dade to Palm Beach County
                  </p>
                  <button
                    type="submit"
                    className="btn-primary inline-flex items-center justify-center gap-2 px-10 py-4 rounded-sm text-[0.75rem] tracking-[0.2em] uppercase font-semibold whitespace-nowrap"
                  >
                    <span>Request Instant Quote</span>
                    <Icon path={icons.arrow} className="w-4 h-4" />
                  </button>
                </div>
              </form>
            )}
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

/* ---------- Services ---------- */
function Services() {
  const services = [
    {
      icon: icons.car,
      title: "Luxury Transportation",
      lede: "Chauffeured ground travel tailored to your schedule.",
      bullets: [
        "Airport transfers & private aviation coordination",
        "Hourly chauffeured service & city-to-city travel",
        "Special events, galas, weddings & red carpets",
      ],
      foot: "Professional chauffeurs · Real-time tracking · Absolute privacy",
    },
    {
      icon: icons.concierge,
      title: "Concierge Care",
      lede: "Your personal lifestyle assistant in South Florida.",
      bullets: [
        "VIP airport meet & greet, lounge access & fast-track",
        "Errands, personal shopping & medical appointments",
        "Restaurant reservations, venue access & personal errands",
      ],
      foot: "A dedicated point of contact · On-call, around the clock",
    },
    {
      icon: icons.event,
      title: "Lifestyle & Events",
      lede: "Seamless coordination of every occasion.",
      bullets: [
        "Private dinners, corporate functions & celebrations",
        "Full itineraries: yachts, villas, dining & entertainment",
        "Vendor curation, staffing & on-site management",
      ],
      foot: "Stress-free execution · White-glove attention to detail",
    },
  ];

  return (
    <section id="services" className="relative py-24 md:py-36 px-6 md:px-10 bg-charcoal-light">
      <div className="max-w-[1400px] mx-auto">
        <FadeIn>
          <div className="max-w-2xl mb-16">
            <SectionLabel>What We Offer</SectionLabel>
            <h2 className="mt-6 font-serif text-[clamp(2rem,4vw,3.75rem)] leading-[1.1] text-ivory">
              Three pillars of quiet, considered service.
            </h2>
            <p className="mt-6 text-ivory-dim text-lg leading-relaxed font-light">
              From a single airport transfer to a fully orchestrated South Florida experience —
              every detail is handled with discretion and care.
            </p>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {services.map((s, i) => (
            <FadeIn key={s.title} delay={i * 120}>
              <div className="card-lift glass h-full rounded-sm p-8 md:p-10 flex flex-col relative group">
                <div className="w-12 h-12 border border-champagne/40 rounded-sm flex items-center justify-center mb-8 group-hover:border-champagne transition-colors duration-500">
                  <Icon path={s.icon} className="w-5 h-5 text-champagne" />
                </div>
                <h3 className="font-serif text-2xl md:text-[1.75rem] text-ivory mb-3">
                  {s.title}
                </h3>
                <p className="text-ivory-dim leading-relaxed mb-6 font-light italic">
                  {s.lede}
                </p>
                <ul className="space-y-3 mb-8 flex-1">
                  {s.bullets.map((b) => (
                    <li key={b} className="flex items-start gap-3 text-ivory-dim text-sm leading-relaxed">
                      <span className="mt-2 w-1 h-1 rounded-full bg-champagne/70 shrink-0" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
                <div className="pt-6 border-t border-white/5">
                  <p className="text-[0.7rem] tracking-[0.2em] uppercase text-champagne/80">
                    {s.foot}
                  </p>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- Why QTC ---------- */
function Why() {
  const points = [
    { icon: icons.shield, title: "Discreet, professional chauffeurs", body: "Hand-selected, uniformed, and trained in the art of unobtrusive service." },
    { icon: icons.check, title: "Fully insured & background-checked", body: "Every team member is vetted to standards that exceed industry requirements." },
    { icon: icons.clock, title: "24/7 availability, 365 days", body: "Last-minute changes? Red-eye flights? We're ready when you are." },
    { icon: icons.sparkle, title: "Tailored to your lifestyle", body: "We learn your preferences so we can anticipate — not ask." },
    { icon: icons.mapPin, title: "Miami-Dade to Palm Beach", body: "Serving the full corridor including Boca, Fort Lauderdale, Coral Gables & beyond." },
    { icon: icons.star, title: "White-glove attention to detail", body: "From the temperature of the cabin to the route you prefer — nothing is overlooked." },
  ];

  return (
    <section id="about" className="relative py-24 md:py-36 px-6 md:px-10">
      <div className="max-w-[1400px] mx-auto">
        <FadeIn>
          <div className="max-w-2xl mb-16">
            <SectionLabel>The QTC Standard</SectionLabel>
            <h2 className="mt-6 font-serif text-[clamp(2rem,4vw,3.5rem)] leading-tight text-ivory">
              Understated excellence, delivered with precision.
            </h2>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-white/5 rounded-sm overflow-hidden border border-white/5">
          {points.map((p, i) => (
            <FadeIn key={p.title} delay={i * 80}>
              <div className="bg-charcoal p-8 md:p-10 h-full card-lift group">
                <div className="flex items-center gap-4 mb-5">
                  <div className="w-10 h-10 rounded-full border border-champagne/30 flex items-center justify-center group-hover:border-champagne/70 transition-colors">
                    <Icon path={p.icon} className="w-4 h-4 text-champagne" />
                  </div>
                  <h3 className="font-serif text-lg text-ivory leading-tight">{p.title}</h3>
                </div>
                <p className="text-ivory-dim text-sm leading-relaxed pl-14">{p.body}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- Fleet ---------- */
function Fleet() {
  const fleet = [
    {
      img: "/images/fleet-sedan.jpg",
      title: "Luxury Sedan",
      pax: "Up to 3 guests",
      desc: "Understated elegance for executive travel and airport transfers.",
    },
    {
      img: "/images/fleet-suv.jpg",
      title: "Premium SUV",
      pax: "Up to 6 guests",
      desc: "Commanding presence with generous space for families or groups.",
    },
    {
      img: "/images/fleet-sprinter.jpg",
      title: "Executive Sprinter",
      pax: "Up to 10 guests",
      desc: "Private-jet comfort on the road — ideal for groups and long stretches.",
    },
  ];

  return (
    <section id="fleet" className="relative py-24 md:py-36 px-6 md:px-10 bg-charcoal-light">
      <div className="max-w-[1400px] mx-auto">
        <FadeIn>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-16 gap-6">
            <div className="max-w-2xl">
              <SectionLabel>The Fleet</SectionLabel>
              <h2 className="mt-6 font-serif text-[clamp(2rem,4vw,3.5rem)] leading-tight text-ivory">
                Travel the way you prefer.
              </h2>
            </div>
            <p className="text-ivory-dim font-light italic text-lg max-w-md leading-relaxed">
              Refined, private, and on your schedule — each vehicle is maintained to uncompromising standards.
            </p>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {fleet.map((f, i) => (
            <FadeIn key={f.title} delay={i * 120}>
              <div className="card-lift group relative overflow-hidden rounded-sm border border-white/5 cursor-pointer">
                <div className="aspect-[4/5] overflow-hidden relative">
                  <img
                    src={f.img}
                    alt={f.title}
                    className="w-full h-full object-cover transition-transform duration-[1.2s] group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/30 to-transparent" />
                  <div className="absolute top-5 left-5">
                    <span className="text-[0.65rem] tracking-[0.25em] uppercase text-champagne border border-champagne/40 px-3 py-1.5 bg-charcoal/40 backdrop-blur">
                      {f.pax}
                    </span>
                  </div>
                </div>
                <div className="p-7 bg-charcoal-lighter">
                  <h3 className="font-serif text-2xl text-ivory mb-2">{f.title}</h3>
                  <p className="text-ivory-dim text-sm leading-relaxed font-light">{f.desc}</p>
                  <div className="mt-6 flex items-center gap-2 text-[0.7rem] tracking-[0.2em] uppercase text-champagne">
                    <span>Inquire</span>
                    <Icon path={icons.arrow} className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>

        <FadeIn>
          <div id="concierge" className="mt-16 glass rounded-sm p-8 md:p-12 grid md:grid-cols-2 gap-10 items-center">
            <div>
              <SectionLabel>Beyond the vehicle</SectionLabel>
              <h3 className="mt-6 font-serif text-3xl md:text-4xl text-ivory leading-tight">
                A concierge who already knows what you need.
              </h3>
              <p className="mt-5 text-ivory-dim leading-relaxed font-light">
                From securing the impossible reservation to arranging a private jet meet-and-greet,
                our concierge team operates with quiet authority. One point of contact. Absolute discretion.
              </p>
            </div>
            <div className="relative aspect-[4/3] rounded-sm overflow-hidden">
              <img
                src="/images/concierge-lifestyle.jpg"
                alt="Concierge lifestyle"
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-charcoal/80 via-transparent to-transparent" />
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

/* ---------- How It Works ---------- */
function HowItWorks() {
  const steps = [
    { num: "01", title: "Tell us what you need", body: "Complete a quick inquiry, or call us directly — however you prefer." },
    { num: "02", title: "We craft the perfect solution", body: "Your dedicated planner handles every detail, from routing to special requests." },
    { num: "03", title: "Arrive relaxed. On time.", body: "Step in, unwind, and let us take care of the journey." },
  ];
  return (
    <section id="lifestyle" className="relative py-24 md:py-36 px-6 md:px-10">
      <div className="max-w-[1200px] mx-auto">
        <FadeIn>
          <div className="text-center max-w-2xl mx-auto mb-20">
            <SectionLabel>The Process</SectionLabel>
            <h2 className="mt-6 font-serif text-[clamp(2rem,4vw,3.25rem)] leading-tight text-ivory">
              Effortless, by design.
            </h2>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-0">
          {steps.map((s, i) => (
            <FadeIn key={s.num} delay={i * 150}>
              <div className="relative md:px-8 md:text-center">
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute top-10 left-1/2 w-full h-px bg-gradient-to-r from-champagne/40 to-champagne/40" />
                )}
                <div className="relative z-10 inline-flex items-center justify-center w-20 h-20 rounded-full border border-champagne/40 bg-charcoal mb-6 mx-auto">
                  <span className="font-serif text-2xl text-champagne">{s.num}</span>
                </div>
                <h3 className="font-serif text-2xl text-ivory mb-3">{s.title}</h3>
                <p className="text-ivory-dim leading-relaxed font-light max-w-xs mx-auto">
                  {s.body}
                </p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- Service area ---------- */
function ServiceArea() {
  const areas = [
    "Miami", "Miami Beach", "Coral Gables", "Coconut Grove",
    "Aventura", "Fort Lauderdale", "Hollywood", "Boca Raton",
    "Delray Beach", "West Palm Beach", "Palm Beach", "Wellington",
  ];
  return (
    <section className="relative py-24 md:py-36 px-6 md:px-10 bg-charcoal-light overflow-hidden">
      <div
        className="absolute inset-0 opacity-20 bg-cover bg-center"
        style={{ backgroundImage: "url(/images/miami-skyline.jpg)" }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-charcoal-light via-charcoal-light/95 to-charcoal-light" />

      <div className="relative z-10 max-w-[1200px] mx-auto">
        <FadeIn>
          <div className="text-center max-w-2xl mx-auto mb-14">
            <SectionLabel>Service Area</SectionLabel>
            <h2 className="mt-6 font-serif text-[clamp(2rem,4vw,3.25rem)] leading-tight text-ivory">
              From Miami-Dade to Palm Beach County.
            </h2>
            <p className="mt-6 text-ivory-dim text-lg leading-relaxed font-light">
              Proudly serving the entire South Florida corridor and surrounding areas —
              with extended service available upon request.
            </p>
          </div>
        </FadeIn>

        <FadeIn delay={100}>
          <div className="glass rounded-sm p-8 md:p-12">
            <div className="flex flex-wrap justify-center gap-x-8 gap-y-3">
              {areas.map((a) => (
                <span
                  key={a}
                  className="text-ivory-dim text-sm tracking-wide relative inline-flex items-center gap-2"
                >
                  <Icon path={icons.mapPin} className="w-3.5 h-3.5 text-champagne/70" />
                  {a}
                </span>
              ))}
            </div>
            <div className="mt-10 gold-divider mx-auto" />
            <p className="mt-6 text-center text-ivory-muted text-xs tracking-[0.25em] uppercase">
              Long-distance & multi-leg journeys by arrangement
            </p>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

/* ---------- Final CTA ---------- */
function FinalCTA() {
  return (
    <section id="contact" className="relative py-28 md:py-40 px-6 md:px-10 overflow-hidden grain">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-30"
        style={{ backgroundImage: "url(/images/fleet-suv.jpg)" }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-charcoal via-charcoal/90 to-charcoal" />

      <div className="relative z-10 max-w-3xl mx-auto text-center">
        <FadeIn>
          <SectionLabel>Begin Your Journey</SectionLabel>
          <h2 className="mt-8 font-serif text-[clamp(2.25rem,5vw,4.5rem)] leading-[1.05] text-ivory">
            Ready for a <span className="italic text-champagne">higher</span> standard?
          </h2>
          <p className="mt-8 text-ivory-dim text-lg leading-relaxed font-light max-w-xl mx-auto">
            Reach a member of our team directly, or reserve your vehicle now.
            We respond to every inquiry personally.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#book"
              className="btn-primary inline-flex items-center justify-center gap-2 px-10 py-4 rounded-sm text-[0.75rem] tracking-[0.2em] uppercase font-semibold"
            >
              <span>Book a Ride</span>
              <Icon path={icons.arrow} className="w-4 h-4" />
            </a>
            <a
              href="tel:+13055550123"
              className="btn-outline inline-flex items-center justify-center gap-2 px-10 py-4 rounded-sm text-[0.75rem] tracking-[0.2em] uppercase font-semibold"
            >
              <span>Speak with a Concierge</span>
            </a>
          </div>

          <div className="mt-14 flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-10 text-ivory-dim text-sm">
            <a href="tel:+13055550123" className="inline-flex items-center gap-3 hover:text-champagne transition">
              <Icon path={icons.phone} className="w-4 h-4 text-champagne" />
              <span className="tracking-wider">+1 (305) 555-0123</span>
            </a>
            <span className="hidden sm:block w-px h-4 bg-white/10" />
            <a href="mailto:concierge@qtcluxury.com" className="inline-flex items-center gap-3 hover:text-champagne transition">
              <Icon path={icons.mail} className="w-4 h-4 text-champagne" />
              <span className="tracking-wider">concierge@qtcluxury.com</span>
            </a>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

/* ---------- Footer ---------- */
function Footer() {
  return (
    <footer className="relative border-t border-white/5 bg-charcoal pt-16 pb-8 px-6 md:px-10">
      <div className="max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-14">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-5">
              <div className="flex items-center justify-center w-10 h-10 border border-champagne/40 rounded-sm">
                <span className="font-serif text-champagne text-lg font-semibold tracking-wider">Q</span>
              </div>
              <span className="font-serif text-xl text-ivory">QTC Luxury Group</span>
            </div>
            <p className="text-ivory-muted text-sm leading-relaxed max-w-sm font-light">
              Discreet luxury transportation & lifestyle services — serving South Florida's most
              discerning travelers, executives, and families.
            </p>
          </div>

          <div>
            <h4 className="text-[0.7rem] tracking-[0.3em] uppercase text-champagne mb-5 font-medium">
              Quick Links
            </h4>
            <ul className="space-y-3 text-sm">
              {[
                ["Services", "#services"],
                ["Fleet", "#fleet"],
                ["Concierge", "#concierge"],
                ["Book a Ride", "#book"],
                ["Contact", "#contact"],
              ].map(([l, h]) => (
                <li key={l}>
                  <a href={h} className="text-ivory-dim hover:text-champagne transition">
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-[0.7rem] tracking-[0.3em] uppercase text-champagne mb-5 font-medium">
              Service Area
            </h4>
            <ul className="space-y-3 text-sm text-ivory-dim font-light">
              <li>Miami-Dade County</li>
              <li>Broward County</li>
              <li>Palm Beach County</li>
              <li className="pt-2">
                <a href="tel:+13055550123" className="inline-flex items-center gap-2 text-ivory-dim hover:text-champagne transition">
                  <Icon path={icons.phone} className="w-3.5 h-3.5" />
                  +1 (305) 555-0123
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="gold-divider mx-auto mb-8" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-[0.7rem] tracking-[0.2em] uppercase text-ivory-muted">
          <p>© 2025 QTC Luxury Group. All rights reserved.</p>
          <p className="italic normal-case tracking-normal font-light text-ivory-muted/80">
            Quiet luxury. Uncompromising service.
          </p>
        </div>
      </div>
    </footer>
  );
}

/* ---------- Root ---------- */
export default function App() {
  return (
    <div className="bg-charcoal text-ivory min-h-screen">
      <Nav />
      <main>
        <Hero />
        <Booking />
        <Services />
        <Why />
        <Fleet />
        <HowItWorks />
        <ServiceArea />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}
