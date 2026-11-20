"use client"

import { useMemo, useState } from "react"
import { format, endOfMonth, startOfMonth } from "date-fns"

import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsPanel, TabsTab } from "@/components/ui/tabs"
import { CampaignsTab } from "@/features/meta-ads/components/campaigns-tab"
import { ConnectionTab } from "@/features/meta-ads/components/connection-tab"
import { SpendTab } from "@/features/meta-ads/components/spend-tab"
import type { MetaDateRange } from "@/features/meta-ads/types"

export function PublicitePage({ initialTab = "depenses" }: { initialTab?: string }) {
  const [from, setFrom] = useState(() => format(startOfMonth(new Date()), "yyyy-MM-dd"))
  const [to, setTo] = useState(() => format(endOfMonth(new Date()), "yyyy-MM-dd"))
  const [tab, setTab] = useState(initialTab)

  const range = useMemo<MetaDateRange>(() => ({ date_from: from, date_to: to }), [from, to])
  const validRange = from !== "" && to !== "" && from <= to

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-semibold tracking-tight">Publicité Meta</h1>
          <p className="text-muted-foreground">
            Dépenses publicitaires par produit, récupérées en direct depuis Meta.
          </p>
        </div>
        {tab !== "connexion" && (
          <div className="flex items-center gap-2">
            <Input type="date" value={from} onChange={(e) => setFrom(e.target.value)} aria-label="Du" />
            <span aria-hidden>→</span>
            <Input type="date" value={to} onChange={(e) => setTo(e.target.value)} aria-label="Au" />
          </div>
        )}
      </div>

      <Tabs value={tab} onValueChange={(value) => setTab(String(value))}>
        <TabsList>
          <TabsTab value="depenses">Dépenses</TabsTab>
          <TabsTab value="campagnes">Campagnes</TabsTab>
          <TabsTab value="connexion">Connexion</TabsTab>
        </TabsList>

        <TabsPanel value="depenses" className="pt-4">
          {validRange && <SpendTab range={range} />}
        </TabsPanel>
        <TabsPanel value="campagnes" className="pt-4">
          {validRange && <CampaignsTab range={range} />}
        </TabsPanel>
        <TabsPanel value="connexion" className="pt-4">
          <ConnectionTab />
        </TabsPanel>
      </Tabs>
    </div>
  )
}
