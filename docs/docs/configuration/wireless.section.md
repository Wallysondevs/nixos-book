# Redes Sem Fio {#sec-wireless}

Para uma instalação de desktop usando NetworkManager (por exemplo, GNOME ou KDE), você deve garantir que o usuário esteja no grupo `networkmanager` e você pode simplesmente configurar redes sem fio a partir do aplicativo de Configurações.
Também é possível declarar (algumas) redes sem fio a partir da configuração do NixOS com [](#opt-networking.networkmanager.ensureProfiles.profiles).

Alternativamente, sem o NetworkManager, você pode configurar redes sem fio usando wpa_supplicant definindo

```nix
{ networking.wireless.enable = true; }
```

Por padrão, o wpa_supplicant gerenciará a primeira interface sem fio que se tornar disponível. No entanto, é recomendado definir o nome da interface desejada com [](#opt-networking.wireless.interfaces), pois é mais confiável.

Se múltiplas interfaces forem definidas, o NixOS criará um serviço systemd separado para cada uma delas, por exemplo:

```nix
{
  networking.wireless.interfaces = [
    "wlan0"
    "wlan1"
  ];
}
```

resulta em `wpa_supplicant-wlan0.service` e `wpa_supplicant-wlan1.service`.


## Configuração Declarativa {#sec-wireless-declarative}

O NixOS permite que você especifique redes de forma declarativa:

```nix
{
  networking.wireless.networks = {
    # SSID with no spaces or special characters
    echelon = {
      psk = "abcdefgh";
    };
    # SSID with spaces and/or special characters
    "echelon's AP" = {
      psk = "ijklmnop";
    };
    # Hidden SSID
    echelon = {
      hidden = true;
      psk = "qrstuvwx";
    };
    free.wifi = { }; # Public wireless network
  };
}
```

Se a rede estiver usando WPA2, a chave pré-compartilhada (PSK) também pode ser especificada com a opção `pskRaw` como 64 dígitos hexadecimais.
Isso é útil tanto para ofuscar senhas quanto para tornar a conexão ligeiramente mais rápida, já que a chave não precisa ser derivada a cada vez.

Os valores `pskRaw` podem ser calculados usando a ferramenta `wpa_passphrase`:

```console
$ wpa_passphrase ESSID PSK
network={
        ssid="echelon"
        #psk="abcdefgh"
        psk=dca6d6ed41f4ab5a984c9f55f6f66d4efdc720ebf66959810f4329bb391c5435
}
```

```nix
{
  networking.wireless.networks.echelon = {
    pskRaw = "dca6d6ed41f4ab5a984c9f55f6f66d4efdc720ebf66959810f4329bb391c5435";
  };
}
```

Outras configurações do wpa_supplicant podem ser definidas usando a opção {option}`extraConfig`, seja globalmente ou por rede. Por exemplo:
```
{
  networking.wireless.extraConfig = ''
    # Enable MAC address randomization by default
    mac_addr=1
  '';
  networking.wireless.networks.home = {
    psk = "abcdefgh";
    extraConfig = ''
      # Use the real MAC address at home
      mac_addr=0
    '';
  };
}
```

::: {.note}
O arquivo de configuração do wpa_supplicant gerado está linkado para `/etc/wpa_supplicant/nixos.conf` para facilitar a inspeção.
:::


Esteja ciente de que nos exemplos anteriores as chaves seriam gravadas no Nix store em texto simples e legíveis para qualquer usuário local.
É recomendado especificar segredos (PSKs, senhas, etc.) de forma segura usando [](#opt-networking.wireless.secretsFile) e a sintaxe `ext:`. Por exemplo:

```nix
{
  networking.wireless.secretsFile = "/run/secrets/wireless.conf";
  networking.wireless.networks = {
    home = {
      pskRaw = "ext:psk_home";
    };
    work.auth = ''
      eap=PEAP
      identity="my-user@example.com"
      password=ext:pass_work
    '';
  };
}
```

onde `/run/secrets/wireless.conf` contém

```
psk_home=mypassword
pass_work=myworkpassword
```

::: {.note}
O arquivo de segredos deve ser de propriedade e colocado em um local acessível (apenas) pelo usuário `wpa_supplicant`. Apenas certos campos suportam a sintaxe `ext:`, por exemplo `psk`, `sae_password` e `password`, mas não `ssid`.
:::


## Configuração Imperativa {#sec-wireless-imperative}

Pode ser útil adicionar uma nova rede sem reconstruir a configuração do NixOS, particularmente se você ainda não tiver acesso à Internet.
Definir [](#opt-networking.wireless.userControlled) como `true` permitirá que usuários do grupo `wpa_supplicant` configurem o wpa_supplicant de forma imperativa.

Por exemplo, usando `wpa_cli` você pode adicionar uma nova rede e conectar-se a ela da seguinte forma:
```console
# wpa_cli
Selected interface 'wlan0'

Interactive mode

> add_network
10
> set_network 10 ssid "echelon"
OK
> set_network 10 psk "abcdefgh"
OK
> select_network 10
OK
```

Note que essas alterações serão perdidas quando o wpa_supplicant for reiniciado.
Para torná-las persistentes, a opção [](#opt-networking.wireless.allowAuxiliaryImperativeNetworks) pode ser definida, o que permite usar o comando `save` no `wpa_cli`, ou até mesmo editar diretamente o arquivo `/etc/wpa_supplicant/imperative.conf`.

::: {.note}
Lembre-se que após editar manualmente `imperative.conf` o daemon wpa_supplicant precisa ser reiniciado:
```console
# systemctl restart wpa_supplicant.service
```
ou
```console
# systemctl restart wpa_supplicant-<interface>.service
```
se [](#opt-networking.wireless.interfaces) tiver sido definido.
:::


## Redes Corporativas {#sec-wireless-enterprise}

Redes com protocolos de autenticação mais sofisticados podem ser configuradas usando a opção `auth` de formato livre, por exemplo:

```
{
  networking.wireless.networks = {
    eduroam.auth = ''
      key_mgmt=WPA-EAP
      eap=PEAP
      identity="alice.smith@example.com"
      password="veryLongPassword$!3"
      ca_cert="/etc/wpa_supplicant/eduroam.pem"
    '';
  };
}
```

Para exemplos e uma lista de opções disponíveis, consulte a página de manual [wpa_supplicant.conf(5)](man:wpa_supplicant.conf(5)).

::: {.warning}
Por padrão, medidas de endurecimento de segurança que limitam o acesso a arquivos, dispositivos e capacidades de rede são aplicadas ao daemon wpa_supplicant.

Certificados e outros arquivos fornecidos aqui precisam ser legíveis pelo usuário `wpa_supplicant`; é, portanto, recomendado armazená-los no diretório `/etc/wpa_supplicant`.

Se o seu protocolo de autenticação de rede exigir acesso de escrita a arquivos, smart cards ou dispositivos TPM, você pode ter que desabilitar o endurecimento de segurança com
```nix
{ networking.wireless.enableHardening = false; }
```

Esta configuração também se aplica a redes configuradas a partir do NetworkManager, a menos que o [backend](#opt-networking.networkmanager.wifi.backend) WiFi em uso não seja o wpa_supplicant.
:::