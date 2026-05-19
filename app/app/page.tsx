export const dynamic = "force-dynamic";

export default function AppHome() {
  return (
    <main className="min-h-screen bg-cream">
      <div className="container-cp py-20">
        <p className="text-sm text-stone-500">CleanerPay</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">Host dashboard</h1>
        <p className="mt-4 max-w-xl text-stone-600">
          Properties, cleaners, pending payments, and bonus periods will live here.
          Auth wires in before this opens up.
        </p>
        <p className="mt-6 text-sm text-stone-500">greg@cleanerpay.ai</p>
      </div>
    </main>
  );
}
