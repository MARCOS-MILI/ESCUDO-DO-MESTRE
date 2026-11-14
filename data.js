/* Conteúdo do Escudo do Mestre. Tudo que está como SUGESTÃO é proposta que o Marcos ainda não confirmou. */
window.CFG = {
  base: 'https://marcos-mili.github.io/sessao-das-oito/'
};

window.GRUPOS = {
  poder: ['PODER', '#24456e'],
  cinema: ['CINE REX', '#8a2222'],
  cidade: ['CIDADE', '#a06b14'],
  igreja: ['IGREJA', '#5a3a80'],
  familia: ['FAMÍLIA', '#2f6a42']
};

window.STATUS = {
  nao: ['NÃO AFETADO', 'ok'],
  sim: ['AFETADO', 'ruim'],
  ini: ['JÁ COMEÇOU', 'meio'],
  dep: ['MESTRE DECIDE', 'neutro']
};

/* ------------------------------------------------------------------ REGRAS */
window.REGRAS = [
  {
    id: 'teste', titulo: 'Teste básico', resumo: 'Dado do atributo + dado da perícia. Total >= DT passa.',
    itens: [
      'Rola o dado do <b>atributo</b> e o dado da <b>perícia</b> e soma. Se o total for igual ou maior que a <b>DT</b>, passou.',
      'DT padrão é <b>7</b>. No PDF aparecem DTs de 6 a 13, e <b>10</b> já é difícil.',
      '<b>Teste oposto:</b> cada um rola o seu e vence o maior total.',
      'Atributos: <b>Físico, Mente, Emoção</b>. Perícias são 20 (mais Tecnologia e Pilotagem, extras do mestre pra 1978).'
    ]
  },
  {
    id: 'escada', titulo: 'Escada dos dados', resumo: 'd4, d6, d8, d10, d12. Subir ou descer um passo.',
    itens: [
      '<b>Atributos:</b> d4 abaixo da média, d6 adulto comum, d8 acima da média, d10 um dos melhores da região, d12 ápice humano.',
      '<b>Perícias:</b> d4 destreinado, d6 treinado, d8 especialista, d10 mestre, d12 grão-mestre.',
      '<b>Passo:</b> aumentar sobe um dado na escada (d4, d6, d8, d10, d12). Reduzir desce. Não passa de d12 nem cai abaixo de d4.',
      '<b>Dados extras:</b> bônus como +1d6 entram na soma. Limite: no máximo <b>4 dados rolados e 3 somados</b> por teste (o Dados do Escudo soma os 3 maiores).'
    ]
  },
  {
    id: 'ra', titulo: 'Rolagem alta e baixa (RA e RB)', resumo: 'RA é o maior valor que saiu. RB é o menor. Dano de arma é RA + modificador.',
    itens: [
      'RA e RB são o maior e o menor valor entre os dados do teste, não importa de qual dado.',
      'O dano de uma arma é a <b>RA mais o modificador</b> dela (ex.: RA+3).',
      'A cura da Benzedeira (Reza e Erva) também usa a RA.'
    ]
  },
  {
    id: 'critico', titulo: 'Crítico e falha crítica', resumo: 'Dois dados iguais de 6 pra cima passam. Todos em 1 falham.',
    itens: [
      '<b>Sucesso crítico:</b> dois ou mais dados com o mesmo valor, e esse valor sendo <b>6 ou mais</b>. Passa automático.',
      '<b>Falha crítica:</b> todos os dados em <b>1</b>. Falha automática, com penalidade: rola 1d8 e vê a tabela (vexame, um atributo cai um passo na cena, perde 1d4 PV, perde 1d4 PD, perde um item, ou nada).'
    ]
  },
  {
    id: 'ajudar', titulo: 'Ajudar', resumo: 'Gasta a ação e dá aumento de passo a quem recebe.',
    itens: [
      'Gasta a sua ação e escolhe uma perícia coerente em que tenha pelo menos <b>d6</b>.',
      'Quem recebe ganha <b>1 aumento de passo</b> (se a sua perícia for d6 ou d8) ou <b>2</b> (se for d10 ou d12).'
    ]
  },
  {
    id: 'pvpd', titulo: 'PV, PD, lesão e trauma', resumo: 'PV é a vida. PD é a determinação. Zerar pede teste.',
    itens: [
      '<b>PV</b> é a vida (dano físico). <b>PD</b> é a determinação (dano emocional, susto, medo).',
      '<b>0 PV:</b> teste de lesão, Físico + Vigor, DT 7 (+3 a cada teste na cena). Pode ficar inconsciente, sofrer uma lesão (tabela d20) ou morrer.',
      '<b>0 PD:</b> teste de trauma, Emoção + Disciplina, DT 7 (+3 a cada teste na cena). Falhou: tabela de traumas (d20).',
      'No fim da cena, quem estava com 0 PV volta com <b>1 PV</b>.',
      'Na mesa do Marcos as habilidades dos jogadores <b>custam PD</b> (2 ou 3 por uso), em vez de "uma vez por cena".'
    ]
  },
  {
    id: 'cenas', titulo: 'Cenas e rodadas', resumo: 'Jogo livre por padrão. Rodadas só quando precisar.',
    itens: [
      'A sessão é dividida em <b>cenas</b> (um lugar ou uma situação). Por padrão o jogo é livre e cada um age quando quer.',
      'O mestre pode usar <b>rodadas</b>: cada jogador faz uma ação importante (mais ações pequenas, como falar uma frase) e os NPCs agem por último.'
    ]
  },
  {
    id: 'invest', titulo: 'Cena de investigação (passo a passo)', resumo: 'Ponto de interesse, Investigar ou Interagir, e pista de graça até o dado.',
    itens: [
      'O mestre descreve o ambiente e lista os <b>pontos de interesse</b> (lugares, objetos, pessoas).',
      '<b>1. Escolhe um ponto.</b> O mestre narra a descrição básica.',
      '<b>2. Interagir:</b> ação simples no ponto (abrir gaveta, virar foto). O mestre dá informação ou pede teste. O turno acaba.',
      '<b>2. Investigar:</b> o mestre lista as perícias do ponto. O jogador escolhe uma e diz o dado dele (d6 vale 6). <b>Recebe de graça</b> todas as informações com DT igual ou menor que esse número, sem rolar.',
      '<b>3. Depois de investigar:</b> <b>Observar</b> (outra perícia da lista, mesma regra de graça) ou <b>Examinar</b> (rola a perícia escolhida e recebe as informações com DT até o total). Se não vier nenhuma informação nova, perde <b>1 PD</b>.',
      '<b>Recapitular:</b> o jogador repassa tudo que o grupo sabe. Se coerente, teste de Intuição DT 10 e ganha uma pista nova. Depois de um sucesso, não repete na mesma cena.',
      '<b>Compartilhar:</b> explica uma pista pra um aliado, que faz um teste DT 10 como ação livre e, se passar, deduz uma pista nova. O PDF chama a perícia de Pesquisar num lugar e Intuição em outro. Pesquisar não existe. <i>Sugestão: usa Intuição.</i>'
    ]
  },
  {
    id: 'fechadura', titulo: 'Fechadura (desafio de acesso)', resumo: 'O mestre rola dados escondidos. O jogador chuta e ouve alto, baixo ou exato.',
    itens: [
      'O mestre rola <b>N dados escondidos</b>, que viram a senha. O jogador posiciona o mesmo número de dados com os valores que quiser, e o mestre responde, dado por dado, <b>"alto", "baixo" ou "exato"</b>.',
      'Tentativas por rodada pelo dado de <b>Crime</b>: d4 uma, d6 duas, d8 três, d10 quatro, d12 cinco.',
      'Cada fechadura tem um máximo de tentativas. Se estourar, ela estraga e só abre na força.',
      'Dá pra trocar alto, baixo e exato por sons (<b>tic, toc, click</b>) pra ficar mais difícil.',
      '<b>Arrombar na força:</b> gasta 1 PV e faz Atletismo contra a DT do objeto.',
      'Cabine de projeção (sugestão): 2d6, máximo de 6 tentativas. Tem um gerador de fechadura na aba Dados.'
    ]
  },
  {
    id: 'medo', titulo: 'Medo e dado de pavor', resumo: 'Susto causa dano emocional. Falhou em Disciplina DT 10: ganha dado de pavor.',
    itens: [
      'Um susto causa dano emocional (a missão do playtest usa <b>1d6</b>) e o jogador faz <b>Disciplina DT 10</b>.',
      'Quem falha ganha um <b>dado de pavor (d6)</b>.',
      'Em todo teste, rola o dado de pavor junto. Ele <b>não soma</b>. Ele <b>anula os dados do teste que saírem menores que ele</b>.',
      'Se anular todos os dados, é <b>falha crítica</b>.',
      'Se o dado de pavor sair <b>1</b>, o medo acaba.',
      'Antes de um teste, gastar <b>1 PD</b> reduz o dado de pavor um passo. Gastar <b>5 PD</b> transforma ele em dado bônus.',
      'Tomar o mesmo medo de novo sobe o dado de pavor um passo.',
      'Gatilhos da mesa: ver a sessão das oito pela primeira vez (1d6, DT 10), encontrar um morador afetado falando fala de filme, achar o Seu Anselmo.'
    ]
  },
  {
    id: 'relacoes', titulo: 'Relações', resumo: 'Invocar uma relação dá dado extra. Uma vez por missão cada.',
    itens: [
      'O jogador pode <b>invocar</b> uma relação: diz o que sente pela pessoa e como isso ajuda a aguentar firme, e escolhe um benefício do grau. Cada relação só pode ser invocada <b>uma vez por missão</b>.',
      '<b>Grau 1, Afinidade:</b> +1d6 em um teste ligado à pessoa, ou ao ajudar, dar +1d6 além do aumento de passo.',
      '<b>Grau 2, Vínculo:</b> +1d8 nas mesmas situações, ou gastar uma ação pra motivar a pessoa e ela recuperar 2d4 PD.',
      '<b>Grau 3, Devoção:</b> +1d12 nas mesmas situações, motivar pra recuperar 2d6 PD, ou, se a pessoa estiver em perigo, fazer uma ação extra pra ajudar.',
      'As palavras das fichas prontas (CONFIANÇA, NEUTRO, ADMIRAÇÃO, ANSEIO) são tempero. <i>Sugestão: usa o grau 1, 2 ou 3 pra regra.</i>'
    ]
  },
  {
    id: 'combate', titulo: 'Combate (só se precisar)', resumo: 'Três fases: geral, distância, corpo a corpo. Ataque contra DT 7.',
    itens: [
      'A rodada tem três fases: <b>geral</b> (qualquer ação que não seja ataque), <b>ataques à distância</b> e <b>ataques corpo a corpo</b>. Cada um age em uma fase só (algumas habilidades deixam agir depois). Dentro da fase tudo acontece ao mesmo tempo.',
      'Ataque é <b>Luta</b> (corpo a corpo) ou <b>Pontaria</b> (distância) contra <b>DT 7</b>, e <b>10</b> se o alvo estiver em cobertura leve.',
      'Dano é <b>RA + modificador da arma</b>.',
      '<b>Defender-se:</b> teste de Acrobacia +1d6 contra o ataque.'
    ]
  },
  {
    id: 'falha', titulo: 'Falhar pra frente (regra da mesa)', resumo: 'Errou? A cena anda, mas com custo.',
    itens: [
      'Nenhuma pista essencial depende de um teste que pode falhar.',
      'Falha vira <b>custo</b>: barulho, perder 1 PD, perder 1 PV, chamar atenção. Nunca bloqueio.',
      'Quem trava recebe <b>socorro</b>, que pode custar 1 PD.',
      'Decidir quais pistas são de graça e quais exigem rolar ainda está na lista de pendências.'
    ]
  },
  {
    id: 'a1978', titulo: 'Adaptações pra 1978 (sugestão)', resumo: 'Perfil, vocação, atributos, perícias, PV e PD pra montar personagem.',
    itens: [
      '<b>Perfil Analista:</b> gasta uma ação pra ganhar 2 marcadores (máximo 4). Depois de rolar, gasta marcadores pra mudar um dado em +1 ou -1. Sobras somem no fim da cena.',
      '<b>Perfil Executor:</b> barra de ímpeto com 5 espaços. Cada falha enche 1. Gasta 1 pra +d4 no teste, 3 pra subir um atributo um passo até o fim da cena, ou 3 pra uma ação extra em conflito.',
      '<b>Perfil Vigilante:</b> uma vez por rodada, gasta 2 PD pra rolar de novo um dado de um teste (dele ou de alguém perto), menos dado que tirou 1.',
      '<b>Atributos:</b> d10, d6, d6 ou d8, d8, d6, distribuídos como quiser entre Físico, Mente e Emoção.',
      '<b>Perícias:</b> todas começam em d4. Distribui 1 em d10, 3 em d8 e 4 em d6.',
      '<b>PV</b> de 15 a 20 e <b>PD</b> de 12 a 17. Cada jogador começa com 3 relações no grau 1.',
      '<b>Jovem de 1978 (os dois):</b> a Sessão das Oito não afeta quem tem menos de 21. Pra se manter sem chamar atenção entre os adultos fazem o jogo de fingir: Enganação ou Furtividade DT 7.',
      '<b>Vocações:</b> Benzedeira (Reza e Erva: 2 PD, Medicina DT 7, cura RA de um aliado), Radialista (Voz de Rádio: 2 PD, aumento de passo em Persuasão ou Enganação), Feirante (Conhece Todo Mundo: aumento de passo em Persuasão ou Intuição com morador), Mecânico de trator (Mão de Graxa: Ofício mecânica), Normalista (Cabeça de Livro: rola de novo um dado em Aptidão ou Inspecionar), Peão da cooperativa (Costas Largas: Vigor e Atletismo).'
    ]
  }
];

