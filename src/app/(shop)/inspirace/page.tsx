import Image from "next/image";

const SHOTS = [
  "https://dekorento.cz/wp-content/uploads/2026/03/MiaGebauer-3.jpg",
  "https://dekorento.cz/wp-content/uploads/2026/03/MiaGebauer-4.jpg",
  "https://dekorento.cz/wp-content/uploads/2026/03/MiaGebauer-6.jpg",
  "https://dekorento.cz/wp-content/uploads/2026/03/MiaGebauer-7.jpg",
  "https://dekorento.cz/wp-content/uploads/2026/03/Partypack-30.jpg",
  "https://dekorento.cz/wp-content/uploads/2026/03/Partypack-37.jpg",
  "https://dekorento.cz/wp-content/uploads/2026/03/Partypack-43.jpg",
  "https://dekorento.cz/wp-content/uploads/2026/03/Partypack-49.jpg",
  "https://dekorento.cz/wp-content/uploads/2026/03/Partypack-50.jpg",
  "https://dekorento.cz/wp-content/uploads/2026/03/Partypack-21.jpg",
  "https://dekorento.cz/wp-content/uploads/2026/03/Partypack-18.jpg",
  "https://dekorento.cz/wp-content/uploads/2026/03/Partypack-38.jpg",
];

export const metadata = { title: "Inspirace — Dekorento" };

export default function InspirationPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <p className="text-xs uppercase tracking-[0.25em] text-neutral-500 font-medium">
        Inspirace
      </p>
      <h1 className="mt-2 text-4xl sm:text-6xl font-black tracking-tight">
        Nechte se inspirovat
      </h1>
      <p className="mt-3 text-neutral-600 max-w-xl">
        Snímky z reálných svateb, oslav a focení s našimi pozadími.
      </p>

      <div className="mt-12 columns-1 sm:columns-2 lg:columns-3 gap-4 [column-fill:_balance]">
        {SHOTS.map((src, i) => (
          <div
            key={i}
            className="mb-4 break-inside-avoid relative rounded-2xl overflow-hidden bg-neutral-100"
          >
            <Image
              src={src}
              alt=""
              width={800}
              height={i % 2 ? 1100 : 600}
              sizes="(max-width:1024px) 50vw, 33vw"
              className="w-full h-auto object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
