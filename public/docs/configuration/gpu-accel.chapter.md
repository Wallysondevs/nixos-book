# Aceleração de GPU {#sec-gpu-accel}

O NixOS oferece várias APIs que se beneficiam da aceleração de hardware de GPU, como VA-API e VDPAU para reprodução de vídeo; OpenGL e Vulkan para gráficos 3D; e OpenCL para computação de propósito geral. Este capítulo descreve como configurar a aceleração de hardware de GPU (na medida em que isso não é feito automaticamente) e como verificar se a aceleração de hardware está de fato sendo utilizada.

A maioria das APIs mencionadas é agnóstica em relação ao servidor de exibição utilizado. Consequentemente, estas instruções devem ser aplicáveis tanto ao X Window System quanto aos compositores Wayland.

## OpenCL {#sec-gpu-accel-opencl}

[OpenCL](https://en.wikipedia.org/wiki/OpenCL) é uma API de computação de propósito geral. É utilizada por várias aplicações como Blender e Darktable para acelerar certas operações.

Aplicações OpenCL carregam drivers através do mecanismo *Installable Client Driver* (ICD). Neste mecanismo, um arquivo ICD especifica o caminho para o driver OpenCL para uma família de GPU específica. No NixOS, existem duas maneiras de tornar os arquivos ICD visíveis para o carregador ICD. A primeira é através da variável de ambiente `OCL_ICD_VENDORS`. Esta variável pode conter um diretório que é escaneado pelo carregador ICL em busca de arquivos ICD. Por exemplo:

```ShellSession
$ export \
  OCL_ICD_VENDORS=`nix-build '<nixpkgs>' --no-out-link -A rocmPackages.clr.icd`/etc/OpenCL/vendors/
```

O segundo mecanismo é adicionar o pacote do driver OpenCL a
[](#opt-hardware.graphics.extraPackages).
Isso vincula o arquivo ICD em `/run/opengl-driver`, onde ele será visível para o carregador ICD.

A instalação correta dos drivers OpenCL pode ser verificada através do comando `clinfo` do pacote clinfo. Este comando reportará o número de dispositivos de hardware encontrados e fornecerá informações detalhadas para cada dispositivo:

```ShellSession
$ clinfo | head -n3
Number of platforms  1
Platform Name        AMD Accelerated Parallel Processing
Platform Vendor      Advanced Micro Devices, Inc.
```

### AMD {#sec-gpu-accel-opencl-amd}

GPUs AMD [Graphics Core Next](https://en.wikipedia.org/wiki/Graphics_Core_Next) (GCN) modernas são suportadas através do pacote rocmPackages.clr.icd. Adicionar este pacote a
[](#opt-hardware.graphics.extraPackages)
habilita o suporte a OpenCL:

```nix
{ hardware.graphics.extraPackages = [ rocmPackages.clr.icd ]; }
```

### Intel {#sec-gpu-accel-opencl-intel}

[GPUs Intel Gen12 e posteriores](https://en.wikipedia.org/wiki/List_of_Intel_graphics_processing_units#Gen12) são suportadas pelo runtime Intel NEO OpenCL que é fornecido pelo pacote `intel-compute-runtime`. As gerações anteriores (8, 9 e 11) foram movidas para o pacote `intel-compute-runtime-legacy1`. O runtime proprietário Intel OpenCL, no pacote `intel-ocl`, é uma alternativa para GPUs Gen7.

Ambos os pacotes `intel-compute-runtime`, assim como o pacote `intel-ocl`, podem ser adicionados a
[](#opt-hardware.graphics.extraPackages)
para habilitar o suporte a OpenCL. Por exemplo, para GPUs Gen12 e posteriores, a seguinte configuração pode ser usada:

```nix
{ hardware.graphics.extraPackages = [ intel-compute-runtime ]; }
```

## Vulkan {#sec-gpu-accel-vulkan}

[Vulkan](https://en.wikipedia.org/wiki/Vulkan_(API)) é uma API de gráficos e computação para GPUs. É utilizada diretamente por jogos ou indiretamente através de camadas de compatibilidade como [DXVK](https://github.com/doitsujin/dxvk/wiki).

Por padrão, se [](#opt-hardware.graphics.enable)
estiver habilitado, o Mesa é instalado e fornece Vulkan para hardware suportado.

Similar ao OpenCL, os drivers Vulkan são carregados através do mecanismo *Installable Client Driver* (ICD). Os arquivos ICD para Vulkan são arquivos JSON que especificam o caminho para a biblioteca do driver e a versão Vulkan suportada. Todos os drivers carregados com sucesso são expostos à aplicação como diferentes GPUs. No NixOS, existem duas maneiras de tornar os arquivos ICD visíveis para aplicações Vulkan: uma variável de ambiente e uma opção de módulo.

A maneira de fazer isso é adicionar o pacote do driver Vulkan a
[](#opt-hardware.graphics.extraPackages).
Isso vincula o arquivo ICD em `/run/opengl-driver`, onde ele será visível para o carregador ICD.

A instalação correta dos drivers Vulkan pode ser verificada através do comando `vulkaninfo` do pacote vulkan-tools. Este comando reportará os dispositivos de hardware e drivers encontrados, neste exemplo de saída amdvlk e radv:

```ShellSession
$ vulkaninfo | grep GPU
                GPU id  : 0 (Unknown AMD GPU)
                GPU id  : 1 (AMD RADV NAVI10 (LLVM 9.0.1))
     ...
GPU0:
        deviceType     = PHYSICAL_DEVICE_TYPE_DISCRETE_GPU
        deviceName     = Unknown AMD GPU
GPU1:
        deviceType     = PHYSICAL_DEVICE_TYPE_DISCRETE_GPU
```

Uma aplicação gráfica simples que usa Vulkan é `vkcube` do pacote vulkan-tools.

### AMD {#sec-gpu-accel-vulkan-amd}

GPUs AMD [Graphics Core Next](https://en.wikipedia.org/wiki/Graphics_Core_Next) (GCN) modernas são suportadas através do driver RADV, que faz parte do mesa.

## VA-API {#sec-gpu-accel-va-api}

[VA-API (Video Acceleration API)](https://www.intel.com/content/www/us/en/developer/articles/technical/linuxmedia-vaapi.html) é uma biblioteca de código aberto e especificação de API, que fornece acesso a capacidades de aceleração de hardware gráfico para processamento de vídeo.

Os drivers VA-API são carregados por `libva`. A versão em nixpkgs é construída para procurar o caminho do driver opengl, então os drivers podem ser instalados em
[](#opt-hardware.graphics.extraPackages).

VA-API pode ser testado usando:

```ShellSession
$ nix-shell -p libva-utils --run vainfo
```

### Intel {#sec-gpu-accel-va-api-intel}

GPUs Intel modernas usam o driver iHD, que pode ser instalado com:

```nix
{ hardware.graphics.extraPackages = [ intel-media-driver ]; }
```

GPUs Intel mais antigas usam o driver i965, que pode ser instalado com:

```nix
{ hardware.graphics.extraPackages = [ intel-vaapi-driver ]; }
```

## Problemas comuns {#sec-gpu-accel-common-issues}

### Permissões de usuário {#sec-gpu-accel-common-issues-permissions}

Exceto onde explicitamente observado, não deve ser necessário ajustar as permissões de usuário para usar estas APIs de aceleração. Na configuração padrão, os dispositivos de GPU têm permissões de leitura/escrita para todos (`/dev/dri/renderD*`) ou são marcados como `uaccess` (`/dev/dri/card*`). As listas de controle de acesso de dispositivos com a tag `uaccess` serão atualizadas automaticamente quando um usuário fizer login através do `systemd-logind`. Por exemplo, se o usuário *alice* estiver logado, a lista de controle de acesso deve ser a seguinte:

```ShellSession
$ getfacl /dev/dri/card0
# file: dev/dri/card0
# owner: root
# group: video
user::rw-
user:alice:rw-
group::rw-
mask::rw-
other::---
```

Se você desabilitou (esta funcionalidade do) `systemd-logind`, pode ser necessário adicionar o usuário ao grupo `video` e fazer login novamente.

### Misturando diferentes versões de nixpkgs {#sec-gpu-accel-common-issues-mixing-nixpkgs}

O mecanismo *Installable Client Driver* (ICD) usado por OpenCL e Vulkan carrega runtimes em seu espaço de endereço usando `dlopen`. Misturar um mecanismo de carregador ICD e runtimes de diferentes versões de nixpkgs pode não funcionar. Por exemplo, se o carregador ICD usar uma versão mais antiga de glibc do que o runtime, o runtime pode não ser carregável devido a símbolos ausentes. Infelizmente, o carregador geralmente não reportará tais problemas.

Se você suspeitar que está enfrentando incompatibilidades de versão de biblioteca entre um carregador ICL e um runtime, você pode executar uma aplicação com a variável `LD_DEBUG` definida para obter mais informações de diagnóstico. Por exemplo, OpenCL pode ser testado com `LD_DEBUG=files clinfo`, o que deve reportar símbolos ausentes.