/* Tabela de DT (só 7 e 10 vêm do guia; o resto é escala de sugestão) */
window.DTS = [
  [6, 'Fácil', 'Pista de graça com d6.'],
  [7, 'Padrão', 'DT normal do playtest. Ataque e fingir.'],
  [8, 'Moderada', 'Pede perícia treinada e um pouco de sorte.'],
  [9, 'Puxada', 'Quase sempre pede dado extra ou ajuda.'],
  [10, 'Difícil', 'Disciplina contra medo. Recapitular e Compartilhar.'],
  [11, 'Muito difícil', 'Só quem é especialista passa com folga.'],
  [12, 'Quase impossível', 'Pede crítico ou muita ajuda.'],
  [13, 'Extrema', 'Teto da escala do playtest.']
];

/* ------------------------------------------------------------------ MESA */
window.RADIO = [
  [12, 'Jornal da Coxilha, 1ª edição', 'Morse escondido por baixo.'],
  [13, 'Musical sertanejo', 'Normal.'],
  [18, 'Jornal da Coxilha, 2ª edição', 'Comunicado da peste. Morse curto por baixo (NÃO E VERDADE). A cidade fecha às 18h.'],
  [19, 'A Voz do Brasil (19h às 20h)', 'Cadeia nacional, sem Morse.'],
  [20, 'Hora Sertaneja', 'A música para. Morse aberto, 100%, sem voz. Sessão das Oito começa.'],
  [22, 'Encerramento', 'Morse curto com ORDEM (proposta de senha do terminal). Começa o toque de recolher.']
];

