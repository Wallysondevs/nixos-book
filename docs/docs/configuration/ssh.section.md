# Acesso Secure Shell {#sec-ssh}

O acesso Secure Shell (SSH) à sua máquina pode ser habilitado definindo:

```nix
{ services.openssh.enable = true; }
```

Por padrão, logins de root usando senha são desautorizados. Eles podem ser
desabilitados completamente definindo
[](#opt-services.openssh.settings.PermitRootLogin) para `"no"`.

Você pode especificar declarativamente chaves públicas autorizadas para um usuário
da seguinte forma:

```nix
{
  users.users.alice.openssh.authorizedKeys.keys = [ "ssh-ed25519 AAAAB3NzaC1kc3MAAACBAPIkGWVEt4..." ];
}
```