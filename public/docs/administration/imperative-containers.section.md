# Gerenciamento Imperativo de Contêineres {#sec-imperative-containers}

Primeiro, abordaremos o gerenciamento imperativo de contêineres usando `nixos-container`. Esteja ciente de que o gerenciamento de contêineres atualmente só é possível como `root`, e que você precisa habilitar [](#opt-boot.enableContainers) explicitamente.

Você cria um contêiner com o identificador `foo` da seguinte forma:

```ShellSession
# nixos-container create foo
```

Isso cria o diretório raiz do contêiner em `/var/lib/nixos-containers/foo` e um pequeno arquivo de configuração em `/etc/nixos-containers/foo.conf`. Ele também constrói a configuração inicial do sistema do contêiner e a armazena em `/nix/var/nix/profiles/per-container/foo/system`. Você pode modificar a configuração inicial do contêiner na linha de comando. Por exemplo, para criar um contêiner que tenha `sshd` em execução, com a chave pública fornecida para `root`:

```ShellSession
# nixos-container create foo --config '
  services.openssh.enable = true;
  users.users.root.openssh.authorizedKeys.keys = ["ssh-dss AAAAB3N…"];
'
```

Por padrão, o próximo endereço livre na sub-rede `10.233.0.0/16` será escolhido como o IP do contêiner. Este comportamento pode ser alterado definindo `--host-address` e `--local-address`:

```ShellSession
# nixos-container create test --config-file test-container.nix \
    --local-address 10.235.1.2 --host-address 10.235.1.1
```

Criar um contêiner não o inicia. Para iniciar o contêiner, execute:

```ShellSession
# nixos-container start foo
```

Este comando retornará assim que o contêiner tiver inicializado e atingido `multi-user.target`. No host, o contêiner é executado dentro de uma unidade systemd chamada `container@container-name.service`. Assim, se algo deu errado, você pode obter informações de status usando `systemctl`:

```ShellSession
# systemctl status container@foo
```

Se o contêiner foi iniciado com sucesso, você pode fazer login como root usando a operação `root-login`:

```ShellSession
# nixos-container root-login foo
[root@foo:~]#
```

Observe que apenas o root no host pode fazer isso (já que não há autenticação). Você também pode obter um prompt de login regular usando a operação `login`, que está disponível para todos os usuários no host:

```ShellSession
# nixos-container login foo
foo login: alice
Password: ***
```

Com `nixos-container run`, você pode executar comandos arbitrários no contêiner:

```ShellSession
# nixos-container run foo -- uname -a
Linux foo 3.4.82 #1-NixOS SMP Thu Mar 20 14:44:05 UTC 2014 x86_64 GNU/Linux
```

Existem várias maneiras de alterar a configuração do contêiner. Primeiro, no host, você pode editar `/var/lib/nixos-containers/foo/etc/nixos/configuration.nix` e executar

```ShellSession
# nixos-container update foo
```

Isso construirá e ativará a nova configuração. Você também pode especificar uma nova configuração na linha de comando:

```ShellSession
# nixos-container update foo --config '
  services.httpd.enable = true;
  services.httpd.adminAddr = "foo@example.org";
  networking.firewall.allowedTCPPorts = [ 80 ];
'

# curl http://$(nixos-container show-ip foo)/
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 3.2 Final//EN">…
```

No entanto, observe que isso sobrescreverá o arquivo `/etc/nixos/configuration.nix` do contêiner.

Alternativamente, você pode alterar a configuração de dentro do próprio contêiner executando `nixos-rebuild switch` dentro do contêiner. Observe que o contêiner por padrão não possui uma cópia do canal NixOS, então você deve executar `nix-channel --update` primeiro.

Os contêineres podem ser parados e iniciados usando `nixos-container stop` e `nixos-container start`, respectivamente, ou usando `systemctl` na unidade de serviço do contêiner. Para destruir um contêiner, incluindo seu sistema de arquivos, faça

```ShellSession
# nixos-container destroy foo
```