window.CENAS = [
  {
    id: 'c1', titulo: 'A volta', dur: '20 min', resumo: 'Estrada, viaturas, bloqueio, lista.',
    itens: [
      'Tom leve, com banter. O Thomas tenta chamar a atenção do Abel e o Abel finge que não percebe.',
      'A estrada de terra. O ônibus é ultrapassado por viaturas, jipes do Exército e um caminhão verde-oliva com lona. Nenhuma sirene.',
      'Na entrada, soldados descarregam cavaletes listrados e rolos de arame. O Seu Nonato (SUCAM, jaleco branco) borrifa inseticida em volta dos veículos.',
      'Um soldado confere os documentos e anota nome e filiação. A lista já tem os nomes escritos.',
      'O Abel é filho de estrangeiros. O soldado estranha o sobrenome e chama o Doutor Valadares, que deixa passar: "Anderson. Santoro. Podem entrar."',
      '"Os senhores foram dos últimos. Fecha oficialmente às dezoito horas."',
      'Documentos: o Abel (18) tem Certificado de Alistamento, o Thomas (20) tem Certificado de Dispensa de Incorporação. O Abel nasceu na Austrália, e o soldado pode perguntar se os pais comunicaram à Polícia Federal. Mantém leve.'
    ],
    graca: 'O jogador percebe que a lista já tem os nomes da cidade inteira.'
  },
  {
    id: 'c2', titulo: 'Chegada e família', dur: '40 min', resumo: 'Alfaiataria do Álvaro, casa dos Anderson, comunicado das 18h.',
    itens: [
      'Cada um reencontra a família. O Thomas volta com tecidos novos e o recado da madrinha Dora: "pergunta pro teu tio por que ele nunca volta pro Sul".',
      'O Abel volta com o embrulho (lâmpada do projetor e carvões) e a nota de pedido com a letra do Seu Anselmo. O Anselmo sumiu há dois dias, então o embrulho é o primeiro gancho pra cabine.',
      '<b>Comunicado das 18h</b> no alto-falante da praça (áudio de verdade). Texto: foco de peste bubônica na zona rural, saída de pessoas e veículos suspensa, entrada livre com inspeção, recolhimento depois das 22h.',
      '<b>Morse por baixo:</b> Percepção DT 6 percebe o ritmo. Tecnologia DT 8 reconhece Morse. Intuição DT 8 entrega a mensagem. A mensagem curta é NAO E VERDADE.',
      '<b>Sem rato:</b> o Abel nota que não tem rato morto, nem pulga. A Jasmim fica agitada com o inseticida. (Peste vem primeiro nos ratos.)',
      '<b>Seu Nonato</b> confirma: "Peste deixa rato morto antes de deixar gente doente. Aqui eu não achei um rato morto. Nem uma pulga."',
      '<b>Dr. Honório</b> no fim da tarde, ainda lúcido, diz baixo que não existe doente. Depois vai ao cinema. De manhã não lembra de nada.',
      '<b>Rádio:</b> o telegrama na parede diz FICA PROIBIDA DIVULGAÇÃO QUALQUER ASSUNTO RELATIVO SURTO.',
      'Muitas pequenas estranhezas pra anotar. Gaveta trancada do Graham. A Helen só fala de política em inglês.'
    ],
    graca: 'O Abel percebe que não existe rato morto em lugar nenhum.'
  },
  {
    id: 'c3', titulo: 'A Sessão das Oito', dur: '40 min', resumo: 'Cecília, saguão, CORTE, Morse aberto, o filme sem título.',
    itens: [
      'Encontro do Abel com a Cecília, com o Thomas por perto.',
      '<b>Saguão com os cartazes:</b> a palavra CORTE é o único enigma obrigatório da primeira sessão.',
      '<b>Bilheteria:</b> talão de ingressos passa de 400 números, a sala tem 180 lugares. Ingresso sem título de filme. Dona Nair evita olhar pra porta do salão, e tem medo do que está lá dentro.',
      '<b>Morse aberto das 20h</b> no rádio da bilheteria, quando saem da sala numa pausa. A Dona Nair não repara.',
      'A sala, o filme sem título, um zumbido que só os jovens sentem. Todo adulto fica calado, olhando.',
      'Se preferir que fiquem fora do cinema: sessão esgotada, ouvem o Morse na rua e entram na noite seguinte.'
    ],
    graca: 'Os cartazes estão numa ordem estranha (Percepção DT 8 mostra que não segue as datas).'
  },
  {
    id: 'c4', titulo: 'A rua depois das 22h', dur: '20 min', resumo: 'Toque de recolher, Sargento Telmo, cidade andando em silêncio.',
    itens: [
      'Toque de recolher inventado: depois das 22h menor de 21 na rua é levado pra casa. Depois das 23h qualquer um sem motivo é "averiguado".',
      'A cidade anda em silêncio pra casa. Cena boa de cidade fantasma.',
      'Eles precisam voltar sem serem averiguados. Jogo de fingir: Enganação ou Furtividade DT 7.',
      'Furtividade silenciosa do Thomas ajuda (Passo de Pluma, 2 ou 3 PD).'
    ],
    graca: 'O Sargento Telmo prefere levar os jovens pra casa a prender.'
  },
  {
    id: 'c5', titulo: 'A manhã seguinte', dur: '30 min', resumo: 'Pais e vizinhos calmos demais. Só os jovens e o Álvaro estão normais.',
    itens: [
      'Os pais e vizinhos adultos estão calmos, obedientes e quase mudos. Sorriem pouco, repetem frases de filme, dizem que a cidade é boa.',
      'Só os jovens e o Álvaro (que finge) estão normais. Descobrem que são os únicos acordados.',
      'O jogo de fingir continua: agir como afetado com adultos e soldados. É a cena engraçada que mantém o tom leve.',
      'Fim da sessão: a rádio das 8h toca de novo, e o Morse diz outra coisa.'
    ],
    graca: 'O Abel acha o pai calmo e a mãe muda. É aqui que a ficha cai.'
  }
];

