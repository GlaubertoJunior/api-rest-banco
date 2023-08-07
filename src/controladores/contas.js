const { contas, depositos, saques, transferencias } = require('../bancodedados');

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
        return res.status(400).json({ mensagem: "O número do CPF é obrigatório." })
    }

    if (!data_nascimento) { //ajustar data de nascimento
        return res.status(400).json({ mensagem: "A data de nascimento é obrigatória." })
    }

    if (!telefone) {
        return res.status(400).json({ mensagem: "O número do telefone é obrigatório." })
    }

    if (!email) {
        return res.status(400).json({ mensagem: "O email do telefone é obrigatório." })
    }

    if (!senha) {
        return res.status(400).json({ mensagem: "A senha é obrigatória." })
    }

    //const numeroConta = Date.now().toString();

    const novoCadastro = {
        numero: String(numeroDaConta),
        saldo: 0,
        usuario: {
            nome,
            cpf,
            data_nascimento,
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
        return res.status(404).json({ mensagem: "Conta não encontrada." });
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
        contaInformada.usuario.data_nascimento = data_nascimento;
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
        return res.status(404).json({ mensagem: "Conta não encontrada." });
    }

    if (contaInformada.saldo !== 0) {
        return res.status(403).json({ mensagem: 'Para prosseguir, precisamos que o saldo da conta esteja zerado.' });
    }

    const indiceContaInformada = contas.findIndex(conta => conta.numero === numeroConta);

    if (indiceContaInformada < 0) {
        return res.status(404).json({ mensagem: "Conta não encontrada." })
    }

    //contas.splice(indiceContaInformada, 1)[0];
    contas.splice(indiceContaInformada, 1);


    return res.json({ mensagem: "Conta excluída com sucesso" });

}

const depositar = (req, res) => {
    const { numero_conta, valor } = req.body;

    const contaInformada = contas.find((conta) => conta.numero === numero_conta);

    if (!contaInformada) {
        return res.status(404).json({ mensagem: "Conta não encontrada." });
    }
    if (!contaInformada) {
        return res.status(400).json({ mensagem: "O número da conta é obrigatório." })
    }

    if (!valor) {
        return res.status(400).json({ mensagem: "O valor do depósito é obrigatório." })
    }

    if (valor <= 0) {
        return res.status(404).json({ mensagem: "O valor informado não é válido." });
    }

    const indiceContaInformada = contas.findIndex(conta => conta.numero === numero_Conta);

    //const indiceSaldo = contas.saldo.[indiceContaInformada - 1];



    //depositos.push();
    //contaInformada.saldo = saldo + Number(valor);
    return res.json({ mensagem: "Conta excluída com sucesso" });
}

module.exports = {
    listarContas,
    cadastrarConta,
    atualizarCadastro,
    excluirConta,
    depositar
}