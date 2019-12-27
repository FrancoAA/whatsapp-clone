import React, { useContext } from 'react';
import { Redirect, Route } from 'react-router-dom';
import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  IonFab,
  IonFabButton
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { chatbubbles, person } from 'ionicons/icons';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';

import { Store } from './common/AppStore';
import { AuthProvider } from './common/Auth';
import { LoginWithAuth } from './pages/Login/Login';

import Chats from './pages/Chats/Chats';
import Chat from './pages/Chat/Chat';
import Tab2 from './pages/Tab2';
import Tab3 from './pages/Tab3';

const App = () => {
  // const {} = useContext(Store);

  return (
    <AuthProvider>
      <IonApp>
        <LoginWithAuth protectedComponent={
          <>
            <IonReactRouter>
              <IonTabs>

                <IonRouterOutlet>
                  <Route path="/chats" component={Chats} exact={true} />
                  <Route path="/chats/:chatId" component={Chat} />
                  <Route path="/profile" component={Tab2} exact={true} />
                  <Route path="/calls" component={Tab3} />
                  <Route path="/" render={() => <Redirect to="/chats" />} exact={true} />
                </IonRouterOutlet>

                <IonTabBar slot="bottom">
                  <IonTabButton tab="chats" href="/chats">
                    <IonIcon icon={chatbubbles}/>
                    <IonLabel>Chats</IonLabel>
                  </IonTabButton>
                  <IonTabButton tab="profile" href="/profile">
                    <IonIcon icon={person} />
                    <IonLabel>Profile</IonLabel>
                  </IonTabButton>
                </IonTabBar>

              </IonTabs>
            </IonReactRouter>
          </>
        }/>
      </IonApp>
    </AuthProvider>
  );
};

export default App;
