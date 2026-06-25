# Revertendo Alterações de Configuração {#sec-rollback}

Após executar `nixos-rebuild` para mudar para uma nova configuração, você pode descobrir que a nova configuração não funciona muito bem. Nesse caso, existem várias maneiras de retornar a uma configuração anterior.

Primeiro, o gerenciador de boot GRUB permite que você inicialize em qualquer configuração anterior que não tenha sido coletada pelo garbage collector. Essas configurações podem ser encontradas no submenu GRUB "NixOS - All configurations". Isso é especialmente útil se a nova configuração falhar ao inicializar. Após o sistema ter inicializado, você pode tornar a configuração selecionada o padrão para inicializações subsequentes:

```ShellSession
# /run/current-system/bin/switch-to-configuration boot
```

Segundo, você pode mudar para a configuração anterior em um sistema em execução:

```ShellSession
# nixos-rebuild switch --rollback
```

Isso é equivalente a executar:

```ShellSession
# /nix/var/nix/profiles/system-N-link/bin/switch-to-configuration switch
```

onde `N` é o número da configuração do sistema NixOS. Para obter uma lista das configurações disponíveis, faça:

```ShellSession
$ ls -l /nix/var/nix/profiles/system-*-link
...
lrwxrwxrwx 1 root root 78 Aug 12 13:54 /nix/var/nix/profiles/system-268-link -> /nix/store/202b...-nixos-13.07pre4932_5a676e4-4be1055
```