window.TRAVOU = [
  'Cada cena tem uma pista de graça. Se travar, entrega ela e segue.',
  'Nada essencial depende de teste. Falha vira custo (barulho, 1 PD, chamar atenção), não bloqueio.',
  'Zeca, Seu Nonato e Dona Nair são NPCs falantes. Quando precisar de pista, um deles aparece.',
  'Pergunta aos jogadores: "O que o seu personagem acha disso?". Eles ajudam a construir.',
  'Respira, bebe água, e lembra: a primeira sessão é pra eles saírem felizes.'
];

window.PENDENCIAS = [
  'Confirmar que os jovens (menos de 21) NÃO são afetados.',
  'Dia da sessão (proposta: terça, 14/11/1978, véspera da eleição).',
  'Pai do Thomas: A desconhecido, B projecionista ambulante de 1957, C Seu Anselmo que não sabe.',
  'Rodar sql/terminal-banco.sql no Supabase e testar com os dois jogadores.',
  'Gravar o comunicado das 18h e o programa com o Morse. Imprimir tabela de Morse e grade da rádio.',
  'Comprar a lata com cadeado 742 (segunda sessão).',
  'Decidir o final: queimar a lata ou deixar o filme rodar até o fim.'
];

/* ------------------------------------------------------------------ ENIGMAS */
window.ENIGMAS = [
  {
    id: 'morse', num: '0', titulo: 'Rádio e Morse', quando: 'Abertura',
    resposta: 'OI ALGUEM ESTA AQUI. NAO ESTAO DEIXANDO NOS SAIR DA CIDADE. ALO, EU PRECISO DA ORDEM.',
    resumo: 'Programa de rádio com Morse por baixo da voz. A última palavra, ORDEM, é a proposta de senha do terminal. A senha de verdade é a que você definiu no terminal.',
    pistas: [
      ['Percepção', '6', 'Um tique-tique por baixo da voz (de graça com d6).'],
      ['Tecnologia', '8', 'É código Morse (comunicado das 18h).'],
      ['Intuição', '8', 'Se travar, entrega a mensagem curta (NAO E VERDADE).']
    ],
    socorro: ['No fim do programa o Morse toca sozinho uns 20 segundos.', 'Mestre diz a primeira palavra.'],
    mesa: ['Tabela de Morse impressa. Eles anotam pontos e traços em papel e traduzem. Sem rolar dado.', 'Morse bem mais baixo que a voz (um quarto a um terço). Chiado de estática leve ajuda.'],
    notas: ['Arquivo do Morse: 10 palavras por minuto, 750 Hz, 1 min 21 s. Gravado pelo Seu Anselmo (telegrafista na juventude).', 'O Rubens põe a fita pra tocar e acha que é chiado de linha.']
  },
  {
    id: 'cartazes', num: '1', titulo: 'Cartazes do saguão', quando: 'Primeira sessão',
    resposta: 'CORTE. Ordem da parede: Chuva de Prata, O Sétimo Carretel, Rastros no Sertão, Tempestade em Agosto, Estrada sem Volta.',
    resumo: 'As primeiras letras dos cinco títulos, na ordem da parede. Pela data de estreia a ordem é outra, por isso a parede parece estranha.',
    pistas: [
      ['Aptidão (artes)', '6', 'Nenhum cartaz tem o selo da Censura Federal.'],
      ['Percepção', '8', 'A ordem não segue as datas de estreia.'],
      ['Inspecionar', '10', 'As primeiras letras formam CORTE.']
    ],
    socorro: ['Zeca: "olha as datas de cada um".', 'Dona Nair: "parede se lê que nem carta".', 'Por último as letras ficam marcadas.'],
    mesa: ['Cinco cartazes impressos em tamanho de cartão, fora de ordem. Eles montam a fileira e circulam a primeira letra.', 'O cartaz Tempestade em Agosto tem o canto inferior direito rasgado. O pedaço (com selo da Censura) está dentro da lata.'],
    notas: ['O MEMO01 do terminal manda colar os cartazes "na ordem enviada". A ordem é a mensagem.', 'CORTE leva a perguntar "o que foi cortado, e onde está?". O Zeca repete a frase do Seu Anselmo: "Filme não mente. Mente quem escolhe o que cortar."'],
    datas: [['Rastros no Sertão', 'março de 1972', '3ª'], ['O Sétimo Carretel', 'setembro de 1974', '2ª'], ['Estrada sem Volta', 'junho de 1975', '5ª'], ['Chuva de Prata', 'outubro de 1976', '1ª'], ['Tempestade em Agosto', 'agosto de 1977', '4ª']],
    pecas: ['cartaz-chuva-de-prata', 'cartaz-o-setimo-carretel', 'cartaz-rastros-no-sertao', 'cartaz-tempestade-em-agosto', 'cartaz-estrada-sem-volta']
  },
  {
    id: 'cabine', num: '2', titulo: 'Cabine trancada por dentro', quando: 'Segunda sessão',
    resposta: 'A parede do fundo tem duas aberturas de projeção. Só o projetor A está ligado. O vidro da abertura B está limpo e solto, sem poeira. Seu Anselmo tirou o projetor B, trancou a porta por dentro e saiu por ali.',
    resumo: 'Sugestão: duas aberturas (A acesa e suja, B apagada e limpa). O mistério da porta trancada se resolve olhando a parede, não a porta.',
    pistas: [
      ['Percepção', '6', 'Só uma abertura tem luz.'],
      ['Inspecionar', '8', 'O vidro de B está limpo e solto.'],
      ['Ofício (projeção)', '8', 'Cabine com dois projetores costuma rodar os dois pra trocar de rolo sem parar a sessão.']
    ],
    socorro: ['Zeca: "A janela de lá nunca acende, moço".', 'O terminal libera o PROJ.LOG.'],
    mesa: ['Desenho impresso da parede do fundo (aberturas A e B, porta, escada).', 'Toque o barulho de um projetor só de um lado. Quem percebe que falta um som resolve sem rolar.'],
    notas: ['Chegar lá em cima: um jogador usa Ajudar e o outro faz Atletismo DT 7. Se falhar, entra do mesmo jeito, mas faz barulho (um morador afetado vira a cabeça) ou perde 1 PV no vidro. Furtividade silenciosa do Thomas evita o barulho.', 'Gancho: a Jasmim vai sozinha pro lado da abertura B, onde passa o ar frio.'],
    pecas: ['desenho-parede-do-fundo-da-cabine']
  },
  {
    id: 'lata', num: '3', titulo: 'A lata e a contagem regressiva', quando: 'Segunda sessão',
    resposta: '7-4-2. A cabeça de rolo normal vai de 8 a 2. Na tela só aparecem 8, 6, 5 e 3. Faltam 7, 4 e 2.',
    resumo: 'A contagem se repete a cada troca de rolo. O que falta é a combinação do cadeado da lata.',
    pistas: [
      ['Percepção', '6', 'A contagem pula números.'],
      ['Ofício (projeção) ou Aptidão (artes)', '8', 'O normal é de 8 a 2.'],
      ['Inspecionar', '10', 'Faltam 7, 4 e 2.']
    ],
    socorro: ['O caderno do Seu Anselmo (7, 4 e 2 riscados a lápis).', 'O terminal libera o ROLOS.LOG.', 'Paletó do Seu Anselmo na loja do Álvaro: filme cortado e papel com 7, 4, 2 no forro.'],
    mesa: ['Lata de verdade (biscoito ou goiabada) com cadeado de 3 dígitos em 742. Dentro: etiquetas da Censura, o pedaço do cartaz rasgado e o primeiro papel do final.', 'A contagem passa no celular do mestre e eles anotam. Quem abre o cadeado com a mão abre a cena.'],
    notas: ['Se errarem o código: a lata sussurra uma fala de filme, 1d4 de dano emocional (Disciplina DT 10 reduz à metade).', 'Detalhe de época: na cabeça de rolo de verdade há um bipe seco no 2. Aqui o bipe toca e o 2 não aparece.'],
    pecas: ['caderno-do-seu-anselmo', 'pedaco-do-canto-rasgado', 'etiqueta-censura-estrada-sem-volta', 'etiqueta-censura-chuva-de-prata', 'etiqueta-censura-o-setimo-carretel', 'etiqueta-censura-tempestade-em-agosto', 'etiqueta-censura-rastros-no-sertao']
  },
  {
    id: 'final', num: '4', titulo: 'O final', quando: 'Por decidir',
    resposta: 'Ainda não decidido. Dois caminhos: queimar a lata ou deixar o filme rodar até o fim.',
    resumo: 'Falta decidir a consequência de cada caminho e o que acontece com os moradores afetados.',
    pistas: [], socorro: [], mesa: ['Primeiro papel do final, dentro da lata.'], notas: ['Prazo do experimento: o AI-5 só deixa de valer em 1º/1/1979.']
  }
];

