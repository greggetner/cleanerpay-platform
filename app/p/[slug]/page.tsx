export const dynamic = "force-dynamic";

export default function CleanerPage({ params }: { params: { slug: string } }) {
  return (
    <main className="min-h-screen bg-cream">
      <div className="container-cp py-20">
        <p className="text-sm text-stone-500">CleanerPay</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">Hi, {params.slug}.</h1>
        <p className="mt-4 max-w-xl text-stone-600">
          Your dashboard is coming. For now: scheduled pay, expense submissions, and
          bonus standing live here.
        </p>
        <p className="mt-6 text-sm text-stone-500">Questions? greg@cleanerpay.ai</p>
      </div>
    </main>
  );
}
