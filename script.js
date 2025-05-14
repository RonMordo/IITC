function toggleDropdown() {
  const dropdown = document.querySelector(".fab-dropdown");
  dropdown.classList.toggle("hidden");
}

document.querySelector(".fab-button").addEventListener("click", toggleDropdown);

document.addEventListener("click", function (event) {
  const fabButton = document.querySelector(".fab-button");
  const fabDropdown = document.querySelector(".fab-dropdown");
  if (!fabButton.contains(event.target)) {
    fabDropdown.classList.add("hidden");
  }
});

let booksData = [];

async function loadBooks() {
  try {
    const storedBooks = sessionStorage.getItem("books");
    if (storedBooks) {
      booksData = JSON.parse(storedBooks);
    } else {
      const response = await fetch("./data/books.json");
      const data = await response.json();
      booksData = data.books;
      sessionStorage.setItem("books", JSON.stringify(booksData));
    }
    displayBooks(booksData);
  } catch (error) {
    console.error("Error loading books:", error);
  }
}

function displayBooks(books) {
  const booksContainer = document.querySelector(".books-container");
  if (!booksContainer) return;

  booksContainer.innerHTML = "";

  books.forEach((book) => {
    const bookHTML = `
      <div class="book-container" data-book-id="${book.id}">
        <div class="remove-button-container">
          <button onclick="removeBook(${book.id})">
            <img src="./assets/remove-button.webp" alt="Remove button image" />
          </button>
        </div>
        <div class="book-image">
          <img src="${book.imageSrc}" alt="Cover of ${book.title}" />
        </div>
        <div class="description">
          <h3>${book.title}</h3>
          <p>By ${book.author}</p>
          <p>${book.genre} (${book.yearPublished})</p>
        </div>
      </div>
    `;
    booksContainer.insertAdjacentHTML("beforeend", bookHTML);
  });
}

function removeBook(bookId) {
  const bookElement = document.querySelector(`[data-book-id="${bookId}"]`);
  if (bookElement) {
    bookElement.style.transition = "opacity 0.3s ease";
    bookElement.style.opacity = "0";

    setTimeout(() => {
      booksData = booksData.filter((book) => book.id !== bookId);
      sessionStorage.setItem("books", JSON.stringify(booksData));
      displayBooks(booksData);
    }, 300);
  }
}

const addBookForm = document.getElementById("addBookForm");
if (addBookForm) {
  const authorInput = document.getElementById("author");
  const authorError = document.getElementById("authorError");

  function validateAuthor(value, showError = true) {
    const hasNumbers = /\d/.test(value);
    const isValid = /^[A-Za-z\s\-'.]+$/.test(value);

    if (hasNumbers) {
      if (showError) {
        authorError.textContent = "Author name cannot contain numbers";
        authorError.classList.add("show");
      }
      return false;
    } else if (!isValid && value) {
      if (showError) {
        authorError.textContent =
          "Author name can only contain letters, spaces, hyphens, apostrophes, and periods";
        authorError.classList.add("show");
      }
      return false;
    } else {
      if (showError) {
        authorError.classList.remove("show");
      }
      return true;
    }
  }

  authorInput.addEventListener("input", function () {
    if (authorInput.classList.contains("invalid")) {
      const isValid = validateAuthor(this.value, true);
      if (isValid) {
        authorInput.classList.remove("invalid");
      }
    }
  });

  authorInput.addEventListener("blur", function () {
    const isValid = validateAuthor(this.value, true);
    if (!isValid && this.value) {
      authorInput.classList.add("invalid");
    }
  });

  addBookForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const formData = new FormData(addBookForm);
    const authorValue = formData.get("author");

    if (!validateAuthor(authorValue, true)) {
      authorInput.classList.add("invalid");
      return;
    }

    const newBook = {
      id: Date.now(),
      title: formData.get("title"),
      author: authorValue,
      genre: formData.get("genre"),
      yearPublished: parseInt(formData.get("yearPublished")),
      imageSrc: `https://picsum.photos/200/250?random=${Date.now()}`,
    };

    booksData.push(newBook);
    sessionStorage.setItem("books", JSON.stringify(booksData));

    alert("Book added successfully!");
    addBookForm.reset();
    authorInput.classList.remove("invalid");
    window.location.href = "./library.html";
  });
}

const contactForm = document.getElementById("contactForm");
if (contactForm) {
  const nameInput = document.getElementById("name");
  const emailInput = document.getElementById("email");
  const messageInput = document.getElementById("message");
  const nameError = document.getElementById("nameError");
  const emailError = document.getElementById("emailError");
  const messageError = document.getElementById("messageError");

  function validateName(value, showError = true) {
    const hasNumbers = /\d/.test(value);
    const isValid = /^[A-Za-z\s\-'.]+$/.test(value);

    if (hasNumbers) {
      if (showError) {
        nameError.textContent = "Name cannot contain numbers";
        nameError.classList.add("show");
      }
      return false;
    } else if (!isValid && value) {
      if (showError) {
        nameError.textContent =
          "Name can only contain letters, spaces, hyphens, apostrophes, and periods";
        nameError.classList.add("show");
      }
      return false;
    } else {
      if (showError) {
        nameError.classList.remove("show");
      }
      return true;
    }
  }

  function validateEmail(value, showError = true) {
    const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

    if (!isValid && value) {
      if (showError) {
        emailError.textContent = "Please enter a valid email address";
        emailError.classList.add("show");
      }
      return false;
    } else {
      if (showError) {
        emailError.classList.remove("show");
      }
      return true;
    }
  }

  function validateMessage(value, showError = true) {
    if (value.length < 10 && value) {
      if (showError) {
        messageError.textContent =
          "Message must be at least 10 characters long";
        messageError.classList.add("show");
      }
      return false;
    } else {
      if (showError) {
        messageError.classList.remove("show");
      }
      return true;
    }
  }

  nameInput.addEventListener("input", function () {
    if (nameInput.classList.contains("invalid")) {
      const isValid = validateName(this.value, true);
      if (isValid) {
        nameInput.classList.remove("invalid");
      }
    }
  });

  emailInput.addEventListener("input", function () {
    if (emailInput.classList.contains("invalid")) {
      const isValid = validateEmail(this.value, true);
      if (isValid) {
        emailInput.classList.remove("invalid");
      }
    }
  });

  messageInput.addEventListener("input", function () {
    if (messageInput.classList.contains("invalid")) {
      const isValid = validateMessage(this.value, true);
      if (isValid) {
        messageInput.classList.remove("invalid");
      }
    }
  });

  nameInput.addEventListener("blur", function () {
    const isValid = validateName(this.value, true);
    if (!isValid && this.value) {
      nameInput.classList.add("invalid");
    }
  });

  emailInput.addEventListener("blur", function () {
    const isValid = validateEmail(this.value, true);
    if (!isValid && this.value) {
      emailInput.classList.add("invalid");
    }
  });

  messageInput.addEventListener("blur", function () {
    const isValid = validateMessage(this.value, true);
    if (!isValid && this.value) {
      messageInput.classList.add("invalid");
    }
  });

  contactForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const nameValid = validateName(nameInput.value, true);
    const emailValid = validateEmail(emailInput.value, true);
    const messageValid = validateMessage(messageInput.value, true);

    if (nameValid && emailValid && messageValid) {
      alert("Message sent successfully!");
      contactForm.reset();
      nameInput.classList.remove("invalid");
      emailInput.classList.remove("invalid");
      messageInput.classList.remove("invalid");
    }
  });
}

window.removeBook = removeBook;

document.addEventListener("DOMContentLoaded", loadBooks);