window.TERMINAL = [
  ['MEMO01.TXT', 'Libera no começo', 'DE: CENTRAL / PARA: O. WEISS, CINE REX. COLAR OS CARTAZES NA ORDEM ENVIADA. NAO ALTERAR A ORDEM. A ORDEM E A INSTRUCAO. EXIBICAO DAS 20H CONFIRMADA. FILME SEM TITULO.'],
  ['PROJ.LOG', 'Socorro da cabine', 'PROJ A: OK. EM USO. PROJ B: RETIRADO DA CABINE A PEDIDO DO PROJECIONISTA. ABERTURA B SEM USO.'],
  ['ROLOS.LOG', 'Socorro da lata', 'ROLO 4, CABECA, EXIBIDA NA TELA: 8 6 5 3. CABECA PADRAO: 8 7 6 5 4 3 2. CORTADO PELA CENSURA: CONFERIR.'],
  ['Mensagens ao vivo', 'Botão "Mandar agora"', 'Frases curtas: ALO? ALGUEM RECEBE? / NAO SAIAM DA SALA.']
];

/* ------------------------------------------------------------------ PEÇAS */
/* quem: 'jogador' pode mandar | 'mestre' só pra você */
window.PECAS = [
  ['cartaz-chuva-de-prata', 'Cartaz: Chuva de Prata', 'jogador', 'Saguão (C)'],
  ['cartaz-o-setimo-carretel', 'Cartaz: O Sétimo Carretel', 'jogador', 'Saguão (O)'],
  ['cartaz-rastros-no-sertao', 'Cartaz: Rastros no Sertão', 'jogador', 'Saguão (R)'],
  ['cartaz-tempestade-em-agosto', 'Cartaz: Tempestade em Agosto (canto rasgado)', 'jogador', 'Saguão (T)'],
  ['cartaz-estrada-sem-volta', 'Cartaz: Estrada sem Volta', 'jogador', 'Saguão (E)'],
  ['ingresso-sessao-das-oito', 'Ingresso da Sessão das Oito', 'jogador', 'Bilheteria'],
  ['desenho-parede-do-fundo-da-cabine', 'Desenho da parede do fundo da cabine', 'jogador', 'Cena da cabine'],
  ['caderno-do-seu-anselmo', 'Caderno do Seu Anselmo', 'jogador', 'Socorro da lata'],
  ['pedaco-do-canto-rasgado', 'Pedaço do canto rasgado', 'jogador', 'Dentro da lata'],
  ['etiqueta-censura-estrada-sem-volta', 'Etiqueta: Estrada sem Volta', 'jogador', 'Dentro da lata'],
  ['etiqueta-censura-chuva-de-prata', 'Etiqueta: Chuva de Prata', 'jogador', 'Dentro da lata'],
  ['etiqueta-censura-o-setimo-carretel', 'Etiqueta: O Sétimo Carretel', 'jogador', 'Dentro da lata'],
  ['etiqueta-censura-tempestade-em-agosto', 'Etiqueta: Tempestade em Agosto', 'jogador', 'Dentro da lata'],
  ['etiqueta-censura-rastros-no-sertao', 'Etiqueta: Rastros no Sertão', 'jogador', 'Dentro da lata'],
  ['saguao-parede-dos-cartazes', 'Parede dos cartazes na ordem certa', 'mestre', 'Resposta do enigma']
];

