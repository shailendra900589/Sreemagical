import { CompensationSettingsForm } from "@/components/admin/CompensationSettingsForm";
import { PageHeader } from "@/components/dashboard/ui";
import { getCompensationSettings } from "@/lib/settings";

export default async function AdminSettingsPage() {
  const settings = await getCompensationSettings();
  return (
    <div>
      <PageHeader
        titleHi="Compensation settings"
        titleEn="Referral · Level · Royalty · Fees"
        description="Yeh percentages kabhi bhi change kar sakte ho — naye BP joinings updated rates use karenge."
      />
      <CompensationSettingsForm initial={settings} />
    </div>
  );
}
