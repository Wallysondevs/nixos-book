# Manual do NixOS {#book-nixos-manual}
## Versão @NIXOS_VERSION@

<!--
  este é o arquivo de estrutura de nível superior para o manual do NixOS.

  a estrutura do manual estende o commonmark do nixpkgs com blocos de inclusão
  para permitir uma melhor organização do texto de entrada. existem seis tipos de
  blocos de inclusão: preface, parts, chapters, sections, appendix e options.
  cada tipo, exceto `options`, corresponde aos elementos docbook de (aproximadamente)
  o mesmo nome, e pode, por si só, incluir mais blocos para denotar sua
  subestrutura.

  blocos de inclusão que não são `options` são blocos de código cercados que listam uma série de
  arquivos a serem incluídos, no formato

     ```{=include=} <type>
     <file-name-1>
     <file-name-2>
     <...>
     ```

  blocos de inclusão `options` não listam nomes de arquivos, mas contêm uma lista de pares chave-valor
  que descrevem as opções a serem incluídas e como convertê-las em
  elementos do tipo de saída do manual:

      ```{=include=} options
      id-prefix: <options id prefix>
      list-id: <variable list element id>
      source: <path to options.json>
      ```

-->

```{=include=} preface
preface.md
```

```{=include=} parts
installation/installation.md
configuration/configuration.md
administration/running.md
development/development.md
```

```{=include=} chapters
contributing-to-this-manual.chapter.md
```

```{=include=} appendix html:into-file=//options.html
nixos-options.md
```

```{=include=} appendix html:into-file=//release-notes.html
release-notes/release-notes.md
```