# X Window System {#sec-x11}

O X Window System (X11) fornece a base da interface gráfica de usuário do NixOS. Ele pode ser habilitado da seguinte forma:

```nix
{ services.xserver.enable = true; }
```

O X server detectará e usará automaticamente o driver de vídeo apropriado de um conjunto de drivers X.org (como `vesa` e `intel`). Você também pode especificar um driver manualmente, por exemplo,

```nix
{ services.xserver.videoDrivers = [ "r128" ]; }
```

para habilitar o driver `xf86-video-r128` do X.org.

Você também precisa habilitar pelo menos um ambiente de desktop ou gerenciador de janelas. Caso contrário, você só poderá fazer login em uma janela `xterm` simples e sem decoração. Assim, você deve escolher uma ou mais das seguintes linhas:

```nix
{
  services.desktopManager.plasma6.enable = true;
  services.xserver.desktopManager.xfce.enable = true;
  services.desktopManager.gnome.enable = true;
  services.xserver.desktopManager.mate.enable = true;
  services.xserver.windowManager.xmonad.enable = true;
  services.xserver.windowManager.twm.enable = true;
  services.xserver.windowManager.icewm.enable = true;
  services.xserver.windowManager.i3.enable = true;
  services.xserver.windowManager.herbstluftwm.enable = true;
}
```

O *display manager* padrão do NixOS (o programa que fornece um prompt de login gráfico e gerencia o X server) é o LightDM. Você pode selecionar um alternativo escolhendo uma das seguintes linhas:

```nix
{
  services.displayManager.sddm.enable = true;
  services.displayManager.gdm.enable = true;
}
```

Você pode definir o layout do teclado (e opcionalmente a variante do layout):

```nix
{
  services.xserver.xkb.layout = "de";
  services.xserver.xkb.variant = "neo";
}
```

O X server é iniciado automaticamente no momento da inicialização. Se você não quiser que isso aconteça, pode definir:

```nix
{ services.xserver.autorun = false; }
```

O X server pode então ser iniciado manualmente:

```ShellSession
# systemctl start display-manager.service
```

Em sistemas de 64 bits, se você quiser OpenGL para programas de 32 bits, como no Wine, você também deve definir o seguinte:

```nix
{ hardware.graphics.enable32Bit = true; }
```

## Auto-login {#sec-x11-auto-login}

A tela de login do x11 pode ser totalmente ignorada, fazendo login automaticamente no seu gerenciador de janelas e ambiente de desktop ao iniciar o computador.

Isso é especialmente útil se você tiver a criptografia de disco habilitada. Como você já precisa fornecer uma senha para descriptografar seu disco, inserir uma segunda senha para fazer login pode ser redundante.

Para habilitar o auto-login, você precisa definir seu gerenciador de janelas e ambiente de desktop padrão. Se você não quisesse nenhum ambiente de desktop e i3 como seu gerenciador de janelas, você definiria:

```nix
{ services.displayManager.defaultSession = "none+i3"; }
```

Todo display manager no NixOS suporta auto-login, aqui está um exemplo usando lightdm para um usuário `alice`:

```nix
{
  services.xserver.displayManager.lightdm.enable = true;
  services.displayManager.autoLogin.enable = true;
  services.displayManager.autoLogin.user = "alice";
}
```

## Executando X sem um display manager  {#sec-x11-startx}

É possível evitar um display manager completamente e iniciar o X server manualmente a partir de um terminal virtual. Adicione à sua configuração:
```nix
{
  services.xserver.displayManager.startx = {
    enable = true;
    generateScript = true;
  };
}
```
então você pode iniciar o X server com o comando `startx`.

