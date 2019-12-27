import {
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonAvatar,
  IonList,
  IonListHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonFab,
  IonFabButton
} from "@ionic/react";

import { send } from "ionicons/icons";
import React, { useState, useContext, useEffect } from "react";

import { Store } from "../../common/AppStore";

import "./Chats.scss";
import ContactsModal from "./components/ContactsModal";
import { useHistory } from "react-router";

const Chats = () => {
  const {
    state,
    fetchChats,
    openChat,
    showContactsModal,
    closeContactsModal
  } = useContext(Store);
  let history = useHistory();
  
  const { chats, showContacts } = state;

  useEffect(() => {
    fetchChats();
  }, []);

  const handleOpenChat = async (chatId) => {
    await openChat({ chatId });
    history.push('/chats/detail');
  };

  return (
    <IonPage className="Chats">
      <IonHeader>
        <IonToolbar>
          <IonTitle>Chats</IonTitle>
        </IonToolbar>
      </IonHeader>

      <ContactsModal isOpen={showContacts} closeModal={closeContactsModal}/>

      <IonContent>
        <IonList>
          {chats.map(chat => (
            <IonItem key={chat.objectId} onClick={() => handleOpenChat(chat.objectId)}>
              <IonAvatar slot="start">
                <img src={chat.avatar} alt="chat-picture"/>
              </IonAvatar>
              <IonLabel>
                <h2>{chat.name}</h2>
                <p>{chat.lastMessage}</p>
              </IonLabel>
            </IonItem>
          ))}
        </IonList>
      </IonContent>

      <IonFab horizontal="end" vertical="bottom">
        <IonFabButton onClick={showContactsModal}>
          <IonIcon icon={send} />
        </IonFabButton>
      </IonFab>
    </IonPage>
  );
};

export default Chats;
