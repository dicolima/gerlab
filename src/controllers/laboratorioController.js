//funcionando corretamnete menos para solicitacoes
// src/controllers/laboratorioController.js
const LaboratorioModel = require('../models/laboratorioModel');

class LaboratorioController {
    static async getAllLaboratorios(req, res) {
        try {
            console.log('Chamando getAllLaboratorios...');
            const laboratorios = await LaboratorioModel.getAllLaboratorios();
            console.log('Laboratórios retornados:', laboratorios);
            res.json({ laboratorios });
        } catch (error) {
            console.error('Erro em getAllLaboratorios:', error);
            res.status(500).json({ error: `Erro ao buscar laboratórios: ${error.message}` });
        }
    }

    static async createLaboratorio(req, res) {
        try {
            console.log('Chamando createLaboratorio com body:', req.body);
            const { lab_num, lab_nom, lab_eqp, lab_des, lab_sts, predio_id, lab_sem, lab_com } = req.body;
            if (!lab_num || !predio_id) {
                return res.status(400).json({ error: 'Campos lab_num e predio_id são obrigatórios' });
            }
            if (isNaN(parseInt(predio_id))) {
                return res.status(400).json({ error: 'predio_id deve ser um número válido' });
            }
            const laboratorio = await LaboratorioModel.createLaboratorio({
                lab_num,
                lab_nom,
                lab_eqp,
                lab_des,
                lab_sts,
                predio_id: parseInt(predio_id),
                lab_sem: lab_sem ? parseInt(lab_sem) : null,
                lab_com: lab_com ? parseInt(lab_com) : null
            });
            res.status(201).json({ laboratorio });
        } catch (error) {
            console.error('Erro em createLaboratorio:', error);
            res.status(500).json({ error: `Erro ao criar laboratório: ${error.message}` });
        }
    }

    static async getLaboratorio(req, res) {
        try {
            console.log(`Chamando getLaboratorio com ID: ${req.params.id}`);
            const laboratorio = await LaboratorioModel.getLaboratorioById(req.params.id);
            if (!laboratorio) {
                return res.status(404).json({ error: 'Laboratório não encontrado' });
            }
            res.json({ laboratorio });
        } catch (error) {
            console.error('Erro em getLaboratorio:', error);
            res.status(500).json({ error: `Erro ao buscar laboratório: ${error.message}` });
        }
    }

    static async updateLaboratorio(req, res) {
        try {
            console.log(`Chamando updateLaboratorio com ID: ${req.params.id}, body:`, req.body);
            const { lab_num, lab_nom, lab_eqp, lab_des, lab_sts, predio_id, lab_sem, lab_com } = req.body;
            if (!lab_num || !predio_id) {
                return res.status(400).json({ error: 'Campos lab_num e predio_id são obrigatórios' });
            }
            if (isNaN(parseInt(predio_id))) {
                return res.status(400).json({ error: 'predio_id deve ser um número válido' });
            }
            const laboratorio = await LaboratorioModel.updateLaboratorio(req.params.id, {
                lab_num,
                lab_nom,
                lab_eqp,
                lab_des,
                lab_sts,
                predio_id: parseInt(predio_id),
                lab_sem: lab_sem ? parseInt(lab_sem) : null,
                lab_com: lab_com ? parseInt(lab_com) : null
            });
            if (!laboratorio) {
                return res.status(404).json({ error: 'Laboratório não encontrado' });
            }
            res.json({ laboratorio });
        } catch (error) {
            console.error('Erro em updateLaboratorio:', error);
            res.status(500).json({ error: `Erro ao atualizar laboratório: ${error.message}` });
        }
    }

    static async deactivateLaboratorio(req, res) {
        try {
            console.log(`Chamando deactivateLaboratorio com ID: ${req.params.id}`);
            const laboratorio = await LaboratorioModel.deactivateLaboratorio(req.params.id);
            if (!laboratorio) {
                return res.status(404).json({ error: 'Laboratório não encontrado' });
            }
            res.json({ success: true });
        } catch (error) {
            console.error('Erro em deactivateLaboratorio:', error);
            res.status(500).json({ error: `Erro ao desativar laboratório: ${error.message}` });
        }
    }

    static async reactivateLaboratorio(req, res) {
        try {
            console.log(`Chamando reactivateLaboratorio com ID: ${req.params.id}`);
            const laboratorio = await LaboratorioModel.reactivateLaboratorio(req.params.id);
            if (!laboratorio) {
                return res.status(404).json({ error: 'Laboratório não encontrado' });
            }
            res.json({ success: true });
        } catch (error) {
            console.error('Erro em reactivateLaboratorio:', error);
            res.status(500).json({ error: `Erro ao reativar laboratório: ${error.message}` });
        }
    }

    // adicionado para haver filtragem na página solicitacoes.html
    static async getAvailableLaboratorios(req, res) {
    try {
        const { predio_id, programa_id, qtd_alunos, sol_dat_ini, sol_hor_ini, sol_hor_fim } = req.query;
        console.log('Requisição para /api/laboratorios/available com query:', req.query);
        if (!predio_id || !programa_id || !qtd_alunos || !sol_dat_ini || !sol_hor_ini || !sol_hor_fim) {
            return res.status(400).json({ error: 'Parâmetros obrigatórios ausentes' });
        }
        const laboratorios = await LaboratorioModel.getAvailableLaboratorios({
            predio_id: parseInt(predio_id),
            programa_id: parseInt(programa_id),
            qtd_alunos: parseInt(qtd_alunos),
            sol_dat_ini,
            sol_hor_ini,
            sol_hor_fim
        });
        res.status(200).json({ laboratorios });
    } catch (error) {
        console.error('Erro ao buscar laboratórios disponíveis:', error);
        res.status(500).json({ error: `Erro ao buscar laboratórios disponíveis: ${error.message}` });
    }
}
    // static async getAvailableLaboratorios(req, res) {
    //     try {
    //         const { predio_id, qtd_alunos, programa_id, sol_dat_ini, sol_hor_ini, sol_hor_fim } = req.query;
    //         const laboratorios = await LaboratorioModel.getAvailableLaboratorios({
    //             predio_id: predio_id ? parseInt(predio_id) : null,
    //             qtd_alunos: qtd_alunos ? parseInt(qtd_alunos) : null,
    //             programa_id: programa_id ? parseInt(programa_id) : null,
    //             sol_dat_ini,
    //             sol_hor_ini,
    //             sol_hor_fim
    //         });
    //         res.json({ laboratorios });
    //     } catch (error) {
    //         res.status(500).json({ error: `Erro ao buscar laboratórios disponíveis: ${error.message}` });
    //     }
    // }
}

module.exports = LaboratorioController;