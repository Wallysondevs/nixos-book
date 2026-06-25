# ZFS {#sec-zfs-state}

Ao usar ZFS, `/etc/zfs/zpool.cache` deve ser persistente (ou um symlink para um local persistente), pois é o valor padrão para a [propriedade](man:zpoolprops(7)) `cachefile`.

Este `cachefile` é usado na inicialização do sistema para descobrir `pools` ZFS, então `pools` ZFS que contêm o `rootfs` e/ou `datasets` de inicialização precoce, como `/nix`, podem ser configurados para `cachefile=none`.

Em princípio, se não houver outros `pools` anexados ao sistema, `zpool.cache` não precisa ser persistido; no entanto, é *fortemente recomendado* persistí-lo, caso `pools` adicionais sejam adicionados posteriormente, temporária ou permanentemente:

Embora o manuseio incorreto do `cachefile` não leve à perda de dados por si só, pode fazer com que os `zpools` não sejam importados durante a inicialização, e os serviços podem então gravar em um local onde um `dataset` era esperado para ser montado.