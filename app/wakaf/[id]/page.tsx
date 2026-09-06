import { PaymentWaiting } from "@/components/payment-waiting";

export default function WakafWaitingPage({
  params,
}: {
  params: { id: string };
}) {
  return <PaymentWaiting txId={params.id} />;
}
