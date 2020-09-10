export async function signUpWithEmail(firebase, email, password) {
    return await firebase.createUser({
        email: email, password: password
    }, {
        email: email,
        creationDate: Date(),
    })
}

export async function signInWithEmail(firebase, email, password) {
    return await firebase.login({
        email: email, password: password
    })
}

export async function sendMessage(firebase, message, senderId, receiverId) {
    return await firebase.push('users/'+receiverId+'/chats', {
        text: message,
        date_created: Date(),
        user: senderId,
    })
}

export async function sendVipMessage(firebase, message, senderId) {
    let users = firebase.database().ref('users')
    users.once('value', snapshot=>{
        snapshot.forEach(childSnapshot=>{
            console.log(childSnapshot.key)
            firebase.push('users/'+childSnapshot.key+'/chats', {
                text: message,
                date_created: Date(),
                user: senderId,
            })

        })
    })

}

export async function assignUser(firebase, userId, role=null){
   return await firebase.database().ref('users/'+userId).update({
       role: role
   })
}

