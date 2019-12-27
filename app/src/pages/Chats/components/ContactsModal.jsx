import React, { useState, useContext, useEffect } from "react";
import { useHistory } from 'react-router-dom';

import {
  IonModal,
  IonButton,
  IonHeader,
  IonContent,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonLabel,
  IonInput,
  IonList,
  IonTextarea,
  IonItem,
  IonFooter,
  IonIcon,
  IonAvatar
} from "@ionic/react";

import { close } from 'ionicons/icons';

import { Store } from '../../../common/AppStore';

const ContactsModal = ({ isOpen, closeModal }) => {
  let history = useHistory();
  const { state, fetchContacts, openChat } = useContext(Store);
  const { chats, contacts } = state;

  useEffect(() => {
    fetchContacts();
  }, []);

  const handleOpenChat = async (user) => {
    const chat = chats.find(c => c.usersList.indexOf(user.objectId) >= 0);
    if (chat) {
      await openChat({ chatId: chat.objectId });
    } else {
      await openChat({ receiver: user });
    }
    closeModal();
    history.push(`/chats/detail`);
  };

  return (
    <IonModal isOpen={isOpen}>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton onClick={closeModal}>
              <IonIcon icon={close}/>
            </IonButton>
          </IonButtons>
          <IonTitle>Contacts</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonList>
          {contacts.map(c => (
            <IonItem key={c.objectId} onClick={() => handleOpenChat(c)}>
              <IonAvatar slot="start">
                <img src={c.picture} alt="avatar"/>
              </IonAvatar>
              <IonLabel>
                {c.username}
              </IonLabel>
            </IonItem>
          ))}
        </IonList>
      </IonContent>
    </IonModal>
  );
};

export default ContactsModal;
