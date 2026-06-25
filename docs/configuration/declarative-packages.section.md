# Gerenciamento Declarativo de Pacotes {#sec-declarative-package-mgmt}

Com o gerenciamento declarativo de pacotes, você especifica quais pacotes deseja em seu sistema definindo a opção
[](#opt-environment.systemPackages). Por exemplo, adicionar a seguinte linha a `configuration.nix` habilita o aplicativo de e-mail Mozilla Thunderbird:

```nix
{ environment.systemPackages = [ pkgs.thunderbird ]; }
```

O efeito dessa especificação é que o pacote Thunderbird do Nixpkgs será construído ou baixado como parte do sistema quando você executar `nixos-rebuild switch`.

::: {.note}
Alguns pacotes exigem configuração global adicional, como registro de serviço D-Bus ou systemd, então adicioná-los a
[](#opt-environment.systemPackages) pode não ser suficiente. Aconselha-se verificar a [lista de opções](#ch-options) para ver se um módulo NixOS para o pacote não existe.
:::

Você pode obter uma lista dos pacotes disponíveis da seguinte forma:

```ShellSession
$ nix-env -qaP '*' --description
nixos.firefox   firefox-23.0   Mozilla Firefox - the browser, reloaded
...
```

A primeira coluna na saída é o *nome do atributo*, como `nixos.thunderbird`.

Nota: o prefixo `nixos` nos diz que queremos obter o pacote do canal `nixos` e funciona apenas em ferramentas de linha de comando (CLI). Em configuração declarativa, use o prefixo `pkgs` (variável).

Para "desinstalar" um pacote, remova-o de
[](#opt-environment.systemPackages) e execute `nixos-rebuild switch`.

```{=include=} sections
customizing-packages.section.md
adding-custom-packages.section.md
```