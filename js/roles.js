/* Who can create an account.
   Students and employees have an ID; parents / guardians do not, so they get one automatically.
   Shared by register.js and profile.js. */
(function () {
  window.DEPARTMENTS = [
    "Registrar's Office / Administration", "Finance & Accounts", "Library", "Health Centre",
    "Maintenance & Works", "Security", "IT / Computer Centre", "Hostels & Welfare",
    "Canteen & Catering", "Other section"
  ];

  window.ROLES = {
    student:  { label: "Student",                    idLabel: "Student ID",  idPlaceholder: "e.g. SC/2022/12345",
                needsId: true,  needsYear: true,  needsFaculty: true, facultyLabel: "Faculty",              withDepartments: false },
    lecturer: { label: "Lecturer / Academic staff",  idLabel: "Employee ID", idPlaceholder: "e.g. EMP/1234",
                needsId: true,  needsYear: false, needsFaculty: true, facultyLabel: "Faculty",              withDepartments: false },
    admin:    { label: "Administrative staff",       idLabel: "Employee ID", idPlaceholder: "e.g. EMP/1234",
                needsId: true,  needsYear: false, needsFaculty: true, facultyLabel: "Faculty / Department", withDepartments: true  },
    staff:    { label: "Other campus staff",         idLabel: "Employee ID", idPlaceholder: "e.g. EMP/1234",
                needsId: true,  needsYear: false, needsFaculty: true, facultyLabel: "Faculty / Department", withDepartments: true  },
    parent:   { label: "Parent / Guardian",          idLabel: "Your ID",     idPlaceholder: "",
                needsId: false, needsYear: false, needsFaculty: false, facultyLabel: "Faculty",              withDepartments: false }
  };

  window.roleOf = function (user) { return window.ROLES[(user && user.role) || "student"] || window.ROLES.student; };

  /* <option> list for the faculty / department drop-down of a role */
  window.facultyOptions = function (roleKey, faculties, esc) {
    const role = window.ROLES[roleKey] || window.ROLES.student;
    const opt = (x) => "<option>" + esc(x) + "</option>";
    const first = '<option value="">Select ' + (role.withDepartments ? "faculty / department" : "faculty") + "</option>";
    if (!role.withDepartments) return first + faculties.map(opt).join("");
    return first +
      '<optgroup label="Faculties">' + faculties.map(opt).join("") + "</optgroup>" +
      '<optgroup label="Departments &amp; sections">' + window.DEPARTMENTS.map(opt).join("") + "</optgroup>";
  };

  /* automatic ID for people who do not have one (parents / guardians) */
  window.makeGuestId = function (existing) {
    let id;
    do { id = "PAR-" + Math.random().toString(36).slice(2, 8).toUpperCase(); }
    while (existing.indexOf(id) !== -1);
    return id;
  };
})();
