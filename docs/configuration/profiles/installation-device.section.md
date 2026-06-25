# Dispositivo de Instalação {#sec-profile-installation-device}

Fornece uma configuração básica para dispositivos de instalação como CDs.
Isso habilita firmware redistribuível, inclui o
[perfil Clone Config](#sec-profile-clone-config)
e uma cópia do canal Nixpkgs, para que `nixos-install`
funcione imediatamente.

A documentação para [Nixpkgs](#opt-documentation.enable)
e [NixOS](#opt-documentation.nixos.enable) é
habilitada forçosamente (para sobrescrever a preferência do
[perfil Minimal](#sec-profile-minimal)); o
manual do NixOS é exibido automaticamente no TTY 8, udisks é desabilitado.
O autologin é habilitado para o usuário `nixos`, enquanto o login sem senha
como `root` e `nixos` é possível.
O `sudo` sem senha também é habilitado.
[NetworkManager](#opt-networking.networkmanager.enable) é
habilitado e pode ser configurado interativamente com `nmtui`.

É explicado como fazer login, iniciar o servidor ssh e, se disponível,
como iniciar o gerenciador de exibição.

Várias configurações são ajustadas para que o instalador tenha uma chance maior de
ter sucesso em ambientes com pouca memória.