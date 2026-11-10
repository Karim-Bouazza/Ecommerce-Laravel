"use client";

import { Link2 } from "lucide-react";
import { toast } from "sonner";

function copyLink() {
  navigator.clipboard
    .writeText(window.location.href)
    .then(() => toast.success("Lien copié"))
    .catch(() => toast.error("Impossible de copier le lien"));
}

export function CopyLinkButton() {
  return (
    <button
      type="button"
      onClick={copyLink}
      className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1 text-xs font-medium transition-colors hover:bg-muted"
    >
      <Link2 className="size-3.5" />
      Copier le lien
    </button>
  );
}
