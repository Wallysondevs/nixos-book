# Instalando atrás de um proxy {#sec-installing-behind-proxy}

Para instalar o NixOS atrás de um proxy, faça o seguinte antes de executar `nixos-install`.

1.  Atualize a configuração do proxy em `/mnt/etc/nixos/configuration.nix` para manter a internet acessível após a reinicialização.

    ```nix
    {
      networking.proxy.default = "http://user:password@proxy:port/";
      networking.proxy.noProxy = "127.0.0.1,localhost,internal.domain";
    }
    ```

1.  Configure as variáveis de ambiente do proxy no shell onde você está executando `nixos-install`.

    ```ShellSession
    # proxy_url="http://user:password@proxy:port/"
    # export http_proxy="$proxy_url"
    # export HTTP_PROXY="$proxy_url"
    # export https_proxy="$proxy_url"
    # export HTTPS_PROXY="$proxy_url"
    ```

::: {.note}
Se você estiver trocando de redes com diferentes configurações de proxy, use a opção `specialisation` em `configuration.nix` para alternar proxies em tempo de execução. Consulte [](#ch-options) para mais informações.
:::