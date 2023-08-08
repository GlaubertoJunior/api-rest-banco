const { contas, depositos, saques, transferencias } = require('../bancodedados');
const { format } = require('date-fns');

let numeroDaConta = 1;

const listarContas = (req, res) => {
    return res.json(contas);
}

const cadastrarConta = (req, res) => {
    const { nome, cpf, data_nascimento, telefone, email, senha } = req.body;

    if (!nome) {
        return res.status(400).json({ mensagem: 'O nome é obrigatório' });
    }

    if (!cpf) {
        return res.status(400).json({ mensagem: 'O número do CPF é obrigatório' });
    }

    if (!data_nascimento) {
        return res.status(400).json({ mensagem: 'A data de nascimento é obrigatória' });
    }

    if (!telefone) {
        return res.status(400).json({ mensagem: 'O número do telefone é obrigatório' });
    }

    if (!email) {
        return res.status(400).json({ mensagem: 'O endereço de email é obrigatório' });
    }

    if (!senha) {
        return res.status(400).json({ mensagem: 'A senha é obrigatória' });
    }

    if (cpf) {
        const cpfsCadastrados = contas.find((conta) => conta.usuario.cpf === cpf);

        if (cpfsCadastrados) {
            return res.status(400).json({ mensagem: 'Ops! Não conseguimos prosseguir. Verifique os dados informados' });
        }
    }

    if (email) {
        const emailsCadastrados = contas.find((conta) => conta.usuario.email === email);

        if (emailsCadastrados) {
            return res.status(400).json({ mensagem: 'Ops! Não conseguimos prosseguir. Verifique os dados informados' });
        }
    }

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
        return res.status(404).json({ mensagem: 'Conta não encontrada' });
    }

    const { nome, cpf, data_nascimento, telefone, email, senha } = req.body;

    if (cpf) {
        const cpfsCadastrados = contas.find((conta) => conta.usuario.cpf === cpf);

        if (cpfsCadastrados) {
            return res.status(400).json({ mensagem: 'Ops! Não conseguimos prosseguir. Verifique os dados informados' });
        }
    }

    if (email) {
        const emailsCadastrados = contas.find((conta) => conta.usuario.email === email);

        if (emailsCadastrados) {
            return res.status(400).json({ mensagem: 'Ops! Não conseguimos prosseguir. Verifique os dados informados' });
        }
    }

    if (nome) {
        contaInformada.usuario.nome = nome;
    }

    if (cpf) {
        contaInformada.usuario.cpf = cpf;
    }

    if (data_nascimento) {
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
        return res.status(404).json({ mensagem: 'Conta não encontrada' });
    }

    if (contaInformada.saldo !== 0) {
        return res.status(403).json({ mensagem: 'Para prosseguir, precisamos que o saldo da conta esteja zerado' });
    }

    const indiceContaInformada = contas.findIndex(conta => conta.numero === numeroConta);

    if (indiceContaInformada < 0) {
        return res.status(404).json({ mensagem: 'Conta não encontrada' });
    }

    contas.splice(indiceContaInformada, 1);

    return res.json({ mensagem: 'Conta excluída com sucesso' });

}

const depositar = (req, res) => {

    const { numero_conta, valor } = req.body;

    const contaInformada = contas.find((conta) => conta.numero === numero_conta);

    if (!numero_conta) {
        return res.status(400).json({ mensagem: 'O número da conta não foi informado' });
    }

    if (!valor) {
        return res.status(400).json({ mensagem: 'O valor do depósito não foi informado' });
    }

    if (!contaInformada) {
        return res.status(404).json({ mensagem: 'Conta não encontrada' });
    }

    if (valor > 0) {

        contaInformada.saldo += Number(valor);

        const novoDeposito = {
            data: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
            numero_conta: contaInformada.numero,
            valor
        }

        depositos.push(novoDeposito);

        return res.json({ mensagem: 'Depósito realizado com sucesso' });
    }

    if (valor <= 0) {
        return res.status(404).json({ mensagem: 'O valor informado não é válido' });
    }
}

const sacar = (req, res) => {

    const { numero_conta, valor, senha } = req.body;

    const contaInformada = contas.find((conta) => conta.numero === numero_conta);

    if (!numero_conta) {
        return res.status(400).json({ mensagem: 'O número da conta não foi informado' });
    }

    if (!valor) {
        return res.status(400).json({ mensagem: 'O valor do saque não foi informado' });
    }

    if (!senha) {
        return res.status(400).json({ mensagem: 'A senha não foi informada' });
    }

    if (!contaInformada) {
        return res.status(404).json({ mensagem: 'Conta não encontrada' });
    }


    if (valor < 0 || valor <= 0) {
        return res.status(404).json({ mensagem: 'O valor informado não é válido' });
    }

    if (senha !== contaInformada.usuario.senha) {
        return res.status(401).json({ mensagem: 'A senha está incorreta' });
    }

    if (contaInformada.saldo < valor) {
        return res.status(404).json({ mensagem: 'Ops! Você não possui o valor disponível para saque' });
    }

    contaInformada.saldo -= Number(valor);

    const novoSaque = {
        data: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
        numero_conta: contaInformada.numero,
        valor
    }

    saques.push(novoSaque);

    return res.json({ mensagem: 'Saque realizado com sucesso' });

}

