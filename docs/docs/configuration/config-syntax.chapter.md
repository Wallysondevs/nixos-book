# Sintaxe de Configuração {#sec-configuration-syntax}

O arquivo de configuração do NixOS `/etc/nixos/configuration.nix` é, na verdade,
uma *expressão Nix*, que é a linguagem puramente funcional do gerenciador de pacotes Nix
para descrever como construir pacotes e configurações. Isso
significa que você tem todo o poder expressivo dessa linguagem à sua
disposição, incluindo a capacidade de abstrair padrões comuns, o que
é muito útil ao gerenciar sistemas complexos. A sintaxe e a semântica
da linguagem Nix estão totalmente descritas no [manual do
Nix](https://nixos.org/nix/manual/#chap-writing-nix-expressions), mas
aqui apresentamos uma breve visão geral das construções mais importantes úteis nos
arquivos de configuração do NixOS.

```{=include=} sections
config-file.section.md
abstractions.section.md
modularity.section.md
```