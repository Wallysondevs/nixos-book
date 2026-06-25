# systemd {#sec-systemd-state}

## `machine-id(5)` {#sec-machine-id}

`systemd` usa um identificador por máquina — {manpage}`machine-id(5)` — que deve ser único e persistente; caso contrário, o journal do sistema pode falhar ao listar inicializações anteriores, etc.

`systemd` gera um `machine-id(5)` aleatório durante a inicialização se ele ainda não existir, e o persiste em `/etc/machine-id`. Sendo assim, basta tornar esse arquivo persistente.

Alternativamente, é possível gerar um `machine-id(5)` aleatório; embora a especificação permita *qualquer* valor de 128b codificado em hexadecimal, o próprio `systemd` usa [UUIDv4], *ou seja*, UUIDs aleatórios, e é, portanto, preferível fazer o mesmo, caso algum software assuma que `machine-id(5)` seja um UUIDv4. Estes podem ser gerados com `uuidgen -r | tr -d -` (`tr` sendo usado para remover os hífens).

Tal `machine-id(5)` pode ser definido escrevendo-o em `/etc/machine-id` ou através da linha de comando do kernel, embora os mantenedores do `systemd` do NixOS [desencorajem] esta última abordagem.

[UUIDv4]: https://en.wikipedia.org/wiki/Universally_unique_identifier#Version_4_(random)
[discourage]: https://github.com/NixOS/nixpkgs/pull/268995

## `/var/lib/systemd` {#sec-var-systemd}

Além disso, o `systemd` espera que seu diretório de estado — `/var/lib/systemd` — persista, para:
- {manpage}`systemd-random-seed(8)`, que carrega uma “semente” de 256b no RNG do kernel no momento da inicialização, e salva uma nova durante o desligamento;
- {manpage}`systemd.timer(5)` com `Persistent=yes`, que são então executados após a inicialização se o temporizador tivesse sido acionado durante o tempo em que o sistema foi desligado;
- {manpage}`systemd-coredump(8)` para armazenar core dumps lá por padrão;
  (veja {manpage}`coredump.conf(5)`)
- {manpage}`systemd-timesyncd(8)`;
- {manpage}`systemd-backlight(8)` e {manpage}`systemd-rfkill(8)` persistem o estado relacionado ao hardware;
- possivelmente outras coisas, esta lista não pretende ser exaustiva.

Em qualquer caso, tornar `/var/lib/systemd` persistente é recomendado.

## `/var/log/journal/{machine-id}` {#sec-var-journal}

Por fim, {manpage}`systemd-journald(8)` escreve o journal do sistema em formato binário para `/var/log/journal/{machine-id}`; se for desejado persistir (localmente) todo o log, é recomendado tornar todo o `/var/log/journal` persistente.

Caso contrário, pode-se definir `Storage=volatile` em {manpage}`journald.conf(5)` ([`services.journald.storage = "volatile";`](#opt-services.journald.storage)), o que desabilita a persistência do journal e faz com que ele seja escrito em `/run/log/journal`.