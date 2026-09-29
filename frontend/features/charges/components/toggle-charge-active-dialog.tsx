"use client";

import * as React from "react";
import { CirclePause, CirclePlay, HelpCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToggleChargeActive } from "@/features/charges/hooks/use-toggle-charge-active";
import type { Charge } from "@/features/charges/types";

export function ToggleChargeActiveDialog({ charge }: { charge: Charge }) {
  const [open, setOpen] = React.useState(false);
  const { mutate, isPending } = useToggleChargeActive(charge.id, () =>
    setOpen(false),
  );

  if (charge.is_active) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger
          render={
            <Button
              variant="ghost"
              size="icon"
              aria-label="Arrêter la charge récurrente"
            />
          }
        >
          <CirclePause className="size-4 text-amber-500" />
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Arrêter la charge récurrente</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center gap-4 py-2 text-center">
            <div className="flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
              <HelpCircle className="size-6" />
            </div>
            <p className="text-sm text-muted-foreground">
              La charge « {charge.name} » ne sera plus calculée automatiquement.
              Vous pourrez la réactiver plus tard.
            </p>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Annuler
            </Button>
            <Button type="button" disabled={isPending} onClick={() => mutate()}>
              {isPending ? "Arrêt…" : "Arrêter"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label="Réactiver la charge récurrente"
      onClick={() => mutate()}
      disabled={isPending}
    >
      <CirclePlay className="size-4 text-emerald-500" />
    </Button>
  );
}
