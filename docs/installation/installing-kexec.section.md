# "Booting" para NixOS via kexec {#sec-booting-via-kexec}

Em alguns casos, seu sistema pode já estar inicializado/pré-instalado com outra distribuição Linux, e inicializar o NixOS anexando uma imagem de instalação é um processo bastante manual.

Isso é particularmente útil para provedores (de nuvem) onde você não pode inicializar uma imagem personalizada, mas obtém alguma instalação Debian ou Ubuntu.

Nesses casos, pode ser mais fácil usar `kexec` para "pular para o NixOS" a partir do sistema em execução, o que apenas assume que `bash` e `kexec` estejam instalados na máquina.

Note que o kexec pode não funcionar corretamente em alguns hardwares, pois os dispositivos não são totalmente reinicializados no processo. Na prática, isso raramente acontece.

Para construir os arquivos necessários a partir da sua versão atual do nixpkgs, você pode executar:

```ShellSession
nix-build -A kexec.x86_64-linux '<nixpkgs/nixos/release.nix>'
```

Isso criará um diretório `result` contendo o seguinte:
 - `bzImage` (o kernel Linux)
 - `initrd` (o arquivo initrd)
 - `kexec-boot` (um script shell que invoca `kexec`)

Esses três arquivos devem ser copiados para a outra distribuição Linux já em execução.

Observe seus symlinks apontando para outros locais, então entre com `cd` e use `scp * root@$destination` para copiá-los, em vez de rsync.

Assim que terminar de copiar, execute `kexec-boot` *no destino*, e após alguns segundos, a máquina deverá estar inicializando em um meio de instalação (efêmero) do NixOS.

Caso você queira descrever seu próprio fechamento de sistema para o kexec, em vez da imagem de instalador padrão, você pode construir seu próprio `configuration.nix`:

```nix
{ modulesPath, ... }:
{
  imports = [ (modulesPath + "/installer/netboot/netboot-minimal.nix") ];

  services.openssh.enable = true;
  users.users.root.openssh.authorizedKeys.keys = [ "my-ssh-pubkey" ];
}
```

```ShellSession
nix-build '<nixpkgs/nixos>' \
  --arg configuration ./configuration.nix
  --attr config.system.build.kexecTree
```

Certifique-se de que seu `configuration.nix` ainda importe `netboot-minimal.nix` (ou `netboot-base.nix`).