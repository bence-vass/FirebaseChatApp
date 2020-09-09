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

export async function uploadAttachment(firebase, files, userId, chatRoomId = 'cr1') {
    await firebase.uploadFiles(
        chatRoomId,
        files,
        'chatRooms/attachments',
        {
            //name: (file) => `${this.props.auth.uid}-${Date.now()}`,
            name: (file) => {
                return `${file.name}-${new Date().getTime()}`
            },
            metadataFactory: (uploadRes, firebase, metadata, downloadURL) => {
                console.log(uploadRes)
                console.log(metadata)
                return {
                    url: downloadURL,
                    date: Date(),
                    user: userId,
                    contentType: metadata.contentType,
                    name: metadata.name
                }
            },
        },
    ).then(res => {
        //console.log(res)
        sendMessage(firebase, '', userId, chatRoomId, Object.values(res).map(e => (e.File)), 'attachment')
    })

}

