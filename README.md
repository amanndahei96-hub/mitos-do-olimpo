# OLYMPUS — Mitologia Grega Clássica

Portal estático responsivo sobre mitologia grega, com página inicial, mapa interativo e panteão, linha do tempo e uma página multimídia.

## Abrir o site

- Site publicado (se o GitHub Pages estiver habilitado): https://amanndahei96-hub.github.io/mitos-do-olimpo/
- Localmente, baixe/clone o repositório e abra `index.html` no navegador. Também pode usar a extensão Live Server no VS Code.

## Páginas

- `index.html` — apresentação, destaques e galeria de monumentos/esculturas.
- `deuses.html` — mapa SVG interativo, galeria e tabela dos deuses.
- `mitos.html` — cosmogonias, linha do tempo expansível e comparação de versões.
- `video.html` — equipe, fontes e player com opção para selecionar um vídeo local.
- `css/style.css` — design responsivo, paleta azul-marinho/dourado e tipografia Cinzel/Inter.
- `js/main.js` — menu móvel, timeline, mapa acessível, player e partículas.

## Imagens e vídeo

Os arquivos `.url` enviados anteriormente são atalhos para caminhos `file:///C:/...`, não os JPG. Para evitar imagens quebradas, as páginas usam imagens públicas do Wikimedia Commons. Se preferir as imagens originais, salve os arquivos reais em `assets/images/` e atualize as referências em `index.html` e `deuses.html`.

O vídeo original não foi anexado. A página de vídeo permite selecionar MP4/WebM do dispositivo, sem apresentar uma demonstração de terceiros como trabalho das autoras. Para hospedar o vídeo, adicione o arquivo real ao projeto e configure a tag `<video>` para apontar para ele.

## Publicar com GitHub Pages

No GitHub, abra **Settings → Pages**, selecione **Deploy from a branch**, escolha `main` e `/ (root)` e salve. O endereço esperado é https://amanndahei96-hub.github.io/mitos-do-olimpo/.
