# Construindo uma ISO (Live) do NixOS {#sec-building-image}

As configurações padrão do instalador live estão disponíveis em `nixos/modules/installer/cd-dvd`.
Para construir outras imagens de sistema, consulte [Construindo Imagens com `nixos-rebuild build-image`](#sec-image-nixos-rebuild-build-image).

Você tem duas opções:

- Use qualquer uma dessas configurações padrão como está
- Combine-as com (qualquer uma de) suas configurações de host

Imagens de sistema, como as do instalador live, sabem como impor configurações das quais dependem imediatamente para funcionar corretamente.

No entanto, se você tiver certeza, pode optar por sobrescrever esses valores impostos com `mkForce`.

## Instruções Práticas {#sec-building-image-instructions}

Para construir uma imagem ISO para o canal `nixos-unstable`:

```ShellSession
$ git clone https://github.com/NixOS/nixpkgs.git
$ cd nixpkgs/nixos
$ git switch nixos-unstable
$ nix-build -A config.system.build.isoImage -I nixos-config=modules/installer/cd-dvd/installation-cd-minimal.nix default.nix
```

Para verificar o conteúdo de uma imagem ISO, monte-a da seguinte forma:

```ShellSession
# mount -o loop -t iso9660 ./result/iso/nixos-image-25.05pre-git-x86_64-linux.iso /mnt/iso
```

## Drivers ou firmware adicionais {#sec-building-image-drivers}

Se você precisar de drivers ou firmware adicionais (não distribuíveis) no instalador, talvez queira estender essas configurações.

Por exemplo, para construir a ISO do instalador gráfico GNOME, mas com suporte para certos adaptadores WiFi presentes em alguns MacBooks, você pode criar o seguinte arquivo em `modules/installer/cd-dvd/installation-cd-graphical-gnome-macbook.nix`:

```nix
{ config, ... }:

{
  imports = [ ./installation-cd-graphical-gnome.nix ];

  boot.initrd.kernelModules = [ "wl" ];

  boot.kernelModules = [
    "kvm-intel"
    "wl"
  ];
  boot.extraModulePackages = [ config.boot.kernelPackages.broadcom_sta ];
}
```

Em seguida, construa-o como no exemplo acima:

```ShellSession
$ git clone https://github.com/NixOS/nixpkgs.git
$ cd nixpkgs/nixos
$ export NIXPKGS_ALLOW_UNFREE=1
$ nix-build -A config.system.build.isoImage -I nixos-config=modules/installer/cd-dvd/installation-cd-graphical-gnome-macbook.nix default.nix
```

## Notas Técnicas {#sec-building-image-tech-notes}

A imposição de valores de configuração é implementada via `mkImageMediaOverride = mkOverride 60;` e, portanto, tem precedência sobre atribuições de valores simples, mas também cede a `mkForce`.

Esta propriedade permite que os designers de imagem implementem de maneiras semanticamente corretas os valores de configuração dos quais o funcionamento correto da imagem depende.

Por exemplo, a imagem base ISO sobrescreve os sistemas de arquivos dos quais ela precisa no mínimo para o funcionamento correto, enquanto a imagem base do instalador sobrescreve todo o layout do sistema de arquivos porque não pode haver outras garantias em um meio live além daquelas fornecidas pelo próprio meio live. Este último é especialmente verdadeiro antes de formatar o(s) dispositivo(s) de bloco de destino. Por outro lado, a ISO de netboot apenas sobrescreve suas dependências mínimas, já que as imagens de netboot são sempre feitas sob medida para o destino.