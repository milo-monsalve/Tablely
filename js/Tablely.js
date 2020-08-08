function Tablely({elementId, data, inputs = [5, 10, 15, 20], numberColumns = []}) {
    this.boxElement = document.getElementById(elementId);
    this.headers = Object.keys(data[0]);
    this.totalRowsToShow = data.length;
    this.indexOfRowsToDisplay = [];
    this.rowsPerPage = 5;
    this.currentPage = [0, 1];
    this.pagesNumber = Math.ceil((this.indexOfRowsToDisplay.length > 0 ? this.indexOfRowsToDisplay.length : this.totalRowsToShow) / this.rowsPerPage);


    createTable = () => {
        let table = document.createElement('table');
        table.setAttribute('id', 'tablely_table_' + elementId)
        return table;
    }

    this.clearTableBody = () => {
        tbody = document.getElementById('tablely_tbody_' + elementId);
        deleteRows(tbody);
    }

    deleteRows = (tableBody) => {
        tableBody.querySelectorAll('*').forEach(row => row.remove());
    }

    getCellInfo = (cell) => {
        let cellInfo = {}
        let row = cell.target.parentElement.cells
        cellInfo.rowData = []
        cellInfo.column = cell.target.cellIndex
        cellInfo.row = cell.target.parentElement.rowIndex
        cellInfo.colValue = numberColumns.indexOf(this.headers[cell.target.cellIndex]) > -1 ? Number(cell.target.textContent.toString().replace(/,/g, '')) : cell.target.textContent;
        for (let i = 0; i < row.length; i++)
            cellInfo.rowData.push(numberColumns.indexOf(this.headers[i]) > -1 ? Number(row[i].textContent.toString().replace(/,/g, '')) : row[i].textContent)
        return cellInfo
    }

    createTableBodyPage = (page) => {
        let tbody
        if (document.body.contains(document.getElementById('tablely_tbody_' + elementId))) {
            tbody = document.getElementById('tablely_tbody_' + elementId);
            deleteRows(tbody);
        } else {
            tbody = document.createElement('tbody');
            tbody.setAttribute('id', 'tablely_tbody_' + elementId)
            tbody.addEventListener('click', event => {
                
                tbody.dispatchEvent(new CustomEvent("row-click", {
                    bubbles: true,
                    detail: getCellInfo(event)
                }))
            })
        }

        let showRowsSince = this.rowsPerPage * (page - 1);
        let showRowsUntil = this.rowsPerPage * page;
        if (this.indexOfRowsToDisplay.length == 0)
            for (let i = showRowsSince; i < showRowsUntil; i++) {
                if (i < this.totalRowsToShow) {
                    let tbody_row = document.createElement('tr');
                    let tr_data = Object.values(data[i]);

                    for (let j = 0; j < tr_data.length; j++) {
                        let tbody_td = document.createElement('td');
                        tbody_td.innerText = tr_data[j];
                        tbody_row.appendChild(tbody_td);
                    }

                    tbody.appendChild(tbody_row);
                }
            }
        else
            for (let i = showRowsSince; i < showRowsUntil; i++) {
                if (i < this.indexOfRowsToDisplay.length) {
                    let tbody_row = document.createElement('tr');
                    let tr_data = Object.values(data[this.indexOfRowsToDisplay[i]]);

                    for (let j = 0; j < tr_data.length; j++) {
                        let tbody_td = document.createElement('td');
                        tbody_td.innerText = tr_data[j];
                        tbody_row.appendChild(tbody_td);
                    }

                    tbody.appendChild(tbody_row);
                } else
                    break;
            }

        return tbody
    }

    sortTableByColumn = (column, type) => {

        if (this.indexOfRowsToDisplay.length == 0)
            switch (type) {
                case 'row-down':
                    data.sort((a, b) => {
                        if (a[column] < b[column]) {
                            return -1;
                        }
                        if (a[column] > b[column]) {
                            return 1;
                        }
                        return 0;
                    });
                    break;
                case 'row-up':
                    data.sort((a, b) => {
                        if (a[column] > b[column]) {
                            return -1;
                        }
                        if (a[column] < b[column]) {
                            return 1;
                        }
                        return 0;
                    })
                    break;
                default:
                    break;
            }
        else
            switch (type) {
                case 'row-down':
                    this.indexOfRowsToDisplay.sort((a, b) => {
                        if (data[a][column] < data[b][column]) {
                            return -1;
                        }
                        if (data[a][column] > data[b][column]) {
                            return 1;
                        }
                        return 0;
                    })
                    break;
                case 'row-up':
                    this.indexOfRowsToDisplay.sort((a, b) => {
                        if (data[a][column] > data[b][column]) {
                            return -1;
                        }
                        if (data[a][column] < data[b][column]) {
                            return 1;
                        }
                        return 0;
                    })
                    break;
                default:
                    break;
            }

        createTableBodyPage(this.currentPage[1]);
        this.changePageInfoText();
    }

    createHeader = () => {
        let thead = document.createElement('thead');
        thead.setAttribute('id', 'tablely_thead_' + elementId)
        let thead_row = document.createElement('tr');
        for (let i = 0; i < this.headers.length; i++) {
            let thead_td = document.createElement('td');
            thead_td.addEventListener('click', e => {
                new Promise((resolve, reject) => {
                    if (event.target.classList.contains('row-up')) {
                        event.target.classList.remove('row-up')
                        event.target.classList.add('row-down')
                    } else if (event.target.classList.contains('row-down')) {
                        event.target.classList.remove('row-down')
                        event.target.classList.add('row-up')
                    } else {
                        event.target.classList.add('row-down')
                    }
                    resolve(event.target.className)
                }).then(res => {
                    sortTableByColumn(this.headers[e.target.cellIndex], res);
                })
            })
            thead_td.innerText = this.headers[i];
            thead_row.appendChild(thead_td);
        }

        thead.appendChild(thead_row);

        return thead
    }

    createInputsSelect = () => {
        let inputs_select = document.createElement('select');
        inputs_select.setAttribute('id', 'tablely_inputs_select_' + elementId);
        inputs_select.addEventListener('change', e => {
            this.rowsPerPage = Number(e.target.value);
            this.pagesNumber = Math.ceil((this.indexOfRowsToDisplay.length > 0 ? this.indexOfRowsToDisplay.length : this.totalRowsToShow) / this.rowsPerPage);
            createTableBodyPage(this.currentPage[1]);
            this.changePageInfoText();
        })

        for (let i in inputs) {
            let optionSelect = document.createElement('option');
            optionSelect.textContent = inputs[i];
            inputs_select.appendChild(optionSelect)
        }

        return inputs_select
    }

    disableOrEnableButtons = () => {
        if (this.currentPage[1] == 1)
            document.getElementById('tablely_btn_previous_' + elementId).setAttribute('disabled', true);
        else
            document.getElementById('tablely_btn_previous_' + elementId).removeAttribute('disabled');

        if (this.currentPage[1] == this.pagesNumber)
            document.getElementById('tablely_btn_next_' + elementId).setAttribute('disabled', true);
        else
            document.getElementById('tablely_btn_next_' + elementId).removeAttribute('disabled');
    }

    clickPreviousPage = () => {
        this.currentPage[0] = this.currentPage[1];
        this.currentPage[1] = this.currentPage[1] - 1;
        createTableBodyPage(this.currentPage[1]);
        this.changePageInfoText();
        disableOrEnableButtons();
    }

    createButtonPrevious = () => {
        let previous = document.createElement('button');
        previous.setAttribute('id', 'tablely_btn_previous_' + elementId);
        previous.setAttribute('disabled', true);
        previous.textContent = "Previous"
        previous.addEventListener('click', e => {
            clickPreviousPage()
        })

        return previous;
    }

    clickNextPage = () => {
        this.currentPage[0] = this.currentPage[1];
        this.currentPage[1] = this.currentPage[1] + 1;
        createTableBodyPage(this.currentPage[1]);
        this.changePageInfoText();
        disableOrEnableButtons();
    }

    createButtonNext = () => {
        let next = document.createElement('button');
        next.setAttribute('id', 'tablely_btn_next_' + elementId)
        next.textContent = "Next"
        next.addEventListener('click', e => {
            clickNextPage();
        })

        return next;
    }

    searchValueInObject = (obj, searchedValue) => {
        let objData = Object.keys(obj).length;

        for (let item in obj)
            if ((obj[item].toString().toLowerCase().indexOf(searchedValue.toLowerCase())) >= 0)
                return true

        return false
    }

    searchValue = (value) => {
        this.indexOfRowsToDisplay = []
        if (value.length > 0) {
            let table_body = document.getElementById('tablely_tbody_' + elementId);
            for (let i = 0; i < this.totalRowsToShow; i++)
                if (searchValueInObject(data[i], value))
                    this.indexOfRowsToDisplay.push(i);

            this.pagesNumber = Math.ceil((this.indexOfRowsToDisplay.length > 0 ? this.indexOfRowsToDisplay.length : this.totalRowsToShow) / this.rowsPerPage);
            createTableBodyPage(this.currentPage[1]);
            this.changePageInfoText();
        } else {
            createTableBodyPage(this.currentPage[1]);
            this.changePageInfoText();
        }
    }

    inputSearcher = () => {
        let input_searcher = document.createElement('input')
        input_searcher.setAttribute('id', 'tablely_input_searcher_' + elementId)
        input_searcher.addEventListener('keypress', e => {
            if (e.key === 'Enter') {
                this.currentPage[1] = 1
                searchValue(e.target.value)
            }
        })

        return input_searcher
    }

    this.changePageInfoText = () => {
        let page_info = document.getElementById('tablely_page_info_' + elementId);
        page_info.textContent = 'Mostrando ' + this.rowsPerPage + ' registros por pagina de ' + this.pagesNumber + ' paginas, pagina : ' + this.currentPage[1] + ', registros: ' + (this.indexOfRowsToDisplay.length > 0 ? this.indexOfRowsToDisplay.length : this.totalRowsToShow);
        disableOrEnableButtons()
    }

    createPageInfo = () => {
        let page_info = document.createElement('p');
        page_info.setAttribute('id', 'tablely_page_info_' + elementId);
        page_info.textContent = 'Mostrando ' + this.rowsPerPage + ' registros por pagina de ' + this.pagesNumber + ' paginas, pagina : ' + this.currentPage[1] + ', registros: ' + (this.indexOfRowsToDisplay.length > 0 ? this.indexOfRowsToDisplay.length : this.totalRowsToShow);

        return page_info;
    }


    this.assembleTable = () => {
        let table = createTable();
        table.appendChild(createHeader())
        table.appendChild(createTableBodyPage(this.currentPage[1]));
        this.boxElement.appendChild(inputSearcher());
        this.boxElement.appendChild(table);
        this.boxElement.appendChild(createInputsSelect());
        this.boxElement.appendChild(createButtonPrevious());
        this.boxElement.appendChild(createButtonNext());
        this.boxElement.appendChild(createPageInfo());
    }

    
}

let mytable = new Tablely({elementId:"mytable",data:empleados,numberColumns:["id"]});
mytable.assembleTable()
console.log(mytable)
document.addEventListener('row-click', (e) => console.log(e.detail));