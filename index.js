import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, updateDoc, doc, deleteDoc } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js";
import { firebaseConfig } from "./firebaseConfig.js"

const API_URL = "https://randomuser.me/api/";
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);


const newUserButton = document.getElementById("addUser");
getUsersFromFirestore();

newUserButton.addEventListener("click", async () => {
    const user = await fetchNewUser();
    console.log("user creado", user)
    await addUserToFirestore(user);
    console.log("user guardado")
    displayUserInTable(user);

});
async function fetchNewUser() {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();

        const user = data.results[0];
        const userData = {
            firstName: user.name.first,
            lastName: user.name.last,
            age: user.dob.age,
            gender: user.gender,
            email: user.email,
            country: user.location.country,
            city: user.location.city,
            picture: user.picture.large
        };

        console.log(userData);
        return userData;
    } catch (error) {
        console.error('Error fetching user:', error);
    }
}

async function addUserToFirestore(userData) {
    try {
        const docRef = await addDoc(collection(db, "users"), userData);
        console.log("Usuario agregado con ID: ", docRef.id);
        userData.id = docRef.id;
        return userData;
    } catch (error) {
        console.error("Error al agregar usuario: ", error);
    }
}

async function getUsersFromFirestore() {
    const userCollection = await getDocs(collection(db, "users"));
    userCollection.forEach((doc) => {
        const userData = { id: doc.id, ...doc.data() };
        displayUserInTable(userData);
    });
}

function displayUserInTable(user) {
    const tableContent = document.querySelector("table tbody");
    const newRow = document.createElement("tr");
    newRow.innerHTML = `
        <td><input type="text" value="${user.firstName}" data-field="firstName" data-id="${user.id}" /></td>
        <td><input type="text" value="${user.lastName}" data-field="lastName" data-id="${user.id}" /></td>
        <td><input type="number" value="${user.age}" data-field="age" data-id="${user.id}" /></td>
        <td><input type="text" value="${user.gender}" data-field="gender" data-id="${user.id}" /></td>
        <td><input type="email" value="${user.email}" data-field="email" data-id="${user.id}" /></td>
        <td><input type="text" value="${user.country}" data-field="country" data-id="${user.id}" /></td>
        <td><input type="text" value="${user.city}" data-field="city" data-id="${user.id}" /></td>
        <td><img src="${user.picture}" alt="${user.firstName} ${user.lastName}" width="50" /></td>
        <td>
            <button class="updateUser" data-id="${user.id}">Actualizar</button>
            <button class="deleteUser" data-id="${user.id}">Eliminar</button>
        </td>
    `;
    tableContent.appendChild(newRow);
}

document.addEventListener("click", async (event) => {
    if (event.target.classList.contains("updateUser")) {
        const userId = event.target.getAttribute("data-id");
        const row = event.target.closest("tr");
        const updatedData = {
            firstName: row.querySelector('input[data-field="firstName"]').value,
            lastName: row.querySelector('input[data-field="lastName"]').value,
            age: row.querySelector('input[data-field="age"]').value,
            gender: row.querySelector('input[data-field="gender"]').value,
            email: row.querySelector('input[data-field="email"]').value,
            country: row.querySelector('input[data-field="country"]').value,
            city: row.querySelector('input[data-field="city"]').value,
        };
        await updateUser(userId, updatedData);
        console.log("Usuario actualizado:", userId);
    }

    if (event.target.classList.contains("deleteUser")) {
        const userId = event.target.getAttribute("data-id");
        await deleteUser(userId);
        console.log("Usuario eliminado:", userId);
        // También puedes eliminar la fila de la tabla
        const row = event.target.closest("tr");
        row.remove();
    }
});


async function updateUser(userId, updatedData) {
    const userRef = doc(db, "users", userId);
    try {
        await updateDoc(userRef, updatedData);
        console.log("Usuario actualizado en Firestore:", userId);
    } catch (error) {
        console.error("Error al actualizar usuario:", error);
    }
}


// Delete a user
async function deleteUser(userId) {
    await deleteDoc(doc(db, "users", userId));

}