/* ------------------------------------------------------------------ JOGADORES */
window.JOGADORES = [
  {
    id: 'abel', nome: 'Abel Anderson', idade: 18, resumo: 'Eletricista. Convidou uma garota pro cinema. Muçurana Jasmim.',
    perfil: 'Vigilante · vocação Eletricista', atrib: 'Físico d10 · Mente d6 · Emoção d6', ficha: 'ficha.html',
    sabe: 'Nasceu na Austrália, filho de ativistas ambientais (zoólogo e botânica). Aos 12 anos foi pro Brasil. Cresceu com animais, adotou a Jasmim. Eletricista, vive voltando à loja do Álvaro por causa da fiação, e mantém distância do Thomas. Em 1975 os pais vieram pra Coxilha Seca por emprego na cooperativa.',
    motivo: 'Impressionar uma garota (Cecília, sugestão).',
    habilidades: [
      ['Mão Companheira', 'Testes com animais (acalmar, conter, guiar, entender o bicho): 2 PD, aumento de passo.'],
      ['Tato Elétrico', 'Testes com eletricidade e fiação (consertar, improvisar, sabotar, ligar ou cortar energia): 2 PD, aumento de passo.'],
      ['Resistência a Animais', 'Resistência 2 contra ataques de animais. Todo dano de animal é reduzido em 2.'],
      ['Vigilante (perfil)', '2 PD: rola de novo um dado de um teste, dele ou de quem está perto (menos um dado que tirou 1).']
    ],
    heranca: [['Língua de Casa (camada 2)', 'Ele e os pais falam inglês. Passa mensagem em inglês a um aliado sem que a maioria entenda. O Doutor Valadares entende.'], ['Olho de Campo (camada 3)', 'Do pai. 1 PD: pelo jeito dos bichos e das plantas, o mestre diz se tem algo errado. Aumento de passo em Animais ou Medicina ao investigar um ambiente.']]
  },
  {
    id: 'thomas', nome: 'Thomas Santoro (Rosália)', idade: 20, resumo: 'Costureiro. Quer uma chance com o Abel. Se veste como Rosália.',
    perfil: 'Analista · vocação Costureiro', atrib: 'd6 em tudo até escolher', ficha: 'ficha.html',
    sabe: 'Criado pelo tio Álvaro (alfaiate), irmão mais velho da mãe, Lúcia, que morreu quando ele nasceu em 1958. O tio é reservado, tem regras (horário, rua, roupa) e nunca deixou ele ir ao Sul. O Thomas o imagina manipulador (o texto original do jogador vira o que o Thomas acredita). Usa o emprego pra ser a Rosália.',
    motivo: 'Quer ter uma chance com o Abel.',
    habilidades: [
      ['Passo de Pluma', 'Furtividade: 3 PD pra +1d6 até o fim da cena de furtividade, ou 2 PD pra aumento de passo.'],
      ['Duas Caras', '2 PD: muda de jeito no meio da conversa (tímido e quieto, ou barulhento e malicioso). Aumento de passo em Persuasão, Enganação ou Intimidar.'],
      ['Rosália (ainda não entrou)', 'Sugestão: 2 PD, aumento de passo em Persuasão ou Enganação com quem não o conhece. Depende do jogador aceitar.'],
      ['Analista (perfil)', 'Uma ação pra ganhar 2 marcadores (máx. 4). Depois de rolar, gasta marcador pra mudar um dado em +1 ou -1.']
    ],
    heranca: [['Giz de Alfaiate (camada 2)', 'Entende as marcas do Álvaro nas roupas e no caderno. Olha a roupa de alguém e descobre se foi afetado pela sessão.'], ['Fala Costurada (camada 3)', 'Aumento de passo em Disciplina contra interrogatório, repetição e Frase de Filme.']]
  }
];

