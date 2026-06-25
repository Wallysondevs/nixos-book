# Gráfico {#sec-profile-graphical}

Define uma configuração NixOS com o ambiente de desktop Plasma 6. É usado pelo CD de instalação gráfica.

Ele define [](#opt-services.xserver.enable),
[](#opt-services.displayManager.sddm.enable),
[](#opt-services.desktopManager.plasma6.enable),
e [](#opt-services.libinput.enable) como verdadeiro. Ele também
inclui glxinfo e firefox na lista de pacotes do sistema.