# Problemas de Rede {#sec-nix-network-issues}

Nix usa um *cache binário* para otimizar a construção de um pacote a partir do código-fonte, transformando-a em um download de um binário pré-construído. Ou seja, sempre que um comando como `nixos-rebuild` precisar de um caminho no Nix store, o Nix tentará baixar esse caminho da Internet em vez de construí-lo a partir do código-fonte. O cache binário padrão é `https://cache.nixos.org/`. Se este cache estiver inacessível, as operações do Nix podem demorar muito devido a timeouts de conexão HTTP. Você pode desabilitar o uso do cache binário adicionando `--option use-binary-caches false`, por exemplo:

```ShellSession
# nixos-rebuild switch --option use-binary-caches false
```

Se você tiver um cache binário alternativo à sua disposição, pode usá-lo em vez disso:

```ShellSession
# nixos-rebuild switch --option binary-caches http://my-cache.example.org/
```