window.FAMILIAS = [
  {
    id: 'anderson', titulo: 'Anderson (Abel)', sabe: 'Graham (zoólogo) e Helen (botânica) são australianos. Saíram da Austrália quando o Abel tinha 12 anos, pra trabalhar perto da floresta amazônica. Em 1975 mudaram pra Coxilha Seca porque o pai arrumou emprego na cooperativa, cuidando de solo e água. A mãe dá aula no colégio. Em casa se fala inglês no jantar e português na rua. Tem uma gaveta trancada no escritório do pai ("papelada da cooperativa").',
    verdade: 'Os dois criticaram em público, na Amazônia, projetos que o governo apoiava. Foram marcados. Perderam a verba do instituto. O Kunz arrumou o emprego e assinou a carta de recomendação. Sabem que foram "acomodados" e não perguntam por quê. O Graham desconfia que a cidade foi escolhida. A Helen suspeita. Calam pra proteger o Abel. Não sabem do experimento.',
    camadas: [
      ['1. Estranhezas (de graça)', 'A gaveta trancada. A Helen só fala de política em inglês. O Graham olha a estrada. Os dois têm emprego estável que "caiu do céu".'],
      ['2. Provas', 'O caderno de campo do Graham (denúncia contra uma megafazenda). A carta do Kunz com o carimbo pequeno no canto, o mesmo do Livro de Registro. Desbloqueia Língua de Casa.'],
      ['3. Verdade', 'Conversa com o Graham quando ele volta da serra, dia 2 ou 3. Ele diz que sabia que ia dar nisso. Desbloqueia Olho de Campo.']
    ],
    sessao: 'A Helen vai ao cinema e fica calada na manhã seguinte. O Graham está na serra medindo nascentes e volta depois. O Abel acha o pai calmo e a mãe muda, e é aí que a ficha cai.'
  },
  {
    id: 'santoro', titulo: 'Santoro (Thomas)', sabe: 'A mãe, Lúcia, morreu quando ele nasceu, em 1958. O tio Álvaro, irmão mais velho dela, alfaiate, o criou. Nunca fala da família, de onde vieram nem do pai. Vieram do Sul, "de gente simples". As regras (horário, rua, roupa). O Álvaro nunca deixou o Thomas ir ao Sul. Se o jogador quiser manter a palavra "culto" na ficha, ela vira a mentira que o Álvaro contou pra explicar o silêncio ("saí de uma seita").',
    verdade: 'Abril de 1964, aos 34 anos, o Álvaro foi ao Sul comprar tecido e foi preso 3 dias "pra averiguação", por ter costurado faixas pra um comício trabalhista no ano anterior. Repetiu o depoimento sem dormir até decorar. Disseram: "se voltar aqui, volta de vez." A casa foi revirada em Coxilha Seca (o Thomas, de 6 anos, lembra). Desde então mantém tudo em ordem pra ninguém olhar pra ele. Veste todo mundo que importa na cidade e sabe das dívidas e dos medos de todos. Não vai ao cinema. Percebeu que o povo mudou e finge ser igual. Guarda o caderno de medidas, com a data em que cada cliente ficou calado. Reconhece o método do filme: repetição, luz, sono, frase decorada. É o interrogatório dele.',
    camadas: [
      ['1. Estranhezas (de graça)', 'Nunca vai ao cinema. As marcas de giz nas roupas. O recado da madrinha Dora: "pergunta pro teu tio por que ele nunca volta pro Sul."'],
      ['2. Provas', 'O paletó do Seu Anselmo na loja (filme cortado e papel com 7, 4, 2 no forro). O caderno de medidas com as datas de quando cada cliente "ficou quieto". Desbloqueia Giz de Alfaiate.'],
      ['3. Verdade', 'A conversa de verdade com o tio, e a foto de 1963 do comício com as faixas. Desbloqueia Fala Costurada.']
    ],
    sessao: 'Pai do Thomas (escolher): A desconhecido. B projecionista ambulante que passou em 1957. C Seu Anselmo, que não sabe.'
  }
];

