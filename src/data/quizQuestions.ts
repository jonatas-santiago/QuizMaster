export type Subject = "matematica" | "historia" | "geografia" | "ciencias" | "portugues" | "ingles" | "educacao_fisica";

export interface Question {
  id: number;
  subject: Subject;
  difficulty: 1 | 2 | 3;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export const subjectConfig: Record<Subject, { label: string; emoji: string; color: string }> = {
  matematica: { label: "Matemática", emoji: "🔢", color: "bg-blue-500" },
  historia: { label: "História", emoji: "📜", color: "bg-amber-500" },
  geografia: { label: "Geografia", emoji: "🌍", color: "bg-emerald-500" },
  ciencias: { label: "Ciências", emoji: "🔬", color: "bg-violet-500" },
  portugues: { label: "Português", emoji: "📝", color: "bg-rose-500" },
  ingles: { label: "Inglês", emoji: "🇺🇸", color: "bg-cyan-500" },
  educacao_fisica: { label: "Educação Física", emoji: "⚽", color: "bg-orange-500" },
};

let _id = 0;
const q = (subject: Subject, difficulty: 1|2|3, question: string, options: string[], correctIndex: number, explanation: string): Question => ({
  id: ++_id, subject, difficulty, question, options, correctIndex, explanation
});

export const questions: Question[] = [
  // ====== MATEMÁTICA ======
  // Nível 1
  q("matematica",1,"Quanto é 7 × 8?",["54","56","58","64"],1,"7 × 8 = 56."),
  q("matematica",1,"Qual é a metade de 64?",["30","32","34","36"],1,"64 ÷ 2 = 32."),
  q("matematica",1,"Quanto é 15 + 28?",["41","42","43","44"],2,"15 + 28 = 43."),
  q("matematica",1,"Quanto é 9 × 6?",["45","52","54","56"],2,"9 × 6 = 54."),
  q("matematica",1,"Qual é o dobro de 35?",["60","65","70","75"],2,"35 × 2 = 70."),
  q("matematica",1,"Quanto é 100 - 37?",["57","63","67","73"],1,"100 - 37 = 63."),
  q("matematica",1,"Quanto é 12 × 5?",["50","55","60","65"],2,"12 × 5 = 60."),
  q("matematica",1,"Qual é a terça parte de 27?",["7","8","9","10"],2,"27 ÷ 3 = 9."),
  q("matematica",1,"Quanto é 48 ÷ 6?",["6","7","8","9"],2,"48 ÷ 6 = 8."),
  q("matematica",1,"Quanto é 25 + 17?",["40","41","42","43"],2,"25 + 17 = 42."),
  // Nível 2
  q("matematica",2,"Qual é a raiz quadrada de 144?",["10","11","12","14"],2,"12 × 12 = 144, então √144 = 12."),
  q("matematica",2,"Quanto é 3² + 4²?",["20","24","25","49"],2,"3² = 9, 4² = 16. 9 + 16 = 25."),
  q("matematica",2,"Se x + 5 = 12, qual é o valor de x?",["5","6","7","8"],2,"x = 12 - 5 = 7."),
  q("matematica",2,"Quanto é 15% de 200?",["20","25","30","35"],2,"15% de 200 = 0,15 × 200 = 30."),
  q("matematica",2,"Qual é o MMC de 4 e 6?",["8","10","12","24"],2,"MMC(4,6) = 12."),
  q("matematica",2,"Quanto é (-3) × (-4)?",["7","-12","12","-7"],2,"Negativo × negativo = positivo: 12."),
  q("matematica",2,"Se 2x = 18, qual é x?",["6","7","8","9"],3,"2x = 18 → x = 9."),
  q("matematica",2,"Qual é a raiz quadrada de 81?",["7","8","9","10"],2,"9 × 9 = 81."),
  q("matematica",2,"Quanto é 0,5 + 0,75?",["1,0","1,15","1,25","1,50"],2,"0,5 + 0,75 = 1,25."),
  q("matematica",2,"Qual é o resultado de 5! (fatorial)?",["60","100","120","150"],2,"5! = 5×4×3×2×1 = 120."),
  // Nível 3
  q("matematica",3,"Qual é 20% de 350?",["60","65","70","75"],2,"20% de 350 = 70."),
  q("matematica",3,"Resolva: 2x - 4 = 10",["5","6","7","8"],2,"2x = 14, x = 7."),
  q("matematica",3,"Qual o valor de 2³ × 3²?",["36","54","72","108"],2,"8 × 9 = 72."),
  q("matematica",3,"Se f(x) = 3x + 1, quanto é f(4)?",["11","12","13","15"],2,"3×4 + 1 = 13."),
  q("matematica",3,"Qual é a área de um triângulo de base 10 e altura 6?",["16","24","30","60"],2,"(10 × 6) / 2 = 30."),
  q("matematica",3,"Resolva: x² = 49. Qual valor positivo de x?",["5","6","7","8"],2,"√49 = 7."),
  q("matematica",3,"Quanto é 3/4 + 2/3?",["5/7","17/12","1/2","11/12"],1,"3/4 + 2/3 = 9/12 + 8/12 = 17/12."),
  q("matematica",3,"Qual é o perímetro de um quadrado de lado 8 cm?",["24","28","32","36"],2,"4 × 8 = 32 cm."),
  q("matematica",3,"Se log₁₀(1000) = x, qual é x?",["2","3","4","10"],1,"10³ = 1000, logo x = 3."),
  q("matematica",3,"Qual é a hipotenusa de um triângulo com catetos 3 e 4?",["4","5","6","7"],1,"3² + 4² = 25, √25 = 5."),

  // ====== HISTÓRIA ======
  // Nível 1
  q("historia",1,"Quem descobriu o Brasil?",["Cristóvão Colombo","Pedro Álvares Cabral","Vasco da Gama","Fernão de Magalhães"],1,"Pedro Álvares Cabral chegou ao Brasil em 22 de abril de 1500."),
  q("historia",1,"Em que ano o Brasil se tornou independente?",["1808","1822","1889","1500"],1,"A independência foi proclamada em 7 de setembro de 1822."),
  q("historia",1,"Quem foi o primeiro presidente do Brasil?",["Dom Pedro II","Getúlio Vargas","Deodoro da Fonseca","Juscelino Kubitschek"],2,"Marechal Deodoro da Fonseca após a Proclamação da República em 1889."),
  q("historia",1,"Em que ano foi proclamada a República no Brasil?",["1822","1889","1891","1930"],1,"A República foi proclamada em 15 de novembro de 1889."),
  q("historia",1,"Quem proclamou a independência do Brasil?",["Dom João VI","Dom Pedro I","Dom Pedro II","Tiradentes"],1,"Dom Pedro I às margens do rio Ipiranga."),
  q("historia",1,"O que foi a Inconfidência Mineira?",["Uma festa","Uma revolta contra Portugal","Uma guerra civil","Uma expedição"],1,"Foi uma conspiração contra o domínio português em Minas Gerais, em 1789."),
  q("historia",1,"Quem foi Tiradentes?",["Um padre","Um imperador","Um líder da Inconfidência Mineira","Um bandeirante"],2,"Joaquim José da Silva Xavier foi líder da Inconfidência Mineira."),
  q("historia",1,"Quando acabou a escravidão no Brasil?",["1822","1850","1888","1889"],2,"A Lei Áurea foi assinada em 13 de maio de 1888."),
  q("historia",1,"Quem assinou a Lei Áurea?",["Dom Pedro I","Dom Pedro II","Princesa Isabel","Getúlio Vargas"],2,"A Princesa Isabel assinou a Lei Áurea em 1888."),
  q("historia",1,"Em que ano Cabral chegou ao Brasil?",["1492","1498","1500","1510"],2,"Pedro Álvares Cabral chegou em 22 de abril de 1500."),
  // Nível 2
  q("historia",2,"A Revolução Francesa ocorreu em que ano?",["1776","1789","1815","1848"],1,"Começou em 1789 com a Queda da Bastilha."),
  q("historia",2,"Qual civilização construiu as pirâmides de Gizé?",["Romana","Grega","Egípcia","Mesopotâmica"],2,"Construídas pelos egípcios por volta de 2500 a.C."),
  q("historia",2,"Quem foi Napoleão Bonaparte?",["Rei da Inglaterra","Imperador da França","Papa","Filósofo grego"],1,"Foi imperador da França no início do século XIX."),
  q("historia",2,"A Segunda Guerra Mundial terminou em que ano?",["1918","1939","1945","1950"],2,"Terminou em 1945 com a rendição do Japão."),
  q("historia",2,"Qual era a forma de governo do Brasil antes da República?",["Democracia","Monarquia","Ditadura","Anarquia"],1,"O Brasil era uma monarquia imperial."),
  q("historia",2,"Quem foi Getúlio Vargas?",["Primeiro presidente","Presidente que governou por 15 anos","Último imperador","Líder militar"],1,"Governou o Brasil de 1930 a 1945 e de 1951 a 1954."),
  q("historia",2,"O Muro de Berlim caiu em que ano?",["1985","1987","1989","1991"],2,"O Muro de Berlim caiu em 9 de novembro de 1989."),
  q("historia",2,"Qual país foi o primeiro a chegar à Lua?",["URSS","Estados Unidos","China","Japão"],1,"Os EUA com a Apollo 11 em 1969."),
  q("historia",2,"O que foi a Guerra Fria?",["Guerra entre EUA e URSS com armas","Conflito ideológico sem confronto direto","Guerra no Ártico","Batalha medieval"],1,"Foi uma disputa ideológica entre EUA e URSS sem confronto militar direto."),
  q("historia",2,"Quem descobriu a América?",["Vasco da Gama","Cristóvão Colombo","Marco Polo","Fernão de Magalhães"],1,"Cristóvão Colombo chegou à América em 1492."),
  // Nível 3
  q("historia",3,"A Guerra dos Cem Anos foi entre quais países?",["Espanha e Portugal","Inglaterra e França","Alemanha e Rússia","Itália e Áustria"],1,"Travada entre Inglaterra e França (1337-1453)."),
  q("historia",3,"Qual tratado dividiu o mundo entre Portugal e Espanha?",["Tratado de Versalhes","Tratado de Tordesilhas","Tratado de Methuen","Tratado de Madri"],1,"Tratado de Tordesilhas (1494)."),
  q("historia",3,"O que foi a Revolução Industrial?",["Revolução política na França","Mudança na produção com máquinas","Guerra civil inglesa","Descoberta da América"],1,"Transformação na produção com uso de máquinas, iniciada na Inglaterra no séc. XVIII."),
  q("historia",3,"Quem foi Karl Marx?",["Presidente dos EUA","Filósofo do capitalismo","Teórico do socialismo/comunismo","Imperador romano"],2,"Autor de 'O Capital' e teórico do socialismo científico."),
  q("historia",3,"Em que ano começou a Primeira Guerra Mundial?",["1905","1912","1914","1918"],2,"A Primeira Guerra Mundial começou em 1914."),
  q("historia",3,"Qual era o nome do navio que afundou em 1912?",["Queen Mary","Titanic","Lusitania","Bismarck"],1,"O RMS Titanic afundou em 15 de abril de 1912."),
  q("historia",3,"O que foi o Holocausto?",["Uma guerra","O genocídio de judeus na Segunda Guerra","Uma revolução","Uma pandemia"],1,"Genocídio de aproximadamente 6 milhões de judeus pelo regime nazista."),
  q("historia",3,"Quem foi Martin Luther King Jr.?",["Presidente dos EUA","Líder dos direitos civis nos EUA","Inventor","Cientista"],1,"Líder do movimento pelos direitos civis dos afro-americanos nos EUA."),
  q("historia",3,"Em que ano o homem pisou na Lua pela primeira vez?",["1965","1967","1969","1971"],2,"Neil Armstrong pisou na Lua em 20 de julho de 1969."),
  q("historia",3,"O que foi a Peste Negra?",["Uma guerra","Uma pandemia de peste bubônica","Uma fome","Um terremoto"],1,"Pandemia que matou cerca de 1/3 da população europeia no século XIV."),

  // ====== GEOGRAFIA ======
  // Nível 1
  q("geografia",1,"Qual é o maior país do mundo em área?",["China","Estados Unidos","Rússia","Canadá"],2,"A Rússia com ~17,1 milhões de km²."),
  q("geografia",1,"Quantos continentes existem?",["5","6","7","8"],2,"7: África, Antártida, Ásia, Europa, América do Norte, América do Sul e Oceania."),
  q("geografia",1,"Qual é o maior oceano do mundo?",["Atlântico","Índico","Pacífico","Ártico"],2,"O Oceano Pacífico com ~165 milhões de km²."),
  q("geografia",1,"Qual é o maior estado do Brasil?",["Minas Gerais","Pará","Amazonas","Mato Grosso"],2,"O Amazonas com ~1,5 milhão de km²."),
  q("geografia",1,"Qual é a capital do Brasil?",["São Paulo","Rio de Janeiro","Brasília","Salvador"],2,"Brasília é a capital federal desde 1960."),
  q("geografia",1,"Em qual continente fica o Brasil?",["Europa","África","América do Norte","América do Sul"],3,"O Brasil fica na América do Sul."),
  q("geografia",1,"Qual é o maior planeta do Sistema Solar?",["Saturno","Júpiter","Netuno","Urano"],1,"Júpiter é o maior planeta do Sistema Solar."),
  q("geografia",1,"Quantos estados tem o Brasil?",["24","25","26","27"],2,"O Brasil tem 26 estados + o Distrito Federal."),
  q("geografia",1,"Qual é o rio mais famoso do Egito?",["Tigre","Eufrates","Nilo","Amazonas"],2,"O Rio Nilo é o mais famoso e importante do Egito."),
  q("geografia",1,"Qual país tem formato de bota?",["Espanha","Grécia","Itália","Portugal"],2,"A Itália tem o formato característico de uma bota."),
  // Nível 2
  q("geografia",2,"Qual é o rio mais longo do Brasil?",["Rio São Francisco","Rio Amazonas","Rio Paraná","Rio Tocantins"],1,"O Rio Amazonas é o mais longo do Brasil."),
  q("geografia",2,"Qual bioma ocupa a maior parte do território brasileiro?",["Cerrado","Amazônia","Mata Atlântica","Caatinga"],1,"A Amazônia ocupa cerca de 49% do território."),
  q("geografia",2,"Qual é o menor país do mundo?",["Mônaco","Vaticano","San Marino","Liechtenstein"],1,"O Vaticano com apenas 0,44 km²."),
  q("geografia",2,"Qual é a montanha mais alta do mundo?",["K2","Monte Everest","Kangchenjunga","Makalu"],1,"O Monte Everest com 8.849 metros."),
  q("geografia",2,"Qual é o deserto mais quente do mundo?",["Gobi","Atacama","Saara","Kalahari"],2,"O Deserto do Saara na África."),
  q("geografia",2,"Quantos fusos horários tem o Brasil?",["2","3","4","5"],2,"O Brasil tem 4 fusos horários."),
  q("geografia",2,"Qual é o país mais populoso do mundo?",["Estados Unidos","Índia","China","Indonésia"],1,"A Índia ultrapassou a China recentemente como mais populoso."),
  q("geografia",2,"Qual é a região mais populosa do Brasil?",["Sul","Nordeste","Sudeste","Centro-Oeste"],2,"O Sudeste é a região mais populosa."),
  q("geografia",2,"Qual é o lago mais profundo do mundo?",["Lago Vitória","Lago Baikal","Lago Superior","Lago Titicaca"],1,"O Lago Baikal na Rússia com ~1.642 metros de profundidade."),
  q("geografia",2,"Qual país fica nos dois hemisférios (norte e sul)?",["México","Colômbia","Brasil","Argentina"],2,"O Brasil é cortado pela Linha do Equador."),
  // Nível 3
  q("geografia",3,"Qual é a capital da Austrália?",["Sydney","Melbourne","Canberra","Brisbane"],2,"Canberra é a capital, não Sydney."),
  q("geografia",3,"Em qual fuso horário está Brasília?",["UTC-2","UTC-3","UTC-4","UTC-5"],1,"Brasília está no fuso UTC-3."),
  q("geografia",3,"Qual é o ponto mais alto do Brasil?",["Pico da Neblina","Pico da Bandeira","Monte Roraima","Pico do Cristal"],0,"O Pico da Neblina com 2.993,78 metros no Amazonas."),
  q("geografia",3,"Qual é a linha imaginária que divide a Terra em hemisférios norte e sul?",["Trópico de Capricórnio","Meridiano de Greenwich","Linha do Equador","Trópico de Câncer"],2,"A Linha do Equador (latitude 0°)."),
  q("geografia",3,"Qual país tem a maior floresta tropical do mundo?",["Indonésia","Congo","Brasil","Colômbia"],2,"O Brasil com a Floresta Amazônica."),
  q("geografia",3,"Qual é o estreito que separa a Ásia da América?",["Gibraltar","Magalhães","Bering","Hormuz"],2,"O Estreito de Bering separa Rússia do Alasca."),
  q("geografia",3,"Quantos países existem na América do Sul?",["10","11","12","13"],2,"São 12 países na América do Sul."),
  q("geografia",3,"Qual é a capital do Canadá?",["Toronto","Vancouver","Ottawa","Montreal"],2,"Ottawa é a capital do Canadá."),
  q("geografia",3,"Qual cordilheira atravessa a América do Sul?",["Alpes","Himalaias","Andes","Rochosas"],2,"A Cordilheira dos Andes."),
  q("geografia",3,"Qual é o maior arquipélago do mundo?",["Filipinas","Japão","Indonésia","Maldivas"],2,"A Indonésia com mais de 17 mil ilhas."),

  // ====== CIÊNCIAS ======
  // Nível 1
  q("ciencias",1,"Qual gás as plantas absorvem da atmosfera?",["Oxigênio","Nitrogênio","Gás carbônico","Hidrogênio"],2,"As plantas absorvem CO₂ na fotossíntese."),
  q("ciencias",1,"Qual é o maior órgão do corpo humano?",["Fígado","Coração","Pele","Pulmão"],2,"A pele com cerca de 2m² de área."),
  q("ciencias",1,"A água ferve a qual temperatura (nível do mar)?",["90°C","95°C","100°C","110°C"],2,"A água ferve a 100°C ao nível do mar."),
  q("ciencias",1,"Qual planeta é conhecido como Planeta Vermelho?",["Vênus","Marte","Júpiter","Saturno"],1,"Marte é chamado de Planeta Vermelho por sua cor avermelhada."),
  q("ciencias",1,"O que as plantas produzem na fotossíntese?",["Gás carbônico","Oxigênio","Nitrogênio","Hidrogênio"],1,"As plantas produzem oxigênio durante a fotossíntese."),
  q("ciencias",1,"Quantos planetas tem o Sistema Solar?",["7","8","9","10"],1,"O Sistema Solar tem 8 planetas (Plutão foi reclassificado)."),
  q("ciencias",1,"Qual é o estado da água a 0°C?",["Líquido","Sólido","Gasoso","Plasma"],1,"A 0°C a água congela, passando ao estado sólido."),
  q("ciencias",1,"O que é o Sol?",["Um planeta","Uma estrela","Um satélite","Um cometa"],1,"O Sol é uma estrela, a mais próxima da Terra."),
  q("ciencias",1,"Qual sentido está relacionado aos olhos?",["Audição","Tato","Visão","Olfato"],2,"Os olhos são responsáveis pela visão."),
  q("ciencias",1,"De que as nuvens são feitas?",["Fumaça","Algodão","Gotículas de água","Poeira"],2,"Nuvens são formadas por gotículas de água ou cristais de gelo."),
  // Nível 2
  q("ciencias",2,"Qual é a fórmula da água?",["HO₂","H₂O","H₂O₂","OH"],1,"2 átomos de hidrogênio e 1 de oxigênio: H₂O."),
  q("ciencias",2,"Quantos ossos tem o corpo humano adulto?",["196","206","216","256"],1,"O corpo humano adulto possui 206 ossos."),
  q("ciencias",2,"Qual é o gás mais abundante na atmosfera?",["Oxigênio","Gás carbônico","Nitrogênio","Argônio"],2,"O nitrogênio compõe cerca de 78% da atmosfera."),
  q("ciencias",2,"Qual é a unidade de medida de força?",["Joule","Watt","Newton","Pascal"],2,"A unidade de força no SI é o Newton (N)."),
  q("ciencias",2,"O que é a fotossíntese?",["Respiração das plantas","Processo de gerar alimento usando luz","Reprodução das plantas","Decomposição"],1,"Processo pelo qual plantas convertem luz em energia/alimento."),
  q("ciencias",2,"Qual é o metal líquido à temperatura ambiente?",["Chumbo","Ferro","Mercúrio","Alumínio"],2,"O mercúrio (Hg) é líquido à temperatura ambiente."),
  q("ciencias",2,"Qual é a velocidade da luz (aproximada)?",["100.000 km/s","200.000 km/s","300.000 km/s","400.000 km/s"],2,"A luz viaja a aproximadamente 300.000 km/s."),
  q("ciencias",2,"O que é o pH?",["Medida de temperatura","Escala de acidez/basicidade","Medida de peso","Tipo de vitamina"],1,"O pH mede quão ácida ou básica é uma substância."),
  q("ciencias",2,"Qual vitamina é produzida pela exposição ao sol?",["Vitamina A","Vitamina B","Vitamina C","Vitamina D"],3,"A vitamina D é sintetizada na pele com exposição solar."),
  q("ciencias",2,"Qual planeta é o mais próximo do Sol?",["Vênus","Terra","Marte","Mercúrio"],3,"Mercúrio é o planeta mais próximo do Sol."),
  // Nível 3
  q("ciencias",3,"Qual partícula subatômica tem carga negativa?",["Próton","Nêutron","Elétron","Fóton"],2,"O elétron possui carga elétrica negativa."),
  q("ciencias",3,"O que o DNA significa?",["Ácido desoxirribonucleico","Ácido diribonucleico","Ácido dinucleotídeo","Aminoácido nucleico"],0,"DNA = Ácido Desoxirribonucleico."),
  q("ciencias",3,"Qual é a lei da gravidade de Newton?",["F = m × a","E = mc²","F = G(m1×m2)/r²","PV = nRT"],2,"A lei da gravitação universal: F = G(m₁×m₂)/r²."),
  q("ciencias",3,"O que são mitocôndrias?",["Núcleo da célula","Organelas que produzem energia","Tipo de vírus","Proteínas"],1,"Mitocôndrias são as 'usinas de energia' das células."),
  q("ciencias",3,"Qual é o elemento químico mais abundante no universo?",["Oxigênio","Carbono","Hélio","Hidrogênio"],3,"O hidrogênio é o elemento mais abundante no universo."),
  q("ciencias",3,"O que é um eclipse solar?",["Terra entre Sol e Lua","Lua entre Terra e Sol","Sol entre Terra e Lua","Alinhamento de planetas"],1,"Ocorre quando a Lua fica entre a Terra e o Sol."),
  q("ciencias",3,"Qual é a função dos glóbulos brancos?",["Transportar oxigênio","Defender o organismo","Coagular o sangue","Digerir alimentos"],1,"Glóbulos brancos (leucócitos) fazem parte do sistema imunológico."),
  q("ciencias",3,"O que é a tabela periódica?",["Lista de animais","Organização dos elementos químicos","Calendário","Tabela de medidas"],1,"Organiza os elementos químicos por número atômico e propriedades."),
  q("ciencias",3,"Qual é a camada da atmosfera onde vivemos?",["Estratosfera","Mesosfera","Troposfera","Termosfera"],2,"A troposfera é a camada mais baixa, onde vivemos."),
  q("ciencias",3,"O que causa as marés?",["Vento","Rotação da Terra","Atração gravitacional da Lua","Correntes oceânicas"],2,"As marés são causadas principalmente pela gravidade da Lua."),

  // ====== PORTUGUÊS ======
  // Nível 1
  q("portugues",1,"Qual é o sujeito da frase: 'O gato bebeu leite'?",["Leite","Bebeu","O gato","O leite"],2,"'O gato' é o sujeito, quem pratica a ação."),
  q("portugues",1,"Qual palavra é um substantivo?",["Correr","Bonito","Cachorro","Rapidamente"],2,"'Cachorro' é substantivo (nomeia um ser)."),
  q("portugues",1,"Quantas sílabas tem a palavra 'borboleta'?",["2","3","4","5"],2,"Bor-bo-le-ta = 4 sílabas."),
  q("portugues",1,"Qual é o plural de 'cão'?",["Cãos","Cães","Cãoes","Cãs"],1,"O plural de cão é cães."),
  q("portugues",1,"Qual é o feminino de 'ator'?",["Atora","Atriz","Atura","Atora"],1,"O feminino de ator é atriz."),
  q("portugues",1,"Qual palavra é um verbo?",["Casa","Bonito","Correr","Livro"],2,"'Correr' é verbo (indica ação)."),
  q("portugues",1,"Qual é o antônimo de 'grande'?",["Alto","Enorme","Pequeno","Largo"],2,"O antônimo (oposto) de grande é pequeno."),
  q("portugues",1,"Quantas letras tem o alfabeto português?",["24","25","26","27"],2,"O alfabeto português tem 26 letras."),
  q("portugues",1,"Qual é o sinônimo de 'feliz'?",["Triste","Alegre","Bravo","Calmo"],1,"Feliz e alegre são sinônimos."),
  q("portugues",1,"Qual pontuação termina uma pergunta?",["Ponto final","Vírgula","Ponto de interrogação","Ponto de exclamação"],2,"Perguntas terminam com ponto de interrogação (?)."),
  // Nível 2
  q("portugues",2,"Qual frase está correta?",["Fazem dois anos","Faz dois anos","Fazem dois ano","Faz dois ano"],1,"'Fazer' indicando tempo é impessoal: 'Faz dois anos'."),
  q("portugues",2,"'Mal' e 'mau' — qual é o correto: '__ humor'?",["Mal","Mau","Os dois","Nenhum"],1,"'Mau' é adjetivo (oposto de 'bom'): mau humor."),
  q("portugues",2,"Qual é a classe gramatical de 'rapidamente'?",["Substantivo","Adjetivo","Advérbio","Verbo"],2,"'Rapidamente' é advérbio de modo."),
  q("portugues",2,"Qual frase tem erro de concordância?",["Os meninos brincam","As crianças corre","Elas estudam","Nós falamos"],1,"O correto seria 'As crianças correm'."),
  q("portugues",2,"O que é um ditongo?",["Duas consoantes juntas","Duas vogais na mesma sílaba","Separação de sílabas","Acento gráfico"],1,"Ditongo: encontro de duas vogais na mesma sílaba (ex: 'pai')."),
  q("portugues",2,"Qual é o sujeito de 'Choveu muito ontem'?",["Choveu","Muito","Ontem","Não há sujeito"],3,"'Chover' é verbo impessoal, não tem sujeito."),
  q("portugues",2,"Qual palavra é proparoxítona?",["Café","Lâmpada","Casa","Amor"],1,"Lâmpada: sílaba tônica é a antepenúltima (lâm-pa-da)."),
  q("portugues",2,"'Eu e ele ____ ao cinema.' Complete:",["foi","fomos","foram","fui"],1,"Eu e ele = nós → fomos."),
  q("portugues",2,"Qual é o coletivo de 'lobos'?",["Bando","Alcateia","Matilha","Rebanho"],1,"O coletivo de lobos é alcateia."),
  q("portugues",2,"'Porque', 'por que', 'porquê' ou 'por quê'? '____ você faltou?'",["Porque","Por que","Porquê","Por quê"],1,"Em perguntas, usa-se 'Por que' (separado, sem acento)."),
  // Nível 3
  q("portugues",3,"Em 'Ela me deu o livro', 'me' é que tipo de pronome?",["Possessivo","Demonstrativo","Oblíquo átono","Relativo"],2,"'Me' é pronome pessoal oblíquo átono."),
  q("portugues",3,"Qual figura de linguagem há em 'Meus olhos são dois oceanos'?",["Metonímia","Metáfora","Hipérbole","Ironia"],1,"Metáfora: comparação implícita sem 'como'."),
  q("portugues",3,"O que é uma oração subordinada?",["Oração independente","Oração que depende de outra","Frase sem verbo","Período simples"],1,"Oração subordinada depende de uma oração principal."),
  q("portugues",3,"Qual é a função sintática de 'bonita' em 'A menina é bonita'?",["Sujeito","Objeto direto","Predicativo do sujeito","Adjunto adnominal"],2,"'Bonita' é predicativo do sujeito (qualifica via verbo de ligação)."),
  q("portugues",3,"'Há' ou 'a'? '____ dois anos que não o vejo.'",["A","Há","À","Ah"],1,"'Há' indica tempo passado (verbo haver)."),
  q("portugues",3,"O que é um pleonasmo?",["Uso de palavras opostas","Repetição desnecessária de ideia","Exagero intencional","Comparação implícita"],1,"Pleonasmo: redundância, como 'subir para cima'."),
  q("portugues",3,"Qual é a voz passiva de 'O gato comeu o rato'?",["O rato comeu o gato","O rato foi comido pelo gato","O gato foi comido","Comeu-se o rato"],1,"Na voz passiva, o objeto vira sujeito: 'O rato foi comido pelo gato'."),
  q("portugues",3,"O que é regência verbal?",["Conjugação do verbo","Relação entre verbo e complemento","Tempo verbal","Modo do verbo"],1,"Regência verbal trata da relação entre o verbo e seus complementos."),
  q("portugues",3,"Identifique a oração coordenada: 'Estudei, mas não passei.'",["Estudei","Mas não passei","As duas","Nenhuma"],1,"'Mas não passei' é oração coordenada adversativa."),
  q("portugues",3,"Qual é o tipo de sujeito em 'Venderam a casa'?",["Simples","Composto","Indeterminado","Inexistente"],2,"Sujeito indeterminado: não se sabe quem vendeu."),
];

