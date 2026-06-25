# Personalizando Pacotes {#sec-customising-packages}

A configuração do Nixpkgs para um sistema NixOS é definida pela opção {option}`nixpkgs.config`.

::::{.example}
# Permitir pacotes não-livres globalmente

```nix
{
  nixpkgs.config = {
    allowUnfree = true;
  };
}
```

:::{.note}
Isso apenas permite software não-livre na configuração NixOS fornecida.
Para usuários que invocam comandos Nix como [`nix-build`](https://nixos.org/manual/nix/stable/command-ref/nix-build), o Nixpkgs é configurado independentemente.
Consulte a [seção do manual do Nixpkgs sobre configuração global](https://nixos.org/manual/nixpkgs/unstable/#chap-packageconfig) para detalhes.
:::
::::

<!-- TODO(@fricklerhandwerk)
tudo o que se segue deve ir para o manual do Nixpkgs, não tem nada a ver com NixOS
-->

Alguns pacotes no Nixpkgs possuem opções para habilitar ou desabilitar funcionalidades opcionais, ou alterar outros aspectos do pacote.

::: {.warning}
Infelizmente, o Nixpkgs atualmente não possui uma maneira de consultar as opções de configuração de pacotes disponíveis.
:::

::: {.note}
Por exemplo, muitos pacotes vêm com extensões que se pode adicionar.
Exemplos incluem:
- [`passExtensions.pass-otp`](https://search.nixos.org/packages?query=passExtensions.pass-otp)
- [`python312Packages.requests`](https://search.nixos.org/packages?query=python312Packages.requests)

Você pode usá-los assim:
```nix
{
  environment.systemPackages = with pkgs; [
    sl
    (pass.withExtensions (
      subpkgs: with subpkgs; [
        pass-audit
        pass-otp
        pass-genphrase
      ]
    ))
    (python3.withPackages (subpkgs: with subpkgs; [ requests ]))
    cowsay
  ];
}
```
:::

Além das opções de alto nível, é possível ajustar um pacote de
maneiras quase arbitrárias, como alterar ou desabilitar dependências de um
pacote. Por exemplo, o pacote Emacs no Nixpkgs por padrão tem uma
dependência do GTK 2. Se você quiser compilá-lo com o GTK 3, pode
especificar isso da seguinte forma:

```nix
{ environment.systemPackages = [ (pkgs.emacs.override { gtk = pkgs.gtk3; }) ]; }
```

A função `override` realiza a chamada para a função Nix que
produz o Emacs, com os argumentos originais emendados pelo conjunto de
argumentos especificados por você. Assim, aqui o argumento da função `gtk` recebe o
valor `pkgs.gtk3`, fazendo com que o Emacs dependa do GTK 3. (Os parênteses
são necessários porque no Nix, a aplicação de função se liga mais fracamente
do que a construção de lista, então sem eles,
[](#opt-environment.systemPackages)
seria uma lista com dois elementos.)

Uma personalização ainda maior é possível usando a função
`overrideAttrs`. Enquanto o mecanismo `override` acima sobrescreve os
argumentos de uma função de pacote, `overrideAttrs` permite alterar os
*atributos* passados para `mkDerivation`. Isso permite alterar qualquer aspecto
do pacote, como o código-fonte. Por exemplo, se você quiser
sobrescrever o código-fonte do Emacs, pode dizer:

```nix
{
  environment.systemPackages = [
    (pkgs.emacs.overrideAttrs (oldAttrs: {
      name = "emacs-25.0-pre";
      src = /path/to/my/emacs/tree;
    }))
  ];
}
```

Aqui, `overrideAttrs` pega a derivação Nix especificada por `pkgs.emacs`
e produz uma nova derivação na qual os atributos `name` e `src` originais
foram substituídos pelos valores fornecidos, re-chamando
`stdenv.mkDerivation`. Os atributos originais são acessíveis através do
argumento da função, que é convencionalmente nomeado `oldAttrs`.

As sobrescritas mostradas acima não são globais. Elas não afetam o
pacote original; outros pacotes no Nixpkgs continuam a depender do
original em vez do pacote personalizado. Isso significa que se outro
pacote em seu sistema depender do pacote original, você acabará com
duas instâncias do pacote. Se você quiser que tudo dependa de sua
instância personalizada, pode aplicar uma sobrescrita *global* da seguinte forma:

```nix
{
  nixpkgs.config.packageOverrides = pkgs: {
    emacs = pkgs.emacs.override { gtk = pkgs.gtk3; };
  };
}
```

O efeito desta definição é essencialmente equivalente a modificar o
atributo `emacs` na árvore de código-fonte do Nixpkgs. Qualquer pacote no Nixpkgs
que dependa de `emacs` receberá sua instância personalizada.
(No entanto, o valor `pkgs.emacs` em `nixpkgs.config.packageOverrides`
refere-se à instância original em vez da sobrescrita, para evitar uma
recursão infinita.)