// // Assurez-vous d'inclure le script socket.io-client dans votre page HTML

// // Connectez-vous au serveur Socket.IO de la tessiture
// const socket = io('/');

// // Écoutez l'événement 'tessitureModification'
// socket.on('tessitureModification', (data) => {
//   // Manipulez les données reçues et mettez à jour votre interface utilisateur
//   console.log('Notification de modification de tessiture reçue :', data);

//   // Ajoutez le code pour mettre à jour l'interface utilisateur en conséquence
//   // Par exemple, ajoutez une notification à une liste ou mettez à jour un tableau
//   // avec les détails du candidat dont la tessiture a été modifiée.
//   const notificationList = document.getElementById('notificationList');

//   // Créez un élément de liste pour afficher la notification
//   const listItem = document.createElement('li');
//   listItem.textContent = data.message;  // Utilisez les données reçues pour personnaliser le message

//   // Ajoutez l'élément de liste à la liste des notifications
//   notificationList.appendChild(listItem);
// });
