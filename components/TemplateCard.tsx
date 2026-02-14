import Link from "next/link";

export function TemplateCard({ id, name, image }: { id: string; name: string; image: string }) {
  return (
    <Link href={`/edit/${id}`} className="card" style={{ overflow: "hidden" }}>
      <div style={{ padding: 16 }}>
        <div className="row" style={{ justifyContent: "space-between" }}>
          <div style={{ fontWeight: 900 }}>{name}</div>
          <div className="badge">Edit</div>
        </div>
        <p className="p" style={{ marginTop: 6 }}>Compila i campi e genera PNG + link.</p>
      </div>
      {/* lightweight preview */}
      <div style={{ borderTop: "1px solid var(--border)", background: "rgba(0,0,0,.25)" }}>
        <img src={image} alt={name} style={{ width: "100%", display: "block" }} />
      </div>
    </Link>
  );
}
