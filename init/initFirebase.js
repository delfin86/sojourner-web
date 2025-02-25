import config from '@/config'
import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'

export default async function () {
  try {
    firebase.initializeApp(config.firebase)
    await firebase.firestore().enablePersistence({experimentalTabSynchronization: true})
  } catch (error) {
    console.error(error)
  }
}
