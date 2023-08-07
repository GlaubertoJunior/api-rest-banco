const express = require('express');
const validaSenha = require('./intermediarios');
const { cadastrarConta, atualizarCadastro, excluirConta, listarContas, depositar } = require('./controladores/contas');

const rotas = express();

rotas.use(validaSenha);

rotas.get('/contas', listarContas);
rotas.post('/contas', cadastrarConta);
rotas.put('/contas/:numeroConta/usuario', atualizarCadastro);
rotas.delete('/contas/:numeroConta', excluirConta);
rotas.post('/transacoes/depositar', depositar);

module.exports = rotas;