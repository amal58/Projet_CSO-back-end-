// client.js
const socket = io('http://localhost:5000');

// Écoutez l'événement pour les notifications planifiées
socket.on('scheduledNotification', (data) => {
  console.log('Notification planifiée reçue !', data);

  // Ajoutez le code pour gérer la notification planifiée sur le tableau de bord de l'administrateur
  // Mise à jour de l'interface utilisateur avec les nouvelles informations
  const notificationList = document.getElementById('notificationList');
  const listItem = document.createElement('li');
  listItem.textContent = data.message;

  // Si des candidats sont inclus, ajoutez-les à la notification
  if (data.candidats && data.candidats.length > 0) {
    const candidatsList = document.createElement('ul');
    data.candidats.forEach((candidat) => {
      const candidatItem = document.createElement('li');
      candidatItem.textContent = `${candidat.nom} ${candidat.prenom}`;
      candidatsList.appendChild(candidatItem);
    });
    listItem.appendChild(candidatsList);
  }

  notificationList.appendChild(listItem);
});
