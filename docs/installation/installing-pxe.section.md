# Inicializando a partir da mídia "netboot" (PXE) {#sec-booting-from-pxe}

Usuários avançados podem desejar instalar o NixOS usando uma configuração PXE ou iPXE existente.

Estas instruções assumem que você possui uma infraestrutura PXE ou iPXE existente e deseja adicionar o instalador do NixOS como outra opção. Para construir os arquivos necessários a partir da sua versão atual do nixpkgs, você pode executar:

```ShellSession
nix-build -A netboot.x86_64-linux '<nixpkgs/nixos/release.nix>'
```

Isso criará um diretório `result` contendo:

*   `bzImage` -- o kernel Linux
*   `initrd` -- o arquivo initrd
*   `netboot.ipxe` -- um script ipxe de exemplo demonstrando os argumentos apropriados da linha de comando do kernel para esta imagem

Se você estiver usando PXE puro, configure seu carregador de boot para usar os arquivos `bzImage` e `initrd` e faça com que ele forneça os mesmos argumentos da linha de comando do kernel encontrados em `netboot.ipxe`.

Se você estiver usando iPXE, dependendo de como seu servidor HTTP/FTP/etc. está configurado, você poderá usar `netboot.ipxe` sem modificações, ou poderá precisar atualizar os caminhos para os arquivos para corresponder ao layout de diretório do seu servidor.

No futuro, poderemos começar a disponibilizar esses arquivos como produtos de compilação do hydra, momento em que atualizaremos esta documentação com instruções sobre como obtê-los, seja para colocá-los em um servidor TFTP dedicado ou para inicializá-los diretamente pela internet.