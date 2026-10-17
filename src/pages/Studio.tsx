import { useTranslation } from "react-i18next";
import { BrandLoader } from "@/components/BrandLoader";
import { useEffect, useState } from "react";
import { useNavigate } from "@/lib/router-compat";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { AppLayout } from "@/components/layout/AppLayout";
import { ProfileEditor, type ProfileVariant } from "@/components/dashboard/ProfileEditor";
import { BadgeCheck, Lock, Sparkles } from "lucide-react";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { useAuth } from "@/hooks/useAuth";
import { getVerificationState } from "@/lib/verification.functions";
import { verifiedTabUnlocked } from "@/lib/studio-access";
import { VerificationPanel } from "@/components/dashboard/VerificationPanel";

/** /studio — the dedicated Profile Hub (link-in-bio) workspace. */
export default function Studio() {
  const { t } = useTranslation();
  const { user, loading } = useAuth();
  const nav = useNavigate();
  // Privacy Alias is the default; the verified profile is a premium tab.
  const [variant, setVariant] = useState<ProfileVariant>("alias");
  const fetchState = useServerFn(getVerificationState);
  const state = useQuery({
    queryKey: ["verification-state", user?.id],
    queryFn: () => fetchState(),
    enabled: Boolean(user),
    retry: false,
  });
  const unlocked = verifiedTabUnlocked(state.data);

  useEffect(() => {
    if (!loading && !user) nav("/auth/sign-in", { replace: true });
  }, [user, loading, nav]);

  const tabs = [
    { id: "alias" as ProfileVariant, label: t("studio.profile.alias"), hint: "rout.be/u/handle", Icon: Sparkles, locked: false },
    { id: "verified" as ProfileVariant, label: t("studio.profile.verified"), hint: "rout.be/handle", Icon: BadgeCheck, locked: !unlocked },
  ];

  return (
    <AppLayout
      width="wide"
      title={t("studio.page.title")}
      description={t("studio.page.description")}
      crumbs={[{ label: "Studio" }]}
      trustBadges
    >
      {loading || !user ? (
        <div className="flex min-h-[40vh] items-center justify-center">
          <div className="relative h-24 w-24">
            <BrandLoader label={t("studio.studio.loading")} />
          </div>
        </div>
      ) : (
        <div className="flex flex-1 flex-col space-y-6 pb-8">
          <div role="tablist" className="flex flex-wrap gap-2 rounded-xl border border-border/60 bg-muted/30 p-1">
            {tabs.map(({ id, label, hint, Icon, locked }) => (
              <button
                key={id}
                type="button"
                role="tab"
                onClick={() => setVariant(id)}
                aria-selected={variant === id}
                className={`flex flex-1 items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition ${
                  variant === id
                    ? "bg-background shadow-sm ring-1 ring-border"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" aria-hidden />
                <span className="flex flex-col leading-tight">
                  <span className="font-medium">{label}</span>
                  <span className="text-xs opacity-70">{hint}</span>
                </span>
                {locked && <Lock className="ml-auto h-3.5 w-3.5 opacity-70" aria-label={t("studio.common.locked")} />}
              </button>
            ))}
          </div>
          <ErrorBoundary label={t("studio.page.title")} inline>
            {variant === "verified" && !unlocked ? (
              state.isLoading ? (
                <p className="text-sm text-muted-foreground">{t("studio.common.loading")}</p>
              ) : (
                <LockedVerifiedTab />
              )
            ) : (
              <ProfileEditor key={variant} variant={variant} />
            )}
          </ErrorBoundary>
        </div>
      )}
    </AppLayout>
  );
}

function LockedVerifiedTab() {
  const { t } = useTranslation();
  return (
    <div className="mx-auto w-full max-w-2xl space-y-6 py-6">
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-border bg-muted">
          <Lock className="h-5 w-5" aria-hidden />
        </div>
        <h2 className="font-display text-2xl tracking-tight">{t("studio.profile.verified")}</h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
          {t("studio.profile.unlock")}
        </p>
      </div>
      <VerificationPanel />
    </div>
  );
}
