
# API Sistema bancário

Trata-se de um projeto de sistema bancário simples desenvolvido em Node.js usando o framework Express. Este projeto foi criado para demonstrar habilidades em desenvolvimento de software, programação em JavaScript, gerenciamento de rotas e endpoints com Express, manipulação de dados em memória, e construção de uma API REST básica.

## Funções

O sistema bancário oferece as seguintes funcionalidades:
*	Abertura de contas;
*	Depósitos;
*	Saques;
*	Transferências entre contas bancárias, com verificação de saldo e senha.
*	Consulta de saldo e/ou extrato.

## Sobre a instalação e uso

1.	Clonar o repositório:

https://github.com/glaubertojunior/api-rest-banco

2.	Clonar o repositório:

    npm install

3.	Iniciar o servidor:

    node index.js

Atenção: O servidor estará rodando em http://localhost:3000.
## Endpoints da API

*	GET /contas: Lista todas as contas bancárias (requer autenticação).
*	POST /contas: Abre uma nova conta bancária.
*	PUT /contas/:numeroConta/usuario: Atualiza informações do usuário da conta.
*	DELETE /contas/:numeroConta: Deleta uma conta bancária.
*	POST /transacoes/depositar: Realiza um depósito em uma conta.
*	POST /transacoes/sacar: Realiza um saque de uma conta.
*	POST /transacoes/transferir: Realiza uma transferência entre contas.
*	GET /contas/saldo: Consulta o saldo de uma conta.
*	GET /contas/extrato: Consulta o extrato de uma conta.

FIM!!!
