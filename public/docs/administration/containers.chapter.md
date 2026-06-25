# Gerenciamento de Contêineres {#ch-containers}

O NixOS permite que você execute facilmente outras instâncias do NixOS como *contêineres*. Contêineres são uma abordagem leve para virtualização que executa software no contêiner na mesma velocidade que no sistema host. Contêineres NixOS compartilham o Nix store do host, tornando a criação de contêineres muito eficiente.

::: {.warning}
Atualmente, os contêineres NixOS não estão perfeitamente isolados do sistema host. Isso significa que um usuário com acesso root ao contêiner pode fazer coisas que afetam o host. Portanto, você não deve conceder acesso root a contêineres para usuários não confiáveis.
:::

Contêineres NixOS podem ser criados de duas maneiras: imperativamente, usando o comando `nixos-container`, e declarativamente, especificando-os em seu `configuration.nix`. A abordagem declarativa implica que os contêineres são atualizados junto com o seu sistema host quando você executa `nixos-rebuild`, o que muitas vezes não é o que você deseja. Em contraste, na abordagem imperativa, os contêineres são configurados e atualizados independentemente do sistema host.

```{=include=} sections
imperative-containers.section.md
declarative-containers.section.md
container-networking.section.md
```