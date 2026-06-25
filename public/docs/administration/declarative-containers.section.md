# Especificação Declarativa de Contêineres {#sec-declarative-containers}

Você também pode especificar contêineres e suas configurações no
`configuration.nix` do host. Por exemplo, o seguinte especifica que
haverá um contêiner chamado `database` executando PostgreSQL:

```nix
{
  containers.database = {
    config =
      { config, pkgs, ... }:
      {
        services.postgresql.enable = true;
        services.postgresql.package = pkgs.postgresql_14;
      };
  };
}
```

Se você executar `nixos-rebuild switch`, o contêiner será construído. Se o
contêiner já estava em execução, ele será atualizado no local, sem
reiniciar. O contêiner pode ser configurado para iniciar automaticamente
definindo `containers.database.autoStart = true` em sua configuração.

Por padrão, contêineres declarativos compartilham o namespace de rede do
host, o que significa que eles podem escutar em portas (privilegiadas). No entanto, eles
não podem alterar a configuração de rede. Você pode dar a um contêiner sua
própria rede da seguinte forma:

```nix
{
  containers.database = {
    privateNetwork = true;
    hostAddress = "192.168.100.10";
    localAddress = "192.168.100.11";
  };
}
```

Isso dá ao contêiner uma interface Ethernet virtual privada com endereço IP
`192.168.100.11`, que está conectada a uma interface Ethernet virtual
no host com endereço IP `192.168.100.10`. (Veja a próxima
seção para detalhes sobre a rede de contêineres.)

Para desabilitar o contêiner, basta removê-lo de `configuration.nix` e
executar `nixos-rebuild
  switch`. Observe que isso não excluirá o diretório raiz do
contêiner em `/var/lib/nixos-containers`. Contêineres podem ser destruídos usando
o método imperativo: `nixos-container destroy foo`.

Contêineres declarativos podem ser iniciados e parados usando o
serviço systemd correspondente, por exemplo,
`systemctl start container@database`.