# Headless {#sec-profile-headless}

Configuração comum para máquinas headless (por exemplo, instâncias Amazon EC2).

Desabilita [vesa](#opt-boot.vesa), consoles seriais,
[emergency mode](#opt-systemd.enableEmergencyMode),
[grub splash images](#opt-boot.loader.grub.splashImage)
e configura o kernel para reiniciar automaticamente em caso de pânico.