
import React, { useState, useEffect, useContext } from 'react';

import Parse from 'parse';

import { Store } from './AppStore';
import { AUTH_FETCH_USER, AUTH_LOGIN, AUTH_LOGOUT, AUTH_SIGNUP, SHOW_TOAST } from './constants';

export const Auth = React.createContext();

export function AuthProvider(props) {
  const { state, dispatch } = React.useContext(Store);
  
  useEffect(() => {
    checkAuth();
  }, []);

  const handleSignUp = async({ username, email, password }) => {    
    const user = new Parse.User();

    user.set('username', username);
    user.set('email', email);
    user.set('password', password);

    try {
      await user.signUp();
      
      dispatch({
        type: AUTH_SIGNUP,
        payload: user.toJSON()
      });
    } catch (error) {
      handleAuthError(error);
    }
  };

  const handleLogin = async({ email, password }) => {    
    try {
      const user = await Parse.User.logIn(email, password);

      dispatch({
        type: AUTH_LOGIN,
        payload: user.toJSON()
      });
    } catch (error) {
      handleAuthError(error);
    }
  };

  const handleLogout = async() => {
    const currentUser = Parse.User.current();;
    await currentUser.logOut();

    dispatch({
      type: AUTH_LOGOUT,
      payload: null
    });
  };

  const checkAuth = async() => {

    const currentUser = await Parse.User.current();

    if (currentUser) {
      dispatch({
        type: AUTH_FETCH_USER,
        payload: currentUser.toJSON()
      });
    } else {
      dispatch({
        type: AUTH_LOGOUT,
        payload: null
      });
    }
  };

  const updateUser = async(payload) => {
    // const { email, username, password, image, bio } = payload;

    // dispatch({
    //   type: AUTH_FETCH_USER,
    //   payload: data.user
    // });
    console.log(`updateUser`);
  };

  const handleAuthError = (error) => {
    console.log(error);
  };

  const value = {
    handleSignUp, 
    handleLogin, 
    handleLogout, 
    handleAuthError,
    checkAuth,
    updateUser
  };

  return (
    <Auth.Provider value={value}>
      {props.children}
    </Auth.Provider>
  )
};

