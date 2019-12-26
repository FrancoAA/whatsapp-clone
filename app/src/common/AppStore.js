import Parse from 'parse';
import React, { createContext, useReducer } from "react";

import {
  SET_LOADING,
  SHOW_TOAST,
  AUTH_SIGNUP,
  AUTH_LOGIN,
  AUTH_LOGOUT,
  AUTH_FETCH_USER,
  FETCH_CHATS,
  CREATE_CHATS,
  DELETE_CHAT,
  FETCH_MESSAGES,
  SEND_MESSAGE,
  OPEN_CONTACTS_MODAL,
  CLOSE_CONTACTS_MODAL,
  FETCH_CONTACTS
} from "./constants";

export const Store = createContext();

export const initialState = {
  contacts: [],
  contact: null,
  showContacts: false,
  message: null,
  messages: [],
  chat: null,
  chats: [],
  user: null,
  error: null
};

function reducer(state, { type, payload }) {
  switch (type) {
    case AUTH_SIGNUP: {
      return { ...state, user: payload, isLoggedIn: true };
    }
    case AUTH_LOGIN: {
      return { ...state, user: payload, isLoggedIn: true };
    }
    case AUTH_LOGOUT: {
      return { ...state, user: null, isLoggedIn: false };
    }
    case AUTH_FETCH_USER: {
      return { ...state, user: payload, isLoggedIn: true };
    }
    case SHOW_TOAST: {
      return { ...state, toast: payload };
    }
    case SET_LOADING: {
      return { ...state, loading: payload };
    }
    case OPEN_CONTACTS_MODAL: {
      return { ...state, showContacts: true };
    }
    case CLOSE_CONTACTS_MODAL: {
      return { ...state, showContacts: false };
    }
    case FETCH_CONTACTS: {
      return { ...state, contacts: payload };
    }
    case FETCH_CHATS: {
      return { ...state, chats: payload };
    }
    default:
      return state;
  }
}

export function StoreProvider(props) {
  const [state, dispatch] = useReducer(reducer, initialState);

  async function fetchContacts() {
    try {
      const contacts = await Parse.Cloud.run('getContacts');
      console.log('getContacts: ', contacts);
      dispatch({
        type: FETCH_CONTACTS,
        payload: contacts.map(c => c.toJSON())
      })
    } catch (error) {
      dispatch({
        type: SHOW_TOAST,
        payload: error.message
      });
    }
  }
  
  async function fetchChats() {
    const { user } = state;
    console.log('User: ', user);
    try {
      const chatsQuery = new Parse.Query('Chats');
      chatsQuery.equalTo('usersList', user.objectId);
      chatsQuery.include('lastMessage.sender');
      const chats = await chatsQuery.find();

      dispatch({
        type: FETCH_CHATS,
        payload: chats.map(c => c.toJSON())
      });
    } catch (error) {
      dispatch({
        type: SHOW_TOAST,
        payload: error.message
      });
    }
  }

  async function sendMessage(message) {
    try {
      const newMessage = Parse.Cloud.run('sendMessage', message);
      dispatch({
        type: SEND_MESSAGE,
        payload: newMessage
      });
    } catch (error) {
      dispatch({
        type: SHOW_TOAST,
        payload: error.message
      });
    }
  }

  async function fetchMessages(chatId) {
    const messagesQuery = new Parse.Query('Messages');

    try {
      messagesQuery.equalTo('chatId', chatId);
      const messages = await messagesQuery.find();

      dispatch({
        type: FETCH_MESSAGES,
        payload: messages.map(m => m.toJSON())
      });
    } catch (error) {
      dispatch({
        type: SHOW_TOAST,
        payload: error.message
      });
    }
  }

  async function showContactsModal() {
    dispatch({
      type: OPEN_CONTACTS_MODAL
    });
  }

  async function closeContactsModal() {
    dispatch({
      type: CLOSE_CONTACTS_MODAL
    });
  }

  const value = { 
    state,
    dispatch,
    fetchChats,
    fetchContacts,
    fetchMessages,
    sendMessage,
    showContactsModal,
    closeContactsModal
  };

  return <Store.Provider value={value}>{props.children}</Store.Provider>;
}