  // ====== INGLÊS ======
  // Nível 1
  q("ingles",1,"What is the English word for 'casa'?",["Car","House","Dog","Tree"],1,"House = casa."),
  q("ingles",1,"How do you say 'obrigado' in English?",["Please","Sorry","Thank you","Hello"],2,"Thank you = obrigado."),
  q("ingles",1,"What color is the sky?",["Green","Blue","Red","Yellow"],1,"The sky is blue."),
  q("ingles",1,"Choose the correct: 'She ___ a student.'",["am","are","is","be"],2,"She is a student."),
  q("ingles",1,"What is the plural of 'child'?",["Childs","Childrens","Children","Childes"],2,"O plural de child é children."),
  q("ingles",1,"What does 'dog' mean in Portuguese?",["Gato","Cachorro","Pássaro","Peixe"],1,"Dog = cachorro."),
  q("ingles",1,"Complete: 'I ___ happy.'",["is","are","am","be"],2,"I am happy."),
  q("ingles",1,"What day comes after Monday?",["Wednesday","Sunday","Tuesday","Friday"],2,"Após Monday vem Tuesday."),
  q("ingles",1,"How do you say 'água' in English?",["Fire","Water","Earth","Air"],1,"Water = água."),
  q("ingles",1,"What is the opposite of 'big'?",["Tall","Small","Fast","Heavy"],1,"O oposto de big é small."),
  // Nível 2
  q("ingles",2,"Choose the correct form: 'They ___ to school every day.'",["goes","go","going","gone"],1,"They go (sujeito plural usa base form)."),
  q("ingles",2,"What is the past tense of 'eat'?",["Eated","Eaten","Ate","Eating"],2,"O passado de eat é ate."),
  q("ingles",2,"Which sentence is correct?",["He don't like coffee.","He doesn't likes coffee.","He doesn't like coffee.","He not like coffee."],2,"He doesn't like coffee é a forma correta."),
  q("ingles",2,"What does 'however' mean?",["Portanto","Entretanto","Porque","Enquanto"],1,"However = entretanto/porém."),
  q("ingles",2,"Choose: 'If it rains, I ___ stay home.'",["will","would","am","do"],0,"First conditional: If + present, will + base form."),
  q("ingles",2,"What is the comparative of 'good'?",["Gooder","More good","Better","Best"],2,"O comparativo de good é better."),
  q("ingles",2,"Which word is an adverb?",["Beautiful","Quick","Quickly","Beauty"],2,"Quickly é advérbio (terminação -ly)."),
  q("ingles",2,"Complete: 'She has ___ living here since 2010.'",["be","being","been","was"],2,"Present perfect continuous: has been."),
  q("ingles",2,"What does 'although' mean?",["Porque","Embora","Então","Desde"],1,"Although = embora/apesar de."),
  q("ingles",2,"Choose the correct: 'This is ___ interesting book.'",["a","an","the","—"],1,"An antes de vogal: an interesting."),
  // Nível 3
  q("ingles",3,"Which sentence uses the passive voice?",["She wrote the letter.","The letter was written by her.","She is writing.","She writes letters."],1,"Passive: subject receives the action."),
  q("ingles",3,"What is the correct form? 'I wish I ___ taller.'",["am","was","were","be"],2,"Subjunctive: I wish I were."),
  q("ingles",3,"Choose: 'By next year, she ___ her degree.'",["finishes","will finish","will have finished","finished"],2,"Future perfect: will have finished."),
  q("ingles",3,"What does 'ubiquitous' mean?",["Raro","Presente em todo lugar","Invisível","Antigo"],1,"Ubiquitous = presente em todo lugar."),
  q("ingles",3,"Identify the gerund: 'Swimming is fun.'",["is","fun","Swimming","—"],2,"Swimming funciona como substantivo (gerund)."),
  q("ingles",3,"Which is a compound-complex sentence?",["I ran.","I ran and she walked.","Although it rained, I ran and she walked.","She walked."],2,"Tem cláusula dependente + duas independentes."),
  q("ingles",3,"Choose: 'Neither the teacher ___ the students were ready.'",["or","and","nor","but"],2,"Neither... nor é a correlação correta."),
  q("ingles",3,"What is the subjunctive in 'I suggest he ___ early'?",["leaves","leave","left","leaving"],1,"Subjunctive: suggest + base form."),
  q("ingles",3,"Which word is a conjunction?",["Quickly","Beautiful","Although","Happiness"],2,"Although é conjunção subordinativa."),
  q("ingles",3,"'Had I known, I would have helped.' This is a:",["First conditional","Second conditional","Third conditional (inverted)","Zero conditional"],2,"Inversão do third conditional (Had I known = If I had known)."),

