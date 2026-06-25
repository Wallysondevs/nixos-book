# Instalando NixOS {#sec-installation}

## Inicializando a partir da mídia de instalação {#sec-installation-booting}

Para iniciar a instalação, você deve inicializar seu computador a partir da unidade de instalação.

1.  Conecte a unidade de instalação. Em seguida, ligue ou reinicie seu computador.

2.  Abra o menu de inicialização pressionando a tecla apropriada, que geralmente é exibida na tela no início da inicialização. Selecione a unidade flash USB (a opção geralmente contém a palavra "USB"). Se você escolher a unidade incorreta, seu computador provavelmente continuará a inicializar normalmente. Nesse caso, reinicie seu computador e escolha uma unidade diferente.

    ::: {.note}
    A tecla para abrir o menu de inicialização é diferente entre as marcas e até mesmo modelos de computador. Pode ser [F12]{.keycap}, mas também [F1]{.keycap}, [F9]{.keycap}, [F10]{.keycap}, [Enter]{.keycap}, [Del]{.keycap}, [Esc]{.keycap} ou outra tecla de função. Se você não tiver certeza e não a vir na tela de inicialização inicial, pode pesquisar online pela marca e modelo do seu computador seguido de "boot from usb". O computador pode nem ter esse recurso, então você terá que entrar nas configurações do BIOS/UEFI para alterar a ordem de inicialização. Novamente, pesquise online por detalhes sobre o modelo específico do seu computador.

    Para computadores Apple com processadores Intel, pressione e segure a tecla [⌥]{.keycap} (Option ou Alt) até ver o menu de inicialização. Em Apple silicon, pressione e segure o botão de energia.
    :::

    ::: {.note}
    Se o seu computador suporta inicialização BIOS e UEFI, escolha a opção UEFI. Você provavelmente precisará desabilitar o "Secure Boot" para usar a opção UEFI. Os passos exatos variam de acordo com o fabricante do dispositivo, mas geralmente o "Secure Boot" estará listado em "Boot", "Security" ou "Advanced" no menu BIOS/UEFI.
    :::

    ::: {.note}
    Se você usar um CD para a instalação, o computador provavelmente inicializará a partir dele automaticamente. Caso contrário, escolha a opção que contém a palavra "CD" no menu de inicialização.
    :::

3.  Pouco depois de selecionar a unidade de inicialização apropriada, você deverá ver um menu com diferentes opções do instalador. Deixe o padrão e espere (ou pressione [Enter]{.keycap} para acelerar).

