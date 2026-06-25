# Gerenciamento de Pacotes {#sec-package-management}

Esta seção descreve como adicionar pacotes adicionais ao seu sistema.
O NixOS possui dois estilos distintos de gerenciamento de pacotes:

-   *Declarativo*, onde você declara quais pacotes deseja em seu
    `configuration.nix`. Cada vez que você executa `nixos-rebuild`, o NixOS
    garantirá que você obtenha um conjunto consistente de binários correspondente
    à sua especificação.

-   *Ad hoc*, onde você instala, atualiza e desinstala pacotes através do
    comando `nix-env`. Este estilo permite misturar pacotes de diferentes
    versões do Nixpkgs. É a única opção para usuários não-root.

```{=include=} sections
declarative-packages.section.md
ad-hoc-packages.section.md
```