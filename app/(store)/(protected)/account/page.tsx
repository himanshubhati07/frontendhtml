import { Suspense } from "react";
import { AccountView } from "./account-view";
import { Skeleton } from "@/components/Skeleton";

export default function AccountPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-5xl px-4 py-8">
          <Skeleton className="h-64 w-full" />
        </div>
      }
    >
      <AccountView />
    </Suspense>
  );
}
