// Define an interface for the form data
interface PersonData {
  firstName: string;
  lastName: string;
  email: string;
  age: number;
}

// Initialize an empty array to store the form data
const formData: PersonData[] = [];

// Select the form and table elements from the DOM
const form = document.querySelector("#myForm") as HTMLFormElement;
const table = document.querySelector("#myTable") as HTMLTableElement;

// Add an event listener to the form for when it is submitted
form.addEventListener("submit", (event: Event) => {
  event.preventDefault();

  // Select the input fields from the form and get their values
  const firstNameInput = document.querySelector("#firstName") as HTMLInputElement;
  const firstName = firstNameInput.value.trim(); // Trim any leading/trailing whitespace
  const lastName = (document.querySelector("#lastName") as HTMLInputElement).value;
  const email = (document.querySelector("#email") as HTMLInputElement).value;
  const ageInput = (document.querySelector("#age") as HTMLInputElement);
  const age = parseInt(ageInput.value);

  // Define a regular expression pattern that matches only alphabetical characters
  const alphaPattern = /^[A-Za-z]+$/;

  // Validate the firstName input
  if (!alphaPattern.test(firstName)) {
    alert("First name must only contain letters");
    firstNameInput.focus();
    return;
  }

  // Validate the age input
  if (age < 1 || age > 100) {
    alert("Age must be between 1 and 100");
    ageInput.focus();
    return;
  }



  // Check if there is a selected row (for editing) and update its data if there is, otherwise create a new object with the form data and add it to the array
  const selectedRow = table.querySelector(".selected") as HTMLTableRowElement;
  if (selectedRow) {
    const index = selectedRow.rowIndex - 1;
    formData[index].firstName = firstName;
    formData[index].lastName = lastName;
    formData[index].email = email;
    formData[index].age = age;
    selectedRow.classList.remove("selected");
  } else {
    const newData: PersonData = {
      firstName,
      lastName,
      email,
      age,
    };
    formData.unshift(newData);
  }

  form.reset();

  updateTable();
});


form.addEventListener("reset", (event: Event) => {
  form.reset();
});



// Define a function to update the table with the current form data
function updateTable() {
  // Clear the current table data
  table.querySelector("tbody")!.innerHTML = "";

  // Create a new row for each set of form data and add it to the table
  formData.forEach((data, index) => {
    const row = table.querySelector("tbody")!.insertRow();
    row.insertCell().textContent = data.firstName;
    row.insertCell().textContent = data.lastName;
    row.insertCell().textContent = data.email;
    row.insertCell().textContent = String(data.age);

    // Add an edit button to the row
    const editButton = document.createElement("button");
    editButton.textContent = "Edit";
    editButton.addEventListener("click", () => {
      // Set the form input values to the selected row's data
      (document.querySelector("#firstName") as HTMLInputElement).value =
        data.firstName;
      (document.querySelector("#lastName") as HTMLInputElement).value =
        data.lastName;
      (document.querySelector("#email") as HTMLInputElement).value = data.email;
      (document.querySelector("#age") as HTMLInputElement).value = String(
        data.age
      );

      // Add a 'selected' class to the selected row
      table.querySelectorAll("tr").forEach((row) => {
        row.classList.remove("selected");
      });
      row.classList.add("selected");
    });
    row.insertCell().appendChild(editButton);

    // Add a delete button to the row
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.addEventListener("click", () => {
      // Show the modal dialog
      const modal = document.querySelector(".modal") as HTMLDivElement;
      modal.style.display = "block";

      // Add event listeners to the modal buttons
      const modalConfirm = document.querySelector(
        ".modal-confirm"
      ) as HTMLButtonElement;
      const modalCancel = document.querySelector(
        ".modal-cancel"
      ) as HTMLButtonElement;

      modalConfirm.addEventListener("click", () => {
        // Remove the row from the array and the table
        formData.splice(index, 1);
        row.remove();

        // Hide the modal dialog
        modal.style.display = "none";
      });

      modalCancel.addEventListener("click", () => {
        // Hide the modal dialog
        modal.style.display = "none";
      });
    });

    row.insertCell().appendChild(deleteButton);
  });
}
