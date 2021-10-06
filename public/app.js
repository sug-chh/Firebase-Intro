console.log(firebase);
const auth = firebase.auth();
const whenSignedIn = document.getElementById("whenSignedIn");
const whenSignedOut = document.getElementById("whenSignedOut");
const signInBtn = document.getElementById("signInBtn");
const signOutBtn = document.getElementById("signOutBtn");
const userDetails = document.getElementById("userDetails");
const randomThing = document.getElementById("randomThing");

console.log(faker);

const provider = new firebase.auth.GoogleAuthProvider();
signInBtn.addEventListener("click", () => {
  auth.signInWithPopup(provider);
  console.log("clicked!");
});

signOutBtn.addEventListener("click", () => auth.signOut());

auth.onAuthStateChanged((user) => {
  if (user) {
    // signed in
    whenSignedIn.hidden = false;
    whenSignedOut.hidden = true;
    userDetails.innerHTML = `<h3>Hello ${user.displayName}!</h3><p>User ID: ${user.uid}</p>`;
  } else {
    whenSignedIn.hidden = true;
    whenSignedOut.hidden = false;
  }
});

const db = firebase.firestore();
const createThing = document.getElementById("createThing");
const thingsList = document.getElementById("thingsList");

let thingsRef;
let unsubscribe;

auth.onAuthStateChanged((user) => {
  if (user) {
    randomThing.hidden = false;
    thingsRef = db.collection("things");
    createThing.addEventListener("click", () => {
      const { serverTimestamp } = firebase.firestore.FieldValue;
      thingsRef.add({
        uid: user.uid,
        name: faker.commerce.productName(),
        createdAt: serverTimestamp(),
      });
    });
    unsubscribe = thingsRef
      .where("uid", "==", user.uid)
      .orderBy("createdAt")
      .onSnapshot((querySnapshot) => {
        const items = querySnapshot.docs.map((doc) => {
          return `<li>${doc.data().name}</li>`;
        });
        console.log(items.join(""));
        thingsList.innerHTML = items.join("");
      });
  } else {
    console.log(unsubscribe);
    unsubscribe && unsubscribe();
    randomThing.hidden = true;
  }
});
