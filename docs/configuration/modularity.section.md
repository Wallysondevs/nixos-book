# Modularidade {#sec-modularity}

O mecanismo de configuração do NixOS é modular. Se o seu `configuration.nix` ficar muito grande, você pode dividi-lo em vários arquivos. Da mesma forma, se você tiver várias configurações NixOS (por exemplo, para computadores diferentes) com alguma coisa em comum, você pode mover a configuração comum para um arquivo compartilhado.

Módulos têm exatamente a mesma sintaxe que `configuration.nix`. Na verdade, `configuration.nix` é ele próprio um módulo. Você pode usar outros módulos incluindo-os a partir de `configuration.nix`, por exemplo:

```nix
{ config, pkgs, ... }:

{
  imports = [
    ./vpn.nix
    ./kde.nix
  ];
  services.httpd.enable = true;
  environment.systemPackages = [ pkgs.emacs ];
  # ...
}
```

Aqui, incluímos dois módulos do mesmo diretório, `vpn.nix` e `kde.nix`. O último pode parecer com isto:

```nix
{ config, pkgs, ... }:

{
  services.xserver.enable = true;
  services.displayManager.sddm.enable = true;
  services.desktopManager.plasma6.enable = true;
  environment.systemPackages = [ pkgs.vim ];
}
```

Note que tanto `configuration.nix` quanto `kde.nix` definem a opção [](#opt-environment.systemPackages). Quando múltiplos módulos definem uma opção, o NixOS tentará *mesclar* as definições. No caso de [](#opt-environment.systemPackages), as listas de pacotes serão concatenadas. O valor em `configuration.nix` é mesclado por último, então para opções do tipo lista, ele aparecerá no final da lista mesclada. Se você quiser que ele apareça primeiro, você pode usar `mkBefore`:

```nix
{ boot.kernelModules = mkBefore [ "kvm-intel" ]; }
```

Isso faz com que o módulo de kernel `kvm-intel` seja carregado antes de quaisquer outros módulos de kernel.

Para outros tipos de opções, uma mesclagem pode não ser possível. Por exemplo, se dois módulos definirem [](#opt-services.httpd.adminAddr), `nixos-rebuild` dará um erro:

```plain
The unique option `services.httpd.adminAddr' is defined multiple times, in `/etc/nixos/httpd.nix' and `/etc/nixos/configuration.nix'.
```

Quando isso acontece, é possível forçar uma definição a ter precedência sobre as outras:

```nix
{ services.httpd.adminAddr = pkgs.lib.mkForce "bob@example.org"; }
```

Ao usar múltiplos módulos, você pode precisar acessar valores de configuração definidos em outros módulos. É para isso que serve o argumento de função `config`: ele contém a configuração completa e mesclada do sistema. Ou seja, `config` é o resultado da combinação das configurações retornadas por cada módulo. (Se você está se perguntando como é possível que o *resultado* (indireto) de uma função seja passado como *entrada* para essa mesma função: isso ocorre porque Nix é uma linguagem "preguiçosa" — ela só calcula valores quando eles são necessários. Isso funciona desde que nenhum valor de configuração individual dependa de si mesmo.)

Por exemplo, aqui está um módulo que adiciona alguns pacotes a [](#opt-environment.systemPackages) somente se [](#opt-services.xserver.enable) estiver definido como `true` em outro lugar:

```nix
{ config, pkgs, ... }:

{
  environment.systemPackages =
    if config.services.xserver.enable then
      [
        pkgs.firefox
        pkgs.thunderbird
      ]
    else
      [ ];
}
```

Com múltiplos módulos, pode não ser óbvio qual é o valor final de uma opção de configuração. O comando `nixos-option` permite que você descubra:

```ShellSession
$ nixos-option services.xserver.enable
true

$ nixos-option boot.kernelModules
[ "tun" "ipv6" "loop" ... ]
```

A exploração interativa da configuração é possível usando `nix repl`, um loop de leitura-avaliação-impressão para expressões Nix. Um uso típico:

```ShellSession
$ nix repl -f '<nixpkgs/nixos>'

nix-repl> config.networking.hostName
"mandark"

nix-repl> map (x: x.hostName) config.services.httpd.virtualHosts
[ "example.org" "example.gov" ]
```

Ao abstrair sua configuração, você pode achar útil gerar módulos usando código, em vez de escrever arquivos. O exemplo abaixo teria o mesmo efeito que importar um arquivo que define essas opções.

```nix
{ config, pkgs, ... }:

let
  netConfig = hostName: {
    networking.hostName = hostName;
    networking.useDHCP = false;
  };

in
{
  imports = [ (netConfig "nixos.localdomain") ];
}
```