# Firewall {#sec-firewall}

O NixOS possui um firewall stateful simples que bloqueia conexões de entrada e outros pacotes inesperados. O firewall se aplica ao tráfego IPv4 e IPv6. Ele é habilitado por padrão. Pode ser desabilitado da seguinte forma:

```nix
{ networking.firewall.enable = false; }
```

Se o firewall estiver habilitado, você pode abrir portas TCP específicas para o mundo exterior:

```nix
{
  networking.firewall.allowedTCPPorts = [
    80
    443
  ];
}
```

Note que a porta TCP 22 (ssh) é aberta automaticamente se o daemon SSH estiver habilitado (`services.openssh.enable = true`). Portas UDP podem ser abertas através de [](#opt-networking.firewall.allowedUDPPorts).

Para abrir faixas de portas TCP:

```nix
{
  networking.firewall.allowedTCPPortRanges = [
    {
      from = 4000;
      to = 4007;
    }
    {
      from = 8000;
      to = 8010;
    }
  ];
}
```

Da mesma forma, faixas de portas UDP podem ser abertas através de [](#opt-networking.firewall.allowedUDPPortRanges).