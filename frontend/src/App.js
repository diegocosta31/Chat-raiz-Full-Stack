import './App.css';
// npm i socket.io-client (versão para react)
import io from "socket.io-client"
import {useState, useEffect} from "react"
import axios from "axios"
// Conexção para receber e enviar eventos
const socket = io("http://localhost:5000")

function App() {
  const [nickname, setNickname] = useState('')
  const [disabled, setDisabled] = useState(false)
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([])
  const [storedMessages, setStoredMessages] = useState([])
  const [firstTime, setFirstTime] = useState(false)

  const url = "http://localhost:5000/api/"

  useEffect(()=>{
    const receivedMessage = (message) =>{
      setMessages({message, ...messages})
    }
    socket.on("message", receivedMessage)
    // Cancelamos a assinatura do estado do componente quando não é mais necessário usá-lo
    return () =>{
      socket.off("message", receivedMessage)
    }
  }, [messages])
  // Carregando as mensagens salvas no DB pela primeira vez
  if(!firstTime){
    axios.get(url + "messages").then(res =>{
      setStoredMessages(res.data.messages)
    })
    setFirstTime(true)
  }
  const handlerSubmit = (e) =>{
    e.preventDefault()
    // Envair menssagem somente se tiver nickname
    if(nickname !== ''){
      socket.emit("message", message, nickname)

      // nossa mensagem
      const newMessage = {
        body: message,
        from: "Eu"
      }
      // Adicinar menssagem com o restatnte
      setMessages([newMessage, ...messages])
      setMessage('')

      // Salvando menssagem no DB
      axios.post(url + "save",{
        message: message,
        from: nickname,
      })
    }else{
      alert("Para enviar menssgens, você deve definir um nickname...")
    }
  }
  const nicknameSubmit = (e) =>{
    e.preventDefault()
    setNickname(nickname)
    setDisabled(true)
  }
  
  return (
    <div className="App">
      <div className="container mt-3">
        <div className="card shadow border-0">
          <div className="card-body">
            <h5 className="text-center mb-3">Chat Raiz</h5>
            {/* Formulario nickname*/}
            <form onSubmit={nicknameSubmit}>
              <div className="d-flex mb-3">
                <input type="text" className="form-control" id="nickname" placeholder='Digite um nickname' disabled={disabled} onChange={e=>setNickname(e.target.value)} value={nickname} required/>
                <button className="btn btn-success mx-3" type='submit' id='btn-nickname'disabled={disabled}>Registrar</button>
              </div>
            </form>
            {/* Formulario Chat */}
            <form onSubmit={handlerSubmit}>
              <div className="d-flex">
                <input type="text" className="form-control" placeholder='Menssagem' onChange={e=> setMessage(e.target.value)} value={message}/>
                <button className="btn btn-success mx-3" type='submit' >Enviar</button>
              </div>
            </form>
          </div>
        </div>
        {/* Menssagens do chat*/}
        <div className="card mt-3 mb-3 shadow border-0" id='content-chat'>
          <div className="card-body">
            {messages.map((message, index)=>(
              <div key={index} className={`d-flex p-3 ${message.form==="Eu" ? "justify-content-end" : "justify-content-start"}`}>
                <div className={`card mb-3 shadow border-1 ${message.form === "Eu" ? "bg-success bg-opacity-25":"bg-light"}`}>
                  <div className="card-body">
                    <small className=''>{message.from}: {message.body}</small>
                  </div>
                </div>
              </div>
            ))}
            {/* Historico de menssagens */}
            <small className="text-center text-muted">... Historico de Menssagens</small>
              {storedMessages.map((message, index)=>(
                <div key={index} className={`d-flex p-3 ${message.from === nickname ? "justify-content-end" : "justify-content-start"}`}>
                  <div className={`card mb-3 shadow border-1 ${message.from === nickname ? "bg-success bg-opacity-25" : "bg-light"}`}>
                    <div className="card-body">
                      <small className="text-muted">{message.from}: {message.message}</small>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
