import React from 'react'
import { Provider } from 'react-redux'
import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'
import 'firebase/storage'
import 'firebase/firestore' // make sure you add this for firestore
import { ReactReduxFirebaseProvider } from 'react-redux-firebase'
import { createFirestoreInstance } from 'redux-firestore'
import Home from './Home'
import configureStore from './store'
import { firebase as fbConfig, rrfConfig } from './config'
import {
    BrowserRouter as Router,
    Switch,
    Route,
} from "react-router-dom";
import {ADMIN_DASHBOARD_URL, CHAT_URL, SIGN_IN_URL, SIGN_UP_URL,} from "./urlPaths";

import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import Chat from "./pages/Chat";
import UserList from "./pages/UserList";
import AdminDashboard from "./pages/AdminDashboard";
import Navbar from "./components/Navbar";


const initialState = window && window.__INITIAL_STATE__ // set initial state here
const store = configureStore(initialState)
// Initialize Firebase instance
firebase.initializeApp(fbConfig)

export default function App() {
  return (
    <Provider store={store}>
      <ReactReduxFirebaseProvider
        firebase={firebase}
        config={rrfConfig}
        dispatch={store.dispatch}
        createFirestoreInstance={createFirestoreInstance}>
          <Router>

              <Navbar/>


              <Switch>
                  <Route exact path={SIGN_UP_URL}><SignUp/></Route>
                  <Route exact path={SIGN_IN_URL}><SignIn/></Route>
                  <Route exact path={CHAT_URL+'/:userId'}><Chat/></Route>
                  <Route exact path={CHAT_URL}><UserList/></Route>
                  <Route exact path={ADMIN_DASHBOARD_URL}><AdminDashboard/></Route>
                  <Route path={'/'}><Home/></Route>
              </Switch>
          </Router>
      </ReactReduxFirebaseProvider>
    </Provider>
  )
}
