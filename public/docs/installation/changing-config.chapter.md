# Alterando a Configuração {#sec-changing-config}

O arquivo `/etc/nixos/configuration.nix` contém a configuração atual da sua máquina. Sempre que você [alterar algo](#ch-configuration) nesse arquivo, você deve executar

```ShellSession
# nixos-rebuild switch
```

para construir a nova configuração, torná-la a configuração padrão para inicialização e tentar aplicar a configuração no sistema em execução (por exemplo, reiniciando os serviços do sistema).

::: {.warning}
Este comando não inicia/para [serviços de usuário](#opt-systemd.user.services) automaticamente. `nixos-rebuild` apenas executa um `daemon-reload` para cada usuário com serviços de usuário em execução.
:::

::: {.warning}
Esses comandos devem ser executados como root, então você deve executá-los a partir de um shell de root ou prefixando-os com `sudo -i`.
:::

Você também pode executar

```ShellSession
# nixos-rebuild test
```

para construir a configuração e alternar o sistema em execução para ela, mas sem torná-la o padrão de inicialização. Assim, se (por exemplo) a configuração travar sua máquina, você pode simplesmente reiniciar para voltar a uma configuração funcional.

Existe também

```ShellSession
# nixos-rebuild boot
```

para construir a configuração e torná-la o padrão de inicialização, mas sem alternar para ela agora (portanto, ela só terá efeito após a próxima reinicialização).

Você pode fazer com que sua configuração apareça em um submenu diferente da tela de inicialização do GRUB 2, dando a ela um *nome de perfil* diferente, por exemplo.

```ShellSession
# nixos-rebuild switch -p test
```

o que faz com que a nova configuração (e as anteriores criadas usando `-p test`) apareça no submenu do GRUB "NixOS - Profile 'test'". Isso pode ser útil para separar configurações de teste de configurações "estáveis".

Um repl, ou read-eval-print loop, também está disponível. Você pode inspecionar sua configuração e usar a linguagem Nix com

```ShellSession
# nixos-rebuild repl
```

Sua configuração é carregada na variável `config`. Use tab para autocompletar, use o comando `:r` para recarregar os arquivos de configuração. Veja `:?` ou [`nix repl` no manual do Nix](https://nixos.org/manual/nix/stable/command-ref/new-cli/nix3-repl.html) para saber mais.

Finalmente, você pode executar

```ShellSession
$ nixos-rebuild build
```

para construir a configuração, mas nada mais. Isso é útil para ver se tudo compila sem problemas.

Se você tem uma máquina que suporta virtualização de hardware, você também pode testar a nova configuração em um sandbox construindo e executando uma *máquina virtual* QEMU que contém a configuração desejada. Basta executar

```ShellSession
$ nixos-rebuild build-vm
$ ./result/bin/run-*-vm
```

A VM não possui dados do seu sistema host, então suas contas de usuário existentes e diretórios home não estarão disponíveis a menos que você tenha definido `mutableUsers = false`. Outra maneira é adicionar temporariamente o seguinte à sua configuração:

```nix
{ users.users.your-user.initialHashedPassword = "test"; }
```

*Importante:* exclua o arquivo \$hostname.qcow2 se você iniciou a máquina virtual pelo menos uma vez sem os usuários corretos, caso contrário as alterações não serão aplicadas. Você pode encaminhar portas no host para o convidado. Por exemplo, o seguinte encaminhará a porta 2222 do host para a porta 22 do convidado (SSH):

```ShellSession
$ QEMU_NET_OPTS="hostfwd=tcp:127.0.0.1:2222-:22" ./result/bin/run-*-vm
```

permitindo que você faça login via SSH (assumindo que você tenha definido as senhas apropriadas ou chaves SSH autorizadas):

```ShellSession
$ ssh -p 2222 localhost
```

Tais encaminhamentos de porta se conectam através da interface de rede virtual da VM. Assim, eles não podem se conectar a portas que estão ligadas apenas à interface de loopback da VM (`127.0.0.1`), e o firewall NixOS da VM deve ser configurado para permitir essas conexões.