# Problemas de Inicialização {#sec-boot-problems}

Se o NixOS falhar ao inicializar, há uma série de parâmetros de linha de comando do kernel que podem ajudar a identificar ou corrigir o problema. Você pode adicionar esses parâmetros no menu de inicialização do GRUB pressionando “e” para modificar a entrada de inicialização selecionada e editando a linha que começa com `linux`.

{manpage}`kernel-command-line(7)` documenta os parâmetros do kernel aceitos pelo systemd. Estes incluem muitos que são úteis para depurar problemas de inicialização, como `systemd.debug_shell` e `rescue`. Alguns também possuem variantes prefixadas com `rd.` que se aplicam ao estágio 1.

`live.nixos.passwd=password`

: Define a senha para o usuário `nixos` live. Isso pode ser usado para acesso SSH se houver problemas ao usar o terminal.

Se nenhum prompt de login ou telas de login X11 aparecer (por exemplo, devido a dependências travadas), você pode pressionar Alt+SetaParaCima. Se tiver sorte, isso iniciará `rescue.target` (descrito em {manpage}`systemd.special(7)`). (Observe também que, como a maioria das unidades tem um tempo limite de 90 segundos antes que o systemd desista delas, os prompts de login `agetty` devem aparecer eventualmente, a menos que algo esteja muito errado.)

## Estágio 1 via script {#sec-boot-problems-scripted-stage-1}

A implementação via script do estágio 1 também entende esses parâmetros de inicialização.

::: {.warning}
A implementação via script do estágio 1 está desabilitada por padrão e foi descontinuada. Esses parâmetros não têm efeito, a menos que o estágio 1 do systemd seja explicitamente desabilitado com `boot.initrd.systemd.enable = false;`.
:::

`boot.shell_on_fail`

: Permite ao usuário iniciar um shell de root se algo der errado no estágio 1 do processo de inicialização (o ramdisk inicial). Isso está desabilitado por padrão porque não há autenticação para o shell de root.

  ::: {.note}
  Alternativa para o estágio 1 do systemd: `SYSTEMD_SULOGIN_FORCE=1` para o modo de recuperação, ou `rd.systemd.debug_shell` para shell no tty9.
  :::

`boot.debug1`

: Inicia um shell interativo no estágio 1 antes que qualquer coisa útil tenha sido feita. Ou seja, nenhum módulo foi carregado e nenhum sistema de arquivos foi montado, exceto `/proc` e `/sys`.

  ::: {.note}
  Alternativa para o estágio 1 do systemd: `rd.systemd.break=pre-udev`
  :::

`boot.debug1devices`

: Semelhante a `boot.debug1`, mas executa o estágio 1 até que os módulos do kernel sejam carregados e os nós de dispositivo sejam criados. Isso pode ajudar, por exemplo, a fazer o teclado funcionar.

  ::: {.note}
  Alternativa para o estágio 1 do systemd: `rd.systemd.break=pre-mount`
  :::

`boot.debug1mounts`

: Semelhante a `boot.debug1` ou `boot.debug1devices`, mas executa o estágio 1 até que todos os sistemas de arquivos montados durante o initrd sejam montados (veja [neededForBoot](#opt-fileSystems._name_.neededForBoot)). Como exemplo motivador, isso pode ser útil se você esqueceu de definir [neededForBoot](#opt-fileSystems._name_.neededForBoot) em um sistema de arquivos.

  ::: {.note}
  Alternativa para o estágio 1 do systemd: `rd.systemd.break=pre-switch-root`
  :::

`boot.trace`

: Imprime cada comando shell executado pelos scripts de inicialização dos estágios 1 e 2.

  ::: {.note}
  Alternativa para o estágio 1 do systemd: `rd.systemd.log_level=debug`
  :::

Observe que para `boot.shell_on_fail`, `boot.debug1`, `boot.debug1devices` e `boot.debug1mounts`, se você **não** selecionou "iniciar o novo shell como pid 1", e você `exit` do novo shell, a inicialização prosseguirá normalmente a partir do ponto onde falhou, como se você tivesse escolhido "ignorar o erro e continuar".