  // ====== EDUCAÇÃO FÍSICA ======
  // Nível 1
  q("educacao_fisica",1,"Quantos jogadores tem um time de futebol em campo?",["9","10","11","12"],2,"Um time de futebol tem 11 jogadores."),
  q("educacao_fisica",1,"Qual esporte usa uma raquete e peteca?",["Tênis","Badminton","Ping-pong","Squash"],1,"Badminton usa raquete e peteca (shuttlecock)."),
  q("educacao_fisica",1,"Quanto tempo dura uma partida de futebol (tempo normal)?",["60 min","80 min","90 min","120 min"],2,"Uma partida dura 90 minutos (2 tempos de 45)."),
  q("educacao_fisica",1,"O que significa 'aquecimento' na educação física?",["Descansar","Preparar o corpo para exercícios","Competir","Alongar após o treino"],1,"Aquecimento prepara o corpo antes da atividade."),
  q("educacao_fisica",1,"Qual é o esporte mais popular do Brasil?",["Vôlei","Basquete","Futebol","Natação"],2,"O futebol é o esporte mais popular do Brasil."),
  q("educacao_fisica",1,"Quantos sets são necessários para vencer no vôlei?",["2","3","4","5"],1,"Vence quem ganhar 3 sets (melhor de 5)."),
  q("educacao_fisica",1,"O que é frequência cardíaca?",["Força muscular","Batimentos do coração por minuto","Flexibilidade","Velocidade"],1,"É o número de vezes que o coração bate por minuto."),
  q("educacao_fisica",1,"Qual desses é um exercício aeróbico?",["Levantamento de peso","Corrida","Flexão","Agachamento com barra"],1,"Corrida é exercício aeróbico (usa oxigênio continuamente)."),
  q("educacao_fisica",1,"Em qual esporte se usa uma cesta?",["Futebol","Handebol","Basquete","Vôlei"],2,"No basquete a bola deve entrar na cesta."),
  q("educacao_fisica",1,"O alongamento serve para:",["Ganhar massa muscular","Aumentar a flexibilidade","Correr mais rápido","Perder peso"],1,"Alongamento aumenta a flexibilidade."),
  // Nível 2
  q("educacao_fisica",2,"Qual a altura oficial da rede de vôlei masculino?",["2,33 m","2,43 m","2,24 m","2,50 m"],1,"A rede masculina tem 2,43 m de altura."),
  q("educacao_fisica",2,"O que é VO2 máximo?",["Velocidade máxima","Consumo máximo de oxigênio","Força máxima","Volume de treino"],1,"VO2 máx mede a capacidade aeróbica máxima."),
  q("educacao_fisica",2,"Quantos jogadores tem um time de basquete em quadra?",["4","5","6","7"],1,"Cada time tem 5 jogadores em quadra."),
  q("educacao_fisica",2,"O que é IMC?",["Índice de Massa Corporal","Índice de Movimento Cardíaco","Índice Muscular Completo","Intensidade Máxima Corporal"],0,"IMC = Índice de Massa Corporal (peso/altura²)."),
  q("educacao_fisica",2,"Qual sistema energético é usado em sprints curtos?",["Aeróbico","Anaeróbico alático (ATP-CP)","Anaeróbico lático","Oxidativo"],1,"Sprints curtos usam o sistema ATP-CP (anaeróbico alático)."),
  q("educacao_fisica",2,"O que é periodização no treinamento?",["Treinar todos os dias igual","Organizar fases de treino","Descansar por meses","Competir sem treinar"],1,"Periodização organiza o treino em fases/ciclos."),
  q("educacao_fisica",2,"Em que ano o Brasil sediou a Copa do Mundo pela última vez?",["2010","2014","2018","2006"],1,"O Brasil sediou a Copa em 2014."),
  q("educacao_fisica",2,"Qual músculo é o maior do corpo humano?",["Bíceps","Quadríceps","Glúteo máximo","Deltóide"],2,"O glúteo máximo é o maior músculo do corpo."),
  q("educacao_fisica",2,"O que é propriocepção?",["Força muscular","Percepção do corpo no espaço","Resistência cardíaca","Velocidade de reação"],1,"Propriocepção é a consciência da posição corporal."),
  q("educacao_fisica",2,"Qual a duração de cada quarto no basquete (NBA)?",["10 min","12 min","15 min","20 min"],1,"Na NBA cada quarto tem 12 minutos."),
  // Nível 3
  q("educacao_fisica",3,"O que é o princípio da sobrecarga progressiva?",["Treinar sempre igual","Aumentar estímulos gradualmente","Reduzir a carga com o tempo","Treinar apenas em competições"],1,"Sobrecarga progressiva: aumentar gradualmente a intensidade."),
  q("educacao_fisica",3,"Qual a frequência cardíaca máxima teórica (fórmula clássica)?",["200 - idade","220 - idade","180 - idade","250 - idade"],1,"FC máx teórica = 220 - idade."),
  q("educacao_fisica",3,"O que é lactato sanguíneo?",["Um hormônio","Subproduto do metabolismo anaeróbico","Tipo de vitamina","Proteína muscular"],1,"Lactato é produzido na glicólise anaeróbica."),
  q("educacao_fisica",3,"Qual tipo de fibra muscular é mais resistente à fadiga?",["Tipo I (lenta)","Tipo IIa","Tipo IIb (rápida)","Tipo III"],0,"Fibras tipo I (contração lenta) são mais resistentes à fadiga."),
  q("educacao_fisica",3,"O que é o EPOC?",["Exercício pós-competição","Consumo excessivo de oxigênio pós-exercício","Protocolo de aquecimento","Escala de percepção"],1,"EPOC = Excess Post-exercise Oxygen Consumption."),
  q("educacao_fisica",3,"Qual é a função do líquido sinovial?",["Transportar sangue","Lubrificar as articulações","Nutrir os músculos","Produzir energia"],1,"O líquido sinovial lubrifica e protege as articulações."),
  q("educacao_fisica",3,"O que é hipertrofia muscular?",["Perda de massa","Aumento do tamanho das fibras musculares","Redução da força","Aumento da flexibilidade"],1,"Hipertrofia é o aumento do volume das fibras musculares."),
  q("educacao_fisica",3,"Qual a principal fonte de energia em exercícios de longa duração?",["ATP-CP","Glicogênio apenas","Gordura (lipídios)","Proteínas"],2,"Em exercícios prolongados de baixa intensidade, gordura é a principal fonte."),
  q("educacao_fisica",3,"O que é o teste de Cooper?",["Teste de flexibilidade","Teste de corrida de 12 minutos","Teste de força máxima","Teste de velocidade de 100m"],1,"Teste de Cooper: correr o máximo possível em 12 minutos."),
  q("educacao_fisica",3,"Qual o papel do ATP no exercício?",["Regular a temperatura","Fornecer energia direta para contração muscular","Transportar oxigênio","Produzir hormônios"],1,"ATP é a moeda energética usada na contração muscular."),
];

export function getQuestionsForSubject(subject: Subject, difficulty: number): Question[] {
  const maxDiff = Math.min(difficulty, 3) as 1 | 2 | 3;
  return questions.filter(q => q.subject === subject && q.difficulty <= maxDiff);
}

export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}
