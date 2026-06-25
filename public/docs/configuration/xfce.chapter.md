# Ambiente de Desktop Xfce {#sec-xfce}

Para habilitar o Ambiente de Desktop Xfce, defina

```nix
{
  services.xserver.desktopManager.xfce.enable = true;
  services.displayManager.defaultSession = "xfce";
}
```

Opcionalmente, *picom* pode ser habilitado para efeitos gráficos agradáveis, algumas configurações de exemplo:

```nix
{
  services.picom = {
    enable = true;
    fade = true;
    inactiveOpacity = 0.9;
    shadow = true;
    fadeDelta = 4;
  };
}
```

Alguns programas Xfce não são instalados automaticamente. Para instalá-los manualmente (em todo o sistema), coloque-os em seu
[](#opt-environment.systemPackages).

## Thunar {#sec-xfce-thunar-plugins}

Thunar (o gerenciador de arquivos do Xfce) é habilitado automaticamente quando o Xfce é habilitado. Para habilitar o Thunar sem habilitar o Xfce, use a opção de configuração [](#opt-programs.thunar.enable) em vez de adicionar `pkgs.thunar` a [](#opt-environment.systemPackages).

Se você gostaria de adicionar plugins extras ao Thunar, adicione-os a [](#opt-programs.thunar.plugins). Você não deve simplesmente adicioná-los a [](#opt-environment.systemPackages).

## Solução de Problemas {#sec-xfce-troubleshooting}

Mesmo depois de habilitar o udisks2, o gerenciamento de volume pode não funcionar. O Thunar e/ou o desktop demoram para aparecer. O Thunar exibirá este tipo de mensagem ao iniciar (verifique `journalctl --user -b`).

```plain
Thunar:2410): GVFS-RemoteVolumeMonitor-WARNING **: remote volume monitor with dbus name org.gtk.Private.UDisks2VolumeMonitor is not supported
```

Isso é causado por alguns serviços GNOME necessários que não estão em execução. Tudo isso é corrigido habilitando "Launch GNOME services on startup" (Iniciar serviços GNOME na inicialização) na aba Avançado do painel de configurações de Sessão e Inicialização. Alternativamente, você pode executar este comando para fazer a mesma coisa.

```ShellSession
$ xfconf-query -c xfce4-session -p /compat/LaunchGNOME -s true
```

É necessário sair e fazer login novamente para que isso tenha efeito.