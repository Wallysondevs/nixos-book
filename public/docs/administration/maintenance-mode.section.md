# Modo de Manutenção {#sec-maintenance-mode}

Você pode entrar no modo de resgate executando:

```ShellSession
# systemctl rescue
```

Isso eventualmente lhe dará um shell de root de usuário único. O Systemd irá parar (quase) todos os serviços do sistema. Para sair do modo de manutenção, basta sair do shell de resgate.