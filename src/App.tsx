import { useState } from "react";
import { Route, Switch } from "wouter";
import { useHashLocation } from "wouter/use-hash-location";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { MarkdownPage } from "@/components/MarkdownPage";
import Home from "@/pages/Home";

// Map route paths to doc file paths
const DOC_ROUTES = [
  "installation/obtaining.chapter",
  "installation/installing-usb.section",
  "installation/installing.chapter",
  "installation/installing-virtualbox-guest.section",
  "installation/installing-from-other-distro.section",
  "installation/installing-behind-a-proxy.section",
  "installation/installing-pxe.section",
  "installation/installing-kexec.section",
  "installation/changing-config.chapter",
  "installation/upgrading.chapter",
  "installation/building-nixos.chapter",
  "installation/building-images-via-systemd-repart.chapter",
  "installation/building-images-via-nixos-rebuild-build-image.chapter",
  "configuration/config-syntax.chapter",
  "configuration/config-file.section",
  "configuration/abstractions.section",
  "configuration/modularity.section",
  "configuration/package-mgmt.chapter",
  "configuration/declarative-packages.section",
  "configuration/ad-hoc-packages.section",
  "configuration/customizing-packages.section",
  "configuration/adding-custom-packages.section",
  "configuration/user-mgmt.chapter",
  "configuration/file-systems.chapter",
  "configuration/luks-file-systems.section",
  "configuration/sshfs-file-systems.section",
  "configuration/overlayfs.section",
  "configuration/networking.chapter",
  "configuration/network-manager.section",
  "configuration/wireless.section",
  "configuration/ad-hoc-network-config.section",
  "configuration/ipv4-config.section",
  "configuration/ipv6-config.section",
  "configuration/renaming-interfaces.section",
  "configuration/firewall.section",
  "configuration/ssh.section",
  "configuration/x-windows.chapter",
  "configuration/wayland.chapter",
  "configuration/xfce.chapter",
  "configuration/gpu-accel.chapter",
  "configuration/linux-kernel.chapter",
  "configuration/kubernetes.chapter",
  "configuration/subversion.chapter",
  "configuration/mattermost.chapter",
  "configuration/profiles.chapter",
  "administration/service-mgmt.chapter",
  "administration/rebooting.chapter",
  "administration/rollback.section",
  "administration/cleaning-store.chapter",
  "administration/logging.chapter",
  "administration/control-groups.chapter",
  "administration/user-sessions.chapter",
  "administration/containers.chapter",
  "administration/declarative-containers.section",
  "administration/imperative-containers.section",
  "administration/container-networking.section",
  "administration/troubleshooting.chapter",
  "administration/boot-problems.section",
  "administration/network-problems.section",
  "administration/maintenance-mode.section",
  "administration/store-corruption.section",
  "administration/system-state.chapter",
  "administration/nixos-state.section",
  "administration/systemd-state.section",
  "administration/zfs-state.section",
];

function DocPage({ route }: { route: string }) {
  // route is like "installation/installing" -> file is "installation/installing.chapter.md" or "installation/installing.section.md"
  const matchingDoc = DOC_ROUTES.find(d => d.startsWith(route));
  const docPath = matchingDoc ? `${matchingDoc}.md` : `${route}.md`;
  return <MarkdownPage path={docPath} />;
}

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen" style={{ background: "hsl(var(--nix-bg))" }}>
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      <div className="lg:ml-72">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        <main className="p-6 max-w-5xl mx-auto">
          <Switch hook={useHashLocation}>
            <Route path="/" component={Home} />
            <Route path="/preface">{() => <MarkdownPage path="preface.md" />}</Route>
            <Route path="/:section/:page">{(params) => <DocPage route={`${params.section}/${params.page}`} />}</Route>
          </Switch>
        </main>
      </div>
    </div>
  );
}
