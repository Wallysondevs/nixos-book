# Arquivo de Configuração do NixOS {#sec-configuration-file}

O arquivo de configuração do NixOS geralmente se parece com isto:

```nix
{ config, pkgs, ... }:

{
  # option definitions
}
```

A primeira linha (`{ config, pkgs, ... }:`) denota que esta é, na verdade,
uma função que aceita pelo menos os dois argumentos `config` e `pkgs`.
(Estes são explicados mais adiante, no capítulo [](#sec-writing-modules)) A
função retorna um *conjunto* de definições de opções (`{ ... }`).
Essas definições têm a forma `name = value`, onde `name` é o
nome de uma opção e `value` é o seu valor. Por exemplo,

```nix
{ config, pkgs, ... }:

{
  services.httpd.enable = true;
  services.httpd.adminAddr = "alice@example.org";
  services.httpd.virtualHosts.localhost.documentRoot = "/webroot";
}
```

define uma configuração com três definições de opções que, juntas,
habilitam o Servidor HTTP Apache com `/webroot` como o diretório raiz de documentos.

Conjuntos podem ser aninhados, e, de fato, pontos em nomes de opções são uma abreviação para
definir um conjunto contendo outro conjunto. Por exemplo,
[](#opt-services.httpd.enable) define um conjunto chamado
`services` que contém um conjunto chamado `httpd`, que por sua vez contém uma
definição de opção chamada `enable` com o valor `true`. Isso significa que o
exemplo acima também pode ser escrito como:

```nix
{ config, pkgs, ... }:

{
  services = {
    httpd = {
      enable = true;
      adminAddr = "alice@example.org";
      virtualHosts = {
        localhost = {
          documentRoot = "/webroot";
        };
      };
    };
  };
}
```

o que pode ser mais conveniente se você tiver muitas definições de opções que
compartilham o mesmo prefixo (como `services.httpd`).

NixOS verifica a correção das suas definições de opções. Por exemplo, se
você tentar definir uma opção que não existe (ou seja, não tem uma
*declaração de opção* correspondente), `nixos-rebuild` retornará um erro
como:

```plain
The option `services.httpd.enable' defined in `/etc/nixos/configuration.nix' does not exist.
```

Da mesma forma, os valores nas definições de opções devem ter um tipo correto. Por
exemplo, `services.httpd.enable` deve ser um Booleano (`true` ou `false`).
Tentar atribuir-lhe um valor de outro tipo, como uma string, causará
um erro:

```plain
The option value `services.httpd.enable' in `/etc/nixos/configuration.nix' is not a boolean.
```

Opções possuem vários tipos de valores. Os mais importantes são:

Strings

:   Strings são delimitadas por aspas duplas, por exemplo:

    ```nix
    {
      networking.hostName = "dexter";
    }
    ```

    Caracteres especiais podem ser escapados prefixando-os com uma barra invertida
    (por exemplo, `\"`).

    Strings de múltiplas linhas podem ser delimitadas por *aspas simples duplas*, por exemplo:

    ```nix
    {
      networking.extraHosts =
        ''
          127.0.0.2 other-localhost
          10.0.0.1 server
        '';
    }
    ```

    A principal diferença é que ela remove de cada linha um número de
    espaços igual à indentação mínima da string como um todo
    (ignorando a indentação de linhas vazias), e que caracteres
    como `"` e `\` não são especiais (tornando-a mais conveniente para
    incluir coisas como código shell). Veja mais informações sobre isso no
    manual do Nix [aqui](https://nixos.org/nix/manual/#ssec-values).

Booleanos

:   Estes podem ser `true` ou `false`, por exemplo:

    ```nix
    {
      networking.firewall.enable = true;
      networking.firewall.allowPing = false;
    }
    ```

Inteiros

:   Por exemplo:

    ```nix
    {
      boot.kernel.sysctl."net.ipv4.tcp_keepalive_time" = 60;
    }
    ```

    (Note que aqui o nome do atributo `net.ipv4.tcp_keepalive_time` está
    entre aspas para evitar que seja interpretado como um conjunto
    chamado `net` contendo um conjunto chamado `ipv4`, e assim por diante. Isso ocorre
    porque não é uma opção do NixOS, mas o nome literal de uma configuração
    do kernel Linux.)

Conjuntos

:   Conjuntos foram introduzidos acima. Eles são pares nome/valor delimitados por
    chaves, como na definição de opção:

    ```nix
    {
      fileSystems."/boot" =
        { device = "/dev/sda1";
          fsType = "ext4";
          options = [ "rw" "data=ordered" "relatime" ];
        };
    }
    ```

Listas

:   O importante a notar sobre listas é que os elementos da lista são
    separados por espaços em branco, assim:

    ```nix
    {
      boot.kernelModules = [ "fuse" "kvm-intel" "coretemp" ];
    }
    ```

    Os elementos da lista podem ser de qualquer outro tipo, por exemplo, conjuntos:

    ```nix
    {
      swapDevices = [ { device = "/dev/disk/by-label/swap"; } ];
    }
    ```

Pacotes

:   Geralmente, os pacotes de que você precisa já fazem parte da coleção
    Nix Packages, que é um conjunto que pode ser acessado através do
    argumento de função `pkgs`. Usos típicos:

    ```nix
    {
      environment.systemPackages =
        [ pkgs.thunderbird
          pkgs.emacs
        ];

      services.postgresql.package = pkgs.postgresql_14;
    }
    ```

    A última definição de opção altera o pacote PostgreSQL padrão
    usado pelo serviço PostgreSQL do NixOS para 14.x. Para mais informações sobre
    pacotes, incluindo como adicionar novos, veja
    [](#sec-custom-packages).