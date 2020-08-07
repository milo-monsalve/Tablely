function Tablely(elementId, data, inputs = [5, 10, 15, 20]) {
    this.boxElement = document.getElementById(elementId);
    this.headers = Object.keys(data[0]);
    this.totalRowsToShow = data.length;
    this.indexOfRowsToDisplay = [];
    this.rowsPerPage = 5;
    this.currentPage = [0, 1];
    this.pagesNumber = Math.ceil((this.indexOfRowsToDisplay.length > 0 ? this.indexOfRowsToDisplay.length : this.totalRowsToShow) / this.rowsPerPage);


    this.createTable = () => {
        let table = document.createElement('table');
        table.setAttribute('id', 'tablely_table_' + elementId)
        return table;
    }

    this.deleteRows = (tableBody) => {
        tableBody.querySelectorAll('*').forEach(row => row.remove());
    }

    this.createTableBodyPage = (page) => {
        let tbody
        if (document.body.contains(document.getElementById('tablely_tbody_' + elementId))) {
            tbody = document.getElementById('tablely_tbody_' + elementId);
            this.deleteRows(tbody);
        } else {
            tbody = document.createElement('tbody');
            tbody.setAttribute('id', 'tablely_tbody_' + elementId)
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

    this.createHeader = () => {
        let thead = document.createElement('thead');
        thead.setAttribute('id', 'tablely_thead_' + elementId)
        let thead_row = document.createElement('tr');
        for (let i = 0; i < this.headers.length; i++) {
            let thead_td = document.createElement('td');
            thead_td.addEventListener('click', e => {
                //this.showHidePage(this.currentPage[0], "none");
                //this.showHidePage(this.currentPage[1], "none");
                //this.sortTableByColumn(e.target.cellIndex)
            })
            thead_td.innerText = this.headers[i];
            thead_row.appendChild(thead_td);
        }

        thead.appendChild(thead_row);

        return thead
    }

    this.createInputsSelect = () => {
        let inputs_select = document.createElement('select');
        inputs_select.setAttribute('id', 'tablely_inputs_select_' + elementId);
        inputs_select.addEventListener('change', e => {
            //this.showHidePage(this.currentPage[0], "none");
            //this.showHidePage(this.currentPage[1], "none");
            this.rowsPerPage = Number(e.target.value);
            this.pagesNumber = Math.ceil((this.indexOfRowsToDisplay.length > 0 ? this.indexOfRowsToDisplay.length : this.totalRowsToShow) / this.rowsPerPage);
            this.showRows();
        })

        for (let i in inputs) {
            let optionSelect = document.createElement('option');
            optionSelect.textContent = inputs[i];
            inputs_select.appendChild(optionSelect)
        }

        return inputs_select
    }

    this.disableOrEnableButtons = () => {
        if (this.currentPage[1] == 1)
            document.getElementById('tablely_btn_previous_' + elementId).setAttribute('disabled', true);
        else
            document.getElementById('tablely_btn_previous_' + elementId).removeAttribute('disabled');

        if (this.currentPage[1] == this.pagesNumber)
            document.getElementById('tablely_btn_next_' + elementId).setAttribute('disabled', true);
        else
            document.getElementById('tablely_btn_next_' + elementId).removeAttribute('disabled');
    }

    this.clickPreviousPage = () => {
        this.currentPage[0] = this.currentPage[1];
        this.currentPage[1] = this.currentPage[1] - 1;
        this.createTableBodyPage(this.currentPage[1]);
        this.disableOrEnableButtons();
    }

    this.createButtonPrevious = () => {
        let previous = document.createElement('button');
        previous.setAttribute('id', 'tablely_btn_previous_' + elementId);
        previous.setAttribute('disabled', true);
        previous.textContent = "Previous"
        previous.addEventListener('click', e => {
            this.clickPreviousPage()
        })

        return previous;
    }

    this.clickNextPage = () => {
        this.currentPage[0] = this.currentPage[1];
        this.currentPage[1] = this.currentPage[1] + 1;
        this.createTableBodyPage(this.currentPage[1]);
        this.disableOrEnableButtons();
    }

    this.createButtonNext = () => {
        let next = document.createElement('button');
        next.setAttribute('id', 'tablely_btn_next_' + elementId)
        next.textContent = "Next"
        next.addEventListener('click', e => {
            this.clickNextPage();
        })

        return next;
    }

    this.searchValueInObject = (obj, searchedValue) => {
        let objData = Object.keys(obj).length;

        for (let item in obj)
            if ((obj[item].toString().toLowerCase().indexOf(searchedValue.toLowerCase())) >= 0)
                return true

        return false
    }

    this.searchValue = (value) => {
        if (value.length > 0) {
            let table_body = document.getElementById('tablely_tbody_' + elementId);
            this.indexOfRowsToDisplay = []
            for (let i = 0; i < this.totalRowsToShow; i++)
                if (this.searchValueInObject(data[i], value))
                    this.indexOfRowsToDisplay.push(i);

            this.pagesNumber = Math.ceil((this.indexOfRowsToDisplay.length > 0 ? this.indexOfRowsToDisplay.length : this.totalRowsToShow) / this.rowsPerPage);
            console.log(this.indexOfRowsToDisplay);
            this.createTableBodyPage(this.currentPage[1]);
        } else
            this.createTableBodyPage(this.currentPage[1]);
    }

    this.inputSearcher = () => {
        let input_searcher = document.createElement('input')
        input_searcher.setAttribute('id', 'tablely_input_searcher_' + elementId)
        input_searcher.addEventListener('keypress', e => {
            if (e.key === 'Enter') {
                //this.showHidePage(this.currentPage[0], "none");
                //this.showHidePage(this.currentPage[1], "none");
                this.searchValue(e.target.value)
            }
        })

        return input_searcher
    }

    this.changePageInfoText = () => {
        let page_info = document.getElementById('tablely_page_info_' + elementId);
        page_info.textContent = 'Mostrando ' + this.rowsPerPage + ' registros por pagina de ' + this.pagesNumber + ' paginas, pagina : ' + this.currentPage[1] + ', registros: ' + (this.indexOfRowsToDisplay.length > 0 ? this.indexOfRowsToDisplay.length : this.totalRowsToShow);
    }
    
    this.createPageInfo = () => {
        let page_info = document.createElement('p');
        page_info.setAttribute('id', 'tablely_page_info_' + elementId);
        page_info.textContent = 'Mostrando ' + this.rowsPerPage + ' registros por pagina de ' + this.pagesNumber + ' paginas, pagina : ' + this.currentPage[1] + ', registros: ' + (this.indexOfRowsToDisplay.length > 0 ? this.indexOfRowsToDisplay.length : this.totalRowsToShow);

        return page_info;
    }


    this.assembleTable = () => {
        let table = this.createTable();
        table.appendChild(this.createHeader())
        table.appendChild(this.createTableBodyPage(this.currentPage[1]));
        this.boxElement.appendChild(this.inputSearcher());
        this.boxElement.appendChild(table);
        this.boxElement.appendChild(this.createInputsSelect());
        this.boxElement.appendChild(this.createButtonPrevious());
        this.boxElement.appendChild(this.createButtonNext());
        this.boxElement.appendChild(this.createPageInfo());
        console.log(table);
    }
    
    this.assembleTable();
}

Tablely("mytable", empleados);