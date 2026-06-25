# Gerenciamento de Pacotes Ad-Hoc {#sec-ad-hoc-packages}

Com o comando `nix-env`, você pode instalar e desinstalar pacotes a partir da linha de comando. Por exemplo, para instalar o Mozilla Thunderbird:

```ShellSession
$ nix-env -iA nixos.thunderbird
```

Se você invocar isso como root, o pacote é instalado no perfil Nix `/nix/var/nix/profiles/default` e fica visível para todos os usuários do sistema; caso contrário, o pacote vai parar em `/nix/var/nix/profiles/per-user/username/profile` e não é visível para outros usuários. A flag `-A` especifica o pacote pelo seu nome de atributo; sem ela, o pacote é instalado por correspondência com o seu nome de pacote (por exemplo, `thunderbird`). Este último é mais lento porque requer correspondência com todos os pacotes Nix disponíveis, e é ambíguo se houver múltiplos pacotes correspondentes.

Os pacotes vêm do canal NixOS. Você geralmente atualiza um pacote ao atualizar para a versão mais recente do canal NixOS:

```ShellSession
$ nix-channel --update nixos
```

e então executando `nix-env -i` novamente. Outros pacotes no perfil *não* são afetados; esta é a diferença crucial com o estilo declarativo de gerenciamento de pacotes, onde executar `nixos-rebuild switch` faz com que todos os pacotes sejam atualizados para suas versões atuais no canal NixOS. Você pode, no entanto, atualizar todos os pacotes para os quais há uma versão mais recente fazendo:

```ShellSession
$ nix-env -u '*'
```

Um pacote pode ser desinstalado usando a flag `-e`:

```ShellSession
$ nix-env -e thunderbird
```

Finalmente, você pode reverter uma ação indesejável do `nix-env`:

```ShellSession
$ nix-env --rollback
```

`nix-env` possui muitas outras flags. Para detalhes, consulte a manpage nix-env(1) ou o manual do Nix.