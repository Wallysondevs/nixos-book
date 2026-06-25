# NetworkManager {#sec-networkmanager}

Para facilitar a configuração de rede, alguns ambientes de desktop usam NetworkManager. Você pode habilitar o NetworkManager definindo:

```nix
{ networking.networkmanager.enable = true; }
```

alguns gerenciadores de desktop (por exemplo, GNOME) habilitam o NetworkManager automaticamente para você.

Todos os usuários que devem ter permissão para alterar as configurações de rede devem pertencer ao grupo `networkmanager`:

```nix
{ users.users.alice.extraGroups = [ "networkmanager" ]; }
```

O NetworkManager é controlado usando `nmcli` ou `nmtui` (interface de usuário de terminal baseada em curses). Consulte suas páginas de manual para detalhes sobre seu uso. Alguns ambientes de desktop (GNOME, KDE) possuem suas próprias ferramentas de configuração para o NetworkManager. No XFCE, não há ferramenta de configuração para o NetworkManager por padrão: ao habilitar [](#opt-programs.nm-applet.enable), o applet gráfico será instalado e será iniciado automaticamente quando a sessão gráfica for iniciada.

::: {.note}
`networking.networkmanager` e `networking.wireless` (WPA Supplicant) podem ser usados juntos, se desejado. Para fazer isso, você precisa instruir o NetworkManager a ignorar essas interfaces, como:

```nix
{
  networking.networkmanager.unmanaged = [
    "*"
    "except:type:wwan"
    "except:type:gsm"
  ];
}
```

Consulte a descrição da opção para a sintaxe exata e referências à documentação externa.
:::