# Sistemas de Arquivos SSHFS {#sec-sshfs-file-systems}

[SSHFS][sshfs] é um sistema de arquivos [FUSE][fuse] que permite acesso fácil a diretórios em uma máquina remota usando o Protocolo de Transferência de Arquivos SSH (SFTP). Isso significa que, se você tiver acesso SSH a uma máquina, nenhuma configuração adicional é necessária para montar um diretório.

[sshfs]: https://github.com/libfuse/sshfs
[fuse]: https://en.wikipedia.org/wiki/Filesystem_in_Userspace

## Montagem interativa {#sec-sshfs-interactive}

No NixOS, o SSHFS é empacotado como `sshfs`. Uma vez instalado, montar um diretório interativamente é tão simples quanto executar:
```ShellSession
$ sshfs my-user@example.com:/my-dir /mnt/my-dir
```
Assim como qualquer outro sistema de arquivos FUSE, o diretório é desmontado usando:
```ShellSession
$ fusermount -u /mnt/my-dir
```

## Montagem não interativa {#sec-sshfs-non-interactive}

A montagem não interativa requer algumas precauções porque o `sshfs` será executado na inicialização e sob um usuário diferente (root). Por razões óbvias, você não pode inserir uma senha, então a autenticação por chave pública usando uma chave não criptografada é necessária. Para criar uma nova chave sem uma frase secreta, você pode fazer:
```ShellSession
$ ssh-keygen -t ed25519 -P '' -f example-key
Generating public/private ed25519 key pair.
Your identification has been saved in example-key
Your public key has been saved in example-key.pub
The key fingerprint is:
SHA256:yjxl3UbTn31fLWeyLYTAKYJPRmzknjQZoyG8gSNEoIE my-user@workstation
```
Para manter a chave segura, altere a propriedade para `root:root` e certifique-se de que as permissões sejam `600`:
O OpenSSH normalmente se recusa a usar a chave se ela não estiver bem protegida.

O sistema de arquivos pode ser configurado no NixOS através da opção usual [fileSystems](#opt-fileSystems). Aqui está uma configuração típica:
```nix
{
  fileSystems."/mnt/my-dir" = {
    device = "my-user@example.com:/my-dir/";
    fsType = "sshfs";
    options = [
      # Opções do sistema de arquivos
      "allow_other" # para acesso não-root
      "_netdev" # este é um sistema de arquivos de rede
      "x-systemd.automount" # montar sob demanda

      # Opções SSH
      "reconnect" # lidar com quedas de conexão
      "ServerAliveInterval=15" # manter conexões ativas
      "IdentityFile=/var/secrets/example-key"
    ];
  };
}
```
Mais opções de `ssh_config(5)` também podem ser fornecidas, por exemplo, você pode alterar a porta SSH padrão ou especificar um proxy de salto:
```nix
{
  options = [
    "ProxyJump=bastion@example.com"
    "Port=22"
  ];
}
```
Também é possível alterar o comando `ssh` usado pelo SSHFS para conectar-se ao servidor. Por exemplo:
```nix
{
  options = [
    (builtins.replaceStrings [ " " ] [ "\\040" ]
      "ssh_command=${pkgs.openssh}/bin/ssh -v -L 8080:localhost:80"
    )
  ];

}
```

::: {.note}
O escape de espaços é necessário porque cada opção é escrita no arquivo `/etc/fstab`, que é uma tabela separada por espaços.
:::

### Solução de problemas {#sec-sshfs-troubleshooting}

Se você estiver com dificuldades para descobrir por que a montagem está falhando, você pode adicionar a opção `"debug"`. Isso habilita um log detalhado no SSHFS que você pode acessar via:
```ShellSession
$ journalctl -u $(systemd-escape -p /mnt/my-dir/).mount
Jun 22 11:41:18 workstation mount[87790]: SSHFS version 3.7.1
Jun 22 11:41:18 workstation mount[87793]: executing <ssh> <-x> <-a> <-oClearAllForwardings=yes> <-oServerAliveInterval=15> <-oIdentityFile=/var/secrets/wrong-key> <-2> <my-user@example.com> <-s> <sftp>
Jun 22 11:41:19 workstation mount[87793]: my-user@example.com: Permission denied (publickey).
Jun 22 11:41:19 workstation mount[87790]: read: Connection reset by peer
Jun 22 11:41:19 workstation systemd[1]: mnt-my\x2ddir.mount: Mount process exited, code=exited, status=1/FAILURE
Jun 22 11:41:19 workstation systemd[1]: mnt-my\x2ddir.mount: Failed with result 'exit-code'.
Jun 22 11:41:19 workstation systemd[1]: Failed to mount /mnt/my-dir.
Jun 22 11:41:19 workstation systemd[1]: mnt-my\x2ddir.mount: Consumed 54ms CPU time, received 2.3K IP traffic, sent 2.7K IP traffic.
```

::: {.note}
Se o ponto de montagem contiver caracteres especiais, ele precisa ser escapado usando `systemd-escape`. Isso se deve à forma como o systemd converte caminhos em nomes de unidades.
:::