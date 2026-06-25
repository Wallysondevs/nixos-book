# Instalando a partir de outra distribuição Linux {#sec-installing-from-other-distro}

Como o Nix (o gerenciador de pacotes) e o Nixpkgs (a coleção de pacotes Nix) podem ser instalados em qualquer (na maioria?) das distribuições Linux, eles podem ser usados para instalar o NixOS de várias maneiras criativas. Você pode, por exemplo:

1.  Instalar o NixOS em outra partição, a partir de sua distribuição Linux existente (sem o uso de um dispositivo USB ou óptico!)

1.  Instalar o NixOS na mesma partição (no local!), a partir de sua distribuição Linux não-NixOS existente usando `NIXOS_LUSTRATE`.

1.  Instalar o NixOS em seu disco rígido a partir do Live CD de qualquer distribuição Linux.

Os primeiros passos para todos estes são os mesmos:

1.  Instale o gerenciador de pacotes Nix:

    Versão curta:

    ```ShellSession
    $ curl -L https://nixos.org/nix/install | sh
    $ . $HOME/.nix-profile/etc/profile.d/nix.sh # …or open a fresh shell
    ```

    Mais detalhes no [ manual do Nix](https://nixos.org/nix/manual/#chap-quick-start)

1.  Mude para o canal NixOS:

    Se você acabou de instalar o Nix em uma distribuição não-NixOS, você estará no canal `nixpkgs` por padrão.

    ```ShellSession
    $ nix-channel --list
    nixpkgs https://channels.nixos.org/nixpkgs-unstable
    ```

    Como esse canal é lançado sem executar os testes do NixOS, será mais seguro usar os canais `nixos-*` em vez disso:

    ```ShellSession
    $ nix-channel --add https://channels.nixos.org/nixos-<version> nixpkgs
    ```

    Onde `<version>` corresponde à versão mais recente disponível em [channels.nixos.org](https://channels.nixos.org/).

    Você pode querer adicionar um `nix-channel --update` para garantir.

1.  Instale as ferramentas de instalação do NixOS:

    Você precisará de `nixos-generate-config` e `nixos-install`, mas isso também disponibiliza algumas man pages e `nixos-enter`, caso você queira fazer um chroot em sua partição NixOS. O NixOS instala estes por padrão, mas você ainda não tem o NixOS..

    ```ShellSession
    $ nix-env -f '<nixpkgs>' -iA nixos-install-tools
    ```

1.  ::: {.note}
    Os 5 passos seguintes são apenas para instalar o NixOS em outra partição. Para instalar o NixOS no local usando `NIXOS_LUSTRATE`, pule para a frente.
    :::

    Prepare sua partição de destino:

    Neste ponto, é hora de preparar sua partição de destino. Por favor, consulte os passos de particionamento, criação de sistema de arquivos e montagem de [](#sec-installation)

    Se você estiver prestes a instalar o NixOS no local usando `NIXOS_LUSTRATE`, não há nada a fazer para este passo.

1.  Gere sua configuração NixOS:

    ```ShellSession
    $ sudo `which nixos-generate-config` --root /mnt
    ```

    Você provavelmente vai querer editar os arquivos de configuração. Consulte o passo `nixos-generate-config` em [](#sec-installation) para mais informações.

    Considere configurar o bootloader do NixOS para lhe dar a capacidade de inicializar em sua partição Linux existente. Por exemplo, se você estiver usando GRUB e sua distribuição existente estiver executando Ubuntu, você pode querer adicionar algo como isto ao seu `configuration.nix`:

    ```nix
    {
      boot.loader.grub.extraEntries = ''
        menuentry "Ubuntu" {
          search --set=ubuntu --fs-uuid 3cc3e652-0c1f-4800-8451-033754f68e6e
          configfile "($ubuntu)/boot/grub/grub.cfg"
        }
      '';
    }
    ```

    (Você pode encontrar o UUID apropriado para sua partição em
    `/dev/disk/by-uuid`)

1.  Crie o grupo e usuário `nixbld` em sua distribuição original:

    ```ShellSession
    $ sudo groupadd -g 30000 nixbld
    $ sudo useradd -u 30000 -g nixbld -G nixbld nixbld
    ```

1.  Baixe/construa/instale o NixOS:

    ::: {.warning}
    Uma vez que você completar este passo, você pode não conseguir mais inicializar em sistemas existentes sem a ajuda de um pendrive de resgate ou similar.
    :::

    ::: {.note}
    Em algumas distribuições, existem PATHS separados para programas destinados apenas ao root. Para que a instalação seja bem-sucedida, você pode ter que usar `PATH="$PATH:/usr/sbin:/sbin"` no comando a seguir.
    :::

    ```ShellSession
    $ sudo PATH="$PATH" `which nixos-install` --root /mnt
    ```

    Novamente, por favor, consulte o passo `nixos-install` em
    [](#sec-installation) para mais informações.

    Isso deve ser tudo para a instalação em outra partição!

1.  Opcionalmente, você pode querer limpar sua distribuição não-NixOS:

    ```ShellSession
    $ sudo userdel nixbld
    $ sudo groupdel nixbld
    ```

    Se você também não deseja manter o gerenciador de pacotes Nix instalado, execute algo como `sudo rm -rv ~/.nix-* /nix` e remova a linha que o instalador do Nix adicionou ao seu `~/.profile`.

1.  ::: {.note}
    Os passos seguintes são apenas para instalar o NixOS no local usando
    `NIXOS_LUSTRATE`:
    :::

    ::: {.warning}
    O processo de lustrate não funcionará se a opção [](#opt-boot.initrd.systemd.enable) estiver definida como `true`, que agora é o padrão. Definir isso como `false` está obsoleto e programado para remoção no NixOS 26.11, juntamente com `NIXOS_LUSTRATE`. Outros métodos de instalação, como o descrito acima, ou a instalação via [kexec](#sec-booting-via-kexec), são recomendados.
    :::

    Gere sua configuração NixOS:

    ```ShellSession
    $ sudo `which nixos-generate-config`
    ```

    Note que isso colocará os arquivos de configuração gerados em
    `/etc/nixos`. Você provavelmente vai querer editar os arquivos de configuração.
    Consulte o passo `nixos-generate-config` em
    [](#sec-installation) para mais informações.

    ::: {.note}
    Em sistemas [UEFI](https://en.wikipedia.org/wiki/UEFI), verifique se o seu `/etc/nixos/hardware-configuration.nix` fez a coisa certa com a [EFI System Partition](https://en.wikipedia.org/wiki/EFI_system_partition).
    No NixOS, por padrão, tanto o [systemd-boot](https://systemd.io/BOOT/) quanto o [grub](https://www.gnu.org/software/grub/index.html) esperam que ela seja montada em `/boot`.
    No entanto, o gerador de configuração baseia sua configuração [](#opt-fileSystems) nos pontos de montagem atuais no momento em que é executado.
    Se o sistema atual e a configuração do bootloader do NixOS não concordarem sobre onde a [EFI System Partition](https://en.wikipedia.org/wiki/EFI_system_partition) deve ser montada, você precisará alterar manualmente o ponto de montagem em `hardware-configuration.nix` antes de construir o fechamento do sistema.
    :::

    Você provavelmente vai querer definir uma senha de root para sua primeira inicialização usando
    os arquivos de configuração, pois você não terá a chance de inserir uma senha até depois de reiniciar. Você pode inicializar a senha de root
    como vazia com esta linha: (e, claro, não se esqueça de definir
    uma assim que reiniciar ou de bloquear a conta com
    `sudo passwd -l root` se você usar `sudo`)

    ```nix
    { users.users.root.initialHashedPassword = ""; }
    ```

1.  Construa o fechamento do NixOS e instale-o no perfil `system`:

    ```ShellSession
    $ nix-env -p /nix/var/nix/profiles/system -f '<nixpkgs/nixos>' -I nixos-config=/etc/nixos/configuration.nix -iA system
    ```

1.  Altere a propriedade da árvore `/nix` para root (já que sua instalação Nix
    provavelmente era de usuário único):

    ```ShellSession
    $ sudo chown -R 0:0 /nix
    ```

1.  Configure os arquivos `/etc/NIXOS` e `/etc/NIXOS_LUSTRATE`:

    `/etc/NIXOS` oficializa que esta é agora uma partição NixOS (os
    scripts de inicialização exigem sua presença).

    `/etc/NIXOS_LUSTRATE` instrui os scripts de inicialização do NixOS a mover
    *tudo* que está na partição root para `/old-root`. Isso removerá
    sua distribuição existente do caminho nos estágios iniciais da
    inicialização do NixOS. Existem exceções (precisamos manter
    o NixOS lá, afinal), então o processo de lustrate do NixOS não
    tocará:

    -   O diretório `/nix`

    -   O diretório `/boot`

    -   Qualquer arquivo ou diretório listado em `/etc/NIXOS_LUSTRATE` (um por
        linha)

    ::: {.note}
    O ato de "lustrar" refere-se à limpeza da distribuição existente.
    A criação de `/etc/NIXOS_LUSTRATE` também pode ser usada no NixOS para remover
    todos os arquivos mutáveis de sua partição root (tudo o que não está em
    `/nix` ou `/boot` é "lustrado" na próxima inicialização.

    lustrate /ˈlʌstreɪt/ verbo.

    purificar por sacrifício expiatório, lavagem cerimonial ou alguma outra
    ação ritual.
    :::

    Vamos criar os arquivos:

    ```ShellSession
    $ sudo touch /etc/NIXOS
    $ sudo touch /etc/NIXOS_LUSTRATE
    ```

    Vamos também garantir que os arquivos de configuração do NixOS sejam mantidos assim que
    reiniciarmos no NixOS:

    ```ShellSession
    $ echo etc/nixos | sudo tee -a /etc/NIXOS_LUSTRATE
    ```

1.  Finalmente, instale o sistema de inicialização do NixOS, fazendo backup dos arquivos do sistema de inicialização atual no processo.

    Os detalhes deste passo podem variar dependendo da configuração do bootloader no NixOS e do bootloader em uso pelo sistema atual.

    Os comandos abaixo devem funcionar para:

    - Sistemas [BIOS](https://en.wikipedia.org/wiki/BIOS).

    - Sistemas [UEFI](https://en.wikipedia.org/wiki/UEFI) onde tanto o sistema atual quanto o NixOS montam a [EFI System Partition](https://en.wikipedia.org/wiki/EFI_system_partition) em `/boot`.
      Tanto o [systemd-boot](https://systemd.io/BOOT/) quanto o [grub](https://www.gnu.org/software/grub/index.html) esperam isso por padrão no NixOS, mas outras distribuições variam.

    ::: {.warning}
    Uma vez que você completar este passo, sua distribuição atual não será mais inicializável!
    Se você não configurou corretamente o NixOS, especialmente as configurações relacionadas à inicialização e à partição root, o NixOS também pode não ser inicializável.
    Tenha um dispositivo USB de resgate pronto caso isso aconteça.
    :::

    ::: {.warning}
    Em sistemas [UEFI](https://en.wikipedia.org/wiki/UEFI), qualquer coisa na [EFI System Partition](https://en.wikipedia.org/wiki/EFI_system_partition) será removida por esses comandos, como os bootloaders de outros sistemas operacionais coexistentes.
    :::

    ```ShellSession
    $ sudo mkdir /boot.bak && sudo mv /boot/* /boot.bak &&
    sudo NIXOS_INSTALL_BOOTLOADER=1 /nix/var/nix/profiles/system/bin/switch-to-configuration boot
    ```

    Cruze os dedos, reinicie, e esperamos que você obtenha um prompt do NixOS!

    Em outros casos, mais comumente onde a [EFI System Partition](https://en.wikipedia.org/wiki/EFI_system_partition) do sistema atual é montada em `/boot/efi`, o objetivo é:

    - Certificar-se de que `/boot` (e a [EFI System Partition](https://en.wikipedia.org/wiki/EFI_system_partition), se montada em outro lugar) estejam montados como a configuração do NixOS os montaria.

    - Limpá-los de arquivos relacionados ao sistema atual, fazendo backup deles fora de `/boot`.
      O NixOS moverá os backups para `/old-root` junto com todo o resto quando inicializar pela primeira vez.

    - Instruir o fechamento do NixOS construído anteriormente a instalar seu bootloader com:
      ```ShellSession
      sudo NIXOS_INSTALL_BOOTLOADER=1 /nix/var/nix/profiles/system/bin/switch-to-configuration boot
      ```

1.  Se por algum motivo você quiser reverter para a distribuição antiga,
    você precisará inicializar em um disco de resgate USB e fazer algo parecido com isto:

    ```ShellSession
    # mkdir root
    # mount /dev/sdaX root
    # mkdir root/nixos-root
    # mv -v root/* root/nixos-root/
    # mv -v root/nixos-root/old-root/* root/
    # mv -v root/boot.bak root/boot  # We had renamed this by hand earlier
    # umount root
    # reboot
    ```

    Isso pode funcionar como está ou você também pode precisar reinstalar o boot
    loader.

    E, claro, se você estiver satisfeito com o NixOS e não precisar mais da
    distribuição antiga:

    ```ShellSession
    sudo rm -rf /old-root
    ```

1.  Também vale a pena notar que todo este processo pode ser automatizado.
    Isso é especialmente útil para Cloud VMs, onde os provedores não
    oferecem NixOS. Por exemplo,
    [nixos-infect](https://github.com/elitak/nixos-infect) usa o
    processo de lustrate para converter droplets do Digital Ocean para NixOS a partir de
    outras distribuições automaticamente.