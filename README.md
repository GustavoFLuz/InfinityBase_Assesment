# InfinityBase Assessment

## Descrição
Este projeto é uma avaliação para uma vaga da InfinityBase. Ele inclui uma aplicação para criar e gerenciar tarefas.

## Estrutura do Projeto
- `/src`: Código fonte do Front End do projeto
- `/api`: Código fonte do Back End do projeto e banco de dados

## Requisitos
- NodeJS v22.12.0+

## Instalação
Após clonar o repositório, execute a partir da pasta base do projeto:
- Back End:
```sh
cd ./api
npm install
```
- Front End:
```sh
npm install
```

## Uso
Para executar o projeto, utilize os seguinte comando:
- Back End:

Configure o arquivo /api/.env com as variáveis de ambiente necessárias ou utilize as variáveis definidas em /api/.env.example
```sh
npm run init-db # Inicializa o banco de dados e adiciona dados de teste

npm run dev # Inicia o servidor em modo de desenvolvimento
# ou
npm run build
npm start # Inicia o servidor em modo de produção
```
- Front End:
```sh
npm run dev
# ou
npm start 

# Para gerar o build de produção
npm run build
```

## Licença
Este projeto está licenciado sob a Licença MIT. Veja o arquivo `LICENSE` para mais detalhes.