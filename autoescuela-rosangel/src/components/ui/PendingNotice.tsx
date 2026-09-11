export default function PendingNotice() {
  return (
    <div className="mb-8 max-w-3xl rounded-sm border border-amber/40 bg-amber-soft px-4 py-3 text-sm text-amber-dark">
      <strong className="font-semibold">Documento pendiente de revisión legal.</strong>{" "}
      Los datos marcados como <code>[PENDIENTE]</code> deben completarse con
      información real de Autoescuela Rosangel antes de publicar la web.
    </div>
  );
}
