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

export async function sendMessage(firebase, message, userId, chatRoomId = 'cr1', attachments = null, type = 'text') {
    return await firebase.push('chatRooms/messages', {
        type: type,
        message: message,
        date: Date(),
        user: userId,
        attachments: attachments
    })
}

export async function assignUser(firebase, userId, role=null){
   return await firebase.database().ref('users/'+userId).update({
       role: role
   })
}

