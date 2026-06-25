# Perfis {#ch-profiles}

Em alguns casos, pode ser desejável aproveitar configurações predefinidas e de uso comum fornecidas por nixpkgs, mas diferentes daquelas que vêm por padrão. Este é um papel desempenhado pelos Perfis do NixOS, que vêm como arquivos localizados em `<nixpkgs/nixos/modules/profiles>`. Ou seja, o uso esperado é adicioná-los à lista de imports do seu `/etc/configuration.nix` da seguinte forma:

```nix
{ imports = [ <nixpkgs/nixos/modules/profiles/profile-name.nix> ]; }
```

Mesmo que alguns desses perfis pareçam úteis apenas no contexto de mídias de instalação, muitos são, na verdade, destinados a serem usados em instalações reais.

O que se segue é uma breve explicação do propósito e caso de uso para cada perfil. Detalhar cada opção configurada por cada um está fora do escopo.

```{=include=} sections
profiles/all-hardware.section.md
profiles/base.section.md
profiles/clone-config.section.md
profiles/demo.section.md
profiles/docker-container.section.md
profiles/graphical.section.md
profiles/headless.section.md
profiles/installation-device.section.md
profiles/perlless.section.md
profiles/minimal.section.md
profiles/qemu-guest.section.md
```