import { Settings } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AccountSettingsSidebar } from "@/components/account/account-settings-sidebar";

export default function AccountSettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Card className="border-border shadow-none">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Settings className="h-5 w-5 text-primary" />
          Developer Account Settings
        </CardTitle>
        <CardDescription>
          Manage your connected OAuth accounts, password security credentials, developer notifications, and account deletion
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar Navigation */}
          <aside className="md:w-64 shrink-0 md:border-r md:border-border md:pr-6">
            <AccountSettingsSidebar />
          </aside>

          {/* Page Content */}
          <div className="flex-1 min-w-0">
            {children}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
