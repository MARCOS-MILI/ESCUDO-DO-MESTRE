# Notas pro Claude (Escudo do Mestre)

Site pessoal do mestre (Marcos, apelido Mili) pra consultar durante a Sessão das Oito. HTML, CSS e JS puros, sem build,
sem banco. Publicado pelo GitHub Pages a partir da `main`, pasta raiz.

## Como trabalhar com o Marcos
- Ele escreve por voz no celular, em português do Brasil informal. Interpretar a intenção, não ler ao pé da letra.
- Prefere que o Claude execute em vez de perguntar muito. Perguntar só o que não dá pra desfazer.
- Respostas curtas, que leiam bem na tela do celular.
- Textos do site em português do Brasil natural: sem travessão, sem formalidade exagerada.
- PROPOSTA ou SUGESTÃO no texto quer dizer ideia ainda não confirmada por ele.

## Decidido pelo Marcos
- 14/11/2026: o Escudo fica público e sem senha. Não propor senha de novo.
- 15/11/2026: minigames (rádio, Morse, projetor) ficam no site dos jogadores, em `sessao-das-oito/jogos/`. A aba Links tem os dois endereços.

## Regras do repositório
- Repositório público. Nunca escrever senha (quadro, fichas, terminal, Supabase) em arquivo nenhum.
- Nunca mandar o endereço deste site pros jogadores. Imagens pros jogadores saem de `sessao-das-oito/pecas/`
  (ver `imgUrl` em `app.js`); imagens só do mestre usam `ownUrl`.
- Conteúdo de texto em `data.js` e `npcs.js`. Conta dos dados em `dados.js` (funções puras, roda no node).
- Testar no celular (largura 390 px) antes de subir: `python3 -m http.server` na pasta e abrir no Playwright.
- O site irmão é o repositório `MARCOS-MILI/sessao-das-oito` (quadro, ficha, terminal, peças dos jogadores).
