"use client";

import { useState } from "react";
import { uploadImage } from "@/lib/admin/upload";

export function ImageField({ value, onChange, folder = "web" }: { value: string; onChange: (url: string) => void; folder?: string }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="adm-image-field">
      {value ? <img src={value} alt="" /> : <div className="adm-drop" style={{ minHeight: 90 }}>Sin foto</div>}
      <div className="adm-stack">
        <label className="adm-btn adm-btn--sm" style={{ width: "fit-content" }}>
          {busy ? "Subiendo…" : value ? "Cambiar foto" : "Subir foto"}
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            hidden
            disabled={busy}
            onChange={async (e) => {
              const file = e.target.files?.[0];
              e.target.value = "";
              if (!file) return;
              setBusy(true);
              setError(null);
              try {
                onChange((await uploadImage(file, folder)).url);
              } catch (err) {
                setError((err as Error).message);
              } finally {
                setBusy(false);
              }
            }}
          />
        </label>
        {error && <div className="adm-alert">{error}</div>}
      </div>
    </div>
  );
}
