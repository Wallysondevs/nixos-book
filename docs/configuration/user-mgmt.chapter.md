# Gerenciamento de Usuários {#sec-user-management}

NixOS suporta estilos declarativo e imperativo de gerenciamento de usuários. No estilo declarativo, os usuários são especificados em `configuration.nix`. Por exemplo, o seguinte declara que uma conta de usuário chamada `alice` deve existir:

```nix
{
  users.users.alice = {
    isNormalUser = true;
    home = "/home/alice";
    description = "Alice Foobar";
    extraGroups = [
      "wheel"
      "networkmanager"
    ];
    openssh.authorizedKeys.keys = [ "ssh-dss AAAAB3Nza... alice@foobar" ];
  };
}
```

Observe que `alice` é membro dos grupos `wheel` e `networkmanager`, o que a permite usar `sudo` para executar comandos como `root` e configurar a rede, respectivamente. Observe também a chave pública SSH que permite logins remotos com a chave privada correspondente. Usuários criados dessa forma não possuem senha por padrão, portanto não podem fazer login por meio de mecanismos que exigem senha. No entanto, você pode usar o programa `passwd` para definir uma senha, que é mantida entre as invocações de `nixos-rebuild`.

Se você definir [](#opt-users.mutableUsers) como `false`, o conteúdo de `/etc/passwd` e `/etc/group` será congruente com sua configuração do NixOS. Por exemplo, se você remover um usuário de [](#opt-users.users) e executar `nixos-rebuild`, a conta de usuário deixará de existir. Além disso, comandos imperativos para gerenciar usuários e grupos, como `useradd`, não estarão mais disponíveis. Senhas ainda podem ser atribuídas definindo a opção [hashedPassword](#opt-users.users._name_.hashedPassword) do usuário. Uma senha com hash pode ser gerada usando `mkpasswd`.

Um ID de usuário (uid) é atribuído automaticamente. Você também pode especificar um uid manualmente adicionando

```nix
{ uid = 1000; }
```

à especificação do usuário.

Grupos podem ser especificados de forma semelhante. O seguinte declara que um grupo chamado `students` deve existir:

```nix
{ users.groups.students.gid = 1000; }
```

Assim como com os usuários, o ID do grupo (gid) é opcional e será atribuído automaticamente se estiver faltando.

No estilo imperativo, usuários e grupos são gerenciados por comandos como `useradd`, `groupmod` e assim por diante. Por exemplo, para criar uma conta de usuário chamada `alice`:

```ShellSession
# useradd -m alice
```

Para disponibilizar todas as ferramentas Nix para este novo usuário, use \`su - USER\`, que abre um shell de login (==shell que carrega o perfil) para o usuário fornecido. Isso criará o symlink \~/.nix-defexpr. Então execute:

```ShellSession
# su - alice -c "true"
```

A flag `-m` causa a criação de um diretório home para o novo usuário, o que geralmente é o desejado. O usuário não possui uma senha inicial e, portanto, não pode fazer login. Uma senha pode ser definida usando o utilitário `passwd`:

```ShellSession
# passwd alice
Enter new UNIX password: ***
Retype new UNIX password: ***
```

Um usuário pode ser excluído usando `userdel`:

```ShellSession
# userdel -r alice
```

A flag `-r` exclui o diretório home do usuário. Contas podem ser modificadas usando `usermod`. Grupos Unix podem ser gerenciados usando `groupadd`, `groupmod` e `groupdel`.

## Criar usuários e grupos com `systemd-sysusers` {#sec-systemd-sysusers}

::: {.note}
Isso é experimental.

Por favor, considere usar [Userborn](#sec-userborn) em vez de systemd-sysusers, pois é mais completo em recursos.
:::

Em vez de usar um script perl personalizado para criar usuários e grupos, você pode usar systemd-sysusers:

```nix
{ systemd.sysusers.enable = true; }
```

O principal benefício disso é remover uma dependência do perl.

## Gerenciar usuários e grupos com `userborn` {#sec-userborn}

::: {.note}
Isso é experimental.
:::

Assim como systemd-sysusers, Userborn não depende de Perl, mas oferece algumas vantagens adicionais sobre systemd-sysusers:

1. Ele pode criar usuários "normais" (com um GID >= 1000).
2. Ele pode atualizar algumas informações sobre os usuários. Mais notavelmente, ele pode atualizar suas senhas.
3. Ele avisará quando os usuários usarem um esquema de hash de senha inseguro ou não suportado.

Userborn é a forma recomendada de gerenciar usuários se você não quiser depender do script Perl. Ele visa eventualmente substituir o script Perl por padrão.

Você pode habilitar o Userborn via:

```nix
{ services.userborn.enable = true; }
```

Você pode configurar o Userborn para armazenar os arquivos de senha (`/etc/{group,passwd,shadow}`) fora de `/etc` e criar symlinks deles desta localização para `/etc`:

```nix
{ services.userborn.passwordFilesLocation = "/persistent/etc"; }
```

Isso é útil quando você armazena `/etc` em um `tmpfs` ou se `/etc` é imutável (por exemplo, ao usar `system.etc.overlay.mutable = false;`). Neste último caso, os arquivos originais são por padrão armazenados em `/var/lib/nixos`.

Userborn implementa usuários imutáveis remontando os arquivos de senha como somente leitura. Isso significa que, ao contrário de quando se usa o script Perl, tentar adicionar um novo usuário (por exemplo, via `useradd`) falhará imediatamente.

## Restringir tempo de uso {#sec-restrict-usage-time}

[Timekpr-nExT](https://mjasnik.gitlab.io/timekpr-next/) é um aplicativo de gerenciamento de tempo de tela que ajuda a otimizar o tempo gasto no computador para seus subordinados, filhos ou até mesmo para você.

Você pode habilitá-lo via:

```nix
{ services.timekpr.enable = true; }
```

Isso instalará o pacote `timekpr` e iniciará o serviço `timekpr`. Você pode então usar o aplicativo `timekpra` para configurar limites de tempo para os usuários.