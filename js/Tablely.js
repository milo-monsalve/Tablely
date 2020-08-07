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

    this.deleteRows = () => {
        let table_body_children = document.getElementById('tablely_tbody_' + elementId);
        table_body_children.querySelectorAll('*').forEach(row => row.remove());
    }


   

    
}