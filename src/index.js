document.addEventListener("DOMContentLoaded", () => {
  // Select the toy collection container from the HTML
  const toyCollection = document.querySelector("#toy-collection");
  // Select the toy form from the HTML
  const toyForm = document.querySelector(".add-toy-form");

  // Function to create a toy card element
  function createToyCard(toy) {
    const card = document.createElement("div");
    card.className = "card";

    const h2 = document.createElement("h2");
    h2.innerText = toy.name;

    const img = document.createElement("img");
    img.src = toy.image;
    img.className = "toy-avatar";

    const p = document.createElement("p");
    p.innerText = `${toy.likes} Likes`;

    const button = document.createElement("button");
    button.className = "like-btn";
    button.id = toy.id;
    button.innerText = "Like ❤️";

    // Event listener for the like button click
    button.addEventListener("click", handleLikeClick);

    // Append child elements to the card
    card.appendChild(h2);
    card.appendChild(img);
    card.appendChild(p);
    card.appendChild(button);

    return card;
  }

  // Function to fetch and render toys from the API
  function renderToys() {
    fetch("http://localhost:3000/toys")
      .then((response) => response.json())
      .then((toys) => {
        toys.forEach((toy) => {
          const card = createToyCard(toy);
          toyCollection.appendChild(card);
        });
      });
  }

  // Function to handle a like button click
  function handleLikeClick(event) {
    const button = event.target;
    const toyId = button.id;
    const likeDisplay = button.previousElementSibling;
    const currentLikes = parseInt(likeDisplay.innerText.split(" ")[0]);
    const newLikes = currentLikes + 1;

    // Send a PATCH request to update the number of likes
    fetch(`http://localhost:3000/toys/${toyId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ likes: newLikes }),
    })
      .then((response) => response.json())
      .then((updatedToy) => {
        // Update the like count in the DOM
        likeDisplay.innerText = `${updatedToy.likes} Likes`;
      });
  }

  // Event listener for submitting a new toy
  toyForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const name = toyForm.querySelector('input[name="name"]').value;
    const image = toyForm.querySelector('input[name="image"]').value;

    // Create a new toy object
    const newToy = {
      name: name,
      image: image,
      likes: 0,
    };

    // Send a POST request to create a new toy
    fetch("http://localhost:3000/toys", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(newToy),
    })
      .then((response) => response.json())
      .then((createdToy) => {
        const card = createToyCard(createdToy);
        toyCollection.appendChild(card);
        toyForm.reset();
      });
  });

  // Initial rendering of toys when the page loads
  renderToys();
});
