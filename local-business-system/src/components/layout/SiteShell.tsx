import { BusinessConfig } from "@/lib/types";
import { renderSections } from "@/lib/renderSections";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export function SiteShell({
  config,
  fontVariables,
}: {
  config: BusinessConfig;
  fontVariables: string;
}) {
  return (
    <div data-theme={config.theme} className={fontVariables}>
      <Header config={config} />
      <main>{renderSections(config)}</main>
      <Footer config={config} />
    </div>
  );
}
