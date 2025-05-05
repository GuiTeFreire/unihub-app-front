export type ClassData = {
    code: string;        // Ex: "INF101"
    name: string;        // Ex: "Algoritmos e Estruturas de Dados"
    period: string;      // Ex: "1º período"
    mandatory: string;   // Ex: "Obrigatória" ou "Optativa"
};

export const classList: ClassData[] = [
    // 1) Fundamentos de Sistemas de Informação TIN0206 1
    { code: "TIN0206", name: "Fundamentos de Sistemas de Informação", period: "1º", mandatory: "Obrigatória" },
    // 2) Fundamentos de Cálculo TMT0043 1
    { code: "TMT0043", name: "Fundamentos de Cálculo", period: "1º", mandatory: "Obrigatória" },
    // 3) Arquitetura de Computadores TIN0235 1
    { code: "TIN0235", name: "Arquitetura de Computadores", period: "1º", mandatory: "Obrigatória" },
    // 4) Algoritmos e Programação TIN0222 1
    { code: "TIN0222", name: "Algoritmos e Programação", period: "1º", mandatory: "Obrigatória" },
    // 5) Projeto Integrador I TIN0209 2
    { code: "TIN0209", name: "Projeto Integrador I", period: "2º", mandatory: "Obrigatória" },
    // 6) Álgebra Linear TMT0044 2
    { code: "TMT0044", name: "Álgebra Linear", period: "2º", mandatory: "Obrigatória" },
    // 7) Fundamentos de Gestão Organizacional TIN0218 2
    { code: "TIN0218", name: "Fundamentos de Gestão Organizacional", period: "2º", mandatory: "Obrigatória" },
    // 8) Cálculo Diferencial e Integral I TMT0045 2
    { code: "TMT0045", name: "Cálculo Diferencial e Integral I", period: "2º", mandatory: "Obrigatória" },
    // 9) Introdução à Lógica Computacional TIN0223 2
    { code: "TIN0223", name: "Introdução à Lógica Computacional", period: "2º", mandatory: "Obrigatória" },
    // 10) Técnicas de Programação TIN0224 2
    { code: "TIN0224", name: "Técnicas de Programação", period: "2º", mandatory: "Obrigatória" },
    // 11) Modelagem da Informação TIN0232 3
    { code: "TIN0232", name: "Modelagem da Informação", period: "3º", mandatory: "Obrigatória" },
    // 12) Cálculo Diferencial e Integral II TMT0046 3
    { code: "TMT0046", name: "Cálculo Diferencial e Integral II", period: "3º", mandatory: "Obrigatória" },
    // 13) Estruturas de Dados TIN0225 3
    { code: "TIN0225", name: "Estruturas de Dados", period: "3º", mandatory: "Obrigatória" },
    // 14) Estruturas Discretas com Algoritmos TIN0257 O
    { code: "TIN0257", name: "Estruturas Discretas com Algoritmos", period: "", mandatory: "Optativa" },
    // 15) Probabilidade TMQ0007 4
    { code: "TMQ0007", name: "Probabilidade", period: "4º", mandatory: "Obrigatória" },
    // 16) Sistemas Operacionais TIN0236 3
    { code: "TIN0236", name: "Sistemas Operacionais", period: "3º", mandatory: "Obrigatória" },
    // 17) Análise e Projeto de Sistemas TIN0228 3
    { code: "TIN0228", name: "Análise e Projeto de Sistemas", period: "3º", mandatory: "Obrigatória" },
    // 18) Estatística TMQ0008 5
    { code: "TMQ0008", name: "Estatística", period: "5º", mandatory: "Obrigatória" },
    // 19) Estruturas de Dados Avançadas TIN0256 O
    { code: "TIN0256", name: "Estruturas de Dados Avançadas", period: "", mandatory: "Optativa" },
    // 20) Interação Humano-Computador TIN0208 1
    { code: "TIN0208", name: "Interação Humano-Computador", period: "1º", mandatory: "Obrigatória" },
    // 21) Linguagens e Paradigmas de Programação TIN0226 3
    { code: "TIN0226", name: "Linguagens e Paradigmas de Programação", period: "3º", mandatory: "Obrigatória" },
    // 22) Redes de Computadores TIN0237 4
    { code: "TIN0237", name: "Redes de Computadores", period: "4º", mandatory: "Obrigatória" },
    // 23) Projeto e Análise de Algoritmos TIN0227 4
    { code: "TIN0227", name: "Projeto e Análise de Algoritmos", period: "4º", mandatory: "Obrigatória" },
    // 24) Armazenamento e Gestão de Dados TIN0233 4
    { code: "TIN0233", name: "Armazenamento e Gestão de Dados", period: "4º", mandatory: "Obrigatória" },
    // 25) Empreendedorismo e Inovação TIN0221 6
    { code: "TIN0221", name: "Empreendedorismo e Inovação", period: "6º", mandatory: "Obrigatória" },
    // 26) Engenharia de Software I TIN0229 4
    { code: "TIN0229", name: "Engenharia de Software I", period: "4º", mandatory: "Obrigatória" },
    // 27) Redes Móveis e Computação Ubíqua TIN0301 O
    { code: "TIN0301", name: "Redes Móveis e Computação Ubíqua", period: "", mandatory: "Optativa" },
    // 28) Engenharia de Software II TIN0230 5
    { code: "TIN0230", name: "Engenharia de Software II", period: "5º", mandatory: "Obrigatória" },
    // 29) Projeto Integrador II TIN0210 4
    { code: "TIN0210", name: "Projeto Integrador II", period: "4º", mandatory: "Obrigatória" },
    // 30) Tópicos em Processos de Software TIN0284 O
    { code: "TIN0284", name: "Tópicos em Processos de Software", period: "", mandatory: "Optativa" },
    // 31) Gerência de Projetos TIN0231 5
    { code: "TIN0231", name: "Gerência de Projetos", period: "5º", mandatory: "Obrigatória" },
    // 33) Ciência de Dados TIN0234 6
    { code: "TIN0234", name: "Ciência de Dados", period: "6º", mandatory: "Obrigatória" },
    // 34) Gestão de Processos de Negócios TIN0219 2
    { code: "TIN0219", name: "Gestão de Processos de Negócios", period: "2º", mandatory: "Obrigatória" },
    // 35) Governança de Tecnologia da Informação TIN0220 5
    { code: "TIN0220", name: "Governança de Tecnologia da Informação", period: "5º", mandatory: "Obrigatória" },
    // 36) Informação e Sociedade TIN0207 1
    { code: "TIN0207", name: "Informação e Sociedade", period: "1º", mandatory: "Obrigatória" },
    // 37) Metodologia Científica e Tecnológica TIN0211 5
    { code: "TIN0211", name: "Metodologia Científica e Tecnológica", period: "5º", mandatory: "Obrigatória" },
    // 38) Atividades de Extensão I TIN0306 A
    { code: "TIN0306", name: "Atividades de Extensão I", period: "", mandatory: "Atividade" },
    // 39) Atividades de Extensão II TIN0307 A
    { code: "TIN0307", name: "Atividades de Extensão II", period: "", mandatory: "Atividade" },
    // 40) Projeto de Graduação I TIN0308 A
    { code: "TIN0308", name: "Projeto de Graduação I", period: "", mandatory: "Atividade" },
    // 41) Projeto de Graduação II TIN0309 A
    { code: "TIN0309", name: "Projeto de Graduação II", period: "", mandatory: "Atividade" },
    // 42) Acessibilidade TIN0238 O
    { code: "TIN0238", name: "Acessibilidade", period: "", mandatory: "Optativa" },
    // 43) Ambiente Operacional UNIX TIN0150 O
    { code: "TIN0150", name: "Ambiente Operacional UNIX", period: "", mandatory: "Optativa" },
    // 44) Aprendizagem Profunda TIN0255 O
    { code: "TIN0255", name: "Aprendizagem Profunda", period: "", mandatory: "Optativa" },
    // 45) Automação TIN0297 O
    { code: "TIN0297", name: "Automação", period: "", mandatory: "Optativa" },
    // 46) Ciência de Redes TIN0240 O
    { code: "TIN0240", name: "Ciência de Redes", period: "", mandatory: "Optativa" },
    // 47) Fundamentos de Representação de Conhecimento e Raciocínio TIN0147 O
    { code: "TIN0147", name: "Fundamentos de Representação de Conhecimento e Raciocínio", period: "", mandatory: "Optativa" },
    // 48) Heurísticas Inteligentes: Técnicas e Aplicações TIN0260 O
    { code: "TIN0260", name: "Heurísticas Inteligentes: Técnicas e Aplicações", period: "", mandatory: "Optativa" },
    // 49) Introdução à Inteligência Artificial TIN0261 O
    { code: "TIN0261", name: "Introdução à Inteligência Artificial", period: "", mandatory: "Optativa" },
    // 50) Projeto de Aplicações com Dados Abertos TIN0291 O
    { code: "TIN0291", name: "Projeto de Aplicações com Dados Abertos", period: "", mandatory: "Optativa" },
    // 51) Projeto de Jogos Digitais TIN0274 O
    { code: "TIN0274", name: "Projeto de Jogos Digitais", period: "", mandatory: "Optativa" },
    // 52) Técnicas de Programação Avançada TIN0265 O
    { code: "TIN0265", name: "Técnicas de Programação Avançada", period: "", mandatory: "Optativa" },
    // 53) Tópicos em Qualidade de Software TIN0286 O
    { code: "TIN0286", name: "Tópicos em Qualidade de Software", period: "", mandatory: "Optativa" },
];