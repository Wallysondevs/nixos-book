# Kubernetes {#sec-kubernetes}

O módulo Kubernetes do NixOS é um termo coletivo para um conjunto de submódulos individuais que implementam os componentes do cluster Kubernetes.

Existem geralmente duas maneiras de habilitar o Kubernetes no NixOS. Uma maneira é habilitar e configurar os componentes do cluster apropriadamente de forma manual:

```nix
{
  services.kubernetes = {
    apiserver.enable = true;
    controllerManager.enable = true;
    scheduler.enable = true;
    addonManager.enable = true;
    proxy.enable = true;
    flannel.enable = true;
  };
}
```

Outra maneira é atribuir funções de cluster ("master" e/ou "node") ao host. Isso habilita o apiserver, controllerManager, scheduler, addonManager, kube-proxy e etcd:

```nix
{ services.kubernetes.roles = [ "master" ]; }
```

Enquanto isso habilitará apenas o kubelet e o kube-proxy:

```nix
{ services.kubernetes.roles = [ "node" ]; }
```

Atribuir as funções de master e node é útil se você deseja um cluster Kubernetes de nó único para fins de desenvolvimento ou teste:

```nix
{
  services.kubernetes.roles = [
    "master"
    "node"
  ];
}
```

Nota: Atribuir qualquer uma das funções também definirá como padrão `true` para [](#opt-services.kubernetes.flannel.enable) e [](#opt-services.kubernetes.easyCerts). Isso configura o flannel como CNI e ativa o bootstrapping PKI automático.

::: {.note}
É obrigatório configurar:
[](#opt-services.kubernetes.masterAddress).
O masterAddress deve ser resolvível e roteável por todos os nós do cluster.
Em clusters de nó único, isso pode ser definido como `localhost`.
:::

O modo de autorização de controle de acesso baseado em função (RBAC) é habilitado por padrão. Isso significa que solicitações anônimas para a porta segura do apiserver, como esperado, causarão um erro de permissão negada. Todos os componentes do cluster devem, portanto, ser configurados com certificados x509 para comunicação tls bidirecional. A seção de assunto do certificado x509 determina as funções e permissões concedidas pelo apiserver para realizar operações em todo o cluster ou em namespaces. Veja também: [ Usando Autorização RBAC](https://kubernetes.io/docs/reference/access-authn-authz/rbac/).

O módulo kubernetes do NixOS oferece uma opção para bootstrapping e configuração automática de certificados,
[](#opt-services.kubernetes.easyCerts).
O processo de bootstrapping PKI envolve a configuração de um daemon de autoridade de certificação (CA) (cfssl) no nó master do kubernetes. O cfssl gera um CA-cert para o cluster e usa o CA-cert para assinar certificados subordinados emitidos para cada um dos componentes do cluster. Posteriormente, o daemon certmgr monitora os certificados ativos e os renova quando necessário. Para clusters Kubernetes de nó único, definir [](#opt-services.kubernetes.easyCerts) = true é suficiente e nenhuma ação adicional é necessária. Por outro lado, para adicionar máquinas de nó extras a um cluster existente, o estabelecimento de confiança inicial é obrigatório.

Para adicionar novos nós ao cluster: Em qualquer nó do cluster (não master) onde
[](#opt-services.kubernetes.easyCerts)
está habilitado, o script auxiliar `nixos-kubernetes-node-join` está disponível no PATH.
Dado um token na entrada padrão (stdin), ele copiará o token para o diretório de segredos do kubernetes
e reiniciará o serviço certmgr. À medida que os certificados solicitados são emitidos, o
script reiniciará os componentes do cluster kubernetes conforme necessário para que eles
utilizem os novos pares de chaves.

::: {.note}
Clusters multi-master (HA) não são suportados pelo módulo easyCerts.
:::

Para interagir com um cluster habilitado para RBAC como administrador,
é necessário ter privilégios de cluster-admin. Por padrão, quando o easyCerts
está habilitado, um arquivo kubeconfig de cluster-admin é gerado e linkado para
`/etc/kubernetes/cluster-admin.kubeconfig`, conforme determinado por
[](#opt-services.kubernetes.pki.etcClusterAdminKubeconfig).
`export KUBECONFIG=/etc/kubernetes/cluster-admin.kubeconfig` fará com que o
kubectl use este kubeconfig para acessar e autenticar o cluster. O
kubeconfig de cluster-admin referencia um par de chaves auto-gerado de propriedade do
root. Assim, apenas o root no master do kubernetes pode obter direitos de cluster-admin
por meio deste arquivo.