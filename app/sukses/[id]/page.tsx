import { PaymentSuccess } from "@/components/payment-success";

export default function SuksesPage({ params }: { params: { id: string } }) {
  return <PaymentSuccess txId={params.id} />;
}
