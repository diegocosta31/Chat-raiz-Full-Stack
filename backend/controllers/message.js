import Message from "../models/message.js";

const controller = {
    //Função para salvar mensagens
    save: (req, res)=>{
        const params = req.body
        const message = new Message()
        message.message = params.message
        message.from = params.from

        message.save((error, messageStored)=>{
            if(error || !messageStored){
                return res.status(404).send({
                    status: "error",
                    message: "Não foi possivel salvar a mensagem"
                })
            }
            return res.status(200).send({
                status: "Success",
                messageStored,
            })
        })
    },
    // Função para bter todas as menssagens
    getMessagens: (req, res)=>{
        const query = Message.find({})
        query.sort("-_id").exec((error, messages)=>{
            if(error){
                return res.status(500).send({
                    status: "Error",
                    message: "Erro ao extrair dados"
                })
            }
            if(!messages){
                return res.status(404).send({
                    status: "Error",
                    message: "Não há menssagens para mostra"
                })
            }
            return res.status(200).send({
                status: "Success",
                messages,
            })
        })
    }
}
export default controller