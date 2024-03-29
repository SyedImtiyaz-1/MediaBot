import { createClient } from '@supabase/supabase-js'
import { Auth } from '@supabase/auth-ui-react'
import { useState, useEffect } from 'react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import styled from 'styled-components'
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Header from './components/Header';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import React from 'react';
import { Input } from 'antd';
const { TextArea } = Input;
import axios from 'axios';
const supabase = createClient('https://ovrcxbswoqoujlpnalpz.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im92cmN4YnN3b3FvdWpscG5hbHB6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDYxMjg1MzAsImV4cCI6MjAyMTcwNDUzMH0.BE22pMUwFnEe-R7KDwY86fkLa3Jer4fiUvxppy6_H1k')

const StyledDiv = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  gap: 1rem;
`

const StyledChat = styled.div`
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  height: 100vh;
  width: 100vw;
  gap: 1rem;
`

const StyledMesseges = styled.div`
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  height: 100vh;
  width: 95vw;
  gap: 1rem;
  overflow-y: scroll;
  padding-top: 1rem;
`

// style footer
const StyledFooter = styled.div`
  width:95vw;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding-bottom: 1rem;
`

export default function App() {
  const [session, setSession] = useState(null);
  const [show, setShow] = useState(false);
  const [input, setInput] = useState("");
  // create a list of alerts
  // const [alerts, setAlerts] = useState(["who is dhoni", "who cpu work", "what is programming", "hello who are you",]);
  const [alerts, setAlerts] = useState([]);
  // create a list of messages
  // const [messages, setMessages] = useState(["he is great","cpu is a brain of computer","programming is a art","i am a bot"]);
  const [messages, setMessages] = useState([]);

  const handleClick = () => setShow(!show);
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  const requestSendner = () => {
    if(input.length > 0){
      setAlerts([...alerts, input]);
      setInput("");
    }
    const delimiter = "\n";
    const inputArray = input.split(delimiter);
    for (let i = 0; i < inputArray.length; i++) {
      inputArray[i] = inputArray[i].trim().split(':');
    }

    if (inputArray[0][0] === "Gmail") {
    axios.post("https://rajesh-flask.azurewebsites.net/send_email", {
      // message: input,
      gmail:inputArray[0][1],
      message:inputArray[1][1]
    }, {
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then((response) => {
        setMessages([...messages, response.data.message]);
      })
      .catch((error) => {
        console.log(error);
      });
    }else if(inputArray[0][0] === "Whatsapp"){
      axios.post("https://rajesh-flask.azurewebsites.net/send_whatsapp", {
      // message: input,
      whatsapp:inputArray[0][1],
      message:inputArray[1][1]
    }, {
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then((response) => {
        setMessages([...messages, response.data.message]);
      })
      .catch((error) => {
        console.log(error);
      });
    }else if(inputArray[0][0] === "SMS"){
      axios.post("https://rajesh-flask.azurewebsites.net/send_sms", {
      // message: input,
      sms:inputArray[0][1],
      message:inputArray[1][1]
    }, {
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then((response) => {
        setMessages([...messages, response.data.message]);
      })
      .catch((error) => {
        console.log(error);
      });
    }else if(inputArray[0][0] === "Call"){
      axios.post("https://rajesh-flask.azurewebsites.net/make_call", {
      // message: input,
      call:inputArray[0][1],
      message:inputArray[1][1]
    }, {
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then((response) => {
        setMessages([...messages, response.data.message]);
      })
      .catch((error) => {
        console.log(error);
      });
    }
    else {
      axios.post("https://rajesh-flask.azurewebsites.net/respond", {
      message: input,
    }, {
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then((response) => {
        setMessages([...messages, response.data.message]);
      })
      .catch((error) => {
        console.log(error);
      });
    }

  }

  if (!session) {
    return (
      <>
        <StyledDiv>
          <AccountCircleIcon sx={{ fontSize: 100 }} />
          <Auth
            supabaseClient={supabase}
            appearance={{ theme: ThemeSupa }}
            providers={['google', 'github']}
          />
      </StyledDiv>
      </>
    )
  }
  else {
    return (
      <>
        <StyledChat>
        <Header />
        <StyledMesseges>
        {alerts.map((alert, index) => (
          <React.Fragment key={index}>
            <Alert severity="info" sx={{ width: '45vw', alignSelf: 'flex-start' }}>{alert}</Alert>
            {messages[index] && (
              <Alert severity="success" sx={{ width: '45vw', alignSelf: 'flex-end' }}>{messages[index]}</Alert>
            )}
          </React.Fragment>
        ))}
        </StyledMesseges>
        <StyledFooter>
        <TextArea rows={3} placeholder="maxLength is 6" maxLength={100} style={{resize:'none',border:"1px solid"}} onChange={(e)=>{
          setInput(e.target.value);
        }}/>
        <Button variant="outlined" onClick={requestSendner} style={{border:"1px solid"}}>Request</Button>
        </StyledFooter>
        </StyledChat>
      </>
    )
  }
}