# Todo o Hardware {#sec-profile-all-hardware}

Habilita todo o hardware suportado pelo NixOS: ou seja, todo o firmware é incluído, e todos os dispositivos a partir dos quais se pode inicializar são habilitados no initrd. Seu uso principal é nos CDs de instalação do NixOS.

Os módulos do kernel habilitados incluem suporte para SATA e PATA, SCSI (parcialmente), USB, Firewire (não testado), Virtio (QEMU, KVM, etc.), VMware e Hyper-V. Além disso, [](#opt-hardware.enableAllFirmware) é habilitado, e o firmware para o chipset ZyDAS ZD1211 é especificamente instalado.