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
  FETCH_CHAT,
  OPEN_CHAT,
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
  otherUser: null,
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
    case FETCH_CHAT: {
      return { ...state, chat: payload };
    }
    case OPEN_CHAT: {
      return { ...state, chat: payload.chat, messages: payload.messages };
    }
    case FETCH_MESSAGES: {
      return { ...state, messages: payload };
    }
    case SEND_MESSAGE: {
      return { ...state, messages: [ ...state.messages, payload]}
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

    try {
      const chatsQuery = new Parse.Query('Chats');
      chatsQuery.equalTo('usersList', user.objectId);
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

  async function openChat({ chatId, receiver }) {
    let Chat, chat, messages, chatQuery, messagesQuery;

    console.log('ChatId: ', chatId, 'receiver: ', receiver);

    Chat = Parse.Object.extend('Chats');

    try {
      const { user } = state;
      chatQuery = new Parse.Query('Chats');
      messagesQuery = new Parse.Query('Messages');

      // Open an existing conversation, fetch the chat info and it's messages
      if (chatId) {
        chat = await chatQuery.get(chatId);
        messagesQuery.equalTo('chatId', chatId);
        messages = await messagesQuery.find();
        dispatch({
          type: OPEN_CHAT,
          payload: {
            chat: chat.toJSON(),
            messages: messages.map(m => m.toJSON())
          }
        });
      } else {
        chat = new Chat();
        chat.set('usersList', [user.objectId, receiver.objectId]);
        chat.set('name', receiver.username);
        chat.set('avatar', receiver.picture);

        await chat.save();

        dispatch({
          type: OPEN_CHAT,
          payload: {
            chat: chat.toJSON(),
            messages: []
          }
        });
      }
    } catch (error) {
      console.log(error.message);
      dispatch({
        type: SHOW_TOAST,
        payload: error.message
      });
    }
  }

  async function sendMessage(chatId, message) {
    const { chats } = state;
    try {
      const newMessage = await Parse.Cloud.run('sendMessage', { chatId, message });
      dispatch({
        type: SEND_MESSAGE,
        payload: newMessage.toJSON()
      });

      const index = chats.findIndex(c => c.objectId === chatId);
      chats[index].lastMessage = message;
      dispatch({
        type: FETCH_CHATS,
        payload: [ ...chats ]
      });
    } catch (error) {
      dispatch({
        type: SHOW_TOAST,
        payload: error.message
      });
    }
  }

  async function fetchMessages(chatId) {
    console.log('fetchMessages called', chatId);

    const messagesQuery = new Parse.Query('Messages');
    const chatQuery = new Parse.Query('Chats');

    try {
      messagesQuery.equalTo('chatId', chatId);
      messagesQuery.include('sender');
      //
      const chat = await chatQuery.get(chatId);
      dispatch({
        type: FETCH_CHAT,
        payload: chat.toJSON()
      });
      //
      const messages = await messagesQuery.find();
      dispatch({
        type: FETCH_MESSAGES,
        payload: messages.map(m => m.toJSON())
      });
    } catch (error) {
      console.log(error);
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
    openChat,
    fetchContacts,
    fetchMessages,
    sendMessage,
    showContactsModal,
    closeContactsModal
  };

  return <Store.Provider value={value}>{props.children}</Store.Provider>;
}
