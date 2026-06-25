# Inicializando a partir de um pendrive USB {#sec-booting-from-usb}

A imagem deve ser gravada literalmente no pendrive USB para que seja inicializável em sistemas UEFI e BIOS. Aqui estão as ferramentas recomendadas para fazer isso.

## Criando um pendrive USB inicializável com uma ferramenta gráfica {#sec-booting-from-usb-graphical}

Etcher é uma ferramenta popular e fácil de usar. Funciona em Linux, Windows e macOS.

Baixe-o em [balena.io](https://www.balena.io/etcher/), inicie o programa, selecione a ISO do NixOS baixada, então selecione o pendrive USB e grave-o.

::: {.warning}
Por padrão, o Etcher reporta erros e estatísticas de uso, o que pode ser desativado nas configurações.
:::

Uma alternativa é o [USBImager](https://bztsrc.gitlab.io/usbimager), que é muito simples e não se conecta à internet. Baixe a versão com interface somente de escrita (wo) para o seu sistema. Inicie o programa, selecione a imagem, selecione o pendrive USB e clique em "Write".

## Criando um pendrive USB inicializável a partir de um Terminal no Linux {#sec-booting-from-usb-linux}

1. Conecte o pendrive USB.
2. Encontre o dispositivo correspondente com `lsblk`. Você pode distingui-los pelo tamanho.
3. Certifique-se de que todas as partições no dispositivo estejam devidamente desmontadas. Substitua `sdX` pelo seu dispositivo (por exemplo, `sdb`).

  ```ShellSession
  sudo umount /dev/sdX*
  ```

4. Em seguida, use o utilitário `dd` para gravar a imagem no pendrive USB.

  ```ShellSession
  sudo dd bs=4M conv=fsync oflag=direct status=progress if=<path-to-image> of=/dev/sdX
  ```

## Criando um pendrive USB inicializável a partir de um Terminal no macOS {#sec-booting-from-usb-macos}

1. Conecte o pendrive USB.
2. Encontre o dispositivo correspondente com `diskutil list`. Você pode distingui-los pelo tamanho.
3. Certifique-se de que todas as partições no dispositivo estejam devidamente desmontadas. Substitua `diskX` pelo seu dispositivo (por exemplo, `disk1`).

  ```ShellSession
  diskutil unmountDisk diskX
  ```

4. Em seguida, use o utilitário `dd` para gravar a imagem no pendrive USB.

  ```ShellSession
  sudo dd if=<path-to-image> of=/dev/rdiskX bs=4m
  ```

  Após a conclusão do `dd`, uma caixa de diálogo da GUI "The disk you inserted was not readable by this computer" será exibida, a qual pode ser ignorada.

  ::: {.note}
  Usar o dispositivo 'raw' `rdiskX` em vez de `diskX` com dd é concluído em minutos em vez de horas.
  :::

5. Ejete o disco quando terminar.

  ```ShellSession
  diskutil eject /dev/diskX
  ```