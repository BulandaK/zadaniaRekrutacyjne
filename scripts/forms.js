const renderTd = (tdText) => {
  let td = document.createElement("td");
  td.textContent = tdText;
  return td;
};
const renderTable = () => {
  const tbody = document.body.querySelector("tbody");
  tbody.innerHTML = "";
  let books = localStorage.getItem("booksList");
  console.log(books);
  if (books != null) {
    books = JSON.parse(books);
    books.forEach((book) => {
      let tr = document.createElement("tr");
      let properties = [book.title, book.author, book.priority, book.category];
      properties.forEach((property) => {
        let td = renderTd(property);
        tr.appendChild(td);
      });
      tbody.appendChild(tr);
    });
  }
};
renderTable();

let bookToAdd = {
  title: null,
  author: null,
  priority: null,
  category: null,
};

const form = document.querySelector("#form");
form.addEventListener("change", (evt) => {
  const inputName = evt.target.name;
  const valueOfInput = evt.target.value;
  bookToAdd[inputName] = valueOfInput;
});

const addMistake = (mistakeMessage, mistakesContainer) => {
  let p = document.createElement("p");
  p.textContent = mistakeMessage;
  mistakesContainer.appendChild(p);
};

const validateInputs = () => {
  let mistakes = document.querySelector(".mistakes");
  mistakes.innerHTML = "";
  let canSendToStorage = true;

  if (bookToAdd.title == null || bookToAdd.title.length < 1) {
    addMistake("tytuł posiada mniej niż 1 znak", mistakes);
    canSendToStorage = false;
  }
  if (bookToAdd.author == null || bookToAdd.author.length < 3) {
    addMistake("autor składa się z mniej niż 3 znaków", mistakes);
    canSendToStorage = false;
  }
  if (
    bookToAdd.priority == null ||
    bookToAdd.priority < 1 ||
    bookToAdd.priority > 5
  ) {
    addMistake("liczby mogą być od 1 do 5 w priorytecie czytania", mistakes);
    canSendToStorage = false;
  }
  return canSendToStorage;
};

const submit = document.querySelector("#btn");
submit.addEventListener("click", async function (evt) {
  evt.preventDefault();
  bookToAdd.category = document.querySelector("#category").value;

  let canPutToLibrary = validateInputs();
  if (canPutToLibrary) {
    let booksFromStorage = await localStorage.getItem("booksList");
    if (booksFromStorage != null) {
      let array = JSON.parse(booksFromStorage);
      array.unshift(bookToAdd);
      await localStorage.setItem("booksList", JSON.stringify(array));
      form.reset();
      renderTable();
    } else {
      form.reset();
      let allBooks = [bookToAdd];
      await localStorage.setItem("booksList", JSON.stringify(allBooks));
    }
  }
  renderTable();
});