/* ------------------------------------------------------------------ MAPA */
window.MAPAS = [
  ['jogadores-antes', 'Jogadores, antes', 'jogador', 'Entregar no começo da sessão. Só o que os personagens conhecem.'],
  ['jogadores-depois', 'Jogadores, depois do fechamento', 'jogador', 'Trocar pela primeira quando a cidade fechar (cena 1 ou depois do comunicado das 18h). Tem bloqueios, acampamento e o carimbo de saída proibida.'],
  ['mestre', 'Mestre', 'mestre', 'Rota da volta, alcance do alto-falante, cabo da rádio, bloqueios A, B, C e E, acampamento D, patrulhas F e notas de cada lugar. Não mostrar aos jogadores.']
];

window.LUGARES = [
  [1, 'Praça Farroupilha', ''], [2, 'Igreja Matriz de Santo Antônio', 'Padre Tiago'], [3, 'Casa paroquial', 'Padre Tiago'],
  [4, 'Prefeitura e Câmara', 'Kunz'], [5, 'Sobrado do prefeito', 'Kunz'], [6, 'Cartório', 'Livro de Registro'],
  [7, 'Delegacia e PM', 'Sargento Telmo'], [8, 'Cine Rex (E5)', 'Weiss, Dona Nair, Seu Anselmo'], [9, 'Alfaiataria Santoro', 'Álvaro e Thomas'],
  [10, 'Rádio Coxilha Seca', 'Rubens'], [11, 'Colégio', 'Helen'], [12, 'Posto de Saúde', 'Dr. Honório'],
  [13, 'Mercado público', ''], [14, 'Pensão Central', 'Weiss e Seu Nonato'], [15, 'Bar do Raimundo', 'só cenário, a decidir'],
  [16, 'Casa dos Anderson', 'Abel, Graham, Helen'], [17, 'Casa do Dr. Honório e da Cecília', ''], [18, 'Casa da Dona Nair', ''],
  [19, 'Casa do Seu Anselmo', 'sumido'], [20, 'Casa do Zeca e da avó', ''], [21, 'Cooperativa dos gaúchos', 'Graham'],
  [22, 'Ponto de ônibus (jardineira)', 'parada final'], [23, 'Cemitério', 'Lúcia Santoro'], [24, 'Campo de futebol', ''],
  [25, 'Caixa d\'água', ''], [26, 'Torre da rádio (Morro da Coxilha)', 'cabo da rádio'], [27, 'Açude Velho', 'quase seco'],
  [28, 'Serra Velha', 'Graham mede nascentes'], [29, 'Entroncamento e Patrulha Rodoviária (A8)', 'desce o ônibus'],
  [30, 'Posto de combustível e borracharia (B8)', ''], [31, 'Galpão da Vossler Pictures (C8)', 'caixas de filme e cartas com selo estrangeiro'],
  [32, 'Fazenda Boa Esperança (K2)', 'Kunz guarda lá o que não pode na prefeitura'], [33, 'Sítio Boa Vista (D2)', 'gente simples'],
  [34, 'Capela de Santo Antônio e cruzeiro (B2)', 'comunidade de base, domingo'], [35, 'Cacimba Funda (E7)', 'poço de 1949, bom pra se esconder']
];

window.BLOQUEIOS = [
  ['A', 'Entrada da cidade, Estrada da Capital (cena 1)'], ['B', 'Estrada da Serra'], ['C', 'Estrada Velha, perto da cooperativa'],
  ['D', 'Acampamento militar a oeste da cidade'], ['E', 'Posto do entroncamento, com Patrulha Rodoviária e soldados do Exército'],
  ['F', 'Patrulhas de jipe nas estradas de terra (só na prancha do mestre)']
];

window.DICAS_MAPA = [
  'O ônibus da volta desce no entroncamento (29), passa pelo posto E e segue pela Estrada da Capital até o bloqueio A. O ponto de ônibus (22) é a parada final dentro da cidade. Dali à alfaiataria (9) são uns 5 minutos a pé.',
  'O alto-falante da praça alcança a praça e os quarteirões em volta. Quem está longe (casa do Zeca, 20) não ouve o comunicado das 18h.',
  'A Sessão das Oito junta a cidade inteira no Cine Rex (8). A rua fica vazia: cena boa de cidade fantasma.',
  'O Morse aberto das 20h se ouve no rádio da bilheteria (8) e na rádio (10). O cabo liga o estúdio à torre (26). Cortar o cabo cala o Morse.',
  'Toque de recolher às 22h. A Delegacia (7) fica de frente pra praça.',
  'Fuga a pé: quem tentar sair pelos campos esbarra nas patrulhas F e nas cercas.',
  'A fazenda do prefeito (32) é boa cena de investigação. O galpão da Vossler (31) é pista pra segunda sessão.'
];

/* Fatos de fundo (conferidos nos docs) */
window.FATOS = [
  'Emenda Constitucional nº 11 (13/10/1978) revoga o AI-5, mas só vale a partir de <b>1º/1/1979</b>. Até lá o regime pode tudo. É o prazo secreto: o experimento tem que acabar antes.',
  'Eleições de <b>15/11/1978</b> e I Congresso Nacional pela Anistia (2 a 5 de novembro, em São Paulo): podem aparecer no noticiário do rádio.',
  'A peste existia de verdade no sertão do Nordeste. O Ceará confirmou 5 casos em 1978. Um cordão militar por peste é exagero da ficção, e é isso que dá o ar de farsa.',
  'Lei de 1975 manda notificar em segredo doenças que podem pedir quarentena. A censura já tinha escondido a epidemia de meningite (1974).',
  'Maioridade civil em 1978 era 21 anos, por isso o corte de idade do efeito e do toque de recolher.'
];
