# Grupos de Controle {#sec-cgroups}

Para acompanhar os processos em um sistema em execução, o systemd usa *grupos de controle* (cgroups). Um grupo de controle é um conjunto de processos usado para alocar recursos como CPU, memória ou largura de banda de I/O. Pode haver múltiplas hierarquias de grupos de controle, permitindo que cada tipo de recurso seja gerenciado independentemente.

O comando `systemd-cgls` lista todos os grupos de controle na hierarquia `systemd`, que é o que o systemd usa para acompanhar os processos pertencentes a cada serviço ou sessão de usuário:

```ShellSession
$ systemd-cgls
├─user
│ └─eelco
│   └─c1
│     ├─ 2567 -:0
│     ├─ 2682 kdeinit4: kdeinit4 Running...
│     ├─ ...
│     └─10851 sh -c less -R
└─system
  ├─httpd.service
  │ ├─2444 httpd -f /nix/store/3pyacby5cpr55a03qwbnndizpciwq161-httpd.conf -DNO_DETACH
  │ └─...
  ├─dhcpcd.service
  │ └─2376 dhcpcd --config /nix/store/f8dif8dsi2yaa70n03xir8r653776ka6-dhcpcd.conf
  └─ ...
```

Similarmente, `systemd-cgls cpu` mostra os cgroups na hierarquia da CPU, o que permite prioridades de agendamento de CPU por cgroup. Por padrão, cada serviço systemd obtém seu próprio cgroup de CPU, enquanto todas as sessões de usuário estão no cgroup de CPU de nível superior. Isso garante, por exemplo, que mil processos descontrolados no cgroup `httpd.service` não podem privar a CPU de um processo no cgroup `postgresql.service`. (Em contraste, se estivessem no mesmo cgroup, o processo PostgreSQL obteria 1/1001 do tempo de CPU do cgroup.) Você pode limitar a participação da CPU de um serviço em `configuration.nix`:

```nix
{ systemd.services.httpd.serviceConfig.CPUShares = 512; }
```

Por padrão, cada cgroup tem 1024 compartilhamentos de CPU, então isso reduzirá pela metade a alocação de CPU do cgroup `httpd.service`.

Existe também uma hierarquia de `memory` que controla os limites de alocação de memória; por padrão, todos os processos estão no cgroup de nível superior, então qualquer serviço ou sessão pode esgotar toda a memória disponível. Limites de memória por cgroup podem ser especificados em `configuration.nix`; por exemplo, para limitar `httpd.service` a 512 MiB de RAM (excluindo swap):

```nix
{ systemd.services.httpd.serviceConfig.MemoryLimit = "512M"; }
```

O comando `systemd-cgtop` mostra uma lista continuamente atualizada de todos os cgroups com seu uso de CPU e memória.