import React, { useState, useEffect, useContext } from "react";

import {
  IonPage,
  IonContent,
  IonButton
} from "@ionic/react";

import "./LoginPage.scss";
import TextInput from './components/TextInput';

import { Store } from '../../common/AppStore';
import { Auth } from "../../common/Auth";

const LoginPage = () => {
  const {handleLogin, handleSignUp} = useContext(Auth);
  const [signUp, setSignUp] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: ""
  });

  const updateValues = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value.trim() }));
  };

  const toggleMode = event => {
    event.preventDefault();
    setSignUp(prev => !prev);
  };

  const onSubmit = async e => {
    e.preventDefault();
    if (signUp) {
      await handleSignUp(formData);
    } else {
      await handleLogin(formData);
    }
  };

  return (
    <IonPage className="LoginPage">
      <IonContent>
        <div className="LoginContainer">
          <form name="loginForm" onSubmit={onSubmit}>
            <TextInput name="email" type="text" placeholder="Email" onChange={e => updateValues(e.target.name, e.target.value)}/>
            {signUp && (
              <TextInput name="username" type="text" placeholder="Username" onChange={e => updateValues(e.target.name, e.target.value)}/>
            )}
            <TextInput name="password" type="password" placeholder="Password" onChange={e => updateValues(e.target.name, e.target.value)}/>

              <div className="ion-padding">
                <IonButton type="submit" expand="block">
                  {signUp ? "Sign Up" : "Login"}
                </IonButton>
                <IonButton
                  fill="outline"
                  expand="block"
                  onClick={e => toggleMode(e)}
                >
                  {signUp ? "Login" : "Sign Up"}
                </IonButton>
              </div>
          </form>
        </div>
      </IonContent>
    </IonPage>
  );
};

const LoginWithAuth = ({ protectedComponent: ProtectedComponent }) => {
  const { state } = useContext(Store);
  const { isLoggedIn } = state;

  return (
    <>
      {isLoggedIn ? ProtectedComponent : <LoginPage/>}
    </>
  );
};

export {LoginPage, LoginWithAuth};
