# Kernel Linux {#sec-kernel-config}

Você pode sobrescrever o kernel Linux e pacotes associados usando a
opção `boot.kernelPackages`. Por exemplo, isso seleciona o kernel Linux 3.10:

```nix
{ boot.kernelPackages = pkgs.linuxKernel.packages.linux_3_10; }
```

Note que isso não apenas substitui o kernel, mas também pacotes que são
específicos da versão do kernel, como os drivers de vídeo NVIDIA. Isso
garante que os pacotes de drivers sejam consistentes com o kernel.

Embora `pkgs.linuxKernel.packages` contenha todos os pacotes de kernel disponíveis,
você pode querer usar um dos aliases `pkgs.linuxPackages_*` sem versão,
como `pkgs.linuxPackages_latest`, que são mantidos atualizados com novas
versões.

Por favor, note que a convenção atual no NixOS é manter apenas versões de kernel ativamente
mantidas tanto na versão instável quanto nas versões estáveis suportadas atualmente
do NixOS. Isso significa que um kernel não-longterm será removido depois de ser
abandonado pelos desenvolvedores do kernel, mesmo em versões estáveis do NixOS. Se você
fixar seu kernel em uma versão não-longterm, espere que sua avaliação falhe assim
que a versão sair do período de manutenção.

Um kernel será removido do nixpkgs quando o primeiro lote de kernels estáveis
_após_ o lançamento final for publicado. Por exemplo, quando 6.15.11 for o lançamento final
da série 6.15 e for lançado junto com 6.16.3 e 6.12.43, ele será
removido no lançamento de 6.16.4 e 6.12.44. Variantes de kernel personalizadas,
como linux-hardened, também são afetadas por isso.

Versões longterm de kernels serão removidas antes do próximo NixOS estável que
excederá o período de manutenção da versão do kernel.

A configuração padrão do kernel Linux deve ser suficiente para a maioria dos usuários.
Você pode ver a configuração do seu kernel atual com o seguinte
comando:

```ShellSession
zcat /proc/config.gz
```

Se você quiser alterar a configuração do kernel, você pode usar o
recurso `packageOverrides` (veja [](#sec-customising-packages)). Por
exemplo, para habilitar o suporte para o depurador de kernel KGDB:

```nix
{
  nixpkgs.config.packageOverrides =
    pkgs:
    pkgs.lib.recursiveUpdate pkgs {
      linuxKernel.kernels.linux_5_10 = pkgs.linuxKernel.kernels.linux_5_10.override {
        extraConfig = ''
          KGDB y
        '';
      };
    };
}
```

`extraConfig` aceita uma lista de opções de configuração do kernel Linux, uma
por linha. O nome da opção não deve incluir o prefixo
`CONFIG_`. O valor da opção é tipicamente `y`, `n` ou `m` (para construir
algo como um módulo de kernel).

Módulos de kernel para dispositivos de hardware são geralmente carregados automaticamente
pelo `udev`. Você pode forçar um módulo a ser carregado via
[](#opt-boot.kernelModules), por exemplo:

```nix
{
  boot.kernelModules = [
    "fuse"
    "kvm-intel"
    "coretemp"
  ];
}
```

Se o módulo for necessário no início da inicialização (por exemplo, para montar o sistema de arquivos raiz), você pode usar [](#opt-boot.initrd.kernelModules):

```nix
{ boot.initrd.kernelModules = [ "cifs" ]; }
```

Isso faz com que os módulos especificados e suas dependências sejam adicionados ao
ramdisk inicial.

Parâmetros de tempo de execução do kernel podem ser definidos através de
[](#opt-boot.kernel.sysctl), por exemplo:

```nix
{ boot.kernel.sysctl."net.ipv4.tcp_keepalive_time" = 120; }
```

define o tempo de keepalive TCP do kernel para 120 segundos. Para ver os
parâmetros disponíveis, execute `sysctl -a`.

## Construindo um kernel personalizado {#sec-linux-config-customizing}

Por favor, consulte o manual do Nixpkgs para as várias maneiras de [construir um kernel personalizado](https://nixos.org/nixpkgs/manual#sec-linux-kernel).

Para usar seu pacote de kernel personalizado em sua configuração NixOS, defina

```nix
{ boot.kernelPackages = pkgs.linuxPackagesFor yourCustomKernel; }
```

## Rust {#sec-linux-rust}

O kernel Linux não possui suporte à linguagem Rust habilitado por
padrão. Para versões de kernel 6.7 ou mais recentes, o suporte experimental a Rust
pode ser habilitado. Em uma configuração NixOS, defina:

```nix
{
  boot.kernelPatches = [
    {
      name = "Rust Support";
      patch = null;
      features = {
        rust = true;
      };
    }
  ];
}
```

## Desenvolvendo módulos de kernel {#sec-linux-config-developing-modules}

Esta seção foi movida para o [manual do Nixpkgs](https://nixos.org/nixpkgs/manual#sec-linux-kernel-developing-modules).

## ZFS {#sec-linux-zfs}

É um problema comum que a versão estável mais recente do ZFS não suporte o kernel Linux mais recente
disponível. É recomendado usar a versão LTS mais recente disponível que seja compatível
com ZFS. Geralmente, este é o kernel padrão fornecido por nixpkgs (ou seja, `pkgs.linuxPackages`).