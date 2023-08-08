const validaSenhaBanco = (req, res, next) => {
    const { senha_banco } = req.query;
    const { banco } = require('./bancodedados')

    if (senha_banco !== banco.senha) {
        return res.status(401).json({ mensagem: 'Senha está incorreta.' });
    }

    next();
}

module.exports = validaSenhaBanco;