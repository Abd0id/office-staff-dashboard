const myForm = document.getElementById("my-form");
const employeePhotoUrl = document.getElementById("url");

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

let data = getData();
const employees = data.employees;

function renderForm(isRender, employeeId = null) {
  const formBlur = document.getElementById("form-blur");
  if (isRender) {
    formBlur.classList.remove("hidden");
    formBlur.classList.add("flex");

    if (employeeId) {
      const employee = employees.find((emp) => emp.id == employeeId);
      if (employee) {
        document.getElementById("url").value = employee.photo || "";
        document.getElementById("name").value = employee.name;
        document.getElementById("email").value = employee.email;
        document.getElementById("phone").value = employee.phone;
        document.getElementById("role").value = employee.role;
        document.getElementById("employee-preview").src =
          employee.photo || "public/Portrait_Placeholder.png";

        const expContainer = document.getElementById("exp");
        const existingExperiences =
          expContainer.querySelectorAll(".experience");
        existingExperiences.forEach((exp) => exp.remove());

        if (employee.experiences && employee.experiences.length > 0) {
          employee.experiences.forEach((experience) => {
            renderExperienceForm();

            const experienceForms =
              expContainer.querySelectorAll(".experience");
            const lastForm = experienceForms[experienceForms.length - 1];

            lastForm.querySelector(".company").value = experience.company || "";
            lastForm.querySelector(".old-role").value =
              experience.oldRole || "";
            lastForm.querySelector(".from").value = experience.fromDate || "";
            lastForm.querySelector(".to").value = experience.toDate || "";
          });
        }

        myForm.dataset.editingId = employeeId;
      }
    } else {
      myForm.reset();
      document.getElementById("employee-preview").src =
        "public/Portrait_Placeholder.png";

      const expContainer = document.getElementById("exp");
      const existingExperiences = expContainer.querySelectorAll(".experience");
      existingExperiences.forEach((exp) => exp.remove());

      delete myForm.dataset.editingId;
    }
  } else {
    formBlur.classList.add("hidden");
    myForm.reset();

    const expContainer = document.getElementById("exp");
    const existingExperiences = expContainer.querySelectorAll(".experience");
    existingExperiences.forEach((exp) => exp.remove());

    delete myForm.dataset.editingId;
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
  assigned = null,
  experiences = null
) {
  if (id) {
    employees.forEach((employee) => {
      if (employee.id == id) {
        employee.photo = photoUrl;
        employee.name = name;
        employee.email = email;
        employee.phone = phone;
        employee.role = role;
        employee.assigned = assigned;
        employee.experiences = experiences;
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
      assigned: assigned,
      experiences: experiences,
    };
    employees.push(newEmployee);
  }
  data.employees = employees;
  saveDataToLocalstorage(data);
  renderEmployeeList();
}

function formValidation(event) {
  event.preventDefault();

  const employeeOldCompany = document.querySelectorAll(".company");
  const companyError = document.querySelectorAll(".company-error");

  const employeeOldRole = document.querySelectorAll(".old-role");
  const oldRoleError = document.querySelectorAll(".old-role-error");

  const employeeFromDate = document.querySelectorAll(".from");
  const fromError = document.querySelectorAll(".from-error");

  const employeeToDate = document.querySelectorAll(".to");
  const toError = document.querySelectorAll(".to-error");

  const employeeName = document.getElementById("name");
  const nameError = document.getElementById("name-error");
  const nameRegex = /^[A-Za-zÀ-ÿ' -]{2,50}/;

  const employeeEmail = document.getElementById("email");
  const emailError = document.getElementById("email-error");
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const employeePhone = document.getElementById("phone");
  const phoneError = document.getElementById("phone-error");
  const phoneRegex = /^[+]\d{1,3}\s\d{3}[-]\d{4,6}/;

  const employeeExperiences = document.querySelectorAll(".experience");

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

  let experiences = [];

  if (employeeExperiences.length > 0) {
    employeeExperiences.forEach((exp, i) => {
      const comp = employeeOldCompany[i];
      const compErr = companyError[i];

      const role = employeeOldRole[i];
      const roleErr = oldRoleError[i];

      const from = employeeFromDate[i];
      const fromErr = fromError[i];

      const to = employeeToDate[i];
      const toErr = toError[i];

      if (!comp.value.match(nameRegex)) {
        compErr.classList.remove("hidden");
        valid = false;
      } else {
        compErr.classList.add("hidden");
      }

      if (!role.value.match(nameRegex)) {
        roleErr.classList.remove("hidden");
        valid = false;
      } else {
        roleErr.classList.add("hidden");
      }

      if (!from.value || !to.value || from.value > to.value) {
        fromErr.classList.remove("hidden");
        toErr.classList.remove("hidden");
        valid = false;
      } else {
        fromErr.classList.add("hidden");
        toErr.classList.add("hidden");
      }

      experiences.push({
        company: comp.value,
        oldRole: role.value,
        fromDate: from.value,
        toDate: to.value,
      });
    });
  }

  const employeeRole = document.getElementById("role");

  if (valid) {
    const editingId = myForm.dataset.editingId;

    if (editingId) {
      const employee = employees.find((emp) => emp.id == editingId);

      saveData(
        editingId,
        employeePhotoUrl.value,
        employeeName.value,
        employeeEmail.value,
        employeePhone.value,
        employeeRole.value,
        employee.assigned,
        experiences.length > 0 ? experiences : employee.experiences
      );

      renderForm(false);

      if (employee.assigned) {
        renderAssignedEmployees(employee.assigned);
      }
    } else {
      let myID = generateId(employeePhone.value, employeeEmail.value);

      for (const emp of employees) {
        if (emp.id === myID) {
          alert("User already exists!");
          return;
        }
      }

      saveData(
        null,
        employeePhotoUrl.value,
        employeeName.value,
        employeeEmail.value,
        employeePhone.value,
        employeeRole.value,
        null,
        experiences
      );

      renderForm(false);
    }
  }
}

function renderEmployeeList() {
  const sideBar = document.getElementById("side-bar");
  sideBar.innerHTML = "";
  employees.forEach((employee) => {
    if (!employee.assigned) {
      const employeeCard = document.createElement("div");
      employeeCard.id = employee.id;
      employeeCard.className =
        "bg-gray-100 dark:bg-gray-900 transition-all duration-500 h-35 lg:w-65 rounded-2xl m-5 flex flex-col justify-center items-center shadow-lg relative";
      employeeCard.draggable = true;

      employeeCard.innerHTML = `
            <button
            class="edit-btn absolute top-0 right-0 m-2 text-blue-500 hover:text-blue-700 transition-colors ease-in-out duration-150"
            data-id="${employee.id}"
            >
            Edit
            </button>
            <img
            src="${
              employee.photo
                ? employee.photo
                : "public/Portrait_Placeholder.png"
            }"
            class="rounded-full h-20 w-20"
            />
            <h3 class="employee-name text-center cursor-pointer hover:text-blue-500 transition-colors" data-id="${
              employee.id
            }">${employee.name}</h3>
            <span class="text-sm">${employee.role}</span>
            `;

      sideBar.appendChild(employeeCard);
    }
  });

  document.querySelectorAll(".edit-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const employeeId = e.target.dataset.id;
      renderForm(true, employeeId);
    });
  });

  document.querySelectorAll(".employee-name").forEach((name) => {
    name.addEventListener("click", (e) => {
      const employeeId = e.target.dataset.id;
      showEmployeeDetails(employeeId);
    });
  });
}

function renderExperienceForm() {
  let expForm = document.getElementById("exp");
  expForm.insertAdjacentHTML(
    "beforeend",
    `
       <div
    class="experience w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
  >
    <label
      for="company"
      class="block text-sm font-medium text-gray-700 dark:text-white mb-2"
      >Entreprise
      <span class="text-red-500">*</span>
    </label>
    <input
      type="text"
      id=""
      class="company w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
    <p id="" class="company-error text-red-500 text-sm mt-1 hidden">
      La company est invalid!
    </p>
    <label
      for="old-role"
      class="block text-sm font-medium text-gray-700 dark:text-white mb-2"
      >Rôle
      <span class="text-red-500">*</span>
    </label>
    <input
      type="text"
      id=""
      class="old-role w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
    <p id="" class="old-role-error text-red-500 text-sm mt-1 hidden">
      Le role est invalid!
    </p>
    <label
      for="from"
      class="block text-sm font-medium text-gray-700 dark:text-white mb-2"
      >Depuis
      <span class="text-red-500">*</span>
    </label>
    <input
      type="date"
      id=""
      class="from w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
    <p id="" class="from-error text-red-500 text-sm mt-1 hidden">
      La date est invalid!
    </p>
    <label
      for="to"
      class="block text-sm font-medium text-gray-700 dark:text-white mb-2"
      >à
      <span class="text-red-500">*</span>
    </label>
    <input
      type="date"
      id=""
      class="to w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
    <p id="" class="to-error text-red-500 text-sm mt-1 hidden">
      La date est invalid!
    </p>
  </div>
`
  );
}

function renderZoneAssignWindow(isRender) {
  const zoneBlur = document.getElementById("zone-blur");
  const zoneWindow = document.getElementById("zone-window");
  if (isRender) {
    zoneBlur.classList.remove("hidden");
    zoneBlur.classList.add("flex");
    renderEmployeeFiltredList();

    zoneWindow.classList.add("animate-scale");
    zoneBlur.classList.add("animate-opacity");
  } else {
    zoneBlur.classList.add("hidden");
  }
}

function renderEmployeeFiltredList() {
  const employeeList = document.getElementById("employee-list");

  employeeList.innerHTML = "";
  employees.forEach((employee) => {
    if (!employee.assigned) {
      employeeList.innerHTML += `
            <div
            id="${employee.id}"
            role="${employee.role}"
            class="employee-card bg-gray-100 dark:bg-gray-900 transition-all duration-500 h-35 lg:w-65 rounded-2xl flex flex-col justify-center items-center shadow-lg relative"
            draggable="true"
            >
            <img
            src="${
              employee.photo
                ? employee.photo
                : "public/Portrait_Placeholder.png"
            }"

            class="rounded-full h-20 w-20"
            />
            <h3 class="text-center">${employee.name}</h3>
            <span class="text-sm">${employee.role}</span>
            </div>
            `;
    }
  });
  const closeZoneWindowBtn = document.getElementById("close-zone-window");
  closeZoneWindowBtn.addEventListener("click", () => {
    renderZoneAssignWindow(false);
  });
}

function addEmployeeToZone(room, roomAccess) {
  const employeeCards = document.querySelectorAll(".employee-card");
  employeeCards.forEach((card) => {
    card.addEventListener("click", () => {
      if (
        roomAccess == card.getAttribute("role") ||
        roomAccess == "All" ||
        card.role == "Manager" ||
        (roomAccess == "Allbut" && card.role != "Nettoyage")
      ) {
        assignEmployee(card.id, room);
      } else alert("No Access");
    });
  });
}

function assignEmployee(employeeId, room) {
  employees.forEach((employee) => {
    if (employee.id == employeeId) {
      employee.assigned = room;
    }
  });
  data.employees = employees;
  saveDataToLocalstorage(data);
  renderEmployeeFiltredList();
  renderEmployeeList();
  renderAssignedEmployees(room);
}

function unassignEmployee(employeeId) {
  let employeeRoom = null;
  employees.forEach((employee) => {
    if (employee.id == employeeId) {
      employeeRoom = employee.assigned;
      employee.assigned = null;
    }
  });
  data.employees = employees;
  saveDataToLocalstorage(data);
  renderEmployeeList();
  if (employeeRoom) {
    renderAssignedEmployees(employeeRoom);
  }
}

function renderAssignedEmployees(currentRoom) {
  const plusBtn = document.querySelectorAll(".plus-btn");

  plusBtn.forEach((button) => {
    const myRoom = button.getAttribute("room");
    if (myRoom == currentRoom) {
      let employeeContainer =
        button.parentElement.querySelector(".employee-zone");

      if (employeeContainer) {
        employeeContainer.innerHTML = "";
      }

      employees.forEach((employee) => {
        if (employee.assigned == currentRoom) {
          button.classList.remove("animate-ping");

          if (employeeContainer) {
            const employeeCard = document.createElement("div");
            employeeCard.id = employee.id;
            employeeCard.setAttribute("role", employee.role);
            employeeCard.className =
              "employee-card bg-gray-100 dark:bg-gray-900 transition-all duration-500 h-35 w-32 rounded-2xl flex flex-col justify-center items-center shadow-lg relative p-2";
            employeeCard.draggable = true;

            employeeCard.innerHTML = `
                        <span class="remove-employee absolute top-0 right-0 m-1 hover:text-red-500 transition-colors ease-in-out duration-150 cursor-pointer" data-id="${
                          employee.id
                        }">
                        🗙️️
                        </span>
                        <img
                        src="${
                          employee.photo
                            ? employee.photo
                            : "public/Portrait_Placeholder.png"
                        }"
                        class="rounded-full h-16 w-16"
                        />
                        <h3 class="employee-name text-center text-xs cursor-pointer hover:text-blue-500 transition-colors" data-id="${
                          employee.id
                        }">${employee.name}</h3>
                        <span class="text-xs">${employee.role}</span>
                        `;

            employeeContainer.appendChild(employeeCard);
          }
        }
      });

      const removeButtons =
        employeeContainer.querySelectorAll(".remove-employee");

      for (let i = 0; i < removeButtons.length; i++) {
        removeButtons[i].addEventListener("click", function (event) {
          event.stopPropagation();
          const employeeId = removeButtons[i].dataset.id;
          unassignEmployee(employeeId);
        });
      }

      const employeeNames =
        employeeContainer.querySelectorAll(".employee-name");

      for (let i = 0; i < employeeNames.length; i++) {
        employeeNames[i].addEventListener("click", function (event) {
          event.stopPropagation();
          const employeeId = employeeNames[i].dataset.id;
          showEmployeeDetails(employeeId);
        });
      }
    }
  });
}

function showEmployeeDetails(employeeId) {
  const employee = employees.find((emp) => emp.id == employeeId);
  if (!employee) return;

  const detailBlur = document.getElementById("employee-detail-blur");
  const detailContent = document.getElementById("employee-detail-content");

  let html = `
    <div class="flex flex-col items-center gap-3">
      <img src="${
        employee.photo ? employee.photo : "public/Portrait_Placeholder.png"
      }" 
           class="rounded-full h-32 w-32" 
           alt="${employee.name}" />
      <h3 class="text-2xl font-semibold">${employee.name}</h3>
      <span class="px-3 py-1 text-sm">${employee.role}</span>
    </div>

    <div class="bg-blue-300 dark:bg-gray-700 p-4 rounded-lg">
      <h4 class="font-semibold text-lg mb-2">Informations de contact</h4>
      <div class="space-y-2">
        <p><span class="font-medium">Email:</span> ${employee.email}</p>
        <p><span class="font-medium">Téléphone:</span> ${employee.phone}</p>
      </div>
    </div>
  `;

  html += `
    <div class="bg-blue-300 dark:bg-gray-700 p-4 rounded-lg">
      <h4 class="font-semibold text-lg mb-2">Affectation</h4>
  `;

  if (employee.assigned) {
    html += `<p><span class="font-medium">Zone assignée:</span> ${employee.assigned}</p>`;
  } else {
    html += `<p class="text-center">Aucune zone assignée</p>`;
  }

  html += `</div>`;

  if (employee.experiences && employee.experiences.length > 0) {
    html += `
      <div class="bg-blue-300 dark:bg-gray-700 p-4 rounded-lg">
        <h4 class="font-semibold text-lg mb-3">Expériences professionnelles</h4>
        <div class="space-y-3">
    `;

    for (let exp of employee.experiences) {
      html += `
      <div class="border-l-4 border-blue-500 pl-3">
        <p class="font-semibold">${exp.oldRole}</p>
        <p class="text-sm">${exp.company}</p>
        <p class="text-xs text-gray-600 dark:text-gray-400">${exp.fromDate} - ${exp.toDate}</p>
      </div>
    `;
    }

    html += `</div></div>`;
  } else {
    html += `
      <div class="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
        <p class="text-center text-gray-600 dark:text-gray-400">Aucune expérience enregistrée</p>
      </div>
    `;
  }

  detailContent.innerHTML = html;
  detailBlur.classList.remove("hidden");
  detailBlur.classList.add("flex");
}

function closeEmployeeDetails() {
  const detailBlur = document.getElementById("employee-detail-blur");
  detailBlur.classList.add("hidden");
  detailBlur.classList.remove("flex");
}

function initApp() {
  const addEmployee = document.getElementById("add-employee");
  const addExperience = document.getElementById("add-experience");
  const cancelBtn = document.getElementById("cancel-btn");
  const plusBtn = document.querySelectorAll(".plus-btn");
  const employeePreview = document.getElementById("employee-preview");
  const closeDetailBtn = document.getElementById("close-detail-window");
  const mobileBtn = document.getElementById("mobile-button");

  renderEmployeeList();

  addEmployee.addEventListener("click", () => {
    renderForm(true);
  });

  myForm.addEventListener("submit", formValidation);

  cancelBtn.addEventListener("click", () => {
    renderForm(false);
  });

  closeDetailBtn.addEventListener("click", closeEmployeeDetails);

  employeePhotoUrl.addEventListener("input", () => {
    if (employeePhotoUrl.value) {
      employeePreview.src = employeePhotoUrl.value;
    } else {
      employeePreview.src = "public/Portrait_Placeholder.png";
    }
  });

  addExperience.addEventListener("click", renderExperienceForm);

  plusBtn.forEach((button) => {
    const currentRoom = button.getAttribute("room");
    button.addEventListener("click", () => {
      const currentRoomAccess = button.getAttribute("room-access");
      renderZoneAssignWindow(true);
      addEmployeeToZone(currentRoom, currentRoomAccess);
    });
    renderAssignedEmployees(currentRoom);
  });

  mobileBtn.addEventListener("click", () => {
    document.getElementById("adding-zone").classList.toggle("hidden");
  });
}

initApp();
