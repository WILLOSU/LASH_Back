const database = require('../models');
const { Op } = require('sequelize');

async function findAll(req, res) {

    // #swagger.tags = ['Responsavel']
    // #swagger.description = 'Endpoint para pesquisar todos os responsaveis.'
    try {
        const responsaveisArray = await database.responsaveis.findAll({
            include: {
                model: database.pacientes,
                as: 'paciente',
                on: {
                    '$responsaveis.pacienteId$': { [Op.col]: 'paciente.id' }
                }
            }
        });
        res.status(200).json(responsaveisArray);
    } catch(err) {
        res.status(500).json({mensagem:' Erro ao buscar responsáveis', erro: err.message});
    }
}

async function findByName(req, res) {

    // #swagger.tags = ['Responsavel']
    // #swagger.description = 'Endpoint para pesquisar um responsavel por nome.'

    try {
        const responsavel = await database.responsaveis.findAll(
            {   
                include: {
                    model: database.pacientes,
                    as: 'paciente',
                    on: {
                        '$responsaveis.pacienteId$': { [Op.col]: 'paciente.id' }
                    }
                },                
                where : {
                    nome: req.params.nome
                }
            });
            res.status(200).json(responsavel);
    } catch(err) {
        res.status(500).json({mensagem:' Erro ao buscar responsável', erro: err.message});
    }
}

async function findByPk(req, res) {

    // #swagger.tags = ['Responsavel']
    // #swagger.description = 'Endpoint para pesquisar um responsavel por ID.'

    try {
        const doenca = await database.responsaveis.findByPk(req.params.id);
        res.status(200).json(doenca);
    } catch(err) {
        res.status(500).json({mensagem:' Erro ao buscar doenças', erro: err.message});
    }
}

async function create(req, res) {

    // #swagger.tags = ['Responsavel']
    // #swagger.description = 'Endpoint para criar um responsavel.'

    try {
        var verificacao = await database.responsaveis.findAll({
            where: {
                cpf: req.body.cpf
            }
        });

        if(verificacao.length === 0) {
            try {
                const responsavel = await database.responsaveis.create({
                    nome: req.body.nome,
                    sobrenome: req.body.sobrenome,
                    cpf: req.body.cpf,
                    cidade: req.body.cidade,
                    pacienteId: req.body.pacienteId,
                    bairro: req.body.bairro,
                    endereco: req.body.endereco,
                    uf:req.body.uf,
                    numero: req.body.numero,         

              });
                
                res.status(200).json(responsavel);
            } catch(err) {
                res.status(500).json({mensagem:' Erro ao criar responsável', erro: err.message});
            }
        } else {
            res.status(500).json({mensagem:' Responsável existente'});
        }
    } catch (err) {
        res.status(500).json({mensagem:' Erro ao buscar reponsável', erro: err.message});
    }
}

async function alter(req, res) {

    // #swagger.tags = ['Responsavel']
    // #swagger.description = 'Endpoint para alterar um responsavel por ID.'

    try {
        const verificacao = await database.responsaveis.update({
            nome: req.body.nome,
            sobrenome: req.body.sobrenome,
            cpf: req.body.cpf,
            rg: req.body.rg
        },{
            where: {
                id: req.params.id
            }
        });

        if(verificacao > 0) {
            const responsavel = await database.responsaveis.findByPk(req.params.id);
            res.status(200).json(responsavel);
        } else {
            res.status(200).json({mensagem: "Responsável inexistente"});
        }
    } catch(err) {
        res.status(500).json({mensagem:' Erro ao buscar responsável', erro: err.message});
    }
}

async function remove(req, res) {

    // #swagger.tags = ['Responsavel']
    // #swagger.description = 'Endpoint para remover um responsavel por ID.'

    try {
        const responsavel = await database.responsaveis.findByPk(req.params.id);

        let nomeResponsavel = responsavel.nome;
        responsavel.destroy();  
        res.status(200).json({mensagem: `${nomeResponsavel} excluído com sucesso`, ok: true}); 
    } catch(err) {
        res.status(500).json({mensagem:' Erro ao buscar responsável', erro: err.message});
    }
}

module.exports = {
    findAll,
    findByName,
    findByPk,
    create,
    alter,
    remove
}