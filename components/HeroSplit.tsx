export default function HeroSplit() {
  return (
    <section className="relative h-[80vh] w-full overflow-hidden bg-black">

      {/* SINISTRA */}
      <img
        src="/images/bg-left.png"
        alt=""
        className="pointer-events-none absolute left-0 top-0 h-full w-1/2 object-cover
                   [mask-image:linear-gradient(to_right,black,transparent)]"
      />

      {/* DESTRA */}
      <img
        src="/images/bg-right.png"
        alt=""
        className="pointer-events-none absolute right-0 top-0 h-full w-1/2 object-cover
                   [mask-image:linear-gradient(to_left,black,transparent)]"
      />

      {/* CONTENUTO CENTRALE */}
      <div className="relative z-10 flex h-full items-center justify-center text-center px-6">
        <div className="max-w-2xl">
          <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight">
            GEKISHIN SQUADRA
          </h1>

          <p className="mt-4 text-white/70">
            Entra nella battaglia e unisciti alla squadra.
          </p>

          <button className="mt-8 px-8 py-4 bg-yellow-400 text-black font-bold
                             rounded-xl hover:bg-yellow-300 transition">
            INIZIA ORA
          </button>
        </div>
      </div>
    </section>
  );
}
