# Construindo Imagens com `nixos-rebuild build-image` {#sec-image-nixos-rebuild-build-image}

Nixpkgs contém uma variedade de módulos para construir imagens personalizadas para diferentes plataformas de virtualização e provedores de nuvem, como por exemplo `amazon-image.nix` e `proxmox-lxc.nix`.

Embora estes possam ser importados diretamente, `system.build.images` fornece um conjunto de atributos que mapeia nomes de variantes para derivações de imagem. As variantes disponíveis são definidas - e extensíveis - em `image.modules`, um conjunto de atributos que mapeia nomes de variantes para módulos NixOS.

Todas essas imagens podem ser construídas tanto através de seu atributo `system.build.image` quanto do comando `nixos-rebuild build-image`.

Por exemplo, para construir uma imagem Amazon a partir da sua configuração NixOS existente, execute:

```ShellSession
$ nixos-rebuild build-image --image-variant amazon
[...]
Done. The disk image can be found in /nix/store/[hash]-nixos-image-amazon-25.05pre-git-x86_64-linux/nixos-image-amazon-25.05pre-git-x86_64-linux.vpc
```

Para obter uma lista de todas as variantes disponíveis, execute `nixos-rebuild build-image` sem argumentos.

::: {.example #ex-nixos-rebuild-build-image-customize}

## Personalizar variantes de imagem específicas {#sec-image-nixos-rebuild-build-image-customize}

A opção `image.modules` pode ser usada para definir opções específicas por variante de imagem, de forma semelhante às [especializações](options.html#opt-specialisation) para configurações NixOS genéricas.

Por exemplo, imagens para o provedor de nuvem Linode usam `grub2` como bootloader por padrão. Se você estiver usando `systemd-boot` em outras plataformas e quiser desativá-lo apenas para Linode, você pode usar as seguintes opções:

``` nix
{
  image.modules.linode = {
    boot.loader.systemd-boot.enable = lib.mkForce false;
  };
}
```