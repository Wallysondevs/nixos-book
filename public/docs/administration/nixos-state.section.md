# NixOS {#sec-nixos-state}

## `/nix` {#sec-state-nix}

NixOS precisa que todo o `/nix` seja persistente, pois ele inclui:
- `/nix/store`, que contém todos os executáveis, bibliotecas e dados de suporte do sistema;
- `/nix/var/nix`, que contém:
  - o banco de dados do daemon Nix;
  - raízes cuja clausura transitiva é preservada durante a coleta de lixo do Nix store;
  - perfis de todo o sistema e por usuário.

## `/boot` {#sec-state-boot}

`/boot` também deve ser persistente, pois contém:
- o kernel e o initrd que o bootloader carrega,
- a configuração do bootloader, incluindo a linha de comando do kernel que determina o caminho do store a ser usado como ambiente do sistema.

## Usuários e grupos {#sec-state-users}

- `/var/lib/nixos` deve persistir: ele mantém o estado necessário para gerar uids e gids estáveis para usuários e grupos gerenciados declarativamente, etc.
- `users.mutableUsers` deve ser `false`, *ou* os seguintes arquivos em `/etc` devem todos persistir:
  - {manpage}`passwd(5)` e {manpage}`group(5)`,
  - {manpage}`shadow(5)` e {manpage}`gshadow(5)`,
  - {manpage}`subuid(5)` e {manpage}`subgid(5)`.