# Atualizando o NixOS {#sec-upgrading}

A melhor maneira de manter sua instalação do NixOS atualizada é usar um dos
*canais* do NixOS. Um canal é um mecanismo do Nix para distribuir
expressões Nix e binários associados. Os canais do NixOS são atualizados
automaticamente a partir do repositório Git do NixOS depois que certos testes
são aprovados e uma seleção de pacotes é construída com sucesso
(veja `nixos/release-combined.nix` e `nixos/release-small.nix`).
Esses canais são:

-   *Canais estáveis*, como [`nixos-26.05`](https://channels.nixos.org/nixos-26.05).
    Estes recebem apenas correções de bugs conservadoras e atualizações de pacotes. Por
    exemplo, uma atualização de canal pode fazer com que o kernel Linux em seu sistema
    seja atualizado de 4.19.34 para 4.19.38 (uma correção de bug menor), mas não
    de 4.19.x para 4.20.x (uma mudança importante que tem o potencial de quebrar coisas).
    Canais estáveis são geralmente mantidos até que a próxima ramificação estável
    seja criada.

-   O *canal instável*, [`nixos-unstable`](https://channels.nixos.org/nixos-unstable).
    Este corresponde à ramificação de desenvolvimento principal do NixOS e, portanto, pode ver
    mudanças radicais entre as atualizações de canal. Não é recomendado para
    sistemas de produção.

-   *Canais pequenos*, como [`nixos-26.05-small`](https://channels.nixos.org/nixos-26.05-small)
    ou [`nixos-unstable-small`](https://channels.nixos.org/nixos-unstable-small).
    Estes são idênticos aos canais estáveis e instáveis descritos acima,
    exceto que contêm menos pacotes binários. Isso significa que eles são atualizados
    mais rapidamente do que os canais regulares (por exemplo, quando um patch de segurança crítico
    é commitado na árvore de código-fonte do NixOS), mas podem exigir que mais pacotes sejam
    construídos a partir do código-fonte do que o usual. Eles são principalmente destinados a ambientes de servidor
    e, como tal, contêm poucas aplicações GUI.

Para ver quais canais estão disponíveis, vá para <https://channels.nixos.org>.
(Note que os URIs dos vários canais redirecionam para um diretório que
contém a versão mais recente do canal e inclui imagens ISO e
appliances VirtualBox.) Por favor, note que durante o processo de lançamento,
canais que ainda não foram lançados também estarão presentes aqui. Veja a
página Getting NixOS <https://nixos.org/download/> para encontrar a versão
estável mais recente suportada.

Quando você instala o NixOS pela primeira vez, você é automaticamente inscrito no
canal do NixOS que corresponde à sua fonte de instalação. Por
exemplo, se você instalou a partir de uma ISO 26.05, você será inscrito no
canal `nixos-26.05`. Para ver em qual canal do NixOS você está inscrito,
execute o seguinte como root:

```ShellSession
# nix-channel --list | grep nixos
nixos https://channels.nixos.org/nixos-unstable
```

Para mudar para um canal NixOS diferente, faça

```ShellSession
# nix-channel --add https://channels.nixos.org/channel-name nixos
```

(Certifique-se de incluir o parâmetro `nixos` no final.) Por exemplo, para
usar o canal estável NixOS 26.05:

```ShellSession
# nix-channel --add https://channels.nixos.org/nixos-26.05 nixos
```

Se você tem um servidor, você pode querer usar o canal "small" em vez disso:

```ShellSession
# nix-channel --add https://channels.nixos.org/nixos-26.05-small nixos
```

E se você quiser viver na vanguarda:

```ShellSession
# nix-channel --add https://channels.nixos.org/nixos-unstable nixos
```

Você pode então atualizar o NixOS para a versão mais recente no canal escolhido
executando

```ShellSession
# nixos-rebuild switch --upgrade
```

o que é equivalente ao mais verboso `nix-channel --update nixos; nixos-rebuild switch`.

::: {.note}
Canais são definidos por usuário. Isso significa que executar `nix-channel --add`
como um usuário não root (ou sem sudo) não afetará a
configuração em `/etc/nixos/configuration.nix`
:::

::: {.warning}
Geralmente é seguro alternar entre canais. A única
exceção é que um NixOS mais recente também pode ter uma versão mais recente do Nix, o que
pode envolver uma atualização do esquema do banco de dados do Nix. Isso não pode ser desfeito
facilmente, então nesse caso você não poderá voltar ao seu canal
original.
:::

## Atualizações Automáticas {#sec-upgrading-automatic}

Você pode manter um sistema NixOS atualizado automaticamente adicionando o
seguinte ao `configuration.nix`:

```nix
{
  system.autoUpgrade.enable = true;
  system.autoUpgrade.allowReboot = true;
}
```

Isso habilita um serviço systemd executado periodicamente chamado
`nixos-upgrade.service`. Se a opção `allowReboot` for `false`, ele executa
`nixos-rebuild switch --upgrade` para atualizar o NixOS para a versão mais recente
no canal atual. (Para ver quando o serviço é executado, veja `systemctl list-timers`.)
Se `allowReboot` for `true`, então o sistema será reiniciado automaticamente se
a nova geração contiver um kernel, initrd ou módulos de kernel diferentes.
Você também pode especificar um canal explicitamente, por exemplo:

```nix
{ system.autoUpgrade.channel = "https://channels.nixos.org/nixos-26.05"; }
```