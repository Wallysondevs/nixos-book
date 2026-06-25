# Convidado QEMU {#sec-profile-qemu-guest}

Este perfil contém configurações comuns para máquinas virtuais executando sob QEMU (usando virtio).

Ele disponibiliza módulos virtio no initrd e define a hora do sistema a partir do relógio de hardware para contornar um bug no qemu-kvm.