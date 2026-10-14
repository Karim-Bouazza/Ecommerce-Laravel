"use client"

import * as React from "react"
import { Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { useCreateExcludedIp } from "@/features/fraud/hooks/use-excluded-ips"
import { ApiError, getErrorMessage } from "@/lib/api"

const EXAMPLES = [
  { value: "203.0.113.10", label: "IP exacte" },
  { value: "123.32.58.*", label: "Joker" },
  { value: "123.32.58.0/24", label: "CIDR" },
]

export function ExcludedIpForm() {
  const [pattern, setPattern] = React.useState("")
  const [note, setNote] = React.useState("")
  const [error, setError] = React.useState<string | null>(null)
  const patternRef = React.useRef<HTMLInputElement>(null)

  const { mutate, isPending } = useCreateExcludedIp(() => {
    setPattern("")
    setNote("")
    patternRef.current?.focus()
  })

  function submit(event: React.FormEvent) {
    event.preventDefault()
    setError(null)

    if (!pattern.trim()) {
      setError("Saisissez une adresse IP ou un motif.")
      patternRef.current?.focus()
      return
    }

    mutate(
      { pattern: pattern.trim(), note: note.trim() || undefined },
      {
        onError: (err) => {
          setError(err instanceof ApiError && err.errors?.pattern?.[0] ? err.errors.pattern[0] : getErrorMessage(err))
          patternRef.current?.focus()
        },
      }
    )
  }

  return (
    <form onSubmit={submit} noValidate className="flex flex-col gap-4">
      <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto] md:items-start">
        <Field data-invalid={error ? true : undefined}>
          <FieldLabel htmlFor="excluded-ip-pattern">Adresse IP ou motif</FieldLabel>
          <Input
            id="excluded-ip-pattern"
            ref={patternRef}
            value={pattern}
            onChange={(e) => {
              setPattern(e.target.value)
              if (error) setError(null)
            }}
            placeholder="123.32.58.*"
            autoComplete="off"
            spellCheck={false}
            className="font-mono"
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? "excluded-ip-error" : "excluded-ip-help"}
          />
          {error ? (
            <FieldError id="excluded-ip-error">{error}</FieldError>
          ) : (
            <FieldDescription id="excluded-ip-help">IP exacte, joker * ou CIDR (IPv4 / IPv6).</FieldDescription>
          )}
        </Field>

        <Field>
          <FieldLabel htmlFor="excluded-ip-note">Note (optionnel)</FieldLabel>
          <Input
            id="excluded-ip-note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Bureau, équipe marketing…"
            maxLength={255}
          />
          <FieldDescription>Pour retrouver à qui correspond cette adresse.</FieldDescription>
        </Field>

        <Button type="submit" disabled={isPending} className="md:mt-[26px]">
          <Plus className="size-4" aria-hidden="true" />
          {isPending ? "Ajout…" : "Ajouter"}
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
        <span>Exemples :</span>
        {EXAMPLES.map((example) => (
          <button
            key={example.value}
            type="button"
            onClick={() => {
              setPattern(example.value)
              setError(null)
              patternRef.current?.focus()
            }}
            className="inline-flex min-h-6 cursor-pointer items-center gap-1.5 rounded-md border bg-muted/40 px-2 py-0.5 transition-colors hover:bg-muted focus-visible:outline-2 focus-visible:outline-ring"
          >
            <span className="font-mono text-foreground">{example.value}</span>
            <span>{example.label}</span>
          </button>
        ))}
      </div>
    </form>
  )
}
