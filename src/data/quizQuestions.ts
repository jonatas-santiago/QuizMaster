export type Subject = "matematica" | "historia" | "geografia" | "ciencias" | "portugues";

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
};

export const questions: Question[] = [
  // MATEMÁTICA - Nível 1
  { id: 1, subject: "matematica", difficulty: 1, question: "Quanto é 7 × 8?", options: ["54", "56", "58", "64"], correctIndex: 1, explanation: "7 × 8 = 56. Uma dica: 7×8 = 56 (5, 6, 7, 8 em sequência!)." },
  { id: 2, subject: "matematica", difficulty: 1, question: "Qual é a metade de 64?", options: ["30", "32", "34", "36"], correctIndex: 1, explanation: "64 ÷ 2 = 32." },
  { id: 3, subject: "matematica", difficulty: 1, question: "Quanto é 15 + 28?", options: ["41", "42", "43", "44"], correctIndex: 2, explanation: "15 + 28 = 43." },
  // MATEMÁTICA - Nível 2
  { id: 4, subject: "matematica", difficulty: 2, question: "Qual é a raiz quadrada de 144?", options: ["10", "11", "12", "14"], correctIndex: 2, explanation: "12 × 12 = 144, então √144 = 12." },
  { id: 5, subject: "matematica", difficulty: 2, question: "Quanto é 3² + 4²?", options: ["20", "24", "25", "49"], correctIndex: 2, explanation: "3² = 9 e 4² = 16. Logo, 9 + 16 = 25." },
  { id: 6, subject: "matematica", difficulty: 2, question: "Se x + 5 = 12, qual é o valor de x?", options: ["5", "6", "7", "8"], correctIndex: 2, explanation: "x = 12 - 5 = 7." },
  // MATEMÁTICA - Nível 3
  { id: 7, subject: "matematica", difficulty: 3, question: "Qual é 20% de 350?", options: ["60", "65", "70", "75"], correctIndex: 2, explanation: "20% de 350 = 0,20 × 350 = 70." },
  { id: 8, subject: "matematica", difficulty: 3, question: "Resolva: 2x - 4 = 10", options: ["5", "6", "7", "8"], correctIndex: 2, explanation: "2x = 14, logo x = 7." },

  // HISTÓRIA - Nível 1
  { id: 9, subject: "historia", difficulty: 1, question: "Quem descobriu o Brasil?", options: ["Cristóvão Colombo", "Pedro Álvares Cabral", "Vasco da Gama", "Fernão de Magalhães"], correctIndex: 1, explanation: "Pedro Álvares Cabral chegou ao Brasil em 22 de abril de 1500." },
  { id: 10, subject: "historia", difficulty: 1, question: "Em que ano o Brasil se tornou independente?", options: ["1808", "1822", "1889", "1500"], correctIndex: 1, explanation: "A independência foi proclamada por Dom Pedro I em 7 de setembro de 1822." },
  { id: 11, subject: "historia", difficulty: 1, question: "Quem foi o primeiro presidente do Brasil?", options: ["Dom Pedro II", "Getúlio Vargas", "Deodoro da Fonseca", "Juscelino Kubitschek"], correctIndex: 2, explanation: "Marechal Deodoro da Fonseca foi o primeiro presidente, após a Proclamação da República em 1889." },
  // HISTÓRIA - Nível 2
  { id: 12, subject: "historia", difficulty: 2, question: "A Revolução Francesa ocorreu em que ano?", options: ["1776", "1789", "1815", "1848"], correctIndex: 1, explanation: "A Revolução Francesa começou em 1789 com a Queda da Bastilha." },
  { id: 13, subject: "historia", difficulty: 2, question: "Qual civilização construiu as pirâmides de Gizé?", options: ["Romana", "Grega", "Egípcia", "Mesopotâmica"], correctIndex: 2, explanation: "As pirâmides de Gizé foram construídas pelos egípcios antigos por volta de 2500 a.C." },
  // HISTÓRIA - Nível 3
  { id: 14, subject: "historia", difficulty: 3, question: "A Guerra dos Cem Anos foi entre quais países?", options: ["Espanha e Portugal", "Inglaterra e França", "Alemanha e Rússia", "Itália e Áustria"], correctIndex: 1, explanation: "A Guerra dos Cem Anos (1337-1453) foi travada entre Inglaterra e França." },
  { id: 15, subject: "historia", difficulty: 3, question: "Qual tratado dividiu o mundo entre Portugal e Espanha?", options: ["Tratado de Versalhes", "Tratado de Tordesilhas", "Tratado de Methuen", "Tratado de Madri"], correctIndex: 1, explanation: "O Tratado de Tordesilhas (1494) dividiu as terras descobertas entre Portugal e Espanha." },

  // GEOGRAFIA - Nível 1
  { id: 16, subject: "geografia", difficulty: 1, question: "Qual é o maior país do mundo em área?", options: ["China", "Estados Unidos", "Rússia", "Canadá"], correctIndex: 2, explanation: "A Rússia é o maior país do mundo com ~17,1 milhões de km²." },
  { id: 17, subject: "geografia", difficulty: 1, question: "Quantos continentes existem?", options: ["5", "6", "7", "8"], correctIndex: 2, explanation: "Existem 7 continentes: África, Antártida, Ásia, Europa, América do Norte, América do Sul e Oceania." },
  { id: 18, subject: "geografia", difficulty: 1, question: "Qual é o maior oceano do mundo?", options: ["Atlântico", "Índico", "Pacífico", "Ártico"], correctIndex: 2, explanation: "O Oceano Pacífico é o maior, cobrindo cerca de 165 milhões de km²." },
  // GEOGRAFIA - Nível 2
  { id: 19, subject: "geografia", difficulty: 2, question: "Qual é o rio mais longo do Brasil?", options: ["Rio São Francisco", "Rio Amazonas", "Rio Paraná", "Rio Tocantins"], correctIndex: 1, explanation: "O Rio Amazonas é o mais longo do Brasil e um dos maiores do mundo." },
  { id: 20, subject: "geografia", difficulty: 2, question: "Qual bioma ocupa a maior parte do território brasileiro?", options: ["Cerrado", "Amazônia", "Mata Atlântica", "Caatinga"], correctIndex: 1, explanation: "A Amazônia ocupa cerca de 49% do território brasileiro." },
  // GEOGRAFIA - Nível 3
  { id: 21, subject: "geografia", difficulty: 3, question: "Qual é a capital da Austrália?", options: ["Sydney", "Melbourne", "Canberra", "Brisbane"], correctIndex: 2, explanation: "Canberra é a capital da Austrália, não Sydney como muitos pensam." },
  { id: 22, subject: "geografia", difficulty: 3, question: "Em qual fuso horário está Brasília (em relação a Greenwich)?", options: ["UTC-2", "UTC-3", "UTC-4", "UTC-5"], correctIndex: 1, explanation: "Brasília está no fuso horário UTC-3 (3 horas atrás de Greenwich)." },

  // CIÊNCIAS - Nível 1
  { id: 23, subject: "ciencias", difficulty: 1, question: "Qual gás as plantas absorvem da atmosfera?", options: ["Oxigênio", "Nitrogênio", "Gás carbônico", "Hidrogênio"], correctIndex: 2, explanation: "As plantas absorvem CO₂ (gás carbônico) na fotossíntese e liberam O₂." },
  { id: 24, subject: "ciencias", difficulty: 1, question: "Qual é o maior órgão do corpo humano?", options: ["Fígado", "Coração", "Pele", "Pulmão"], correctIndex: 2, explanation: "A pele é o maior órgão do corpo humano, com cerca de 2m² de área." },
  { id: 25, subject: "ciencias", difficulty: 1, question: "A água ferve a qual temperatura (nível do mar)?", options: ["90°C", "95°C", "100°C", "110°C"], correctIndex: 2, explanation: "A água ferve a 100°C ao nível do mar (pressão de 1 atm)." },
  // CIÊNCIAS - Nível 2
  { id: 26, subject: "ciencias", difficulty: 2, question: "Qual é a fórmula da água?", options: ["HO₂", "H₂O", "H₂O₂", "OH"], correctIndex: 1, explanation: "A molécula de água é composta por 2 átomos de hidrogênio e 1 de oxigênio: H₂O." },
  { id: 27, subject: "ciencias", difficulty: 2, question: "Quantos ossos tem o corpo humano adulto?", options: ["196", "206", "216", "256"], correctIndex: 1, explanation: "O corpo humano adulto possui 206 ossos." },
  // CIÊNCIAS - Nível 3
  { id: 28, subject: "ciencias", difficulty: 3, question: "Qual partícula subatômica tem carga negativa?", options: ["Próton", "Nêutron", "Elétron", "Fóton"], correctIndex: 2, explanation: "O elétron possui carga elétrica negativa, enquanto o próton tem carga positiva." },
  { id: 29, subject: "ciencias", difficulty: 3, question: "O que o DNA significa?", options: ["Ácido desoxirribonucleico", "Ácido diribonucleico", "Ácido dinucleotídeo", "Aminoácido nucleico"], correctIndex: 0, explanation: "DNA = Ácido Desoxirribonucleico, a molécula que carrega a informação genética." },

  // PORTUGUÊS - Nível 1
  { id: 30, subject: "portugues", difficulty: 1, question: "Qual é o sujeito da frase: 'O gato bebeu leite'?", options: ["Leite", "Bebeu", "O gato", "O leite"], correctIndex: 2, explanation: "'O gato' é o sujeito, pois é quem pratica a ação de beber." },
  { id: 31, subject: "portugues", difficulty: 1, question: "Qual palavra é um substantivo?", options: ["Correr", "Bonito", "Cachorro", "Rapidamente"], correctIndex: 2, explanation: "'Cachorro' é substantivo (nomeia um ser). 'Correr' é verbo, 'bonito' adjetivo e 'rapidamente' advérbio." },
  { id: 32, subject: "portugues", difficulty: 1, question: "Quantas sílabas tem a palavra 'borboleta'?", options: ["2", "3", "4", "5"], correctIndex: 2, explanation: "Bor-bo-le-ta = 4 sílabas (polissílaba)." },
  // PORTUGUÊS - Nível 2
  { id: 33, subject: "portugues", difficulty: 2, question: "Qual frase está correta?", options: ["Fazem dois anos", "Faz dois anos", "Fazem dois ano", "Faz dois ano"], correctIndex: 1, explanation: "O verbo 'fazer' indicando tempo é impessoal, ficando no singular: 'Faz dois anos'." },
  { id: 34, subject: "portugues", difficulty: 2, question: "'Mal' e 'mau' — qual é o correto: '__ humor'?", options: ["Mal", "Mau", "Os dois", "Nenhum"], correctIndex: 1, explanation: "'Mau' é adjetivo (oposto de 'bom'): mau humor. 'Mal' é advérbio (oposto de 'bem')." },
  // PORTUGUÊS - Nível 3
  { id: 35, subject: "portugues", difficulty: 3, question: "Em 'Ela me deu o livro', 'me' é que tipo de pronome?", options: ["Possessivo", "Demonstrativo", "Oblíquo átono", "Relativo"], correctIndex: 2, explanation: "'Me' é pronome pessoal oblíquo átono, funcionando como objeto indireto." },
  { id: 36, subject: "portugues", difficulty: 3, question: "Qual figura de linguagem há em 'Meus olhos são dois oceanos'?", options: ["Metonímia", "Metáfora", "Hipérbole", "Ironia"], correctIndex: 1, explanation: "É metáfora: comparação implícita entre olhos e oceanos, sem uso de 'como'." },
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
