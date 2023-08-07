const { contas, depositos, saques, transferencias } = require('../bancodedados');
const { format } = require('date-fns');

let numeroDaConta = 3; //ALTERAR PARA ***1***

const listarContas = (req, res) => {
    return res.json(contas);
}

const cadastrarConta = (req, res) => {
    const { nome, cpf, data_nascimento, telefone, email, senha } = req.body;

    if (!nome) {
        return res.status(400).json({ mensagem: "O nome é obrigatório." })
    }

    if (!cpf) {
        return res.status(400).json({ mensagem: 'O número do CPF é obrigatório.' });
    }

    if (!data_nascimento) { //ajustar data de nascimento
        return res.status(400).json({ mensagem: 'A data de nascimento é obrigatória.' });
    }

    if (!telefone) {
        return res.status(400).json({ mensagem: 'O número do telefone é obrigatório.' });
    }

    if (!email) {
        return res.status(400).json({ mensagem: 'O email do telefone é obrigatório.' });
    }

    if (!senha) {
        return res.status(400).json({ mensagem: 'A senha é obrigatória.' });
    }

    //const numeroConta = Date.now().toString();

    let dataRecebida = data_nascimento;
    let dataFiltrada = dataRecebida.split('/');
    let dataFormatada = `${dataFiltrada[2]}-${dataFiltrada[1]}-${dataFiltrada[0]}`;

    const novoCadastro = {
        numero: String(numeroDaConta),
        saldo: 0,
        usuario: {
            nome,
            cpf,
            data_nascimento: dataFormatada,
            telefone,
            email,
            senha,
        }
    };


    contas.push(novoCadastro);

    numeroDaConta++;

    return res.status(201).send();
}

const atualizarCadastro = (req, res) => {

    const { numeroConta } = req.params;


    const contaInformada = contas.find((conta) => conta.numero === numeroConta);

    if (!contaInformada) {
        return res.status(404).json({ mensagem: 'Conta não encontrada.' });
    }
    /*
        const numeroConta = req.query.numeroConta;
    
    
        const contaInformada = contas.find((conta) => conta.numero === numeroConta);
    
        if (!contaInformada) {
            return res.status(404).json({ mensagem: "Conta não encontrada." });
        }
    */
    const { nome, cpf, data_nascimento, telefone, email, senha } = req.body;


    if (nome) {
        contaInformada.usuario.nome = nome;
    }

    if (cpf) {
        contaInformada.usuario.cpf = cpf;
    }

    if (data_nascimento) { //ajustar data de nascimento
        let dataRecebida = data_nascimento;
        let dataFiltrada = dataRecebida.split('/');
        let dataFormatada = `${dataFiltrada[2]}-${dataFiltrada[1]}-${dataFiltrada[0]}`;

        contaInformada.usuario.data_nascimento = dataFormatada;
    }

    if (telefone) {
        contaInformada.usuario.telefone = telefone;
    }

    if (email) {
        contaInformada.usuario.email = email;
    }

    if (senha) {
        contaInformada.usuario.senha = senha;
    }

    return res.json({ mensagem: 'Conta atualizada com sucesso' });
}


const excluirConta = (req, res) => {
    const { numeroConta } = req.params;


    const contaInformada = contas.find((conta) => conta.numero === numeroConta);

    if (!contaInformada) {
        return res.status(404).json({ mensagem: 'Conta não encontrada.' });
    }

    if (contaInformada.saldo !== 0) {
        return res.status(403).json({ mensagem: 'Para prosseguir, precisamos que o saldo da conta esteja zerado.' });
    }

    const indiceContaInformada = contas.findIndex(conta => conta.numero === numeroConta);

    if (indiceContaInformada < 0) {
        return res.status(404).json({ mensagem: 'Conta não encontrada.' })
    }

    //contas.splice(indiceContaInformada, 1)[0];
    contas.splice(indiceContaInformada, 1);


    return res.json({ mensagem: 'Conta excluída com sucesso.' });

}

const depositar = (req, res) => {

    const { numero_conta, valor } = req.body;

    const contaInformada = contas.find((conta) => conta.numero === numero_conta);

    if (!numero_conta) {
        return res.status(400).json({ mensagem: 'O número da conta não foi informado.' })
    }

    if (!valor) {
        return res.status(400).json({ mensagem: 'O valor do depósito não foi informado.' })
    }

    if (!contaInformada) {
        return res.status(404).json({ mensagem: 'Conta não encontrada.' });
    }

    if (valor <= 0) {
        return res.status(404).json({ mensagem: 'O valor informado não é válido.' });
    }

    const novoDeposito = {
        data: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
        numero_conta: contaInformada,
        valor
    }

    banco.push(novoDeposito);
    // [ ] To-do... contaInformada.saldo = saldo + Number(valor);

    //// [ ] To-do... return res.send(novoDeposito);
    return res.json({ mensagem: 'Depósito realizado com sucesso.' });

}

const sacar = (req, res) => {

    const { numero_conta, valor, senha } = req.body;

    const contaInformada = contas.find((conta) => conta.numero === numero_conta);

    if (!numero_conta) {
        return res.status(400).json({ mensagem: 'O número da conta não foi informado.' })
    }

    if (!valor) {
        return res.status(400).json({ mensagem: 'O valor do depósito não foi informado.' })
    }

    if (!senha) {
        return res.status(400).json({ mensagem: 'O número da senha não foi informado.' })
    }

    if (!contaInformada) {
        return res.status(404).json({ mensagem: 'Conta não encontrada.' });
    }

    if (senha !== contaInformada.usuario.senha) {
        return res.status(401).json({ mensagem: 'Senha está incorreta.' });
    }

    if (valor <= 0) {
        return res.status(404).json({ mensagem: 'O valor informado não é válido.' });
    }

    const data = new Date();
    let dataAjustada = format(data, 'yyyy-MM-dd HH:mm:ss');

    const novoSaque = {
        dataAjustada,
        numero_conta: contaInformada,
        valor
    }

    saques.push(novoSaque);
    //contaInformada.saldo = saldo + Number(valor);
    return res.json({ mensagem: 'Saque realizado com sucesso.' });

}

const consultarSaldo = (req, res) => {
    const { numero_conta, senha } = req.query;

    const contaInformada = contas.find((conta) => conta.numero === numero_conta);

    if (!numero_conta) {
        return res.status(400).json({ mensagem: 'O número da conta não foi informado.' })
    }

    if (!senha) {
        return res.status(400).json({ mensagem: 'O número da senha não foi informado.' })
    }

    if (senha !== contaInformada.usuario.senha) {
        return res.status(401).json({ mensagem: 'Senha está incorreta.' });
    }

    const indiceContaInformada = contas.findIndex(conta => conta.numero === numero_conta);


    return res.json(indiceContaInformada);

}

module.exports = {
    listarContas,
    cadastrarConta,
    atualizarCadastro,
    excluirConta,
    depositar,
    sacar,
    consultarSaldo
}