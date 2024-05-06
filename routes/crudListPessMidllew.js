const express = require('express')
const router = express.Router()

let listaPessoas = []

// Middleware para validar se a pessoa existe
function validarPessoa(req, res, next) {
    const id = req.params.id
    const pessoa = listaPessoas.find(pessoa => pessoa.id == id)
    if (pessoa) {
        req.pessoa = pessoa
        next()
    } else {
        return res.status(404).json({ mensagem: "Pessoa não encontrada!" })
    }
}

// Middleware para validar os atributos da pessoa
function validarAtributos(req, res, next) {
    const dadosRecebidos = req.body
    if (!dadosRecebidos.nome || !dadosRecebidos.idade || !dadosRecebidos.email) {
        return res.status(400).json({ mensagem: "Todos os atributos são obrigatórios: nome, idade e email." })
    } else {
        next()
    }
}

// READ -> Buscar todas as pessoas
router.get('/pessoas', (req, res) => {
    res.status(200).json(listaPessoas)
})

// READ -> Buscar uma pessoa específica por meio de seu identificador
router.get('/pessoas/:id', validarPessoa, (req, res) => {
    res.json(req.pessoa)
})

// CREATE -> Adicionar uma nova pessoa
router.post('/pessoas', validarAtributos, (req, res) => {
    const dados = req.body

    const pessoa = {
        id: Math.round(Math.random() * 1000),
        nome: dados.nome,
        idade: dados.idade,
        email: dados.email
    }

    listaPessoas.push(pessoa)

    res.status(201).json({
        mensagem: "Pessoa cadastrada com sucesso!",
        pessoa
    })
})

// UPDATE -> Atualizar uma pessoa existente com base em seu identificador
router.put('/pessoas/:id', validarAtributos, validarPessoa, (req, res) => {
    const id = req.params.id
    const novosDados = req.body

    const index = listaPessoas.findIndex(pessoa => pessoa.id == id)

    const pessoaAtualizada = {
        id: Number(id),
        nome: novosDados.nome,
        idade: novosDados.idade,
        email: novosDados.email
    }

    listaPessoas[index] = pessoaAtualizada

    res.status(200).json({
        mensagem: "Pessoa atualizada com sucesso!",
        pessoa: pessoaAtualizada
    })
})

// DELETE -> Remover uma pessoa da lista com base em seu identificador
router.delete('/pessoas/:id', validarPessoa, (req, res) => {
    const id = req.params.id
    const index = listaPessoas.findIndex(pessoa => pessoa.id == id)
    listaPessoas.splice(index, 1)
    res.status(200).json({ mensagem: "Pessoa removida com sucesso!" })
})

module.exports = router
