# Abstrações {#sec-module-abstractions}

Se você se encontra repetindo-se constantemente, é hora de abstrair. Considere, por exemplo, esta configuração do Apache HTTP Server:

```nix
{
  services.httpd.virtualHosts = {
    "blog.example.org" = {
      documentRoot = "/webroot/blog.example.org";
      adminAddr = "alice@example.org";
      forceSSL = true;
      enableACME = true;
    };
    "wiki.example.org" = {
      documentRoot = "/webroot/wiki.example.org";
      adminAddr = "alice@example.org";
      forceSSL = true;
      enableACME = true;
    };
  };
}
```

Ele define dois virtual hosts com configuração quase idêntica; a única diferença são os diretórios de document root. Para evitar essa duplicação, podemos usar um `let`:
```nix
let
  commonConfig = {
    adminAddr = "alice@example.org";
    forceSSL = true;
    enableACME = true;
  };
in
{
  services.httpd.virtualHosts = {
    "blog.example.org" = (commonConfig // { documentRoot = "/webroot/blog.example.org"; });
    "wiki.example.org" = (commonConfig // { documentRoot = "/webroot/wiki.example.org"; });
  };
}
```

O `let commonConfig = ...` define uma variável chamada `commonConfig`. O operador `//` mescla dois conjuntos de atributos, então a configuração do segundo virtual host é o conjunto `commonConfig` estendido com a opção de document root.

Você pode escrever um `let` onde quer que uma expressão seja permitida. Assim, você também poderia ter escrito:

```nix
{
  services.httpd.virtualHosts =
    let
      commonConfig = {
        # ...
      };
    in
    {
      "blog.example.org" = (
        commonConfig
        // {
          # ...
        }
      );
      "wiki.example.org" = (
        commonConfig
        // {
          # ...
        }
      );
    };
}
```

mas não `{ let commonConfig = ...; in ...; }` já que atributos (em oposição a valores de atributos) não são expressões.

**Funções** fornecem outro método de abstração. Por exemplo, suponha que queremos gerar muitos virtual hosts diferentes, todos com configuração idêntica, exceto pelo document root. Isso pode ser feito da seguinte forma:

```nix
{
  services.httpd.virtualHosts =
    let
      makeVirtualHost = webroot: {
        documentRoot = webroot;
        adminAddr = "alice@example.org";
        forceSSL = true;
        enableACME = true;
      };
    in
    {
      "example.org" = (makeVirtualHost "/webroot/example.org");
      "example.com" = (makeVirtualHost "/webroot/example.com");
      "example.gov" = (makeVirtualHost "/webroot/example.gov");
      "example.nl" = (makeVirtualHost "/webroot/example.nl");
    };
}
```

Aqui, `makeVirtualHost` é uma função que recebe um único argumento `webroot` e retorna a configuração para um virtual host. Essa função é então chamada para vários nomes para produzir a lista de configurações de virtual host.