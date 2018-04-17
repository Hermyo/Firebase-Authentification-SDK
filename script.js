// Initialize Firebase
const config = {
    apiKey: "AIzaSyCdBFYtDtfag-B4vgTUw9t6OtVOD8n1Ixs",
    authDomain: "thewalkingdead-bfe2e.firebaseapp.com",
    databaseURL: "https://thewalkingdead-bfe2e.firebaseio.com",
    projectId: "thewalkingdead-bfe2e",
    storageBucket: "thewalkingdead-bfe2e.appspot.com",
    messagingSenderId: "896822131654"
};
firebase.initializeApp(config);
const db = firebase.database();
const character = db.ref('characters');

let myId = '';

character.once('value', function (snapshot) {
    snapshot.forEach(function (childSnapshot) {
        let childData = childSnapshot.val();
        if (childData.uid == myId || !childData.uid) {
            document.getElementById('characterList').innerHTML += '<li>' + childData.name +
                '</li>';
        }
    });
});

function writeUserData(Name) {
    db.ref('characters/' + name).push({
        name: Name,
        uid: myId,
    });

}

function PushOnFirebase() {
    let name = document.getElementById("lastname").value;
    writeUserData(name);
    window.location.reload();
}

// FirebaseUI config.
let uiConfig = {
    signInSuccessUrl: 'index.html',
    signInOptions: [
        // Leave the lines as is for the providers you want to offer your users.
        firebase.auth.EmailAuthProvider.PROVIDER_ID
    ],
    // Terms of service url.
    tosUrl: 'http://localhost:8080/cgu'
};

// Initialize the FirebaseUI Widget using Firebase.
let ui = new firebaseui.auth.AuthUI(firebase.auth());
// The start method will wait until the DOM is loaded.
ui.start('#firebaseui-auth-container', uiConfig);


function initApp() {

    firebase.auth().onAuthStateChanged(function (user) {
        document.getElementById('showUser').style.display = 'none';

        if (user) {
            document.getElementById('showUser').style.display = 'block';
            // All datas
            // User is signed in.
            const displayName = user.displayName;
            const email = user.email;
            const emailVerified = user.emailVerified;
            const photoURL = user.photoURL;
            const uid = user.uid;
            const phoneNumber = user.phoneNumber;
            const providerData = user.providerData;


            // retour de l'utilisateur après authentification
            user.getIdToken().then((accessToken) => {
                document.getElementById('sign-in-status').textContent = 'Signed in';
                document.getElementById('sign-in').textContent = 'Sign out';
                document.getElementById('account-details').textContent = JSON.stringify({
                    displayName: displayName,
                    email: email,
                    emailVerified: emailVerified,
                    phoneNumber: phoneNumber,
                    photoURL: photoURL,
                    uid: uid,
                    accessToken: accessToken,
                    providerData: providerData
                }, null, ' ');
            });
            myId = user.uid;
        } else {

            // Gestion de la deconnexion
            document.getElementById('sign-in-status').textContent = 'Signed out';
            document.getElementById('sign-in').textContent = 'Sign in';
            document.getElementById('account-details').textContent = 'null';
        }
    }, (error) => { // gestion de erreur de connexion
        console.error(error);
    });
}
initApp();

function logout() {
    firebase.auth().signOut().then(function () {
        // Sign-out successful.
    }).catch(function (error) {
        // An error happened.
    });
}