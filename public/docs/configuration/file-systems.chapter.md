# Sistemas de Arquivos {#ch-file-systems}

Você pode definir sistemas de arquivos usando a opção de configuração `fileSystems`. Por exemplo, a seguinte definição faz com que o NixOS monte o sistema de arquivos Ext4 no dispositivo `/dev/disk/by-label/data` no ponto de montagem `/data`:

```nix
{
  fileSystems."/data" = {
    device = "/dev/disk/by-label/data";
    fsType = "ext4";
  };
}
```

Isso criará uma entrada em `/etc/fstab`, que gerará uma unidade [systemd.mount](https://www.freedesktop.org/software/systemd/man/systemd.mount.html) correspondente via [systemd-fstab-generator](https://www.freedesktop.org/software/systemd/man/systemd-fstab-generator.html). O sistema de arquivos será montado automaticamente, a menos que `"noauto"` esteja presente em [options](#opt-fileSystems._name_.options). Sistemas de arquivos `"noauto"` podem ser montados explicitamente usando `systemctl`, por exemplo, `systemctl start data.mount`. Pontos de montagem são criados automaticamente se ainda não existirem. Para `device`, é melhor usar os aliases de dispositivo independentes de topologia em `/dev/disk/by-label` e `/dev/disk/by-uuid`, pois estes não mudam se a topologia mudar (por exemplo, se um disco for movido para outro controlador IDE).

Você geralmente pode omitir o tipo de sistema de arquivos (`fsType`), já que `mount` geralmente pode detectar o tipo e carregar o módulo do kernel necessário automaticamente. No entanto, se o sistema de arquivos for necessário no início da inicialização (no ramdisk inicial) e não for `ext2`, `ext3` ou `ext4`, então é melhor especificar `fsType` para garantir que o módulo do kernel esteja disponível.

::: {.note}
A inicialização do sistema falhará se qualquer um dos sistemas de arquivos não conseguir montar, levando você ao shell de emergência. Você pode tornar uma montagem assíncrona e não crítica adicionando `options = [ "nofail" ];`.
:::

```{=include=} sections
luks-file-systems.section.md
sshfs-file-systems.section.md
overlayfs.section.md
```