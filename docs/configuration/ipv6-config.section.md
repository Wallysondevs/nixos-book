# Configuração IPv6 {#sec-ipv6}

IPv6 é habilitado por padrão. A autoconfiguração de endereço sem estado é usada para atribuir automaticamente endereços IPv6 a todas as interfaces, e as Extensões de Privacidade (RFC 4941) são habilitadas por padrão. Você pode ajustar o padrão para isso configurando [](#opt-networking.tempAddresses). Esta opção pode ser sobrescrita por interface por [](#opt-networking.interfaces._name_.tempAddress). Você pode desabilitar o suporte a IPv6 globalmente configurando:

```nix
{ networking.enableIPv6 = false; }
```

Você pode desabilitar o IPv6 em uma única interface usando um sysctl normal (neste exemplo, usamos a interface `eth0`):

```nix
{ boot.kernel.sysctl."net.ipv6.conf.eth0.disable_ipv6" = true; }
```

Assim como no IPv4, as interfaces de rede são configuradas automaticamente via DHCPv6. Você pode configurar uma interface manualmente:

```nix
{
  networking.interfaces.eth0.ipv6.addresses = [
    {
      address = "fe00:aa:bb:cc::2";
      prefixLength = 64;
    }
  ];
}
```

Para configurar um gateway, opcionalmente com interface explicitamente especificada:

```nix
{
  networking.defaultGateway6 = {
    address = "fe00::1";
    interface = "enp0s3";
  };
}
```

Veja [](#sec-ipv4) para exemplos semelhantes e informações adicionais.