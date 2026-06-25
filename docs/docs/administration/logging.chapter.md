# Registro de Logs {#sec-logging}

O registro de logs em todo o sistema é fornecido pelo *journal* do systemd, que engloba daemons de registro de logs tradicionais como syslogd e klogd. As entradas de log são mantidas em arquivos binários em `/var/log/journal/`. O comando `journalctl` permite visualizar o conteúdo do journal. Por exemplo,

```ShellSession
$ journalctl -b
```

mostra todas as entradas do journal desde a última reinicialização. (A saída de `journalctl` é direcionada para `less` por padrão.) Você pode usar várias opções e operadores de correspondência para restringir a saída a mensagens de interesse. Por exemplo, para obter todas as mensagens do PostgreSQL:

```ShellSession
$ journalctl -u postgresql.service
-- Logs begin at Mon, 2013-01-07 13:28:01 CET, end at Tue, 2013-01-08 01:09:57 CET. --
...
Jan 07 15:44:14 hagbard postgres[2681]: [2-1] LOG:  database system is shut down
-- Reboot --
Jan 07 15:45:10 hagbard postgres[2532]: [1-1] LOG:  database system was shut down at 2013-01-07 15:44:14 CET
Jan 07 15:45:13 hagbard postgres[2500]: [1-1] LOG:  database system is ready to accept connections
```

Ou para obter todas as mensagens desde a última reinicialização que tenham pelo menos um nível de severidade "critical":

```ShellSession
$ journalctl -b -p crit
Dec 17 21:08:06 mandark sudo[3673]: pam_unix(sudo:auth): auth could not identify password for [alice]
Dec 29 01:30:22 mandark kernel[6131]: [1053513.909444] CPU6: Core temperature above threshold, cpu clock throttled (total events = 1)
```

O journal do sistema é legível por root e por usuários nos grupos `wheel` e `systemd-journal`. Todos os usuários possuem um journal privado que pode ser lido usando `journalctl`.