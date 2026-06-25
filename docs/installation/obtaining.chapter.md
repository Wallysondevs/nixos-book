# Obtendo NixOS {#sec-obtaining}

As imagens ISO do NixOS podem ser baixadas da [página de download do NixOS](https://nixos.org/download.html#nixos-iso). Siga as instruções em [](#sec-booting-from-usb) para criar um pendrive USB inicializável.

Se você tem um sistema muito antigo que não consegue inicializar a partir de USB, você pode gravar a imagem em um CD vazio. O NixOS pode não funcionar muito bem em tais sistemas.

Como alternativa à instalação do NixOS por conta própria, você pode obter um sistema NixOS em funcionamento por meio de vários outros métodos:

-   Usando appliances virtuais no formato Open Virtualization Format (OVF) que podem ser importados para o VirtualBox. Estes estão disponíveis na [página de download do NixOS](https://nixos.org/download.html#nixos-virtualbox).

-   Usando AMIs para o EC2 da Amazon. Para encontrar um para sua região, por favor, consulte a [página de download](https://nixos.org/download.html#nixos-amazon).

-   Usando NixOps, a ferramenta de implantação em nuvem baseada em NixOS, que permite provisionar instâncias NixOS do VirtualBox e EC2 a partir de especificações declarativas. Confira a [página inicial do NixOps](https://nixos.org/nixops) para detalhes.