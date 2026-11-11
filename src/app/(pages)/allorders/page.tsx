import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { AlertCircle, ArrowRight, ChevronRight, Loader2, Package, RefreshCw } from "lucide-react";
import { authOptions } from "@/lib/auth";
import { getUserOrders } from "@/services/orderService";
import OrderCard from "@/components/orders/OrderCard";
import type { OrderData } from "@/types/order";

export const metadata: Metadata = {
  title: "My Orders | Nexa",
  description: "View your Nexa order history and delivery status",
};

async function OrdersList() {
  const session = await getServerSession(authOptions);

  if (!session?.token) {
    redirect("/login?callbackUrl=/allorders");
  }

  let orders: OrderData[] = [];
  let errorMessage: string | null = null;

  try {
    orders = await getUserOrders(session.token);
  } catch (err) {
    errorMessage =
      err instanceof Error ? err.message : "Failed to load your orders.";
  }

  if (errorMessage) {
    return (
      <div className="flex flex-col items-center max-w-md mx-auto text-center p-8 rounded-3xl border border-red-200 bg-card shadow-xs">
        <div className="mb-5 flex size-16 items-center justify-center rounded-full bg-red-50 text-red-600">
          <AlertCircle className="size-8" aria-hidden="true" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-primary">
          Unable to load orders
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">{errorMessage}</p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <a
            href="/allorders"
            className="flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            <RefreshCw className="size-4" aria-hidden="true" />
            <span>Try Again</span>
          </a>
          <Link
            href="/products"
            className="rounded-full border border-border px-6 py-3 text-sm font-semibold text-foreground hover:bg-secondary transition-colors"
          >
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  const sortedOrders = [...orders].sort((a, b) => {
    const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    return timeB - timeA;
  });

  if (sortedOrders.length === 0) {
    return (
      <div className="flex flex-col items-center max-w-md mx-auto text-center py-16 px-6 rounded-3xl border border-border bg-card shadow-xs">
        <div className="mb-5 flex size-16 items-center justify-center rounded-full bg-secondary text-primary">
          <Package className="size-8" aria-hidden="true" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-primary">
          No orders yet
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          You have not placed any orders yet. Once you complete a Cash or Card checkout, your orders will appear here.
        </p>
        <Link
          href="/products"
          className="mt-6 flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          <span>Explore Products</span>
          <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">
        Showing {sortedOrders.length} {sortedOrders.length === 1 ? "order" : "orders"}
      </p>

      <div className="space-y-6">
        {sortedOrders.map((order) => (
          <OrderCard key={order._id} order={order} />
        ))}
      </div>
    </div>
  );
}

export default function AllOrdersPage() {
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full flex-1">
      <nav
        aria-label="Breadcrumb"
        className="mb-6 flex items-center gap-2 text-sm text-muted-foreground"
      >
        <Link href="/" className="hover:text-primary transition-colors">
          Home
        </Link>
        <ChevronRight className="size-4" aria-hidden="true" />
        <span aria-current="page" className="font-medium text-foreground">
          My Orders
        </span>
      </nav>

      <div className="mb-8 border-b border-border pb-5">
        <h1 className="text-3xl font-bold tracking-tight text-primary">
          My Orders
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Track your recent orders.
        </p>
      </div>

      <Suspense
        fallback={
          <div className="py-20 flex flex-col items-center justify-center">
            <Loader2 className="size-8 animate-spin text-primary" aria-hidden="true" />
            <p className="mt-4 text-sm font-medium text-muted-foreground">
              Loading your orders...
            </p>
          </div>
        }
      >
        <OrdersList />
      </Suspense>
    </main>
  );
}
