# Clonar Configuração {#sec-profile-clone-config}

Este perfil é usado em imagens de instalador. Ele fornece um `configuration.nix` editável que importa todos os módulos que também foram usados ao criar a imagem inicialmente. Como resultado, ele permite aos usuários editar e reconstruir o sistema live.

Em imagens onde a mídia de instalação também se torna um alvo de instalação, a cópia de `configuration.nix` deve ser desabilitada definindo `installer.cloneConfig` como `false`. Por exemplo, isso é feito em `sd-image-aarch64-installer.nix`.