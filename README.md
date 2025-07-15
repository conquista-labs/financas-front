# Arquitetura e Estrutura de Pastas

## Visão Geral

Este projeto segue uma arquitetura bem definida para garantir manutenção, escalabilidade e flexibilidade ao longo do tempo. A estrutura adotada busca respeitar os princípios de Clean Architecture, mantendo cada camada com responsabilidades claras e bem delimitadas.

A organização do código é baseada em boas práticas que incluem separação de preocupações, desacoplamento e reutilização de componentes.

## Tecnologias Principais Utilizadas

- **RarUI**: Estamos usando o [RarUI](https://rarui.rarolabs.com.br/) como design system para garantir uma interface padronizada e consistente.
- **Vitest**: Utilizamos [Vitest](https://vitest.dev/) para testes unitários eficientes e fáceis de manter.
- **React Query**: A camada HTTP é gerenciada com [React Query](https://tanstack.com/query/latest/docs/framework/react/overview) para cache e sincronização de dados.
- **Axios**: Utilizado para realizar chamadas à API, [Axios](https://axios-http.com/ptbr) oferece uma interface simples e poderosa.
- **Zustand**: Para controle de estado global, usamos [Zustand](https://zustand.docs.pmnd.rs/getting-started/introduction) pela sua leveza e simplicidade.
- **React Router DOM**: Gerencia o roteamento da aplicação de forma eficiente com [React Router DOM](https://reactrouter.com/).

## Camadas

### Domain

A camada de **domain** é responsável por concentrar as regras de negócio da aplicação, mantendo uma estrutura independente de tecnologias específicas. É onde encapsulamos a lógica central do sistema, garantindo que outras camadas consumam essa lógica sem depender de implementações concretas.

##### Errors

- Define erros específicos que podem ocorrer dentro do domínio, como `invalidCredentialsError` e `unexpectedError`.
- Os erros encapsulam mensagens claras para uma melhor tratativa em outras camadas.

##### Models

- Contém as definições de tipos e interfaces que representam dados essenciais do domínio.
- Exemplos incluem `auth.ts` para autenticação e `proposal.ts` para propostas.
- A separação clara de requests e responses (por exemplo, `authenticateRequest.ts` e `authenticateResponse.ts`) mantém a comunicação organizada e explícita.

##### Protocols

- Define contratos (interfaces) para provedores que são utilizados na aplicação, como `authProvider.ts` e `proposalProvider.ts`.
- Esta estrutura permite a injeção de dependências, facilitando testes e futuras mudanças de implementação.

##### UseCases

- Representa os casos de uso específicos da aplicação. Cada caso de uso encapsula uma operação do domínio, como `authenticate`, `generateProposalPdf`, e `cbbTerms`.
- Os casos de uso são responsáveis por orquestrar chamadas a diferentes serviços e garantir que as regras de negócio sejam aplicadas corretamente.

#### Benefícios da Abordagem

- **Independência**: A camada de domínio é agnóstica em relação à infraestrutura e frameworks, promovendo maior manutenibilidade.
- **Isolamento das Regras de Negócio**: As regras de negócio estão concentradas e organizadas, evitando a dispersão de lógica entre diferentes partes da aplicação.
- **Testabilidade**: Como não há dependência direta de frameworks, a camada de domínio é altamente testável.

### Data

A camada **Data** é responsável por implementar concretamente os casos de uso definidos na camada de **Domain**. Nesta camada, encapsulamos as chamadas para serviços externos e garantimos que a lógica de integração esteja desacoplada das bibliotecas específicas.

##### Mocks

- Contém simulações das chamadas e implementações de casos de uso, como `mockAuthenticate.ts` e `mockGenerateProposalPdf.ts`.
- Útil para testes unitários e ambientes de desenvolvimento sem dependência direta de APIs reais.

##### Protocols

- Define contratos e interfaces para comunicação com serviços externos, como o `httpClient.ts`.
- O desacoplamento do cliente **HTTP** permite substituir a biblioteca (Axios, Fetch, etc.) sem impactar os casos de uso.

##### UseCases

- Implementações concretas dos casos de uso definidos no **Domain**, como `authenticate.ts`, `cbbTerms.ts`, e `generateProposalPdf.ts`.
- Cada caso de uso orquestra a lógica necessária para comunicação com APIs externas, respeitando as interfaces previamente definidas no domínio.

#### Boas Práticas Adotadas

- **Independência de Implementação**: A camada depende exclusivamente do domínio, garantindo um fluxo de dependência claro e robusto.

- **Desacoplamento do Cliente HTTP**: A interface `httpClient.ts` abstrai a biblioteca de requisições, mantendo a flexibilidade para futuras mudanças.

- **Segregação de Responsabilidades**: Os detalhes de como uma requisição é feita não são tratados nesta camada, mas sim delegados à camada Infra, garantindo modularidade e manutenção facilitada.

#### Benefícios

- **Facilidade de Manutenção**: A troca da biblioteca de requisições não afeta os casos de uso já implementados.
- **Testabilidade**: Mocks bem definidos permitem testes eficazes e desacoplados do backend.
- **Flexibilidade**: Adaptação rápida a mudanças nas APIs externas com impactos mínimos no restante da aplicação.

### Infra

A camada **Infraestrutura (Infra)** é responsável por implementar as integrações com frameworks e bibliotecas externas, mantendo a abstração necessária para que as camadas superiores não sejam impactadas por mudanças nessas implementações.

##### HTTP

- Contém a implementação concreta do protocolo HTTP para requisições.
- Arquivo principal: `axiosHttpClient.ts`, onde a biblioteca Axios é utilizada para implementar a interface `HttpClient`.
- Testes unitários: `axiosHttpClient.spec.ts` para garantir a funcionalidade correta da implementação

##### Mock

- Simulações para o cliente HTTP, como `mockAxiosHttpClient.ts.`
- Útil para testes e desenvolvimento desacoplado de dependências externas.

#### Boas Práticas Adotadas

- **Abstração com Interface**: A interface `HttpClient` definida na camada de **Data** garante que qualquer mudança na biblioteca de requisição HTTP (como substituir Axios por Fetch) possa ser feita sem impactar os casos de uso.

- **Desacoplamento**: A camada **Infra** não conhece diretamente a camada **Domínio**, garantindo que a lógica de negócios permaneça isolada de detalhes técnicos.

- **Testabilidade**: A utilização de mocks facilita a criação de testes isolados, garantindo a robustez da implementação.

#### Benefícios

- **Flexibilidade**: A camada de Infra pode ser facilmente ajustada para utilizar novas tecnologias sem necessidade de refatoração nas camadas superiores.
- **Facilidade de Manutenção**: O desacoplamento permite identificar e corrigir problemas sem impactar a lógica de negócios.
- **Respeito ao Princípio de Dependência**: Mantém a camada de **Domínio** completamente independente de frameworks externos.

### Presentation

A camada de **Presentation** é responsável pela interface com o usuário, incluindo componentes reutilizáveis, lógica de hooks, páginas específicas, roteamento, estado global e definições de tipos para o sistema.

##### Components

- Contém componentes reutilizáveis em mais de uma página do sistema.
- Segue a convenção de nomenclatura com arquivos em PascalCase para componentes (`Header.tsx`) e arquivos de teste (`header.spec.tsx`).
- Inclui arquivos específicos de estilos (`header.styles.css`) quando necessário.

##### Hooks

- Contém hooks reutilizáveis para o sistema, abstraindo a lógica complexa e mantendo a organização limpa.
- Implementa o uso do **React Query**, com um hook dedicado para cada caso de uso.

  ```tsx
  import { useQuery, UseQueryResult } from "@tanstack/react-query";
  import { makeCbbTermsFactory } from "@/main/factories/usecases";
  import { CbbTermsModel } from "@/domain/usecases";
  import { UseCbbTermsOptions } from "./useCbbTerms.types";

  export const useCbbTerms = (
    options?: UseCbbTermsOptions,
  ): UseQueryResult<CbbTermsModel, unknown> => {
    const cbbTerms = makeCbbTermsFactory();

    return useQuery({
      queryKey: ["get", "cbb-terms"],
      queryFn: () => cbbTerms.get(),
      ...options,
    });
  };
  ```

- Isso mantém a lógica do **React Query** separada dos componentes, facilitando o reuso e os testes.

##### Mocks

- Contém utilitários de teste para componentes e páginas React, além de mocks usados repetidas vezes.
- Exemplo: Mock para **React Router Dom**, utilitários para interceptar requisições e simular respostas, e configurações de teste com **Memory Router**.

##### Pages

- Contém as páginas principais do sistema.
- Cada página consome hooks e componentes reutilizáveis da camada de **Presentation**.
- Caso um componente ou hook seja específico de uma página, ele permanece dentro da estrutura dessa página.

##### Router

- Centraliza o roteamento da aplicação, definindo todas as rotas do sistema.

##### Store

- Gerencia os estados globais da aplicação usando **Zustand**.
- Organizado para garantir uma separação clara entre estado global e lógica de apresentação.

##### Types

- Contém tipos utilizados apenas dentro da camada de **Presentation**, principalmente para pacotes externos que precisam de tipagens globais.

#### Convenções de Nomeação

| **Tipo de Arquivo**       | **Nomenclatura** | **Exemplo**              |
| ------------------------- | ---------------- | ------------------------ |
| Arquivos de Teste         | `.spec`          | `header.spec.tsx`        |
| Arquivos de Definição     | `.definitions`   | `header.definitions.tsx` |
| Arquivos de Tipagem       | `.types`         | `header.types.ts`        |
| Componentes Implementados | Início Maiúsculo | `Header.tsx`             |
| Arquivos de Estilo        | `.styles`        | `header.styles.css`      |

#### Benefícios da Abordagem

- **Separação de Responsabilidades**: Componentes e hooks possuem funções bem definidas, mantendo a arquitetura limpa.
- **Desacoplamento**: A lógica de chamada da API com React Query não está embutida nos componentes.
- **Facilidade de Testes**: Mocks e utilitários de teste garantem testes isolados e eficientes.
- **Manutenibilidade**: A organização clara das pastas e convenção de arquivos facilita a manutenção e escalabilidade.

### Main

A camada **Main** depende de todas as outras camadas da arquitetura e serve como o ponto central para a inicialização e composição do sistema. Ela sacrifica a simplicidade para manter as demais camadas limpas, modulares e desacopladas.

#### Funções Principais

- **Composição de Dependências**: Implementa o padrão Dependency Injection, garantindo que as dependências sejam abstraídas e injetadas nos componentes.
- **Factories**: Centraliza a criação de instâncias concretas para abstrações das camadas inferiores, mantendo a lógica de inicialização encapsulada.
- **Desacoplamento**: Evita instanciar diretamente dependências no código, mantendo a flexibilidade e extensibilidade da aplicação.
- **Agregação**: Faz a ponte entre diferentes camadas, conectando dados, lógica de domínio, validações e apresentação.

##### Adapters

- Contém adaptadores que fazem a interface entre a camada de Main e componentes externos ou internos.
- **Exemplo**: Adaptadores de APIs, formatação de dados ou integração com bibliotecas.

##### Decorators

- Contém decorators que estendem ou modificam o comportamento de funções ou classes.
- **Exemplo**: Um decorator para log de chamadas a APIs ou autenticação.

##### Factories

- Implementa o padrão Factory, centralizando a criação de instâncias para diferentes casos de uso.
- **Exemplo**: Factory para criar uma instância de autenticação ou configuração de serviços externos.
- **Vantagem**: Garante que a aplicação dependa apenas de abstrações e mantém a lógica de instância em um só local.

##### Factories

- Contém interceptadores que modificam requisições ou respostas.
- **Exemplo**: Interceptador de requisições HTTP para adicionar headers de autenticação.

#### Benefícios da Abordagem

- **Desacoplamento**: A Main é a única camada que depende de todas as outras, garantindo a independência das demais.
- **Flexibilidade**: A injeção de dependências facilita futuras alterações e a substituição de implementações.
- **Manutenibilidade**: Centraliza a lógica complexa de inicialização, simplificando alterações e evitando redundância.
- **Escalabilidade**: A organização clara com factories, adapters e interceptors permite adicionar novos casos de uso de forma limpa.

### Remuso

Nesta arquitetura, aplicamos vários princípios do SOLID para garantir a flexibilidade e a manutenção eficiente do sistema:

- **Dependency Inversion Principle (Princípio da Inversão de Dependência)**: O design segue o DIP ao depender de abstrações em vez de implementações concretas. Isso permite a fácil injeção de dependências em componentes, promovendo maior flexibilidade e testabilidade.

- **Single Responsibility Principle (Princípio da Responsabilidade Única)**: Inicialmente, componentes críticos, como o de Login, possuíam múltiplas responsabilidades. Essas responsabilidades foram distribuídas em camadas distintas, cada uma com uma responsabilidade única, mantendo o código coeso e mais fácil de manter.

- **Open-Closed Principle (Princípio do Aberto/Fechado)**: O sistema está preparado para extensões sem a necessidade de modificar o código existente. Decorators são um exemplo prático dessa aplicação, permitindo adicionar funcionalidades a objetos sem alterar sua lógica original. Um caso de uso relevante seria a implementação de um decorator para incluir automaticamente o token de acesso do usuário logado em todas as requisições autenticadas, sem modificar o HttpClient original.

A adoção desses princípios do SOLID foi fundamental para criar uma arquitetura robusta, expansível e de fácil manutenção, garantindo que o projeto possa evoluir de forma sustentável com o tempo.
