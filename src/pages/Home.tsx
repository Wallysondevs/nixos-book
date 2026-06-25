export default function Home() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-[hsl(var(--nix-blue))] mb-4">
          Manual do NixOS 26.05
        </h1>
        <p className="text-lg text-[hsl(var(--nix-dim))]">
          Tradução completa do manual oficial — PT-BR
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <a href="#/installation/installing" className="block p-6 rounded-lg border border-[hsl(var(--nix-blue))]/20 bg-[hsl(var(--nix-bg-2))] hover:border-[hsl(var(--nix-blue))]/50 transition-colors">
          <h3 className="font-mono font-bold text-[hsl(var(--nix-blue))] mb-2">Instalação</h3>
          <p className="text-sm text-[hsl(var(--nix-dim))]">Guia completo de instalação manual, USB, VirtualBox, PXE e mais.</p>
        </a>
        <a href="#/configuration/config-file" className="block p-6 rounded-lg border border-[hsl(var(--nix-blue))]/20 bg-[hsl(var(--nix-bg-2))] hover:border-[hsl(var(--nix-blue))]/50 transition-colors">
          <h3 className="font-mono font-bold text-[hsl(var(--nix-blue))] mb-2">Configuração</h3>
          <p className="text-sm text-[hsl(var(--nix-dim))]">configuration.nix, módulos, pacotes, usuários, filesystems.</p>
        </a>
        <a href="#/configuration/networking" className="block p-6 rounded-lg border border-[hsl(var(--nix-blue))]/20 bg-[hsl(var(--nix-bg-2))] hover:border-[hsl(var(--nix-blue))]/50 transition-colors">
          <h3 className="font-mono font-bold text-[hsl(var(--nix-blue))] mb-2">Rede</h3>
          <p className="text-sm text-[hsl(var(--nix-dim))]">NetworkManager, WiFi, firewall, SSH, IPv4/IPv6.</p>
        </a>
        <a href="#/administration/service-mgmt" className="block p-6 rounded-lg border border-[hsl(var(--nix-blue))]/20 bg-[hsl(var(--nix-bg-2))] hover:border-[hsl(var(--nix-blue))]/50 transition-colors">
          <h3 className="font-mono font-bold text-[hsl(var(--nix-blue))] mb-2">Administração</h3>
          <p className="text-sm text-[hsl(var(--nix-dim))]">Serviços, rollback, limpeza, containers, troubleshooting.</p>
        </a>
      </div>

      <div className="p-4 rounded-lg border border-[hsl(var(--nix-purple))]/20 bg-[hsl(var(--nix-bg-2))]">
        <p className="text-sm text-[hsl(var(--nix-dim))] font-mono">
          <span className="text-[hsl(var(--nix-green))]">$</span> nixos-version<br/>
          <span className="text-[hsl(var(--nix-fg))]">26.05.3021.34268251cf55 (Yarara)</span>
        </p>
        <p className="text-xs text-[hsl(var(--nix-dim))] mt-2">
          84 capítulos traduzidos do manual oficial via Vertex AI (Gemini 2.5 Flash)
        </p>
      </div>
    </div>
  );
}
