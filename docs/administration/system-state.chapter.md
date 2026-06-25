# Estado necessário do sistema {#ch-system-state}

Normalmente — em sistemas com um `rootfs` persistente — serviços do sistema podem persistir estado no sistema de arquivos sem intervenção do administrador.

No entanto, é possível e não incomum criar [sistemas impermanentes], cujo `rootfs` é um `tmpfs` ou é redefinido durante a inicialização. Embora o próprio NixOS suporte este tipo de configuração, cuidados especiais precisam ser tomados.

[sistemas impermanentes]: https://wiki.nixos.org/wiki/Impermanence


```{=include=} sections
nixos-state.section.md
systemd-state.section.md
zfs-state.section.md
```