# Reiniciando e Desligando {#sec-rebooting}

O sistema pode ser desligado (e automaticamente desativado) executando:

```ShellSession
# shutdown
```

Isso é equivalente a executar `systemctl poweroff`.

Para reiniciar o sistema, execute

```ShellSession
# reboot
```

o que é equivalente a `systemctl reboot`. Alternativamente, você pode reiniciar rapidamente o sistema usando `kexec`, que ignora a BIOS carregando diretamente o novo kernel na memória:

```ShellSession
# systemctl kexec
```

A máquina pode ser suspensa para a RAM (se suportado) usando `systemctl suspend`, e suspensa para o disco usando `systemctl hibernate`.

Esses comandos podem ser executados por qualquer usuário que esteja logado localmente, ou seja, em um console virtual ou no X11; caso contrário, o usuário é solicitado a autenticar-se.