# Mattermost {#sec-mattermost}

O módulo Mattermost do NixOS permite que você construa instâncias [Mattermost](https://mattermost.com) para colaboração via chat, opcionalmente com compilações personalizadas de plugins específicos para sua instância.

Para habilitar o Mattermost usando Postgres, use uma configuração como esta:

```nix
{
  services.mattermost = {
    enable = true;

    # You can change this if you are reverse proxying.
    host = "0.0.0.0";
    port = 8065;

    # Allow modifications to the config from Mattermost.
    mutableConfig = true;

    # Override modifications to the config with your NixOS config.
    preferNixConfig = true;

    socket = {
      # Enable control with the `mmctl` socket.
      enable = true;

      # Exporting the control socket will add `mmctl` to your PATH, and export
      # MMCTL_LOCAL_SOCKET_PATH systemwide. Otherwise, you can get the socket
      # path out of `config.mattermost.socket.path` and set it manually.
      export = true;
    };

    # For example, to disable auto-installation of prepackaged plugins.
    settings.PluginSettings.AutomaticPrepackagedPlugins = false;
  };
}
```

A partir do NixOS 25.05, o Mattermost usa autenticação por pares com Postgres ou MySQL por padrão. Se você usava autenticação por senha no localhost anteriormente, isso será configurado automaticamente se sua `stateVersion` estiver definida para pelo menos `25.05`.

## Usando a derivação Mattermost {#sec-mattermost-derivation}

A derivação `mattermost` do nixpkgs executa todo o conjunto de testes durante a `checkPhase`. Este conjunto de testes é executado com uma instância de banco de dados MySQL e Postgres ativa no sandbox. Se você estiver construindo o Mattermost, isso pode levar um tempo, especialmente se estiver sendo construído em um sistema com recursos limitados.

Os seguintes passthrus são projetados para auxiliar na habilitação ou desabilitação da `checkPhase`:

- `mattermost.withTests`
- `mattermost.withoutTests`

O padrão (`mattermost`) é um alias para `mattermost.withTests`.

## Usando plugins do Mattermost {#sec-mattermost-plugins}

Você pode configurar plugins do Mattermost usando binários pré-compilados ou construindo os seus próprios. Testamos a construção e o uso de plugins no conjunto de testes do NixOS.

Plugins do Mattermost são tarballs contendo um binário Go estaticamente linkado específico do sistema e recursos de webapp.

Aqui está um exemplo com um tarball de plugin pré-compilado:

```nix
{
  services.mattermost = {
    plugins = with pkgs; [
      # todo
      # 0.7.1
      # https://github.com/mattermost/mattermost-plugin-todo/releases/tag/v0.7.1
      (fetchurl {
        # Note: Don't unpack the tarball; the NixOS module will repack it for you.
        url = "https://github.com/mattermost-community/mattermost-plugin-todo/releases/download/v0.7.1/com.mattermost.plugin-todo-0.7.1.tar.gz";
        hash = "sha256-P+Z66vqE7FRmc2kTZw9FyU5YdLLbVlcJf11QCbfeJ84=";
      })
    ];
  };
}
```

Uma vez que o plugin esteja instalado e a configuração reconstruída, você pode habilitar este plugin no Console do Sistema.

## Construindo plugins do Mattermost {#sec-mattermost-plugins-build}

A derivação `mattermost` inclui o passthru `buildPlugin` para construir plugins que usam o template de construção de plugin "padrão" do Mattermost em [mattermost-plugin-demo](https://github.com/mattermost/mattermost-plugin-demo).

Como este é um padrão "de fato" para construir plugins do Mattermost que faz suposições sobre o ambiente de construção, o auxiliar `buildPlugin` tenta se adequar a essas suposições da melhor forma possível.

Veja como construir o plugin Todo acima. Note que dependemos de `package-lock.json` estar montado corretamente, então devemos usar uma versão onde ele esteja! Se não houver um lockfile ou o lockfile estiver incorreto, o Nix não consegue buscar as dependências de construção e tempo de execução do npm para uma construção em sandbox.

```nix
{
  services.mattermost = {
    plugins = with pkgs; [
      (mattermost.buildPlugin {
        pname = "mattermost-plugin-todo";
        version = "0.8-pre";
        src = fetchFromGitHub {
          owner = "mattermost-community";
          repo = "mattermost-plugin-todo";
          # 0.7.1 didn't work, seems to use an older set of node dependencies.
          rev = "f25dc91ea401c9f0dcd4abcebaff10eb8b9836e5";
          hash = "sha256-OM+m4rTqVtolvL5tUE8RKfclqzoe0Y38jLU60Pz7+HI=";
        };
        vendorHash = "sha256-5KpechSp3z/Nq713PXYruyNxveo6CwrCSKf2JaErbgg=";
        npmDepsHash = "sha256-o2UOEkwb8Vx2lDWayNYgng0GXvmS6lp/ExfOq3peyMY=";
        extraGoModuleAttrs = {
          npmFlags = [ "--legacy-peer-deps" ];
        };
      })
    ];
  };
}
```

Veja `pkgs/by-name/ma/mattermost/build-plugin.nix` para todas as opções. Assim como no exemplo anterior, uma vez que o plugin esteja instalado e a configuração reconstruída, você pode habilitar este plugin no Console do Sistema.