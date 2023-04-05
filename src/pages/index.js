import Head from 'next/head'
import Image from 'next/image'
import { Inter } from 'next/font/google'
// import styles from '@component/styles/Home.module.css'
import styles from "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
  Button,
  Avatar,
} from "@chatscope/chat-ui-kit-react";
import { useState } from 'react';


const messListDataDefault = [{
  message: "Hello my friend",
  sentTime: "just now",
  sender: "Joe",
},
{
  message: "What can i help you",
  sentTime: "just now",
  sender: "Joe",
}]

const inter = Inter({ subsets: ['latin'] })

import axios from 'axios';

// replace YOUR_API_KEY with your actual OpenAI API key
const OPENAI_API_KEY = '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';



export default function Home() {
  
  const [messListData, setMessListData] = useState(messListDataDefault)
  const [inputMess, setInputMess] = useState("");

  async function askOpenAI(question) {
    const response = await axios.post('https://chatgpt-api.shn.hk/v1/', {
      "model": "gpt-3.5-turbo",
      "messages": [{"role": "user", "content": question}]
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
    });
  
    if (response.status === 200) {
      const answer = response.data.choices[0].text.trim();
      return answer;
    }
  
    return '';
  }

  function reciveMess(text) {
    setMessListData([
      ...messListData,
      {
      message: text,
      sentTime: "just now",
      sender: "Chat Gpt",
      direction: "incoming",
      position: "first"
      }])
      console.log("MessList",messListData);
  }

  async function sendMess(text) {
    setMessListData([
      ...messListData,
      {
      message: text,
      sentTime: "just now",
      sender: "Me",
      direction: "outgoing",
      position: "normal"
      }])
      console.log("MessList",messListData);


      if (text) {
        const response = await askOpenAI(text);
        reciveMess(response);
      }
  }

  const messListRender = messListData.map((mess,index) =>
        <Message
          key={index}
          model={mess}
        >
          {/* <Avatar src={'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQUIwD84MUO1g9n6U0VWNJKRK0pPFVGTXsBeQ3KTeeGTpxX7VKB3-rMoW1J2bvU2blIFiM&usqp=CAU'} name={"Zoe"} /> */}
        </Message>

  );

  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

        <div style={{ position: "relative", height: "500px" }}>
          <MainContainer>
            <ChatContainer>
              <MessageList>
                {messListRender}
              </MessageList>
              <MessageInput 
                placeholder="Type message here" 
                value={inputMess}
                onSend={()=>{
                  sendMess(inputMess)
                  setInputMess("")
                }}
                onChange={(e)=>{
                  setInputMess(e)
                }}
                autoFocus
                />
            </ChatContainer>
          </MainContainer>
        </div>

        {/* <Button onClick={sendMess}>Add message</Button> */}
    </>
  )
}
