import { AppSidebar } from "@/features/layout/components/app-sidebar"
import { UserBadge } from "@/features/layout/components/user-badge"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { RequireAuth } from "@/features/auth/components/require-auth"
import { AbilityProvider } from "@/features/auth/lib/ability-provider"

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <RequireAuth>
      <AbilityProvider>
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset>
            <header className="flex h-16 items-center gap-2 border-b px-4">
              <SidebarTrigger />
              <UserBadge className="ml-auto" />
            </header>
            <main className="flex-1 p-4">{children}</main>
          </SidebarInset>
        </SidebarProvider>
      </AbilityProvider>
    </RequireAuth>
  )
}
