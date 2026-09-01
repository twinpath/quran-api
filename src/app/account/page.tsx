import { Suspense } from "react";
import { ProfileOverview } from "@/components/account/profile-overview";

export default function AccountProfilePage() {
  return (
    <Suspense fallback={<ProfileOverview isLoading />}>
      <ProfileOverview />
    </Suspense>
  );
}
