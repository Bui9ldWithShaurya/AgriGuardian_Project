import { useState } from "react";
import { toast } from "sonner";
import { useApp } from "@/context/AppContext";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";

export function SettingsDialog() {
  const { t, settingsOpen, setSettingsOpen, phone, setPhone, alertsEnabled, setAlertsEnabled } =
    useApp();
  const [draft, setDraft] = useState(phone);

  return (
    <Dialog
      open={settingsOpen}
      onOpenChange={(open) => {
        setSettingsOpen(open);
        if (open) setDraft(phone);
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="font-heading">{t("settings")}</DialogTitle>
          <DialogDescription>{t("smsDemoNote")}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="phone">{t("phoneLabel")}</Label>
            <Input
              id="phone"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder={t("phonePlaceholder")}
            />
          </div>
          <div className="flex items-center justify-between gap-3">
            <Label htmlFor="alerts" className="text-sm font-medium">
              {t("enableAlerts")}
            </Label>
            <Switch id="alerts" checked={alertsEnabled} onCheckedChange={setAlertsEnabled} />
          </div>
        </div>

        <DialogFooter>
          <Button
            onClick={() => {
              setPhone(draft);
              setSettingsOpen(false);
              toast.success(t("saved"));
            }}
          >
            {t("save")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
