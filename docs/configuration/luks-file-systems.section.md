# Sistemas de Arquivos Criptografados com LUKS {#sec-luks-file-systems}

NixOS suporta sistemas de arquivos que são criptografados usando *LUKS* (Linux Unified Key Setup). Por exemplo, veja como criar um sistema de arquivos Ext4 criptografado no dispositivo
`/dev/disk/by-uuid/3f6b0024-3a44-4fde-a43a-767b872abe5d`:

```ShellSession
# cryptsetup luksFormat /dev/disk/by-uuid/3f6b0024-3a44-4fde-a43a-767b872abe5d

WARNING!
========
This will overwrite data on /dev/disk/by-uuid/3f6b0024-3a44-4fde-a43a-767b872abe5d irrevocably.

Are you sure? (Type uppercase yes): YES
Enter LUKS passphrase: ***
Verify passphrase: ***

# cryptsetup luksOpen /dev/disk/by-uuid/3f6b0024-3a44-4fde-a43a-767b872abe5d crypted
Enter passphrase for /dev/disk/by-uuid/3f6b0024-3a44-4fde-a43a-767b872abe5d: ***

# mkfs.ext4 /dev/mapper/crypted
```

O volume LUKS deve ser detectado automaticamente por `nixos-generate-config`, mas você pode querer verificar se seu `hardware-configuration.nix` está correto. Para garantir manualmente que o sistema seja montado automaticamente na inicialização como `/`, adicione o seguinte ao `configuration.nix`:

```nix
{
  boot.initrd.luks.devices.crypted.device = "/dev/disk/by-uuid/3f6b0024-3a44-4fde-a43a-767b872abe5d";
  fileSystems."/".device = "/dev/mapper/crypted";
}
```

Caso o grub seja usado como bootloader, e `/boot` esteja localizado em uma partição criptografada, é necessário adicionar a seguinte opção do grub:

```nix
{ boot.loader.grub.enableCryptodisk = true; }
```

## FIDO2 {#sec-luks-file-systems-fido2}

O NixOS também suporta o desbloqueio do seu sistema de arquivos criptografado com LUKS usando um token compatível com FIDO2.

### Sem systemd no initrd {#sec-luks-file-systems-fido2-legacy}

No exemplo a seguir, criaremos uma nova credencial FIDO2 e a adicionaremos como uma nova chave ao nosso dispositivo existente `/dev/sda2`:

```ShellSession
# export FIDO2_LABEL="/dev/sda2 @ $HOSTNAME"
# fido2luks credential "$FIDO2_LABEL"
f1d00200108b9d6e849a8b388da457688e3dd653b4e53770012d8f28e5d3b269865038c346802f36f3da7278b13ad6a3bb6a1452e24ebeeaa24ba40eef559b1b287d2a2f80b7

# fido2luks -i add-key /dev/sda2 f1d00200108b9d6e849a8b388da457688e3dd653b4e53770012d8f28e5d3b269865038c346802f36f3da7278b13ad6a3bb6a1452e24ebeeaa24ba40eef559b1b287d2a2f80b7
Password:
Password (again):
Old password:
Old password (again):
Added to key to device /dev/sda2, slot: 2
```

Para garantir que este sistema de arquivos seja descriptografado usando a chave compatível com FIDO2, adicione o seguinte ao `configuration.nix`:

```nix
{
  boot.initrd.luks.fido2Support = true;
  boot.initrd.luks.devices."/dev/sda2".fido2.credential =
    "f1d00200108b9d6e849a8b388da457688e3dd653b4e53770012d8f28e5d3b269865038c346802f36f3da7278b13ad6a3bb6a1452e24ebeeaa24ba40eef559b1b287d2a2f80b7";
}
```

Você também pode usar a configuração FIDO2 sem senha, mas por razões de segurança, você pode querer habilitá-la apenas quando seu dispositivo estiver protegido por PIN, como o [Trezor](https://trezor.io/).

```nix
{ boot.initrd.luks.devices."/dev/sda2".fido2.passwordLess = true; }
```

### systemd Estágio 1 {#sec-luks-file-systems-fido2-systemd}

Se o systemd estágio 1 estiver habilitado, ele lida com o desbloqueio de volumes criptografados com LUKS durante a inicialização. O exemplo a seguir habilita o systemd estágio 1 e adiciona suporte para desbloquear o volume LUKS2 existente `root` usando quaisquer tokens compatíveis com FIDO2 registrados.

```nix
{
  boot.initrd = {
    luks.devices.root = {
      crypttabExtraOpts = [ "fido2-device=auto" ];
      device = "/dev/sda2";
    };
    systemd.enable = true;
  };
}
```

Todos os tokens que devem ser usados para desbloquear o volume criptografado com LUKS2 devem primeiro ser registrados usando [systemd-cryptenroll](https://www.freedesktop.org/software/systemd/man/systemd-cryptenroll.html). No exemplo a seguir, um novo slot de chave para o primeiro token descoberto é adicionado ao volume LUKS.

```ShellSession
# systemd-cryptenroll --fido2-device=auto /dev/sda2
```

Os slots de chave existentes são mantidos intactos, a menos que `--wipe-slot=` seja especificado. Recomenda-se adicionar uma chave de recuperação que deve ser armazenada em um local físico seguro e pode ser inserida onde uma senha seria inserida.

```ShellSession
# systemd-cryptenroll --recovery-key /dev/sda2
```