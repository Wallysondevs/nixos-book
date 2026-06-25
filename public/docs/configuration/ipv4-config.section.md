# Configuração IPv4 {#sec-ipv4}

Por padrão, o NixOS usa DHCP (especificamente, `dhcpcd`) para configurar automaticamente as interfaces de rede. No entanto, você pode configurar uma interface manualmente da seguinte forma:

```nix
{
  networking.interfaces.eth0.ipv4.addresses = [
    {
      address = "192.168.1.2";
      prefixLength = 24;
    }
  ];
}
```

Tipicamente, você também vai querer definir um gateway padrão e um conjunto de servidores de nomes:

```nix
{
  networking.defaultGateway = "192.168.1.1";
  networking.nameservers = [ "8.8.8.8" ];
}
```

::: {.note}
Endereços e rotas para interfaces configuradas estaticamente e o gateway padrão são configurados por serviços systemd chamados `network-addresses-<interface>.service`. A configuração dos servidores de nomes, por outro lado, é realizada por `network-local-commands.service` usando resolvconf.
:::

::: {.note}
Se necessário, por exemplo, se endereços/rotas foram adicionados/removidos, você pode redefinir a configuração de rede executando `systemctl restart networking-scripted.target`
:::

O nome do host é definido usando [](#opt-networking.hostName):

```nix
{ networking.hostName = "cartman"; }
```

O nome do host padrão é `nixos`. Defina-o como uma string vazia (`""`) para permitir que o servidor DHCP forneça o nome do host.