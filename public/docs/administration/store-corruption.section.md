# Corrupção da Nix Store {#sec-nix-store-corruption}

Após uma falha do sistema, é possível que arquivos na Nix store se corrompam. (Por exemplo, o sistema de arquivos Ext4 tem a tendência de substituir arquivos não sincronizados por bytes zero.) O NixOS se esforça para evitar que isso aconteça: ele executa um `sync` antes de mudar para uma nova configuração, e o banco de dados do Nix é totalmente transacional. Se a corrupção ainda ocorrer, você poderá corrigi-la automaticamente.

Se a corrupção estiver em um caminho no closure da configuração do sistema NixOS, você pode corrigi-la executando

```ShellSession
# nixos-rebuild switch --repair
```

Isso fará com que o Nix verifique cada caminho no closure e, se seu hash criptográfico diferir do hash registrado no banco de dados do Nix, o caminho será reconstruído ou baixado novamente.

Você também pode escanear toda a Nix store em busca de caminhos corrompidos:

```ShellSession
# nix-store --verify --check-contents --repair
```

Quaisquer caminhos corrompidos serão baixados novamente se estiverem disponíveis em um cache binário; caso contrário, não poderão ser reparados.