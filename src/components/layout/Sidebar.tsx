import { Link } from "wouter";
import { useHashLocation } from "wouter/use-hash-location";
import { cn } from "@/lib/utils";
import {
  BookOpen, Terminal, Shield, Settings, FileText, Users,
  Network, X, Package, HardDrive, Zap, Layers,
  Wifi, Lock, ChevronRight, Server, Database,
  Container, Cpu, Globe, Cloud, Monitor,
  FolderOpen, Key, RefreshCw, Trash2, AlertTriangle,
  Play, Pause, ScrollText, Box, Dot,
} from "lucide-react";

const NAVIGATION = [
  {
    title: "Início",
    items: [
      { path: "/", label: "Bem-vindo", icon: BookOpen },
      { path: "/preface", label: "Prefácio", icon: FileText },
    ],
  },
  {
    title: "Instalação",
    items: [
      { path: "/installation/obtaining", label: "Obtendo o NixOS", icon: Cloud },
      { path: "/installation/installing-usb", label: "Gravando na USB", icon: HardDrive },
      { path: "/installation/installing", label: "Instalação Manual", icon: Terminal },
      { path: "/installation/installing-virtualbox-guest", label: "VirtualBox Guest", icon: Monitor },
      { path: "/installation/installing-from-other-distro", label: "A partir de outra Distro", icon: RefreshCw },
      { path: "/installation/installing-behind-a-proxy", label: "Atrás de um Proxy", icon: Globe },
      { path: "/installation/installing-pxe", label: "PXE", icon: Network },
      { path: "/installation/installing-kexec", label: "kexec", icon: Zap },
      { path: "/installation/changing-config", label: "Alterando Configuração", icon: Settings },
      { path: "/installation/upgrading", label: "Atualizando o NixOS", icon: RefreshCw },
      { path: "/installation/building-nixos", label: "Construindo Imagens", icon: Box },
      { path: "/installation/building-images-via-systemd-repart", label: "Imagens (systemd-repart)", icon: Layers },
      { path: "/installation/building-images-via-nixos-rebuild-build-image", label: "Imagens (nixos-rebuild)", icon: Box },
    ],
  },
  {
    title: "Configuração",
    items: [
      { path: "/configuration/config-syntax", label: "Sintaxe de Configuração", icon: FileText },
      { path: "/configuration/config-file", label: "Arquivo de Configuração", icon: FileText },
      { path: "/configuration/abstractions", label: "Abstrações", icon: Layers },
      { path: "/configuration/modularity", label: "Modularidade", icon: Package },
      { path: "/configuration/package-mgmt", label: "Gerenciamento de Pacotes", icon: Package },
      { path: "/configuration/declarative-packages", label: "Pacotes Declarativos", icon: Package },
      { path: "/configuration/ad-hoc-packages", label: "Pacotes Ad Hoc", icon: Package },
      { path: "/configuration/customizing-packages", label: "Customizando Pacotes", icon: Settings },
      { path: "/configuration/adding-custom-packages", label: "Pacotes Custom", icon: Package },
      { path: "/configuration/user-mgmt", label: "Gerenciamento de Usuários", icon: Users },
      { path: "/configuration/file-systems", label: "Sistemas de Arquivos", icon: FolderOpen },
      { path: "/configuration/luks-file-systems", label: "LUKS (Criptografia)", icon: Lock },
      { path: "/configuration/sshfs-file-systems", label: "SSHFS", icon: Network },
      { path: "/configuration/overlayfs", label: "OverlayFS", icon: Layers },
    ],
  },
  {
    title: "Rede",
    items: [
      { path: "/configuration/networking", label: "Rede (Visão Geral)", icon: Network },
      { path: "/configuration/network-manager", label: "NetworkManager", icon: Wifi },
      { path: "/configuration/wireless", label: "Wireless (wpa_supplicant)", icon: Wifi },
      { path: "/configuration/ad-hoc-network-config", label: "Config Ad Hoc", icon: Network },
      { path: "/configuration/ipv4-config", label: "IPv4", icon: Network },
      { path: "/configuration/ipv6-config", label: "IPv6", icon: Network },
      { path: "/configuration/renaming-interfaces", label: "Renomear Interfaces", icon: Network },
      { path: "/configuration/firewall", label: "Firewall", icon: Shield },
      { path: "/configuration/ssh", label: "SSH", icon: Key },
    ],
  },
  {
    title: "Desktop & GPU",
    items: [
      { path: "/configuration/x-windows", label: "X Window System", icon: Monitor },
      { path: "/configuration/wayland", label: "Wayland", icon: Monitor },
      { path: "/configuration/xfce", label: "Xfce", icon: Monitor },
      { path: "/configuration/gpu-accel", label: "Aceleração GPU", icon: Cpu },
    ],
  },
  {
    title: "Kernel & Avançado",
    items: [
      { path: "/configuration/linux-kernel", label: "Kernel Linux", icon: Cpu },
      { path: "/configuration/kubernetes", label: "Kubernetes", icon: Container },
      { path: "/configuration/subversion", label: "Subversion", icon: Database },
      { path: "/configuration/mattermost", label: "Mattermost", icon: Globe },
      { path: "/configuration/profiles", label: "Perfis", icon: Layers },
    ],
  },
  {
    title: "Administração",
    items: [
      { path: "/administration/service-mgmt", label: "Gerenciamento de Serviços", icon: Server },
      { path: "/administration/rebooting", label: "Reinicialização", icon: RefreshCw },
      { path: "/administration/rollback", label: "Rollback", icon: RefreshCw },
      { path: "/administration/cleaning-store", label: "Limpando o Store", icon: Trash2 },
      { path: "/administration/logging", label: "Logging", icon: ScrollText },
      { path: "/administration/control-groups", label: "Control Groups", icon: Layers },
      { path: "/administration/user-sessions", label: "Sessões de Usuário", icon: Users },
      { path: "/administration/containers", label: "Containers NixOS", icon: Container },
      { path: "/administration/declarative-containers", label: "Containers Declarativos", icon: Container },
      { path: "/administration/imperative-containers", label: "Containers Imperativos", icon: Container },
      { path: "/administration/container-networking", label: "Rede em Containers", icon: Network },
    ],
  },
  {
    title: "Troubleshooting",
    items: [
      { path: "/administration/troubleshooting", label: "Resolução de Problemas", icon: AlertTriangle },
      { path: "/administration/boot-problems", label: "Problemas de Boot", icon: AlertTriangle },
      { path: "/administration/network-problems", label: "Problemas de Rede", icon: Network },
      { path: "/administration/maintenance-mode", label: "Modo de Manutenção", icon: Settings },
      { path: "/administration/store-corruption", label: "Corrupção do Store", icon: AlertTriangle },
    ],
  },
  {
    title: "Estado do Sistema",
    items: [
      { path: "/administration/system-state", label: "Estado do Sistema", icon: Database },
      { path: "/administration/nixos-state", label: "Estado NixOS", icon: Database },
      { path: "/administration/systemd-state", label: "Estado systemd", icon: Server },
      { path: "/administration/zfs-state", label: "Estado ZFS", icon: HardDrive },
    ],
  },
];

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
  const [location] = useHashLocation();

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={cn(
          "fixed left-0 top-0 h-full w-72 z-50 overflow-y-auto transition-transform duration-300 border-r border-[hsl(var(--nix-blue))]/15",
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
        style={{ background: "hsl(var(--nix-bg))" }}
      >
        <div
          className="flex items-center justify-between px-4 py-3 border-b border-white/5 sticky top-0 z-10"
          style={{ background: "hsl(var(--nix-bg-2))" }}
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
            </div>
            <div className="min-w-0">
              <h1 className="font-mono font-bold text-sm leading-tight text-[hsl(var(--nix-blue))]">
                NixOS Manual
              </h1>
              <p className="text-[10px] text-[hsl(var(--nix-dim))] font-mono leading-tight">
                26.05 Yarara — PT-BR
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="lg:hidden p-1 rounded text-gray-400 hover:text-white hover:bg-white/10"
            aria-label="Fechar menu"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <nav className="p-3 space-y-5 pb-8">
          {NAVIGATION.map((section, sIdx) => (
            <div key={section.title}>
              <h2 className="text-[10px] font-mono font-semibold text-[hsl(var(--nix-blue))]/80 uppercase tracking-wider px-2 mb-1.5 flex items-center gap-1.5">
                <span className="text-[hsl(var(--nix-purple))]">
                  [{String(sIdx + 1).padStart(2, "0")}]
                </span>
                {section.title}
              </h2>
              <ul className="space-y-0.5">
                {section.items.map((item) => {
                  const isActive = location === item.path;
                  const Icon = item.icon;
                  return (
                    <li key={item.path}>
                      <Link href={item.path}>
                        <a
                          className={cn(
                            "flex items-center gap-2 px-2 py-1.5 rounded-md text-[13px] font-mono transition-colors",
                            isActive
                              ? "bg-[hsl(var(--nix-blue))]/15 text-[hsl(var(--nix-blue))] font-semibold"
                              : "text-[hsl(var(--nix-fg))]/75 hover:text-[hsl(var(--nix-blue))] hover:bg-white/5"
                          )}
                          onClick={() => setIsOpen(false)}
                        >
                          {isActive ? (
                            <ChevronRight className="w-3.5 h-3.5 flex-shrink-0 text-[hsl(var(--nix-purple))]" />
                          ) : (
                            <Dot className="w-3.5 h-3.5 flex-shrink-0 text-[hsl(var(--nix-dim))]" />
                          )}
                          <Icon className="w-3.5 h-3.5 flex-shrink-0 opacity-80" />
                          <span className="flex-1 leading-tight truncate">
                            {item.label}
                          </span>
                        </a>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        <div className="px-4 py-3 border-t border-white/5 font-mono text-[10px] sticky bottom-0" style={{ background: "hsl(var(--nix-bg-2))" }}>
          <p className="text-[hsl(var(--nix-dim))] m-0 leading-tight">
            <span className="text-[hsl(var(--nix-green))]">●</span> 84 capítulos traduzidos
          </p>
          <p className="text-[hsl(var(--nix-dim))] m-0 leading-tight">
            <span className="text-[hsl(var(--nix-blue))]">$</span> Manual Oficial PT-BR
          </p>
        </div>
      </aside>
    </>
  );
}
