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

const Chats = () => {
  const {
    state,
    fetchChats,
    showContactsModal,
    closeContactsModal
  } = useContext(Store);
  
  const { chats, showContacts } = state;

  useEffect(() => {
    fetchChats();
  }, []);

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
            <IonItem key={chat.objectId} routerLink={`/chats/${chat.objectId}`}>
              <IonAvatar slot="start">
                <img src={chat.lastMessage.sender.picture} alt="chat-picture"/>
              </IonAvatar>
              <IonLabel>
                <h2>{chat.lastMessage.sender.username}</h2>
                <p>{chat.lastMessage.text}</p>
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
