# Subversion {#module-services-subversion}

[Subversion](https://subversion.apache.org/) é um sistema de controle de versão centralizado. Ele pode usar uma [variedade de protocolos](https://svnbook.red-bean.com/en/1.7/svn-book.html#svn.serverconfig.choosing) para comunicação entre cliente e servidor.

## Subversion dentro do Apache HTTP {#module-services-subversion-apache-httpd}

Esta seção foca na configuração de um servidor baseado em web sobre o servidor Apache HTTP, que usa [WebDAV](http://www.webdav.org/)/[DeltaV](http://www.webdav.org/deltav/WWW10/deltav-intro.htm) para comunicação.

Para mais informações sobre a configuração geral, por favor, consulte a [seção apropriada do livro do Subversion](https://svnbook.red-bean.com/en/1.7/svn-book.html#svn.serverconfig.httpd).

Para configurar, inclua em `/etc/nixos/configuration.nix` o código para ativar o Apache HTTP, definindo [](#opt-services.httpd.adminAddr) apropriadamente:

```nix
{
  services.httpd.enable = true;
  services.httpd.adminAddr = "...";
  networking.firewall.allowedTCPPorts = [
    80
    443
  ];
}
```

Para um servidor Subversion simples com autenticação básica, configure o módulo Subversion para Apache da seguinte forma, definindo `hostName` e `documentRoot` apropriadamente, e `SVNParentPath` para o diretório pai dos repositórios, `AuthzSVNAccessFile` para o local do arquivo `.authz` que descreve a permissão de acesso, e `AuthUserFile` para o arquivo de senha.

```nix
{
  services.httpd.extraModules = [
    # note that order is *super* important here
    {
      name = "dav_svn";
      path = "${pkgs.apacheHttpdPackages.subversion}/modules/mod_dav_svn.so";
    }
    {
      name = "authz_svn";
      path = "${pkgs.apacheHttpdPackages.subversion}/modules/mod_authz_svn.so";
    }
  ];
  services.httpd.virtualHosts = {
    "svn" = {
      hostName = HOSTNAME;
      documentRoot = DOCUMENTROOT;
      locations."/svn".extraConfig = ''
        DAV svn
        SVNParentPath REPO_PARENT
        AuthzSVNAccessFile ACCESS_FILE
        AuthName "SVN Repositories"
        AuthType Basic
        AuthUserFile PASSWORD_FILE
        Require valid-user
      '';
    };
  };
}
```

A chave `"svn"` é apenas um nome simbólico que identifica o virtual host. O `"/svn"` em `locations."/svn".extraConfig` é o caminho sob o qual os repositórios serão servidos.

[Esta página](https://wiki.archlinux.org/index.php/Subversion) explica como configurar o próprio Subversion. Isso se resume ao seguinte:

Sob `REPO_PARENT`, os repositórios podem ser configurados da seguinte forma:

```ShellSession
$ svn create REPO_NAME
```

Os arquivos do repositório precisam ser acessíveis por `wwwrun`:

```ShellSession
$ chown -R wwwrun:wwwrun REPO_PARENT
```

O arquivo de senha `PASSWORD_FILE` pode ser criado da seguinte forma:

```ShellSession
$ htpasswd -cs PASSWORD_FILE USER_NAME
```

Usuários adicionais podem ser configurados de forma similar, omitindo a flag `c`:

```ShellSession
$ htpasswd -s PASSWORD_FILE USER_NAME
```

O arquivo que descreve as permissões de acesso `ACCESS_FILE` terá uma aparência semelhante à seguinte:

```
[/]
* = r

[REPO_NAME:/]
USER_NAME = rw
```

Os repositórios Subversion serão acessíveis como `http://HOSTNAME/svn/REPO_NAME`.