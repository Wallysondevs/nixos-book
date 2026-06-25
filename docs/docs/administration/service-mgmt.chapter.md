# Gerenciamento de Serviços {#sec-systemctl}

No NixOS, todos os serviços do sistema são iniciados e monitorados usando o programa systemd. systemd é o processo "init" do sistema (ou seja, PID 1), o pai de todos os outros processos. Ele gerencia um conjunto das chamadas "unidades", que podem ser coisas como serviços do sistema (programas), mas também pontos de montagem, arquivos de troca (swap files), dispositivos, alvos (targets - grupos de unidades) e muito mais. As unidades podem ter dependências complexas; por exemplo, uma unidade pode exigir que outra unidade seja iniciada com sucesso antes que a primeira unidade possa ser iniciada. Quando o sistema inicializa, ele inicia uma unidade chamada `default.target`; as dependências desta unidade fazem com que todos os serviços do sistema sejam iniciados, sistemas de arquivos sejam montados, arquivos de troca sejam ativados e assim por diante.

## Interagindo com um systemd em execução {#sect-nixos-systemd-general}

O comando `systemctl` é a principal forma de interagir com o `systemd`. Os parágrafos a seguir demonstram maneiras de interagir com qualquer sistema operacional executando systemd como sistema init. O NixOS não é exceção. A [próxima seção](#sect-nixos-systemd-nixos) explica coisas específicas do NixOS que valem a pena saber.

Sem nenhum argumento, `systemctl` mostra o status das unidades ativas:

```ShellSession
$ systemctl
-.mount          loaded active mounted   /
swapfile.swap    loaded active active    /swapfile
sshd.service     loaded active running   SSH Daemon
graphical.target loaded active active    Graphical Interface
...
```

Você pode solicitar informações detalhadas de status sobre uma unidade, por exemplo, o serviço de banco de dados PostgreSQL:

```ShellSession
$ systemctl status postgresql.service
postgresql.service - PostgreSQL Server
          Loaded: loaded (/nix/store/pn3q73mvh75gsrl8w7fdlfk3fq5qm5mw-unit/postgresql.service)
          Active: active (running) since Mon, 2013-01-07 15:55:57 CET; 9h ago
        Main PID: 2390 (postgres)
          CGroup: name=systemd:/system/postgresql.service
                  ├─2390 postgres
                  ├─2418 postgres: writer process
                  ├─2419 postgres: wal writer process
                  ├─2420 postgres: autovacuum launcher process
                  ├─2421 postgres: stats collector process
                  └─2498 postgres: zabbix zabbix [local] idle

Jan 07 15:55:55 hagbard postgres[2394]: [1-1] LOG:  database system was shut down at 2013-01-07 15:55:05 CET
Jan 07 15:55:57 hagbard postgres[2390]: [1-1] LOG:  database system is ready to accept connections
Jan 07 15:55:57 hagbard postgres[2420]: [1-1] LOG:  autovacuum launcher started
Jan 07 15:55:57 hagbard systemd[1]: Started PostgreSQL Server.
```

Observe que isso mostra o status da unidade (ativa e em execução), todos os processos pertencentes ao serviço, bem como as mensagens de log mais recentes do serviço.

As unidades podem ser paradas, iniciadas ou reiniciadas:

```ShellSession
# systemctl stop postgresql.service
# systemctl start postgresql.service
# systemctl restart postgresql.service
```

Essas operações são síncronas: elas esperam até que o serviço tenha terminado de iniciar ou parar (ou tenha falhado). Iniciar uma unidade fará com que as dependências dessa unidade também sejam iniciadas (se necessário).

## systemd no NixOS {#sect-nixos-systemd-nixos}

Pacotes no Nixpkgs às vezes fornecem unidades systemd junto com eles, geralmente em, por exemplo, `#pkg-out#/lib/systemd/`. Colocar tal pacote em `environment.systemPackages` não torna o serviço disponível para usuários ou para o sistema.

Para habilitar um serviço *de sistema* systemd com um pacote upstream fornecido, use (por exemplo):

```nix
{ systemd.packages = [ pkgs.packagekit ]; }
```

Normalmente, os módulos do NixOS escritos pela comunidade fazem o que foi descrito acima, além de cuidar de outros detalhes. Se um módulo foi escrito para um serviço no qual você está interessado, você provavelmente precisaria apenas usar `services.#name#.enable = true;`. Esses serviços são definidos no diretório [ `nixos/modules/` ](https://github.com/NixOS/nixpkgs/tree/master/nixos/modules) do Nixpkgs. Caso o serviço seja simples o suficiente, o método acima deve funcionar e iniciar o serviço na inicialização.

Serviços systemd *de usuário*, por outro lado, devem ser tratados de forma diferente. Dado um pacote que possui um arquivo de unidade systemd em `#pkg-out#/lib/systemd/user/`, usar [](#opt-systemd.packages) permitirá que você inicie o serviço via `systemctl --user start`, mas ele não iniciará automaticamente no login. No entanto, você pode habilitá-lo imperativamente adicionando o atributo do pacote a [](#opt-systemd.packages) e então fazer isso (por exemplo):

```ShellSession
$ mkdir -p ~/.config/systemd/user/default.target.wants
$ ln -s /run/current-system/sw/lib/systemd/user/syncthing.service ~/.config/systemd/user/default.target.wants/
$ systemctl --user daemon-reload
$ systemctl --user enable syncthing.service
```

Se você estiver interessado em um arquivo de temporizador (timer file), use `timers.target.wants` em vez de `default.target.wants` no 1º e 2º comando.

Usar `systemctl --user enable syncthing.service` em vez do método acima funcionará, mas usará o caminho absoluto de `syncthing.service` para o symlink, e este caminho está em `/nix/store/.../lib/systemd/user/`. Consequentemente, a [coleta de lixo](#sec-nix-gc) removerá esse arquivo e você acabará com um symlink quebrado em sua configuração systemd, o que, por sua vez, não fará com que o serviço/temporizador inicie no login.

### Definindo serviços personalizados {#sect-nixos-systemd-custom-services}

Você pode definir serviços adicionando-os a `systemd.services`:

```nix
{
  systemd.services.myservice = {
    after = [ "network-online.target" ];
    requires = [ "network-online.target" ];

    before = [ "multi-user.target" ];
    wantedBy = [ "multi-user.target" ];

    serviceConfig = {
      ExecStart = "...";
    };
  };
}
```

Se você quiser especificar um script de várias linhas para `ExecStart`, você pode querer usar `pkgs.writeShellScript`.

### Unidades de modelo (Template units) {#sect-nixos-systemd-template-units}

systemd suporta unidades de modelo (templated units) onde uma unidade base pode ser iniciada várias vezes com um parâmetro diferente. A sintaxe para conseguir isso é `service-name@instance-name.service`. As unidades recebem o nome da instância passado para elas (veja `systemd.unit(5)`). O NixOS tem suporte para esses tipos de unidades e para substituições específicas de modelo. Um serviço precisa ser definido duas vezes, uma para a unidade base e outra para a instância. Todas as instâncias devem incluir `overrideStrategy = "asDropin"` para que a detecção de mudanças funcione. Este exemplo ilustra isso:
```nix
{
  systemd.services = {
    "base-unit@".serviceConfig = {
      ExecStart = "...";
      User = "...";
    };
    "base-unit@instance-a" = {
      overrideStrategy = "asDropin"; # needed for templates to work
      wantedBy = [ "multi-user.target" ]; # causes NixOS to manage the instance
    };
    "base-unit@instance-b" = {
      overrideStrategy = "asDropin"; # needed for templates to work
      wantedBy = [ "multi-user.target" ]; # causes NixOS to manage the instance
      serviceConfig.User = "root"; # also override something for this specific instance
    };
  };
}
```