# Configuração Ad-Hoc {#ad-hoc-network-config}

Você pode usar [](#opt-networking.localCommands) para especificar comandos shell a serem
executados depois que as interfaces de rede forem criadas, mas não necessariamente totalmente
configuradas.
Isso é útil para realizar configurações de rede não cobertas pelos módulos NixOS existentes. Por exemplo, você pode criar um network namespace e um par
de virtual ethernet devices assim:

```nix
{
  networking.localCommands = ''
    ip netns add mynet
    ip link add name veth-in type veth peer name veth-out
    ip link set dev veth-out netns mynet
  '';
}
```

::: {.note}
Os comandos devem ser idealmente idempotentes, então é recomendado realizar
limpezas do estado que você cria (por exemplo, virtual interfaces), ou pelo menos
garantir que possíveis falhas sejam tratadas.
:::