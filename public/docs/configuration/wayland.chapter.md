# Wayland {#sec-wayland}

Enquanto o X11 (veja [](#sec-x11)) ainda é a tecnologia de exibição primária no NixOS, o suporte ao Wayland está melhorando constantemente. Onde o X11 separa o X Server e o gerenciador de janelas, no Wayland eles são combinados: um Compositor Wayland é como um gerenciador de janelas X11, mas também incorpora a funcionalidade de 'Servidor' Wayland. Isso significa que é suficiente instalar um Compositor Wayland como o sway sem habilitar separadamente um servidor Wayland:

```nix
{ programs.sway.enable = true; }
```

Isso instala o compositor sway junto com algumas utilidades essenciais. Agora você pode iniciar o sway a partir do console TTY.

Se você estiver usando um compositor baseado em wlroots, como o sway, e quiser ser capaz de compartilhar sua tela, certifique-se de configurar o Pipewire usando [](#opt-services.pipewire.enable) e opções relacionadas.

Para mais dicas e truques úteis, veja a [página wiki sobre Sway](https://wiki.nixos.org/wiki/Sway).