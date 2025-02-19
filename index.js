document.getElementById("form").addEventListener("submit", createPost);
document.getElementById("fetch-list").addEventListener("click", fetchGET);

const img = document.getElementById("input-img");
const title = document.getElementById("input-title");
const bio = document.getElementById("input-bio");

const dataContainer = document.getElementById("data-container");
dataContainer.style.display = "none";

//GET
async function fetchGET() {
  renderLoadingState();

  try {
    const response = await fetch(fetchUrl);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    renderPost(data);

    const pPost = document.getElementById("pPost");
    pPost.innerHTML= ""
  
    const allPostContainer = document.querySelector("#data-container");
    allPostContainer.style.display = "block";
  
    const formCont = document.querySelector(".form");
    formCont.style.display = "none";
    
  } catch (error) {
    renderErrorState();
  }
}

//POST
const fetchUrl = "http://localhost:3004/posts";
async function createPost(e) {
  e.preventDefault(); // Evita el comportamiento por defecto del formulario
  

  if (!img.value || !title.value || !bio.value) {
    throw new Error('Todos los campos son obligatorios.');
  }

  try {
    const postRequest = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        imgDB: img.value,
        titleDB: title.value,
        bioDB: bio.value,
      }),
    };

    const response = await fetch(fetchUrl, postRequest);
    const responseData = await response.json(); 

    console.log("📨 Respuesta del servidor:", responseData);

    e.target.reset(); // Resetea el formulario después de enviarlo
  } catch (error) {
    console.error("Hubo un problema con el POST:", error);
  }
}



// DELETE

document.getElementById("post-render").addEventListener("click", async (e) => {
  if (e.target.classList.contains("deleteBtn")) {
    const postId = e.target.id;
    if (postId) {
      await fetchDeletePost(postId);
      alert("Post eliminado con éxito");
      fetchGET(); //Actualizar la BD
    } else {
      console.error("ID del post no encontrado");
    }
  }
});

async function fetchDeletePost(id) {
  const fetchDeleteUrl = `http://localhost:3004/posts/${id}`
  try {
    const deletePost = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    };
    const response = await fetch(
      fetchDeleteUrl,
      deletePost
    );

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
  } catch (error) {
    console.error("Error al eliminar el post:", error.message);
    alert(error.message);
  }
}

//RENDER
const renderPost = (post) => {
  const containerPostsRender = document.getElementById("post-render");
  containerPostsRender.innerHTML = "";

  post.forEach((element) => {
    const cardPost = document.createElement("div");
    cardPost.innerHTML = `
      <img src="${element.imgDB}" alt="${element.titleDB}">
      <div>
        <h3>${element.titleDB}</h3>
        <p>${element.bioDB}</p>
      </div>
      <button class="deleteBtn" id="${element.id}">Delete</button>
      `;
    containerPostsRender.appendChild(cardPost);
  });
};

const goToCreatePostBtn = document
  .getElementById("fetch-create-container")
  .addEventListener("click", () => {
    const formContainer = document.querySelector("#form");
    formContainer.style.display = "block";

    const dataContainer = document.querySelector("#data-container");
    dataContainer.style.display = "none";
  });

function renderLoadingState() {
  const p = document.getElementById("pPost");
  p.innerHTML = "";
  p.innerHTML = "Loading...";
}

function renderErrorState() {
  const p = document.getElementById("pPost");
  p.innerHTML= ""
  p.innerHTML = "Failed to load data";
}