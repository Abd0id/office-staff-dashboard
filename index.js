const myForm = document.getElementById("my-form");

const STORAGEKEY = "data";

function getData() {
  if (!localStorage.getItem(STORAGEKEY)) {
    return { employees: [] };
  } else {
    return JSON.parse(localStorage.getItem(STORAGEKEY));
  }
}

function saveDataToLocalstorage(data) {
  localStorage.setItem(STORAGEKEY, JSON.stringify(data));
}

function renderForm(isRender) {
  const formBlur = document.getElementById("form-blur");
  if (isRender) {
    formBlur.classList.remove("hidden");
    formBlur.classList.add("flex");

    setTimeout(() => {
      myForm.classList.replace("scale-5", "scale-100");
    }, 10);
  } else {
    formBlur.classList.add("hidden");
    myForm.classList.replace("scale-100", "scale-5");
  }
}

function generateId(a, b) {
  return a + b;
}

function saveData(
  id = null,
  photoUrl,
  name,
  email,
  phone,
  role,
  company,
  oldRole,
  fromDate,
  toDate
) {
  let data = getData();
  let employeesData = data.employees;

  if (id) {
    employeesData.forEach((employee) => {
      if (employee.id == id) {
        employee.photo = photoUrl;
        employee.name = name;
        employee.email = email;
        employee.phone = phone;
        employee.role = role;
        employee.company = company;
        employee.oldRole = oldRole;
        employee.fromDate = fromDate;
        employee.toDate = toDate;
      }
    });
  } else {
    let newEmployee = {
      id: generateId(phone, email),
      photo: photoUrl,
      name: name,
      email: email,
      phone: phone,
      role: role,
      company: company,
      oldRole: oldRole,
      fromDate: fromDate,
      toDate: toDate,
    };
    employeesData.push(newEmployee);
  }
  data.employees = employeesData;
  saveDataToLocalstorage(data);
  console.log(data);
  renderEmployee();
}

function renderEmployee() {
  const sideBar = document.getElementById("side-bar");
  const data = getData();
  const employees = data.employees;

  sideBar.innerHTML = "";
  employees.forEach((employee) => {
    sideBar.innerHTML += `
      <div
        id="${employee.id}"
        class="bg-gray-100 dark:bg-gray-900 transition-all duration-500 h-35 lg:w-65 rounded-2xl m-5 flex flex-col justify-center items-center shadow-lg relative"
      >
        <button
          class="absolute top-0 right-0 m-2 text-blue-500 hover:text-blue-700 transition-colors ease-in-out duration-150"
        >
          Edit
        </button>
        <img
          src="${
            employee.photo ? employee.photo : "public/Portrait_Placeholder.png"
          }"
          
          class="rounded-full h-20 w-20"
        />
        <h3 class="text-center">${employee.name}</h3>
        <span class="text-sm">${employee.role}</span>
      </div>
    `;
  });
}

function formValidation(event) {
  event.preventDefault();

  const employeeOldCompany = document.getElementById("company");
  const employeeOldRole = document.getElementById("old-role");
  const employeeFromDate = document.getElementById("from");
  const employeeToDate = document.getElementById("to");

  const employeeName = document.getElementById("name");
  const nameError = document.getElementById("name-error");
  const nameRegex = /^[A-Za-zÀ-ÿ' -]{2,50}/;

  const employeeEmail = document.getElementById("email");
  const emailError = document.getElementById("email-error");
  const emailRegex = /^[^\s@]+@[^\s@]+.[^\s@]+$/;

  const employeePhone = document.getElementById("phone");
  const phoneError = document.getElementById("phone-error");
  const phoneRegex = /^[+]\d{1,3}\s\d{3}[-]\d{4,6}/;

  let valid = true;

  if (!employeeName.value.match(nameRegex)) {
    nameError.classList.remove("hidden");
    valid = false;
  } else {
    nameError.classList.add("hidden");
  }

  if (!employeeEmail.value.match(emailRegex)) {
    emailError.classList.remove("hidden");
    valid = false;
  } else {
    emailError.classList.add("hidden");
  }
  if (!employeePhone.value.match(phoneRegex)) {
    phoneError.classList.remove("hidden");
    valid = false;
  } else {
    phoneError.classList.add("hidden");
  }

  const employeePreview = document.getElementById("employee-preview");
  const employeePhotoUrl = document.getElementById("url");
  const employeeRole = document.getElementById("role");

  employeePhotoUrl.addEventListener("input", () => {
    if (employeePhotoUrl.value) {
      employeePreview.src = employeePhotoUrl.value;
    } else {
      employeePreview.src = "public/Portrait_Placeholder.png";
    }
  });

  if (valid) {
    let myID = generateId(employeePhone.value, employeeEmail.value);
    let data = getData();
    const employees = data.employees;

    for (const emp of employees) {
      if (emp.id === myID) {
        alert("User already exists!");
        return;
      }
    }

    renderForm(false);
    saveData(
      null,
      employeePhotoUrl.value,
      employeeName.value,
      employeeEmail.value,
      employeePhone.value,
      employeeRole.value,
      employeeOldCompany.value,
      employeeOldRole.value,
      employeeFromDate.value,
      employeeToDate.value
    );
  }
}

function renderExperienceForm() {
  let expForm = document.getElementById("exp");
  expForm.innerHTML += `
              <div
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <label
                for="company"
                class="block text-sm font-medium text-gray-700 dark:text-white mb-2"
                >Entreprise
                <span class="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="company"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <label
                for="old-role"
                class="block text-sm font-medium text-gray-700 dark:text-white mb-2"
                >Rôle
                <span class="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="old-role"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <label
                for="from"
                class="block text-sm font-medium text-gray-700 dark:text-white mb-2"
                >Depuis
                <span class="text-red-500">*</span>
              </label>
              <input
                type="date"
                id="from"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <label
                for="to"
                class="block text-sm font-medium text-gray-700 dark:text-white mb-2"
                >à
                <span class="text-red-500">*</span>
              </label>
              <input
                type="date"
                id="to"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>`;
}

function initApp() {
  const addEmployee = document.getElementById("add-employee");
  const addExperience = document.getElementById("add-experience");
  const cancelBtn = document.getElementById("cancel-btn");
  renderEmployee();

  addEmployee.addEventListener("click", () => {
    renderForm(true);
  });

  myForm.addEventListener("submit", formValidation);
  cancelBtn.addEventListener("click", () => {
    renderForm(false);
  });
  addExperience.addEventListener("click", renderExperienceForm);
}

initApp();
