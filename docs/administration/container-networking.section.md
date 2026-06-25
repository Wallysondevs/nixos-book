# Rede de Contêineres {#sec-container-networking}

Quando você cria um contêiner usando `nixos-container create`, ele recebe seu próprio endereço IPv4 privado na faixa `10.233.0.0/16`. Você pode obter o endereço IPv4 do contêiner da seguinte forma:

```ShellSession
# nixos-container show-ip foo
10.233.4.2

$ ping -c1 10.233.4.2
64 bytes from 10.233.4.2: icmp_seq=1 ttl=64 time=0.106 ms
```

A rede é implementada usando um par de dispositivos Ethernet virtuais. A interface de rede no contêiner é chamada `eth0`, enquanto a interface correspondente no host é chamada `ve-container-name` (por exemplo, `ve-foo`). O contêiner possui seu próprio namespace de rede e a capacidade `CAP_NET_ADMIN`, para que possa realizar configurações de rede arbitrárias, como a configuração de regras de firewall, sem afetar ou ter acesso à rede do host.

Por padrão, os contêineres não conseguem se comunicar com a rede externa. Se você deseja isso, deve configurar regras de Network Address Translation (NAT) no host para reescrever o tráfego do contêiner para usar seu endereço IP externo. Isso pode ser feito usando a seguinte configuração no host:

```nix
{
  networking.nat.enable = true;
  networking.nat.internalInterfaces = [ "ve-+" ];
  networking.nat.externalInterface = "eth0";
}
```

onde `eth0` deve ser substituído pela interface externa desejada. Observe que `ve-+` é um curinga que corresponde a todas as interfaces de contêiner.

Se você estiver usando o Network Manager, precisa explicitamente impedi-lo de gerenciar as interfaces do contêiner:

```nix
{ networking.networkmanager.unmanaged = [ "interface-name:ve-*" ]; }
```

Pode ser necessário reiniciar seu sistema para que as alterações entrem em vigor.