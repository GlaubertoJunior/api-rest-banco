const express = require('express');
const { cadastrarConta, atualizarCadastro, excluirConta, listarContas, depositar, sacar, consultarSaldo } = require('./controladores/contas');
const validaSenhaBanco = require('./intermediarios');

const rotas = express();


rotas.get('/contas', validaSenhaBanco, listarContas);
rotas.post('/contas', cadastrarConta);
rotas.put('/contas/:numeroConta/usuario', atualizarCadastro);
rotas.delete('/contas/:numeroConta', excluirConta);
rotas.post('/transacoes/depositar', depositar);
rotas.post('/transacoes/sacar', sacar);
rotas.get('/contas/saldo', consultarSaldo);

module.exports = rotas;