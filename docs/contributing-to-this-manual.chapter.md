# Contribuindo para este manual {#chap-contributing}

As fontes do manual do NixOS estão no subdiretório [nixos/doc/manual](https://github.com/NixOS/nixpkgs/tree/master/nixos/doc/manual) do repositório [Nixpkgs](https://github.com/NixOS/nixpkgs).
Este manual utiliza a [sintaxe do manual do Nixpkgs](https://github.com/NixOS/nixpkgs/blob/master/doc/README.md#syntax) e as [convenções estilísticas](https://github.com/NixOS/nixpkgs/blob/master/doc/README.md#documentation-conventions).

Você pode verificar rapidamente suas edições com o seguinte:

```ShellSession
$ cd /path/to/nixpkgs
$ $EDITOR nixos/doc/manual/... # edit the manual
$ nix-build nixos/release.nix -A manual.x86_64-linux
```

Se a compilação for bem-sucedida, o manual estará em `./result/share/doc/nixos/index.html`.

As instruções acima não abordam o apêndice de opções `configuration.nix` disponíveis, nem as páginas de manual relacionadas ao NixOS. Estes são construídos e escritos em um local e formato diferentes, conforme explicado nas próximas seções.

## Ambiente de desenvolvimento {#sec-contributing-development-env}

Para reduzir a repetição, considere usar as ferramentas do ambiente de desenvolvimento fornecido:

Carregue-o do diretório de documentação do NixOS com

```ShellSession
$ cd /path/to/nixpkgs/nixos/doc/manual
$ nix-shell
```

Para carregar os utilitários de desenvolvimento automaticamente ao entrar nesse diretório, [configure o `nix-direnv`](https://nix.dev/guides/recipes/direnv).

Certifique-se de que seus arquivos locais não sejam adicionados ao histórico do Git, adicionando as seguintes linhas a `.git/info/exclude` na raiz do repositório Nixpkgs:

```
/**/.envrc
/**/.direnv
```

### `devmode` {#sec-contributing-devmode}

Use [`devmode`](https://github.com/NixOS/nixpkgs/blob/master/pkgs/by-name/de/devmode/README.md) para uma pré-visualização ao vivo ao editar o manual.

## Testando redirecionamentos {#sec-contributing-redirects}

Uma vez que você tenha uma compilação bem-sucedida, você pode abrir o HTML relevante (caminho mencionado acima) em um navegador junto com a âncora, e observar o redirecionamento.

Note que se você já carregou a página e *então* inseriu a âncora, você precisará realizar um recarregamento. Isso ocorre porque os navegadores não reexecutam o código JS do cliente quando apenas a âncora foi alterada.

## Contribuindo para a documentação das opções de `configuration.nix` {#sec-contributing-options}

A documentação para todas as diferentes opções de `configuration.nix` é gerada automaticamente lendo as `description`s de todas as opções do NixOS definidas em `nixos/modules/`. Se você deseja melhorar tal `description`, encontre-a no diretório `nixos/modules/`, edite-a e abra um pull request.

Para ver como suas alterações são renderizadas na web, execute novamente:

```ShellSession
$ nix-build nixos/release.nix -A manual.x86_64-linux
```

E você verá as alterações no apêndice no caminho `result/share/doc/nixos/options.html`.

Você também pode compilar apenas a página de manual `configuration.nix(5)`, via:

```ShellSession
$ cd /path/to/nixpkgs
$ nix-build nixos/release.nix -A nixos-configuration-reference-manpage.x86_64-linux
```

E observe o resultado via:

```ShellSession
$ man --local-file result/share/man/man5/configuration.nix.5
```

Se você estiver em uma arquitetura diferente que seja suportada pelo NixOS (verifique o arquivo `nixos/release.nix` no repositório do Nixpkgs), então substitua `x86_64-linux` pela arquitetura. O `nix-build` reclamará caso contrário, mas também deve informar qual arquitetura você possui + as suportadas.

## Contribuindo para as manpages das ferramentas `nixos-*` {#sec-contributing-nixos-tools}

As páginas de manual para as ferramentas disponíveis na imagem de instalação podem ser encontradas no Nixpkgs executando (por exemplo, para `nixos-rebuild`):

```ShellSession
$ git ls | grep nixos-rebuild.8
```

As manpages são escritas no [formato `mdoc(7)`](https://mandoc.bsd.lv/man/mdoc.7.html) e devem ser portáveis entre mandoc e groff para renderização (exceto por pequenas diferenças, notavelmente diferentes regras de espaçamento).

Para uma pré-visualização, execute `man --local-file path/to/file.8`.

Sendo escritas em `mdoc`, estas manpages utilizam marcação semântica. As subseções a seguir fornecem uma diretriz sobre onde aplicar quais elementos semânticos.

### Linhas de comando e argumentos {#ssec-contributing-nixos-tools-cli-and-args}

Em qualquer manpage, comandos, flags e argumentos para o executável *atual* devem ser marcados de acordo com sua semântica. Comandos, flags e argumentos passados para *outros* executáveis não devem ser marcados dessa forma e devem ser considerados como exemplos de código e marcados com `Ql`.

- Use `Fl` para marcar argumentos de flag, `Ar` para seus argumentos.
- Argumentos repetidos devem ser marcados adicionando uma elipse (escrita com pontos, `...`).
- Use `Cm` para marcar argumentos de string literais, por exemplo, o argumento de comando `boot` passado para `nixos-rebuild`.
- Flags ou argumentos opcionais devem ser marcados com `Op`. Isso inclui argumentos repetidos opcionais.
- Flags ou argumentos obrigatórios não devem ser marcados.
- Grupos de argumentos mutuamente exclusivos devem ser envolvidos em chaves, preferencialmente criados com blocos `Bro`/`Brc`.

Quando um argumento é usado em um exemplo, ele deve ser marcado com `Ar` novamente para diferenciá-lo de uma constante. Por exemplo, um comando com uma opção `--host name` que chama ssh para recuperar a hora local do host significaria isso da seguinte forma:
```
This will run
.Ic ssh Ar name Ic time
to retrieve the remote time.
```

### Caminhos, opções do NixOS, variáveis de ambiente {#ssec-contributing-nixos-tools-options-and-environment}

Caminhos constantes devem ser marcados com `Pa`, opções do NixOS com `Va`, e variáveis de ambiente com `Ev`.

Caminhos gerados, por exemplo, `result/bin/run-hostname-vm` (onde `hostname` é uma variável ou argumentos) devem ser marcados como literais `Ql` inline com seus componentes variáveis marcados apropriadamente.

 - Quando `hostname` se refere a um argumento, ele se torna `.Ql result/bin/run- Ns Ar hostname Ns -vm`
 - Quando `hostname` se refere a uma variável, ele se torna `.Ql result/bin/run- Ns Va hostname Ns -vm`

### Exemplos de código e outros comandos {#ssec-contributing-nixos-tools-code-examples}

Em texto livre, nomes e invocações completas de outros comandos (por exemplo, `ssh` ou `tar -xvf src.tar`) devem ser marcados com `Ic`, fragmentos de linhas de comando devem ser marcados com `Ql`.

Blocos de código maiores ou aqueles que não podem ser mostrados inline devem usar marcação de bloco de exibição literal indentada para seu conteúdo, ou seja,

```
.Bd -literal -offset indent
...
.Ed
```

O conteúdo dos blocos de código pode ser marcado ainda mais, por exemplo, se eles se referirem a argumentos que serão substituídos neles:

```
.Bd -literal -offset indent
{
  config.networking.hostname = "\c
.Ar hostname Ns \c
";
}
.Ed
```