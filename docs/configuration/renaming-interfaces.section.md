# Renomeando interfaces de rede {#sec-rename-ifs}

NixOS usa o [esquema de nomes previsíveis](https://systemd.io/PREDICTABLE_INTERFACE_NAMES/) do udev para atribuir nomes às interfaces de rede. Isso significa que, por padrão, as placas não recebem os nomes tradicionais como `eth0` ou `eth1`, cuja ordem pode mudar imprevisivelmente entre reinicializações. Em vez disso, contando com localizações físicas e informações de firmware, o esquema produz nomes como `ens1`, `enp2s0`, etc.

Esses nomes são previsíveis, mas menos memoráveis e não necessariamente estáveis: por exemplo, a instalação de novo hardware ou a alteração das configurações de firmware pode resultar em uma [mudança de nome](https://github.com/systemd/systemd/issues/3715#issue-165347602). Se isso for indesejável, por exemplo, se você tiver uma única placa de rede ethernet, você pode reverter para o esquema tradicional definindo [](#opt-networking.usePredictableInterfaceNames) como `false`.

## Atribuindo nomes personalizados {#sec-custom-ifnames}

Caso existam múltiplas interfaces do mesmo tipo, é melhor atribuir nomes personalizados com base no endereço de hardware do dispositivo. Por exemplo, atribuímos o nome `wan` à interface com endereço MAC `52:54:00:12:01:01` usando uma unidade de link de rede:

```nix
{
  systemd.network.links."10-wan" = {
    matchConfig.PermanentMACAddress = "52:54:00:12:01:01";
    linkConfig.Name = "wan";
  };
}
```

Note que os links são lidos diretamente pelo udev, *não pelo networkd*, e funcionarão mesmo que o networkd esteja desabilitado.

Alternativamente, podemos usar uma regra udev antiga e simples:

```nix
{
  boot.initrd.services.udev.rules = ''
    SUBSYSTEM=="net", ACTION=="add", DRIVERS=="?*", \
    ATTR{address}=="52:54:00:12:01:01", KERNEL=="eth*", NAME="wan"
  '';
}
```

::: {.warning}
A regra deve ser instalada no initrd usando `boot.initrd.services.udev.rules`, e não a opção usual `services.udev.extraRules`. Isso é para evitar condições de corrida com outros programas que controlam a interface.
:::