
let bootstrapTheme = {
    table: " table-bordered",
    thead: "table-dark",
    tableHead: "",
    tableHeadSearch: "input-group",
    tableHeadSearchLabel: "mr-3",
    tableHeadSearchInput: "form-control form-control-sm rounded-0",
    tableFoot: "",
    tableFootSelect: "form-control form-control-sm rounded-0",
    tableFootInfo: "",
    tableFootControls: "",
    tableFootControlPrevious: "btn btn-sm rounded-0 btn-primary",
    tableFootControlNext: "btn btn-sm rounded-0 btn-primary",
};

function Tablely({ elementId, data, inputs = [5, 10, 15, 20], numberColumns = [], captionText = "My Table", currencyColumns = [],
    theme = {
        table: "",
        thead: "",
        tableHead: "",
        tableHeadSearch: "",
        tableHeadSearchLabel: "",
        tableHeadSearchInput: "",
        tableFoot: "",
        tableFootSelect: "",
        tableFootInfo: "",
        tableFootControls: "",
        tableFootControlPrevious: "",
        tableFootControlNext: "",
    } }) {
    this.boxElement = document.getElementById(elementId);
    this.headers = Object.keys(data[0]);
    this.totalRowsToShow = data.length;
    this.indexOfRowsToDisplay = [];
    this.rowsPerPage = 5;
    this.currentPage = [0, 1];
    this.pagesNumber = Math.ceil((this.indexOfRowsToDisplay.length > 0 ? this.indexOfRowsToDisplay.length : this.totalRowsToShow) / this.rowsPerPage);


    createTableNavHead = () => {
        let table_nav_head = document.createElement('nav')
        table_nav_head.classList.add('tablely-head-nav')

        let table_nav_searcher = document.createElement('div')
        table_nav_searcher.classList.add('tablely-nav-searcher')

        let table_nav_control = document.createElement('div')
        table_nav_control.setAttribute('id', 'tablely_nav_head_control_' + elementId)
        table_nav_control.className += theme.tableHeadSearch

        let table_nav_control_label = document.createElement('label')
        table_nav_control_label.setAttribute('for', 'tablely_input_searcher_' + elementId)
        table_nav_control_label.innerText = "Buscar: "
        table_nav_control_label.className += theme.tableHeadSearchLabel
        table_nav_control.appendChild(table_nav_control_label)

        table_nav_control.appendChild(inputSearcher())

        table_nav_searcher.appendChild(table_nav_control)

        table_nav_head.appendChild(table_nav_searcher)

        return table_nav_head
    }

    createTableNavFoot = () => {
        let table_nav_foot = document.createElement('nav')
        table_nav_foot.classList.add('tablely-foot-nav')

        let table_nav_select = document.createElement('div')
        table_nav_select.classList.add('tablely-nav-select')
        table_nav_select.appendChild(createInputsSelect())

        let table_nav_info = document.createElement('div')
        table_nav_info.classList.add('tablely-nav-info')
        table_nav_info.appendChild(createPageInfo())

        let table_nav_controls = document.createElement('div')
        table_nav_controls.classList.add('tablely-nav-controls')
        table_nav_controls.appendChild(createButtonPrevious())
        table_nav_controls.appendChild(createButtonNext())

        table_nav_foot.appendChild(table_nav_select)
        table_nav_foot.appendChild(table_nav_info)
        table_nav_foot.appendChild(table_nav_controls)

        return table_nav_foot
    }


    createTable = () => {
        let table = document.createElement('table');
        table.classList.add('tablely')
        table.className += theme.table;
        table.setAttribute('id', 'tablely_table_' + elementId)

        let table_caption = document.createElement('caption')
        table_caption.classList.add('tablely-caption', 'tablely-caption-top')
        table_caption.innerText = captionText

        table.appendChild(table_caption)
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

    createTableBodyEmpty = () => {
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

        let tbody_row = document.createElement('tr');
        let tbody_td = document.createElement('td');
        tbody_td.innerText = 'Sin resultados';
        tbody_td.style.textAlign = 'center';
        tbody_td.setAttribute('colspan', this.headers.length)
        tbody_row.appendChild(tbody_td);
        tbody.appendChild(tbody_row);

        return tbody
    }

    setFormat = (column, row) => {
        if (currencyColumns.indexOf(this.headers[column]) > -1)
            return Intl.NumberFormat("en-US").format(row[column])

        return row[column]
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
                        tbody_td.innerText = setFormat(j, tr_data)
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
                        tbody_td.innerText = setFormat(j, tr_data);
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
                case 'arrow-down':
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
                case 'arrow-up':
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
                case 'arrow-down':
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
                case 'arrow-up':
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
        thead.classList.add(theme.thead.split(' '))
        let thead_row = document.createElement('tr');
        for (let i = 0; i < this.headers.length; i++) {
            let thead_td = document.createElement('th');
            thead_td.addEventListener('click', e => {
                new Promise((resolve, reject) => {
                    if (event.target.classList.contains('arrow-up')) {
                        event.target.classList.remove('arrow-up')
                        event.target.classList.add('arrow-down')
                    } else if (event.target.classList.contains('arrow-down')) {
                        event.target.classList.remove('arrow-down')
                        event.target.classList.add('arrow-up')
                    } else {
                        event.target.classList.add('arrow-down')
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
        inputs_select.className += theme.tableFootSelect
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
        previous.className += theme.tableFootControlPrevious
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
        next.className += theme.tableFootControlNext
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

            if (this.indexOfRowsToDisplay.length > 0)
                createTableBodyPage(this.currentPage[1]);
            else
                createTableBodyEmpty();

            this.changePageInfoText();
        } else {
            createTableBodyPage(this.currentPage[1]);
            this.changePageInfoText();
        }
    }

    inputSearcher = () => {
        let input_searcher = document.createElement('input')
        input_searcher.setAttribute('id', 'tablely_input_searcher_' + elementId)
        input_searcher.className += theme.tableHeadSearchInput
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

        this.boxElement.classList.add('tablely_box');
        let table = createTable();
        table.appendChild(createHeader())
        table.appendChild(createTableBodyPage(this.currentPage[1]));
        this.boxElement.appendChild(createTableNavHead());
        this.boxElement.appendChild(table);
        this.boxElement.appendChild(createTableNavFoot());
    }
}