A segunda opção gerará um script `xinitrc` base que executará seu gerenciador de janelas e configurará a sessão de usuário do systemd.
Você pode estender o script usando a opção
[extraCommands](#opt-services.xserver.displayManager.startx.extraCommands),
por exemplo:
```nix
{
  services.xserver.displayManager.startx = {
    generateScript = true;
    extraCommands = ''
      xrdb -load .Xresources
      xsetroot -solid '#666661'
      xsetroot -cursor_name left_ptr
    '';
  };
}
```
ou, alternativamente, você pode escrever o seu próprio do zero em `~/.xinitrc`.

Neste caso, lembre-se que você é responsável por iniciar o gerenciador de janelas, por exemplo:
```shell
sxhkd &
bspwm &
```
e se você habilitou algum serviço de usuário do systemd, provavelmente também desejará adicionar estas linhas:
```shell
# import required env variables from the current shell
systemctl --user import-environment DISPLAY XDG_SESSION_ID
# start all graphical user services
systemctl --user start nixos-fake-graphical-session.target
# start the user dbus daemon
dbus-daemon --session --address="unix:path=/run/user/$(id -u)/bus" &
```

## Drivers Intel Graphics {#sec-x11--graphics-cards-intel}

O driver padrão e recomendado para Intel Graphics no X.org é `modesetting` (incluído no próprio pacote xorg-server).
Este é um driver genérico que usa o mecanismo de [mode setting](https://en.wikipedia.org/wiki/Mode_setting) (KMS) do kernel, ele suporta Glamor (aceleração gráfica 2D via OpenGL) e é ativamente mantido, podendo ter um desempenho pior em alguns casos (como em chipsets antigos).

Existe um segundo driver, `intel` (fornecido pelo pacote xf86-video-intel), específico para iGPUs Intel mais antigas da geração 2 à 9. Ele não é recomendado pela maioria das distribuições: ele carece de vários recursos modernos (por exemplo, não suporta Glamor) e o pacote não é oficialmente atualizado desde 2015.

iGPUs de terceira geração e mais antigas (15-20+ anos) não são suportadas pelo driver `modesetting` (o X travará na inicialização). Assim, o driver `intel` é necessário para esses chipsets.
Caso contrário, os resultados variam dependendo do hardware, então você pode ter que experimentar ambos os drivers. Use a opção
[](#opt-services.xserver.videoDrivers)
para definir um. A configuração recomendada para sistemas modernos é:

```nix
{ services.xserver.videoDrivers = [ "modesetting" ]; }
```
::: {.note}
O driver `modesetting` atualmente não fornece uma opção `TearFree` (isso estará disponível em uma próxima versão do X.org). Assim, sem usar um compositor (por exemplo, veja [](#opt-services.picom.enable)) você experimentará screen tearing.
:::

Se você experimentar screen tearing independentemente da situação, esta configuração foi relatada para resolver o problema:

```nix
{
  services.xserver.videoDrivers = [ "intel" ];
  services.xserver.deviceSection = ''
    Option "DRI" "2"
    Option "TearFree" "true"
  '';
}
```

Observe que isso provavelmente degradará o desempenho em comparação com `modesetting` ou `intel` com DRI 3 (padrão).

## Drivers proprietários NVIDIA {#sec-x11-graphics-cards-nvidia}

A NVIDIA fornece um driver proprietário para suas placas gráficas que possui melhor desempenho 3D do que os drivers X.org. Ele não é habilitado por padrão porque não é software livre. Você pode habilitá-lo da seguinte forma:

```nix
{ services.xserver.videoDrivers = [ "nvidia" ]; }
```

Se você tem uma placa mais antiga, pode ter que usar um dos drivers legados:

```nix
{
  hardware.nvidia.package = config.boot.kernelPackages.nvidiaPackages.legacy_470;
  hardware.nvidia.package = config.boot.kernelPackages.nvidiaPackages.legacy_390;
  hardware.nvidia.package = config.boot.kernelPackages.nvidiaPackages.legacy_340;
}
```

Você pode precisar reiniciar após habilitar este driver para evitar um conflito com outros módulos do kernel.

## Touchpads {#sec-x11-touchpads}

O suporte para touchpads Synaptics (encontrados em muitos laptops, como a série Dell Latitude) pode ser habilitado da seguinte forma:

```nix
{ services.libinput.enable = true; }
```

O driver possui muitas opções (veja [](#ch-options)).
Por exemplo, o seguinte desabilita o comportamento de tap-to-click:

```nix
{ services.libinput.touchpad.tapping = false; }
```

Nota: o uso de `services.xserver.synaptics` está obsoleto desde o NixOS 17.09.

## Temas GTK/Qt {#sec-x11-gtk-and-qt-themes}

Temas GTK podem ser instalados tanto no perfil do usuário quanto em todo o sistema (via `environment.systemPackages`). Para fazer com que as aplicações Qt 5 se pareçam com as GTK, você pode usar a seguinte configuração:

```nix
{
  qt.enable = true;
  qt.platformTheme = "gtk2";
  qt.style = "gtk2";
}
```

## Layouts XKB personalizados {#custom-xkb-layouts}

É possível instalar layouts de teclado [ XKB ](https://en.wikipedia.org/wiki/X_keyboard_extension) personalizados usando a opção `services.xserver.xkb.extraLayouts`.

Como primeiro exemplo, vamos criar um layout baseado no layout US básico, com uma camada adicional para digitar alguns símbolos gregos pressionando a tecla alt direita.

Crie um arquivo chamado `us-greek` com o seguinte conteúdo (em um diretório chamado `symbols`; é uma peculiaridade do XKB que ajudará nos testes):

```
xkb_symbols "us-greek"
{
  include "us(basic)"            // includes the base US keys
  include "level3(ralt_switch)"  // configures right alt as a third level switch

  key <LatA> { [ a, A, Greek_alpha ] };
  key <LatB> { [ b, B, Greek_beta  ] };
  key <LatG> { [ g, G, Greek_gamma ] };
  key <LatD> { [ d, D, Greek_delta ] };
  key <LatZ> { [ z, Z, Greek_zeta  ] };
};
```

Uma especificação de layout mínima deve incluir o seguinte:

```nix
{
  services.xserver.xkb.extraLayouts.us-greek = {
    description = "US layout with alt-gr greek";
    languages = [ "eng" ];
    symbolsFile = /yourpath/symbols/us-greek;
  };
}
```

::: {.note}
O nome (depois de `extraLayouts.`) deve corresponder ao dado ao bloco `xkb_symbols`.
:::

Aplicar esta personalização requer a reconstrução de vários pacotes, e um arquivo XKB quebrado pode levar à falha da sessão X no login. Portanto, é fortemente aconselhável **testar seu layout antes de aplicá-lo**:

```ShellSession
$ nix-shell -p xkbcomp
$ setxkbmap -I/yourpath us-greek -print | xkbcomp -I/yourpath - $DISPLAY
```

Você pode inspecionar os arquivos XKB predefinidos para exemplos:

```ShellSession
$ echo "$(nix-build --no-out-link '<nixpkgs>' -A xkeyboard-config)/etc/X11/xkb/"
```

Uma vez que a configuração é aplicada, e você fez um ciclo de logout/login, o layout deve estar pronto para uso. Você pode testá-lo, por exemplo, executando `setxkbmap us-greek` e então digitando `<alt>+a` (pode não ser aplicado imediatamente no seu terminal). Para alterar o padrão, a opção usual `services.xserver.xkb.layout` ainda pode ser usada.

Um layout pode ter vários outros componentes além de `xkb_symbols`, por exemplo, definiremos novos keycodes para algumas teclas multimídia e os vincularemos a algum símbolo.

Use o utilitário *xev* de `pkgs.xev` para encontrar os códigos das teclas de interesse, então crie um arquivo `media-key` para armazenar as definições dos keycodes

```
xkb_keycodes "media"
{
 <volUp>   = 123;
 <volDown> = 456;
}
```

Agora use os keycodes recém-definidos em `media-sym`:

```
xkb_symbols "media"
{
 key.type = "ONE_LEVEL";
 key <volUp>   { [ XF86AudioLowerVolume ] };
 key <volDown> { [ XF86AudioRaiseVolume ] };
}
```

Como antes, para instalar o layout faça

```nix
{
  services.xserver.xkb.extraLayouts.media = {
    description = "Multimedia keys remapping";
    languages = [ "eng" ];
    symbolsFile = /path/to/media-key;
    keycodesFile = /path/to/media-sym;
  };
}
```

::: {.note}
A função `pkgs.writeText <filename> <content>` pode ser útil se você preferir manter as definições de layout dentro da configuração do NixOS.
:::

Infelizmente, o Xorg server não suporta (atualmente) a definição direta de um keymap, mas depende das regras XKB para selecionar os componentes correspondentes (keycodes, types, ...) de um layout. Isso significa que componentes diferentes de símbolos não serão carregados por padrão. Como solução alternativa, você pode definir o keymap usando `setxkbmap` no início da sessão com:

```nix
{
  services.xserver.displayManager.sessionCommands = "setxkbmap -keycodes media";
}
```

Se você estiver iniciando o X server manualmente, você deve definir o argumento `-xkbdir /etc/X11/xkb`, caso contrário o X não encontrará seus arquivos de layout. Por exemplo, com `xinit` execute

```ShellSession
$ xinit -- -xkbdir /etc/X11/xkb
```

Para aprender a escrever layouts, consulte a [documentação](https://www.x.org/releases/current/doc/xorg-docs/input/XKB-Enhancing.html#Defining_New_Layouts) do XKB. Mais exemplos de layouts também podem ser encontrados [aqui](https://wiki.archlinux.org/index.php/X_KeyBoard_extension#Basic_examples).