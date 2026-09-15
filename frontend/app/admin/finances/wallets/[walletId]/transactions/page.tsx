import { WalletTransactionsPage } from "@/features/wallets/pages/wallet-transactions-page"

export default async function Page({
  params,
}: {
  params: Promise<{ walletId: string }>
}) {
  const { walletId } = await params

  return <WalletTransactionsPage walletId={Number(walletId)} />
}
