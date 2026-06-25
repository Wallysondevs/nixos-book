# Contêiner Docker {#sec-profile-docker-container}

Este é o perfil a partir do qual as imagens Docker são geradas. Ele prepara um sistema funcional importando os perfis [Minimal](#sec-profile-minimal) e [Clone Config](#sec-profile-clone-config), e definindo opções de configuração apropriadas que são úteis dentro de um contexto de contêiner, como [](#opt-boot.isContainer).