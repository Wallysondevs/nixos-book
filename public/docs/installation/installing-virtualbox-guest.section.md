# Instalando em um convidado VirtualBox {#sec-installing-virtualbox-guest}

Instalar o NixOS em um convidado VirtualBox é conveniente para usuários que
desejam experimentar o NixOS sem instalá-lo diretamente no hardware. Se você
deseja configurar um convidado VirtualBox, siga estas instruções:

1.  Adicione uma Nova Máquina no VirtualBox com Tipo de SO "Linux / Other Linux"

1.  Tamanho da Memória Base: 768 MB ou superior.

1.  Novo Disco Rígido de 10 GB ou superior.

1.  Monte o CD-ROM com a ISO do NixOS (clicando em CD/DVD-ROM)

1.  Clique em Configurações / Sistema / Processador e habilite PAE/NX

1.  Clique em Configurações / Sistema / Aceleração e habilite a aceleração "VT-x/AMD-V"

1.  Clique em Configurações / Tela / Monitor e selecione VMSVGA como Controlador Gráfico

1.  Salve as configurações, inicie a máquina virtual e continue a instalação normalmente

Existem algumas modificações que você deve fazer em configuration.nix.
Habilite a inicialização:

```nix
{ boot.loader.grub.device = "/dev/sda"; }
```

Remova também o fsck que é executado na inicialização. Ele sempre falhará ao
ser executado, interrompendo sua inicialização até que você pressione `*`.

```nix
{ boot.initrd.checkJournalingFS = false; }
```

Pastas compartilhadas podem receber um nome e um caminho no sistema host nas
configurações do VirtualBox (Máquina / Configurações / Pastas Compartilhadas,
então clique no ícone "Adicionar"). Adicione o seguinte ao
`/etc/nixos/configuration.nix` para montá-las automaticamente. Se você não
adicionar `"nofail"`, o sistema não inicializará corretamente.

```nix
{ config, pkgs, ... }:
{
  fileSystems."/virtualboxshare" = {
    fsType = "vboxsf";
    device = "nameofthesharedfolder";
    options = [
      "rw"
      "nofail"
    ];
  };
}
```

A pasta estará disponível diretamente sob o diretório raiz.