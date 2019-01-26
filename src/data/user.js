import firebase from 'firebase/app'

function getUserRefHelper (user) {
  return firebase.firestore().collection('users').doc(user.uid)
}

export default {
  state: {
    user: null,

    loginDialog: false,

    persistent: false,

    loseDataWarning: false
  },

  getters: {
    user: state => state.user,

    realUser: state => (state.user && !state.user.isAnonymous) ? state.user : null,

    loginDialog: state => state.loginDialog,

    persistent: state => state.persistent
  },

  mutations: {
    setUser (state, user) {
      state.user = user
    },

    setLoginDialog (state, loginDialog) {
      state.loginDialog = loginDialog
    },

    setPersistent (state, persistent) {
      state.persistent = persistent
    },

    shownLoseDataWarning (state) {
      state.loseDataWarning = true
    }
  },

  actions: {
    showLoginDialog ({commit}) {
      commit('setLoginDialog', true)
    },

    hideLoginDialog ({commit}) {
      commit('setLoginDialog', false)
    },

    initUser ({commit, dispatch}, user) {
      return firebase.auth().onAuthStateChanged(user => {
        console.log(`Initializing user ${user.uid}`)
        commit('setUser', user)
        if (user) {
          return dispatch('initFavourites')
        } else {
          commit('setFavourites', [])
        }
      })
    },

    register ({commit}, {email, password}) {
      return firebase.auth().createUserWithEmailAndPassword(email, password)
    },

    logIn ({commit}, {email, password}) {
      return firebase.auth().signInWithEmailAndPassword(email, password)
        .then(response => getUserRefHelper(response.user).set({}, {merge: true}))
    },

    logOut ({commit}) {
      return firebase.auth().signOut()
    },

    getUserRef ({state}) {
      if (state.user) {
        return getUserRefHelper(state.user)
      }
      if (!state.user) {
        return firebase.auth().signInAnonymously()
          .then(response => {
            const userData = getUserRefHelper(response.user)
            userData.set({}, {merge: true})
            return userData
          })
      }
    },

    initPersistent ({commit, dispatch}) {
      if (navigator.storage && navigator.storage.persisted) {
        return navigator.storage.persisted()
          .then(persistent => {
            if (persistent) {
              commit('setPersistent', true)
            } else {
              dispatch('showWarning', 'Persistent storage disabled.')
              throw new Error('Could not enable persistence')
            }
          })
          .then(() => dispatch('showSuccess', 'Persistent storage enabled.'))
      } else {
        commit('setPersistent', false)
        dispatch('showWarning', 'Persistent storage disabled.')
      }
    },

    initIndexedDB ({dispatch}) {
      return new Promise((resolve, reject) => {
        const request = window.indexedDB.open('sojourner-test')
        request.onerror = () => {
          dispatch('showNotification', {
            color: 'error',
            message: 'Unable to initialize IndexedDB, are you browsing in private mode?',
            timeout: 0
          })
          reject(new Error('Unable to open IndexedDB'))
        }
        request.onsuccess = () => {
          request.result.close()
          resolve()
        }
      })
    },

    persist ({commit}) {
      if (navigator.storage && navigator.storage.persist) {
        return navigator.storage.persist()
          .then(persistent => {
            if (persistent) {
              commit('setPersistent', true)
            } else {
              throw new Error('Could not enable persistence')
            }
          })
      } else {
        return Promise.reject(new Error('Persistence not supported by the browser'))
      }
    },

    warnAboutLosingData ({dispatch, commit, state, getters}) {
      if (!getters.realUser && !state.persistent && !state.loseDataWarning) {
        return dispatch('showWarning', 'You are neither logged in, nor persisted. Please click on Anonymous button in the top right corner to fix that - otherwise your data might be lost.')
          .then(() => commit('shownLoseDataWarning'))
      }
    }
  }
}
