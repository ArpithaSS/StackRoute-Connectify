const fetchUsers=async()=>{
try{
const response=await fetch('https://dummyjson.com/users');
const data=await response.json();
const users=data.users;
const cardContainer=document.getElementById('friends-card');
users.forEach(user=>{
    const card=document.createElement('div');
    card.innerHTML=`
    <div class="card border border-warning" style="width: 18rem;">
  <img src="${user.image}" class="card-img-top" alt="${user.name}">
  <div class="card-body">
  <h5>${user.firstName} ${user.lastName}</h5>
    <p class="card-text">${user.email}</p>
  </div>
</div>
    `
    cardContainer.appendChild(card);
})
}
catch(error){
    console.log("Error fetchind data", error);
}
}

document.addEventListener("DOMContentLoaded",fetchUsers);
// fetchUsers();