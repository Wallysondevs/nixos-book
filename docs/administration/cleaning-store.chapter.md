# Limpando a Nix Store {#sec-nix-gc}

Nix possui um modelo puramente funcional, o que significa que os pacotes nunca são
atualizados no local. Em vez disso, novas versões de pacotes acabam em um
local diferente na Nix store (`/nix/store`). Você deve
executar periodicamente o *coletor de lixo* do Nix para remover pacotes antigos e não referenciados.
Isso é fácil:

```ShellSession
$ nix-collect-garbage
```

Alternativamente, você pode usar uma unidade systemd que faz o mesmo em
segundo plano:

```ShellSession
# systemctl start nix-gc.service
```

Você pode instruir o NixOS em `configuration.nix` para executar esta unidade automaticamente
em determinados momentos, por exemplo, todas as noites às 03:15:

```nix
{
  nix.gc.automatic = true;
  nix.gc.dates = "03:15";
}
```

Os comandos acima não removem as raízes do coletor de lixo, como
configurações de sistema antigas. Assim, eles não removem a capacidade de reverter
para configurações anteriores. O comando a seguir exclui raízes antigas,
removendo a capacidade de reverter para elas:

```ShellSession
$ nix-collect-garbage -d
```

Você também pode fazer isso para perfis específicos, por exemplo:

```ShellSession
$ nix-env -p /nix/var/nix/profiles/per-user/eelco/profile --delete-generations old
```

Observe que as configurações de sistema do NixOS são armazenadas no perfil
`/nix/var/nix/profiles/system`.

Outra forma de recuperar espaço em disco (muitas vezes até 40% do tamanho da
Nix store) é executar o otimizador de store do Nix, que procura
arquivos idênticos na store e os substitui por hard links para uma
única cópia.

```ShellSession
$ nix-store --optimise
```

Como este comando precisa ler toda a Nix store, ele pode levar bastante
tempo para ser concluído.

## Entradas de Boot do NixOS {#sect-nixos-gc-boot-entries}

Se sua partição `/boot` ficar sem espaço, após limpar perfis antigos
você deve reconstruir seu sistema com `nixos-rebuild boot` ou `nixos-rebuild
switch` para atualizar a partição `/boot` e liberar espaço.