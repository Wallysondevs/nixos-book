# Sessões de Usuário {#sec-user-sessions}

Systemd rastreia todos os usuários que estão logados no sistema (por exemplo, em um console virtual ou remotamente via SSH). O comando `loginctl` permite consultar e manipular sessões de usuário. Por exemplo, para listar todas as sessões de usuário:

```ShellSession
$ loginctl
   SESSION        UID USER             SEAT
        c1        500 eelco            seat0
        c3          0 root             seat0
        c4        500 alice
```

Isso mostra que dois usuários estão logados localmente, enquanto outro está logado remotamente. ("Seats" são essencialmente as combinações de telas e dispositivos de entrada conectados ao sistema; geralmente, há apenas um "seat".) Para obter informações sobre uma sessão:

```ShellSession
$ loginctl session-status c3
c3 - root (0)
           Since: Tue, 2013-01-08 01:17:56 CET; 4min 42s ago
          Leader: 2536 (login)
            Seat: seat0; vc3
             TTY: /dev/tty3
         Service: login; type tty; class user
           State: online
          CGroup: name=systemd:/user/root/c3
                  ├─ 2536 /nix/store/10mn4xip9n7y9bxqwnsx7xwx2v2g34xn-shadow-4.1.5.1/bin/login --
                  ├─10339 -bash
                  └─10355 w3m nixos.org
```

Isso mostra que o usuário está logado no console virtual 3. Também lista os processos pertencentes a esta sessão. Como o systemd rastreia isso, você pode encerrar uma sessão de forma a garantir que todos os processos da sessão sejam finalizados:

```ShellSession
# loginctl terminate-session c3
```