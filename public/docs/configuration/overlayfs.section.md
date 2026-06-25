# Overlayfs {#sec-overlayfs}

O NixOS oferece uma abstração conveniente para criar overlays tanto somente leitura quanto graváveis.

```nix
{
  fileSystems = {
    "/writable-overlay" = {
      overlay = {
        lowerdir = [ writableOverlayLowerdir ];
        upperdir = "/.rw-writable-overlay/upper";
        workdir = "/.rw-writable-overlay/work";
      };
      # Mount the writable overlay in the initrd.
      neededForBoot = true;
    };
    "/readonly-overlay".overlay.lowerdir = [
      writableOverlayLowerdir
      writableOverlayLowerdir2
    ];
  };
}
```

Se `upperdir` e `workdir` não forem nulos, eles serão criados antes que o overlay seja montado.

Para montar um overlay como somente leitura, você precisa fornecer pelo menos dois `lowerdir`s.