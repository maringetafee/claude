"use client";

export function PrintButton() {
  return (
    <button type="button" className="adm-btn" onClick={() => window.print()}>
      Imprimir hoja del pedido
    </button>
  );
}
