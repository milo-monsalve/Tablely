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
        if (document.body.contains(document.getElementById('tablely_tbody_' + elementId))){
            tbody = document.getElementById('tablely_tbody_' + elementId);
            this.deleteRows(tbody);
        } else {
            tbody = document.createElement('tbody');
            tbody.setAttribute('id', 'tablely_tbody_' + elementId)
        }

        let showRowsSince = this.rowsPerPage * (page - 1);
        let showRowsUntil = this.rowsPerPage * page;
        for (let i = showRowsSince; i < showRowsUntil; i++) {
            let tbody_row = document.createElement('tr');
            //tbody_row.style.display = "none";
            let tr_data = Object.values(data[i]);

            for (let j = 0; j < tr_data.length; j++) {
                let tbody_td = document.createElement('td');
                tbody_td.innerText = tr_data[j];
                tbody_row.appendChild(tbody_td);
            }

            tbody.appendChild(tbody_row);
        }
        return tbody
    }


}