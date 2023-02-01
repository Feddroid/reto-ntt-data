const container = document.querySelector("tbody");
const url = "https://randomuser.me/api/?results=15";
const btnSort = document.querySelectorAll(".sortButton");
let resultsJson = [];
let sortAsc = true;

// Función para listar los datos en la tabla
const showData = (datas, sortField) => {
  resultsJson = datas;
  sortAsc = !sortAsc;

  // Objeto con funciones de ordenamiento
  const sortFunctions = {
    sortAge: (a, b) =>
      sortAsc ? a.dob.age - b.dob.age : b.dob.age - a.dob.age,
    sortName: (a, b) =>
      sortAsc
        ? a.name.first.localeCompare(b.name.first)
        : b.name.first.localeCompare(a.name.first),
    sortLast: (a, b) =>
      sortAsc
        ? a.name.last.localeCompare(b.name.last)
        : b.name.last.localeCompare(a.name.last),
    sortGender: (a, b) =>
      sortAsc
        ? a.gender.localeCompare(b.gender)
        : b.gender.localeCompare(a.gender),
    sortEmail: (a, b) =>
      sortAsc ? a.email.localeCompare(b.email) : b.email.localeCompare(a.email),
    sortNationality: (a, b) =>
      sortAsc ? a.nat.localeCompare(b.nat) : b.nat.localeCompare(a.nat),
  };

  // Ordenando los datos de acuerdo al campo especificado
  const sortedData = datas.sort(sortFunctions[sortField] || ((a, b) => 0));

  // Creando filas a partir de los datos
  const results = sortedData
    .map((data) => {
      return `<tr>
                <td>${data.name.first}</td>
                <td>${data.name.last}</td>
                <td>${data.dob.age}</td>
                <td>${data.gender}</td>
                <td>${data.email}</td>
                <td>${data.nat}</td>
                <td><img src="${data.picture.thumbnail}" alt="User's picture" class="rounded-circle" /></td>
              </tr>`;
    })
    .join("");

  // Actualiza el contenido de la tabla
  container.innerHTML = results;
};

// Función asíncrona para obtener los datos de la API
async function getData() {
  try {
    const response = await fetch(url);
    const responseJson = await response.json();
    showData(responseJson.results, "sortAge");
  } catch (error) {
    console.error(error);
  }
}

// Agregando listener al evento click en cada botón
btnSort.forEach((button) => {
  button.addEventListener("click", function () {
    this.classList.toggle("sortArrow");
    showData(resultsJson, this.classList[1]);

    const sortItem = this.closest(".sortItem");
    const allSortItems = document.querySelectorAll(".sortItem");
    allSortItems.forEach((item) => {
      item.classList.remove("active");
    });
    sortItem.classList.add("active");
  });
});

// Código para descargar en formato CSV
const downloadButton = document.querySelector("#download-csv");
downloadButton.addEventListener("click", function () {
  const tableData = [];
  const tableRows = container.rows;
  for (let i = 0; i < tableRows.length; i++) {
    const rowData = [];
    for (let j = 0; j < tableRows[i].cells.length; j++) {
      let cellData = tableRows[i].cells[j].innerHTML;
      if (j === tableRows[i].cells.length - 1) {
        const image = tableRows[i].cells[j].querySelector("img");
        cellData = image.src;
      }
      rowData.push(cellData);
    }
    tableData.push(rowData);
  }

  const csv = tableData
    .map(function (row) {
      return row.join(",");
    })
    .join("\n");

  const timestamp = Date.now();

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  saveAs(blob, `table-data-${timestamp}.csv`);
});

getData();
