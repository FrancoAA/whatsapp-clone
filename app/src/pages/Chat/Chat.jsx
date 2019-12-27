import { format } from "date-fns";
import React, { useEffect, useState, useRef, useContext } from "react";
import { useParams } from 'react-router-dom';

import { Store } from '../../common/AppStore';

import {
  IonBackButton,
  IonButtons,
  IonHeader,
  IonFooter,
  IonPage,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonIcon
} from "@ionic/react";

import { send } from "ionicons/icons";

import "./Chat.scss";

const Chat = () => {
  const { state, fetchMessages, sendMessage } = useContext(Store);
  const { chatId } = useParams();
  const ionContentRef = useRef(null);

  const { user, messages } = state;

  useEffect(() => {
    fetchMessages(chatId);
  }, []);

  const handleSend = e => {
    if (e.keyCode === 13) {
      const message = e.target.value;
      sendMessage(chatId, message);
      e.target.value = "";
      ionContentRef.current.scrollToBottom(500);
    }
  };

  return (
    <IonPage className="Chat">
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton />
          </IonButtons>
          <IonTitle>Chat</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent ref={ionContentRef}>
        <div className="MessageList">
          {messages.map(m => (
              <div key={m.objectId} className="message-wrapper">
                <div
                  className={`message ${
                    m.sender.objectId === user.objectId ? "message-mine" : "message-other"
                  }`}
                >
                  <div className="message-text">{m.text}</div>
                  <span className="message-timestamp">{format(new Date(m.createdAt), 'h:mm a')}</span>
                </div>
              </div>
            ))}
        </div>
      </IonContent>

      <IonFooter>
        <IonToolbar>
          <div className="input-container">
            <input type="text" onKeyUp={handleSend} />
          </div>
          <IonButtons slot="end">
            <IonButton>
              <IonIcon icon={send} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonFooter>
    </IonPage>
  );
};

export default Chat;
