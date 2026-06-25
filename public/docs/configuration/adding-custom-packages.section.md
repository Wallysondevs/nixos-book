# Adicionando Pacotes Personalizados {#sec-custom-packages}

É possível que um pacote que você precisa não esteja disponível no NixOS. Nesse
caso, você pode fazer duas coisas. Ou você pode empacotá-lo com Nix, ou pode tentar
usar pacotes pré-construídos do upstream. Devido às peculiaridades do NixOS, é
importante notar que construir software a partir do código-fonte é frequentemente mais fácil do que
usar executáveis pré-construídos.

## Construindo com Nix {#sec-custom-packages-nix}

Isso pode ser feito in-tree ou out-of-tree. Para uma construção in-tree, você pode
clonar o repositório Nixpkgs, adicionar o pacote ao seu clone e (opcionalmente)
enviar um patch ou pull request para que ele seja aceito no repositório principal do Nixpkgs.
Isso é descrito em detalhes no [manual do Nixpkgs](https://nixos.org/nixpkgs/manual).
Em resumo, você clona o Nixpkgs:

```ShellSession
$ git clone https://github.com/NixOS/nixpkgs
$ cd nixpkgs
```

Então você escreve e testa o pacote conforme descrito no manual do Nixpkgs.
Finalmente, você o adiciona a [](#opt-environment.systemPackages), por exemplo.

```nix
{ environment.systemPackages = [ pkgs.my-package ]; }
```

e você executa `nixos-rebuild`, especificando sua própria árvore Nixpkgs:

```ShellSession
# nixos-rebuild switch -I nixpkgs=/path/to/my/nixpkgs
```

A segunda possibilidade é adicionar o pacote fora da árvore Nixpkgs.
Por exemplo, aqui está como você especifica uma construção do
pacote [GNU Hello](https://www.gnu.org/software/hello/) diretamente em
`configuration.nix`:

```nix
{
  environment.systemPackages =
    let
      my-hello =
        with pkgs;
        stdenv.mkDerivation rec {
          name = "hello-2.8";
          src = fetchurl {
            url = "mirror://gnu/hello/${name}.tar.gz";
            hash = "sha256-5rd/gffPfa761Kn1tl3myunD8TuM+66oy1O7XqVGDXM=";
          };
        };
    in
    [ my-hello ];
}
```

Claro, você também pode mover a definição de `my-hello` para uma
expressão Nix separada, por exemplo.

```nix
{ environment.systemPackages = [ (import ./my-hello.nix) ]; }
```

onde `my-hello.nix` contém:

```nix
with import <nixpkgs> { }; # bring all of Nixpkgs into scope

stdenv.mkDerivation rec {
  name = "hello-2.8";
  src = fetchurl {
    url = "mirror://gnu/hello/${name}.tar.gz";
    hash = "sha256-5rd/gffPfa761Kn1tl3myunD8TuM+66oy1O7XqVGDXM=";
  };
}
```

Isso permite testar o pacote facilmente:

```ShellSession
$ nix-build my-hello.nix
$ ./result/bin/hello
Hello, world!
```

## Usando executáveis pré-construídos {#sec-custom-packages-prebuilt}

A maioria dos executáveis pré-construídos não funcionará no NixOS. Existem duas
exceções notáveis: flatpaks e AppImages. Para flatpaks, consulte a [seção
dedicada](#module-services-flatpak). AppImages podem ser executados "como estão" no NixOS.

Primeiro você precisa habilitar o suporte a AppImage: adicione a `/etc/nixos/configuration.nix`

```nix
{
  programs.appimage.enable = true;
  programs.appimage.binfmt = true;
}
```

Então você pode executar o AppImage "como está" ou com `appimage-run foo.appimage`.

Se houver bibliotecas compartilhadas faltando, adicione-as com

```nix
{
  programs.appimage.package = pkgs.appimage-run.override {
    extraPkgs = pkgs: [
      # missing libraries here, e.g.: `pkgs.libepoxy`
    ];
  };
}
```

Para fazer outros executáveis pré-construídos funcionarem no NixOS, você precisa empacotá-los
com Nix e ajudantes especiais como `autoPatchelfHook` ou `buildFHSEnv`. Consulte
o [manual do Nixpkgs](https://nixos.org/nixpkgs/manual) para detalhes. Isso
é complexo e, frequentemente, fazer uma construção a partir do código-fonte é mais fácil.