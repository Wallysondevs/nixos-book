# Construindo Imagens via `systemd-repart` {#sec-image-repart}

Você pode construir imagens de disco no NixOS com a opção `image.repart` fornecida pelo módulo [image/repart.nix][]. Este módulo usa `systemd-repart` para construir as imagens e expõe toda a sua interface através da opção `repartConfig`.

[image/repart.nix]: https://github.com/NixOS/nixpkgs/blob/master/nixos/modules/image/repart.nix

Um exemplo de como construir uma imagem:

```nix
{ config, modulesPath, ... }:
{

  imports = [ "${modulesPath}/image/repart.nix" ];

  image.repart = {
    name = "image";
    partitions = {
      "esp" = {
        contents = {
          # ...
        };
        repartConfig = {
          Type = "esp";
          # ...
        };
      };
      "root" = {
        storePaths = [ config.system.build.toplevel ];
        repartConfig = {
          Type = "root";
          Label = "nixos";
          # ...
        };
      };
    };
  };

}
```

## Caminhos do Nix Store {#sec-image-repart-store-paths}

Se você deseja reescrever caminhos do Nix store, por exemplo, para remover o prefixo `/nix/store` ou para aninhá-lo abaixo de um caminho pai, você pode fazer isso através da opção `nixStorePrefix`.

### Partição do Nix Store {#sec-image-repart-store-partition}

Você pode definir uma partição que contém apenas o Nix store e então montá-la em `/nix/store`. Como a parte `/nix/store` dos caminhos já é determinada pelo ponto de montagem, você deve definir `nixStorePrefix = "/"` para que `/nix/store` seja removido dos caminhos antes de copiá-los para a imagem.

```nix
{
  fileSystems."/nix/store".device = "/dev/disk/by-partlabel/nix-store";

  image.repart.partitions = {
    "store" = {
      storePaths = [ config.system.build.toplevel ];
      nixStorePrefix = "/";
      repartConfig = {
        Type = "linux-generic";
        Label = "nix-store";
        # ...
      };
    };
  };
}
```

### Subvolume do Nix Store {#sec-image-repart-store-subvolume}

Alternativamente, você pode criar um subvolume Btrfs `/@nix-store` contendo o Nix store e montá-lo em `/nix/store`:

```nix
{
  fileSystems."/" = {
    device = "/dev/disk/by-partlabel/root";
    fsType = "btrfs";
    options = [ "subvol=/@" ];
  };

  fileSystems."/nix/store" = {
    device = "/dev/disk/by-partlabel/root";
    fsType = "btrfs";
    options = [ "subvol=/@nix-store" ];
  };

  image.repart.partitions = {
    "root" = {
      storePaths = [ config.system.build.toplevel ];
      nixStorePrefix = "/@nix-store";
      repartConfig = {
        Type = "root";
        Label = "root";
        Format = "btrfs";
        Subvolumes = "/@ /@nix-store";
        MakeDirectories = "/@ /@nix-store";
        # ...
      };
    };
  };
}
```

## Imagem de Appliance {#sec-image-repart-appliance}

O módulo `image/repart.nix` também pode ser usado para construir [appliances de software][] autocontidos.

[software appliances]: https://en.wikipedia.org/wiki/Software_appliance

O mecanismo de atualização baseado em gerações do NixOS não é adequado para appliances. As atualizações de appliances são geralmente realizadas substituindo a imagem inteira por uma nova ou atualizando partições via um esquema A/B. Veja o [processo de atualização do Chrome OS][chrome-os-update] para um exemplo de como conseguir isso. A imagem de appliance construída no exemplo a seguir não contém um `configuration.nix` e, portanto, você não poderá chamar `nixos-rebuild` a partir deste sistema. Além disso, ela usa uma [Imagem de Kernel Unificada][unified-kernel-image].

[chrome-os-update]: https://chromium.googlesource.com/aosp/platform/system/update_engine/+/HEAD/README.md
[unified-kernel-image]: https://uapi-group.org/specifications/specs/unified_kernel_image/

```nix
let
  pkgs = import <nixpkgs> { };
  efiArch = pkgs.stdenv.hostPlatform.efiArch;
in
(pkgs.nixos [
  (
    {
      config,
      lib,
      pkgs,
      modulesPath,
      ...
    }:
    {

      imports = [ "${modulesPath}/image/repart.nix" ];

      boot.loader.grub.enable = false;

      fileSystems."/".device = "/dev/disk/by-label/nixos";

      image.repart = {
        name = "image";
        partitions = {
          "esp" = {
            contents = {
              "/EFI/BOOT/BOOT${lib.toUpper efiArch}.EFI".source =
                "${pkgs.systemd}/lib/systemd/boot/efi/systemd-boot${efiArch}.efi";

              "/EFI/Linux/${config.system.boot.loader.ukiFile}".source =
                "${config.system.build.uki}/${config.system.boot.loader.ukiFile}";
            };
            repartConfig = {
              Type = "esp";
              Format = "vfat";
              SizeMinBytes = "96M";
            };
          };
          "root" = {
            storePaths = [ config.system.build.toplevel ];
            repartConfig = {
              Type = "root";
              Format = "ext4";
              Label = "nixos";
              Minimize = "guess";
            };
          };
        };
      };

    }
  )
]).image
```