const transferir = (req, res) => {

    const { numero_conta_origem, numero_conta_destino, valor, senha } = req.body;

    const contaInformadaOrigem = contas.find((conta) => conta.numero === numero_conta_origem);
    const contaInformadaDestino = contas.find((conta) => conta.numero === numero_conta_destino);

    if (!numero_conta_origem) {
        return res.status(400).json({ mensagem: 'O número da conta de origem não foi informado' });
    }

    if (!numero_conta_destino) {
        return res.status(400).json({ mensagem: 'O número da conta de destino foi informado' });
    }

    if (!contaInformadaOrigem) {
        return res.status(404).json({ mensagem: 'A Conta de origem não foi encontrada' });
    }

    if (!contaInformadaDestino) {
        return res.status(404).json({ mensagem: 'A Conta de destino não foi encontrada' });
    }

    if (contaInformadaOrigem === contaInformadaDestino) {
        return res.status(404).json({ mensagem: 'Ops! A conta de origem e destino são a mesma' });
    }

    if (!senha) {
        return res.status(400).json({ mensagem: 'O número da senha não foi informado' });
    }

    if (senha !== contaInformadaOrigem.usuario.senha) {
        return res.status(401).json({ mensagem: 'A senha está incorreta' });
    }

    if (!valor) {
        return res.status(400).json({ mensagem: 'O valor a ser transferido não foi informado' });
    }

    if (valor <= 0) {
        return res.status(404).json({ mensagem: 'Informe um valor válido' });
    }

    if (contaInformadaOrigem.saldo < valor) {
        return res.status(404).json({ mensagem: 'Ops! Você não possui o valor disponível em conta' });
    }

    contaInformadaOrigem.saldo -= Number(valor);
    contaInformadaDestino.saldo += Number(valor);

    const novaTransferencia = {
        data: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
        numero_conta_origem: contaInformadaOrigem.numero,
        numero_conta_destino: contaInformadaDestino.numero,
        valor
    }

    transferencias.push(novaTransferencia);

    return res.json({ mensagem: 'Transferência realizado com sucesso' });
}

const consultarSaldo = (req, res) => {
    const { numero_conta, senha } = req.query;

    const contaInformada = contas.find((conta) => conta.numero === numero_conta);

    if (!numero_conta) {
        return res.status(400).json({ mensagem: 'O número da conta não foi informado' });
    }

    if (!senha) {
        return res.status(400).json({ mensagem: 'A senha não foi informada' });
    }

    if (!contaInformada) {
        return res.status(404).json({ mensagem: 'Conta não encontrada' });
    }

    if (senha !== contaInformada.usuario.senha) {
        return res.status(401).json({ mensagem: 'A senha está incorreta' });
    }

    return res.json({ saldo: contaInformada.saldo });
}

const consultarExtrato = (req, res) => {
    const { numero_conta, senha } = req.query;

    const contaInformada = contas.find((conta) => conta.numero === numero_conta);

    if (!numero_conta) {
        return res.status(400).json({ mensagem: 'O número da conta não foi informado' });
    }

    if (!senha) {
        return res.status(400).json({ mensagem: 'O número da senha não foi informado' });
    }

    if (!contaInformada) {
        return res.status(404).json({ mensagem: 'Conta não encontrada' });
    }

    if (senha !== contaInformada.usuario.senha) {
        return res.status(401).json({ mensagem: 'Senha está incorreta.' });
    }

    const historicoDepositos = depositos.filter((deposito) => deposito.numero_conta === numero_conta);
    const historicoSaques = saques.filter((saque) => saque.numero_conta === numero_conta);
    const historicoTransfRecebidas = transferencias.filter((transferencia) => transferencia.numero_conta_destino === numero_conta);
    const historicoTransfEnviadas = transferencias.filter((transferencia) => transferencia.numero_conta_origem === numero_conta);


    const emitirExtrato = {
        depositos: historicoDepositos,
        saques: historicoSaques,
        transferenciasRec: historicoTransfRecebidas,
        transferenciasEnv: historicoTransfEnviadas
    }


    return res.json({ emitirExtrato });
};
module.exports = {
    listarContas,
    cadastrarConta,
    atualizarCadastro,
    excluirConta,
    depositar,
    sacar,
    transferir,
    consultarSaldo,
    consultarExtrato
};