"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { toggleChargeActive } from "@/features/charges/api/charge-api";
import { getErrorMessage } from "@/lib/api";

export function useToggleChargeActive(
  chargeId: number,
  onSuccess?: () => void,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => toggleChargeActive(chargeId),
    onSuccess: (charge) => {
      toast.success(
        charge.is_active
          ? "Charge récurrente activée."
          : "Charge récurrente arrêtée.",
      );
      queryClient.invalidateQueries({ queryKey: ["charges"] });
      onSuccess?.();
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
}