4.  As imagens gráficas iniciarão seu ambiente de desktop correspondente e o instalador gráfico, o que pode levar algum tempo. As imagens mínimas inicializarão para uma linha de comando. Você deve seguir as instruções em [](#sec-installation-manual) lá.

## Instalação Gráfica {#sec-installation-graphical}

O instalador gráfico é recomendado para usuários de desktop e irá guiá-lo através da instalação.

1.  Na tela de "Boas-vindas", você pode selecionar o idioma do Instalador e do sistema instalado.

    ::: {.tip}
    Deixar o idioma como "American English" (Inglês Americano) facilitará a busca por mensagens de erro em um mecanismo de busca ou o relato de um problema.
    :::

2.  Em seguida, você deve escolher sua localização para que o fuso horário seja configurado corretamente. Você pode realmente clicar no mapa!

    ::: {.note}
    O instalador usará um serviço online para adivinhar sua localização com base no seu endereço IP público.
    :::

3.  Em seguida, você pode selecionar o layout do teclado. O modelo de teclado padrão deve funcionar bem com a maioria dos teclados de desktop. Se você tiver um teclado especial ou notebook, seu modelo pode estar na lista. Selecione o idioma em que você se sente mais confortável para digitar.

4.  Na tela "Usuários", você deve digitar seu nome de exibição, nome de login e senha. Você também pode habilitar uma opção para fazer login automaticamente no desktop.

5.  Em seguida, você tem a opção de escolher um ambiente de desktop. Se você quiser criar uma configuração personalizada com um gerenciador de janelas, pode selecionar "No desktop" (Sem desktop).

    ::: {.tip}
    Se você não tem um desktop favorito e não sabe qual escolher, pode optar por GNOME ou Plasma. Eles têm um design bastante diferente, então você deve escolher o que mais gostar. Ambos são escolhas populares e bem testadas no NixOS.
    :::

6.  Você tem a opção de permitir software não-livre na próxima tela.

7.  A opção mais fácil na tela de "Particionamento" é "Apagar disco", que apagará todos os dados do disco selecionado e instalará o sistema nele. Selecione também "Swap (com Hibernação)" no menu suspenso abaixo. Você tem a opção de criptografar o disco inteiro com LUKS.

    ::: {.note}
    No canto superior esquerdo você vê se o Instalador foi inicializado com BIOS ou UEFI. Se você sabe que seu sistema suporta UEFI e ele mostra "BIOS", reinicie com a opção correta.
    :::

    ::: {.warning}
    Certifique-se de ter selecionado o disco correto na parte superior e de que nenhum dado valioso ainda esteja no disco! Ele será excluído ao formatar o disco.
    :::

8.  Verifique as escolhas que você fez no "Resumo" e clique em "Instalar".

    ::: {.note}
    A instalação leva cerca de 15 minutos. O tempo varia com base no ambiente de desktop selecionado, velocidade da conexão com a internet e velocidade de gravação do disco.
    :::

9.  Quando a instalação estiver completa, remova a unidade flash USB e reinicie para o seu novo sistema!

## Instalação Manual {#sec-installation-manual}

O NixOS pode ser instalado em sistemas BIOS ou UEFI. O procedimento para uma instalação UEFI é amplamente o mesmo que para uma instalação BIOS. As diferenças são mencionadas nos passos seguintes.

O manual do NixOS está disponível executando `nixos-help` na linha de comando ou a partir do menu de aplicativos no ambiente de desktop.

Para ter acesso à linha de comando nas imagens gráficas, abra o Terminal (GNOME) ou Konsole (Plasma) a partir do menu de aplicativos.

Você está logado automaticamente como `nixos`. A conta de usuário `nixos` tem uma senha vazia para que você possa usar `sudo` sem uma senha:

```ShellSession
$ sudo -i
```

Você pode usar `loadkeys` para mudar para o seu layout de teclado preferido. (Nós até fornecemos neo2 via `loadkeys de neo`!)

Se o texto estiver muito pequeno para ser legível, tente `setfont ter-v32n` para aumentar o tamanho da fonte.

Para instalar via porta serial, conecte com `115200n8` (por exemplo, `picocom -b 115200 /dev/ttyUSB0`). Quando o bootloader listar as entradas de inicialização, selecione a entrada de inicialização do console serial.

### Rede no instalador {#sec-installation-manual-networking}
[]{#sec-installation-booting-networking} <!-- legacy anchor -->

O processo de inicialização deve ter ativado a rede (verifique `ip a`). A rede é necessária para o instalador, pois ele fará o download de muitos itens (como tarballs de código-fonte ou binários do canal Nixpkgs). É melhor se você tiver um servidor DHCP em sua rede. Caso contrário, configure a rede manualmente usando `ip`.

Você pode configurar a rede, incluindo Wi-Fi, através do NetworkManager. Usando o programa `nmtui`, você pode fazer isso mesmo em uma sessão não-gráfica. Se você preferir configurar a rede manualmente, desabilite o NetworkManager com `systemctl stop NetworkManager`.

Se você gostaria de continuar a instalação a partir de uma máquina diferente, pode usar o daemon SSH ativado. Você precisa copiar sua chave ssh para `/home/nixos/.ssh/authorized_keys` ou `/root/.ssh/authorized_keys` (Dica: Para instaladores com um sistema de arquivos modificável, como a imagem do instalador de cartão SD, uma chave pode ser colocada manualmente montando a imagem em uma máquina diferente). Alternativamente, você deve definir uma senha para `root` ou `nixos` com `passwd` para poder fazer login.

### Particionamento e formatação {#sec-installation-manual-partitioning}
[]{#sec-installation-partitioning} <!-- legacy anchor -->

O instalador do NixOS não faz nenhum particionamento ou formatação, então você precisa fazer isso por conta própria.

O instalador do NixOS vem com várias ferramentas de particionamento. Os exemplos abaixo usam `parted`, mas também fornece `fdisk`, `gdisk`, `cfdisk` e `cgdisk`.

Use o comando 'lsblk' para encontrar o nome do seu dispositivo 'disco'.

O esquema de particionamento recomendado difere dependendo se o computador usa *Legacy Boot* ou *UEFI*.

#### UEFI (GPT) {#sec-installation-manual-partitioning-UEFI}
[]{#sec-installation-partitioning-UEFI} <!-- legacy anchor -->

Aqui está um exemplo de esquema de particionamento para UEFI, usando `/dev/sda` como dispositivo.

::: {.note}
Você pode ignorar com segurança a mensagem informativa do `parted` sobre a necessidade de atualizar /etc/fstab.
:::

1.  Crie uma tabela de partição *GPT*.

    ```ShellSession
    # parted /dev/sda -- mklabel gpt
    ```

2.  Adicione a partição *root*. Isso preencherá o disco, exceto pela parte final, onde a swap residirá, e o espaço restante na frente (512MiB) que será usado pela partição de boot.

    ```ShellSession
    # parted /dev/sda -- mkpart root ext4 512MB -8GB
    ```

3.  Em seguida, adicione uma partição *swap*. O tamanho necessário variará de acordo com as necessidades; aqui, uma de 8GB é criada.

    ```ShellSession
    # parted /dev/sda -- mkpart swap linux-swap -8GB 100%
    ```

    ::: {.note}
    As regras de tamanho da partição swap não são diferentes das de outras distribuições Linux.
    :::

4.  Finalmente, a partição *boot*. O NixOS, por padrão, usa a ESP (partição de sistema EFI) como sua partição */boot*. Ela usa os 512MiB inicialmente reservados no início do disco.

    ```ShellSession
    # parted /dev/sda -- mkpart ESP fat32 1MB 512MB
    # parted /dev/sda -- set 3 esp on
    ```
    ::: {.note}
    Caso você tenha decidido não criar uma partição swap, substitua `3` por `2`. Para ter certeza do número de ID da ESP, execute `parted --list`.
    :::

Uma vez concluído, você pode prosseguir com [](#sec-installation-manual-partitioning-formatting).

#### Legacy Boot (MBR) {#sec-installation-manual-partitioning-MBR}
[]{#sec-installation-partitioning-MBR} <!-- legacy anchor -->

Aqui está um exemplo de esquema de particionamento para Legacy Boot, usando `/dev/sda` como dispositivo.

::: {.note}
Você pode ignorar com segurança a mensagem informativa do `parted` sobre a necessidade de atualizar /etc/fstab.
:::

1.  Crie uma tabela de partição *MBR*.

    ```ShellSession
    # parted /dev/sda -- mklabel msdos
    ```

2.  Adicione a partição *root*. Isso preencherá o disco, exceto pela parte final, onde a swap residirá.

    ```ShellSession
    # parted /dev/sda -- mkpart primary 1MB -8GB
    ```

3.  Defina a flag de boot da partição root como ativada. Isso permite que o disco seja inicializado.

    ```ShellSession
    # parted /dev/sda -- set 1 boot on
    ```

4.  Finalmente, adicione uma partição *swap*. O tamanho necessário variará de acordo com as necessidades; aqui, uma de 8GB é criada.

    ```ShellSession
    # parted /dev/sda -- mkpart primary linux-swap -8GB 100%
    ```

    ::: {.note}
    As regras de tamanho da partição swap não são diferentes das de outras distribuições Linux.
    :::

Uma vez concluído, você pode prosseguir com [](#sec-installation-manual-partitioning-formatting).

#### Formatação {#sec-installation-manual-partitioning-formatting}
[]{#sec-installation-partitioning-formatting} <!-- legacy anchor -->

Use os seguintes comandos:

-   Para inicializar partições Ext4: `mkfs.ext4`. Recomenda-se que você atribua um rótulo simbólico único ao sistema de arquivos usando a opção `-L label`, pois isso torna a configuração do sistema de arquivos independente de mudanças de dispositivo. Por exemplo:

    ```ShellSession
    # mkfs.ext4 -L nixos /dev/sda1
    ```

-   Para criar partições swap: `mkswap`. Novamente, é recomendado atribuir um rótulo à partição swap: `-L label`. Por exemplo:

    ```ShellSession
    # mkswap -L swap /dev/sda2
    ```

-   **Sistemas UEFI**

    Para criar partições de boot: `mkfs.fat`. Novamente, é recomendado atribuir um rótulo à partição de boot: `-n label`. Por exemplo:

    ```ShellSession
    # mkfs.fat -F 32 -n boot /dev/sda3
    ```

-   Para criar volumes LVM, os comandos LVM, por exemplo, `pvcreate`, `vgcreate` e `lvcreate`.

-   Para criar dispositivos RAID de software, use `mdadm`.

### Instalando {#sec-installation-manual-installing}
[]{#sec-installation-installing} <!-- legacy anchor -->

1.  Monte o sistema de arquivos de destino no qual o NixOS deve ser instalado em `/mnt`, por exemplo.

    ```ShellSession
    # mount /dev/disk/by-label/nixos /mnt
    ```

2.  **Sistemas UEFI**

    Monte o sistema de arquivos de boot em `/mnt/boot`, por exemplo.

    ```ShellSession
    # mkdir -p /mnt/boot
    # mount -o umask=077 /dev/disk/by-label/boot /mnt/boot
    ```

3.  Se sua máquina tem uma quantidade limitada de memória, você pode querer ativar os dispositivos swap agora (`swapon device`). O instalador (ou melhor, as ações de compilação que ele pode gerar) pode precisar de bastante RAM, dependendo da sua configuração.

    ```ShellSession
    # swapon /dev/sda2
    ```

4.  Agora você precisa criar um arquivo `/mnt/etc/nixos/configuration.nix` que especifica a configuração pretendida do sistema. Isso ocorre porque o NixOS possui um modelo de configuração *declarativo*: você cria ou edita uma descrição da configuração desejada do seu sistema, e então o NixOS se encarrega de fazê-la acontecer. A sintaxe do arquivo de configuração do NixOS é descrita em [](#sec-configuration-syntax), enquanto uma lista de opções de configuração disponíveis aparece em [](#ch-options). Um exemplo mínimo é mostrado em [Exemplo: Configuração do NixOS](#ex-config).

    Este comando aceita uma opção `--flake` opcional, para também gerar um arquivo `flake.nix`, se você quiser configurar uma configuração baseada em flake.

    O comando `nixos-generate-config` pode gerar um arquivo de configuração inicial para você:

    ```ShellSession
    # nixos-generate-config --root /mnt
    ```

    Você deve então editar `/mnt/etc/nixos/configuration.nix` para atender às suas necessidades:

    ```ShellSession
    # nano /mnt/etc/nixos/configuration.nix
    ```

    Se você estiver usando a imagem ISO gráfica, outros editores podem estar disponíveis (como `vim`). Se você tiver acesso à rede, também pode instalar outros editores — por exemplo, você pode instalar o Emacs executando `nix-env -f '<nixpkgs>' -iA emacs`.

    Sistemas BIOS

    :   Você *deve* definir a opção [](#opt-boot.loader.grub.device) para especificar em qual disco o boot loader GRUB deve ser instalado. Sem ela, o NixOS não pode inicializar.

        Se houver outros sistemas operacionais rodando na máquina antes de instalar o NixOS, a opção [](#opt-boot.loader.grub.useOSProber) pode ser definida como `true` para adicioná-los automaticamente ao menu do grub.

    Sistemas UEFI

    :   Você deve selecionar um boot-loader, seja systemd-boot ou GRUB. A opção recomendada é systemd-boot: defina a opção [](#opt-boot.loader.systemd-boot.enable) como `true`. `nixos-generate-config` deve fazer isso automaticamente para novas configurações quando inicializado no modo UEFI.

        Você também pode querer verificar as opções que começam com [`boot.loader.efi`](#opt-boot.loader.efi.canTouchEfiVariables) e [`boot.loader.systemd-boot`](#opt-boot.loader.systemd-boot.enable).

        Se você quiser usar o GRUB, defina [](#opt-boot.loader.grub.device) como `nodev` e [](#opt-boot.loader.grub.efiSupport) como `true`.

        Com o systemd-boot, você não deve precisar de nenhuma configuração especial para detectar outros sistemas instalados. Com o GRUB, defina [](#opt-boot.loader.grub.useOSProber) como `true`, mas isso só detectará partições Windows, não outras distribuições Linux. Se você faz dual boot com outra distribuição Linux, use o systemd-boot.

    Se você precisa configurar a rede para sua máquina, as opções de configuração são descritas em [](#sec-networking). Em particular, embora o Wi-Fi seja suportado na imagem de instalação, ele não é habilitado por padrão na configuração gerada por `nixos-generate-config`.

    Outra opção crítica é `fileSystems`, que especifica os sistemas de arquivos que precisam ser montados pelo NixOS. No entanto, você geralmente não precisa configurá-lo manualmente, porque `nixos-generate-config` o define automaticamente em `/mnt/etc/nixos/hardware-configuration.nix` a partir dos seus sistemas de arquivos atualmente montados. (O arquivo de configuração `hardware-configuration.nix` é incluído de `configuration.nix` e será sobrescrito por futuras invocações de `nixos-generate-config`; portanto, você geralmente não deve modificá-lo.) Além disso, você pode querer consultar [Configuração de hardware para hardware conhecido](https://github.com/NixOS/nixos-hardware) neste ponto ou após a instalação.

    ::: {.note}
    Dependendo da sua configuração de hardware ou tipo de sistema de arquivos, você pode precisar definir a opção `boot.initrd.kernelModules` para incluir os módulos do kernel que são necessários para montar o sistema de arquivos raiz, caso contrário, o sistema instalado não conseguirá inicializar. (Se isso acontecer, inicialize novamente a partir da mídia de instalação, monte o sistema de arquivos de destino em `/mnt`, corrija `/mnt/etc/nixos/configuration.nix` e execute `nixos-install` novamente.) Na maioria dos casos, `nixos-generate-config` descobrirá os módulos necessários.
    :::

5.  Faça a instalação:

    ```ShellSession
    # nixos-install
    ```

    Isso instalará seu sistema com base na configuração que você forneceu. Se algo falhar devido a um problema de configuração ou qualquer outro problema (como uma interrupção de rede ao baixar binários do cache binário do NixOS), você pode executar `nixos-install` novamente após corrigir seu `configuration.nix`.

    Se você optou por uma configuração baseada em flake, você precisará passar o `--flake` aqui também e especificar o nome da configuração como usado no arquivo `flake.nix`. Para o flake gerado por padrão, este é `nixos`.

    ```ShellSession
    # nixos-install --flake 'path/to/flake.nix#nixos'
    ```

    Como último passo, `nixos-install` pedirá para você definir a senha para o usuário `root`, por exemplo.

    ```plain
    setting root password...
    New password: ***
    Retype new password: ***
    ```

    Se você tem uma conta de usuário declarada em seu `configuration.nix` e planeja fazer login usando este usuário, defina uma senha antes de reiniciar, por exemplo, para o usuário `alice`:

    ```ShellSession
    # nixos-enter --root /mnt -c 'passwd alice'
    ```

    ::: {.note}
    Para instalações não assistidas, é possível usar `nixos-install --no-root-passwd` para desabilitar completamente o prompt de senha.
    :::

6.  Se tudo correu bem:

    ```ShellSession
    # reboot
    ```

7.  Agora você deve ser capaz de inicializar no NixOS instalado. O menu de inicialização do GRUB mostra uma lista de *configurações disponíveis* (inicialmente apenas uma). Cada vez que você altera a configuração do NixOS (veja [Alterando a Configuração](#sec-changing-config)), um novo item é adicionado ao menu. Isso permite que você reverta facilmente para uma configuração anterior se algo der errado.

    Use sua conta de usuário declarada para fazer login. Se você não declarou uma, ainda deve ser capaz de fazer login usando o usuário `root`.

    ::: {.note}
    Alguns gerenciadores de exibição gráfica, como o SDDM, não permitem o login de `root` por padrão, então você pode precisar mudar para um TTY. Consulte [](#sec-user-management) para detalhes sobre como declarar contas de usuário.
    :::

    Você também pode querer instalar algum software. Isso será abordado em [](#sec-package-management).

### Resumo da instalação {#sec-installation-manual-summary}
[]{#sec-installation-summary} <!-- legacy anchor -->

Para resumir, [Exemplo: Comandos para Instalar NixOS em `/dev/sda`](#ex-install-sequence) mostra uma sequência típica de comandos para instalar o NixOS em um disco rígido vazio (aqui `/dev/sda`). [Exemplo: Configuração do NixOS](#ex-config) mostra uma expressão Nix de configuração correspondente.

::: {#ex-partition-scheme-MBR .example}
### Exemplos de esquemas de partição para NixOS em `/dev/sda` (MBR)
```ShellSession
# parted /dev/sda -- mklabel msdos
# parted /dev/sda -- mkpart primary 1MB -8GB
# parted /dev/sda -- mkpart primary linux-swap -8GB 100%
```
:::

::: {#ex-partition-scheme-UEFI .example}
### Exemplos de esquemas de partição para NixOS em `/dev/sda` (UEFI)
```ShellSession
# parted /dev/sda -- mklabel gpt
# parted /dev/sda -- mkpart root ext4 512MB -8GB
# parted /dev/sda -- mkpart swap linux-swap -8GB 100%
# parted /dev/sda -- mkpart ESP fat32 1MB 512MB
# parted /dev/sda -- set 3 esp on
```
:::

::: {#ex-install-sequence .example}
### Comandos para Instalar NixOS em `/dev/sda`

Com um disco particionado.

```ShellSession
# mkfs.ext4 -L nixos /dev/sda1
# mkswap -L swap /dev/sda2
# swapon /dev/sda2
# mkfs.fat -F 32 -n boot /dev/sda3        # (for UEFI systems only)
# mount /dev/disk/by-label/nixos /mnt
# mkdir -p /mnt/boot                      # (for UEFI systems only)
# mount -o umask=077 /dev/disk/by-label/boot /mnt/boot # (for UEFI systems only)
# nixos-generate-config --root /mnt
# nano /mnt/etc/nixos/configuration.nix
# nixos-install
# reboot
```
:::

::: {#ex-config .example}
### Exemplo: Configuração do NixOS
```ShellSession
{ config, pkgs, ... }: {
  imports = [
    # Include the results of the hardware scan.
    ./hardware-configuration.nix
  ];

  boot.loader.grub.device = "/dev/sda";   # (for BIOS systems only)
  boot.loader.systemd-boot.enable = true; # (for UEFI systems only)

  # Note: setting fileSystems is generally not
  # necessary, since nixos-generate-config figures them out
  # automatically in hardware-configuration.nix.
  #fileSystems."/".device = "/dev/disk/by-label/nixos";

  # Enable the OpenSSH server.
  services.sshd.enable = true;
}
```
:::

## Notas adicionais de instalação {#sec-installation-additional-notes}

```{=include=} sections
installing-usb.section.md
installing-pxe.section.md
installing-kexec.section.md
installing-virtualbox-guest.section.md
installing-from-other-distro.section.md
installing-behind-a-proxy.section.md
```