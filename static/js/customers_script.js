// **************************  Site URL construction  *****************************

//var flip_server = 1
//var port_num = 1027     

// Step 2: initialize variables (Don't change any of these)
var baseURL = `http://flip${flip_server}.engr.oregonstate.edu:${port_num}/`
var customers_subpage = baseURL + "customers"
var orders_subpage = baseURL + "orders"
var products_subpage = baseURL + "products"
var departments_subpage = baseURL + "departments"
var seasons_subpage = baseURL + "seasons"

// *************************  Event Listeners  ***************************
document.addEventListener('DOMContentLoaded', async () => {

	 // Insert
    document.querySelector(".submit_new_customer").addEventListener('click', add_customer);

	// Update 
    document.querySelectorAll(".update_button").forEach(item => {item.addEventListener('click', update_customer)});

    // Delete
    document.querySelectorAll(".delete_button").forEach(item => {item.addEventListener('click', delete_customer)});

});

// ************************  Update Customer  ************************
async function update (){

    // Step 1: return if 'editBlock' (i.e. another update in progress)
    if (document.getElementById('editBlock')){
        return
    }

    // Step 2: Determine row to edit
    customer_rows = document.querySelectorAll(".customer_row")
    for (var row of customer_rows){
        if (row.id == this.id){
            rowToEdit = row
            break
        }       
    }

    var thisID = this.ID

    // Step 3: Create and display the edit block
    rowCells = rowToEdit.children
    var old_fname = rowCells.item(1).textContent
    var old_lname = rowCells.item(2).textContent
    var old_birthDate = rowCells.item(3).textContent
    var old_zipcode = rowCells.item(4).textContent


    // Step 4: Take in edits
    var editRow = document.createElement('tr')           
    editRow.setAttribute('id', 'editBlock')			// creation of editBlock

    var customerID = document.createElement('td')		// customerID should be kept, not editable
    editRow.appendChild(customerID)
       
    cellEdit('newFName', old_fname)
    cellEdit('newLName', old_lname)
    cellEdit('newBirthDate', old_birthDate)
    cellEdit('newZipCode', old_zipcode)

    
        // --6. Make 'Change' Button
    var makeChange = document.createElement('button')
    makeChange.id = "submit_edit" + customerID           // Store ID of edit row at end of row
    makeChange.textContent = "Change"
    makeChange.style.backgroundColor = "yellow"
    makeChange.style.width = "50%"
    makeChange.style.height = "100%"
    editRow.appendChild(makeChange)
        // --7. Make 'Cancel' Button
    var cancelChange = document.createElement('button')
    cancelChange.id = 'cancel_edit'
    cancelChange.textContent = "Cancel"
    cancelChange.style.backgroundColor = "yellow"
    cancelChange.style.width = "50%"
    cancelChange.style.height = "100%"
    editRow.appendChild(cancelChange)


        // --Append row to Table (right underneath the row that is being edited)
    rowToEdit.insertAdjacentElement('afterend', editRow)


    // -------- Step 5: Assign listener to 'Change' and 'Cancel' Buttons
    document.getElementById(makeChange.id).addEventListener('click', submit_edit)
    document.getElementById(cancelChange.id).addEventListener('click', cancel_edit)
};

async function cellEdit(id_val, old_val) {
	var editCell = document.createElement('td')      
    var inputBox = document.createElement('input')  
    inputBox.setAttribute('id', id_val)
    inputBox.setAttribute('type', 'text')
    inputBox.setAttribute('value', old_val)
    inputBox.style.backgroundColor = "yellow"
    editCell.appendChild(inputBox)
    editRow.appendChild(editCell)
}

// Function 2: 'Change' button's callback function
async function submit_edit(){
    // id of editrow == 'editBlock' (Use this to delete entire row after edit has been made)
    // id of row being edited == last index of event button's id value (Use this to finally change the displayed data)

    // -------- Step 1: access modified values and initialze layload
    var payload = {};
    payload.action = "update"
    if (this.id.length == 12){          // If ID is 1 digit
        payload.ID = this.id[this.id.length - 1]
    } else {                            // If ID is 2 digits
        payload.ID = this.id.slice(11, 13)
    }
                
    payload.name = document.getElementById("newFName").value
    payload.department = document.getElementById("newLName").value
    payload.price = document.getElementById("newBirthDate").value
    payload.unitType = document.getElementById("newZipCode").value


    // -------- Step 2: Formulate request and sent it
    var url = products_subpage
    var fetchdata = {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: {'Content-Type' : 'application/json'}
    }
    var response = await fetch(url, fetchdata)
    var data = await response.json()
    // console.log("!!! Server response:", data)       // For debugging

    // -------- Step 3: Update the displayed data
        // -- First, access the row to update
    all_rows = document.querySelectorAll(".customer_row")

    for (var row of all_rows){
        if (row.id == thisid){
            rowToEdit = row
            break
        }       
    }
    // -- Second, edit the row
    rowCells = rowToEdit.children
    rowCells.item(0).textContent = data['customerID']
    rowCells.item(1).textContent = data['productName']
    rowCells.item(2).textContent = data['departmentID']
    rowCells.item(3).textContent = data['salePrice']
    rowCells.item(4).textContent = data['unitType']


    // -------- Step 4: Delete the Edit row
    document.getElementById("editBlock").remove()


}

// Function 3:'Cancel' button's callback function (Cancels an edit)
async function cancel_edit(){
    document.getElementById("editBlock").remove()
}

// Function 4: 'Delete' button's callback function (deletes a row)
async function delete_product(){

	var thisID = this.id

    // -------- Step 1: Make request to delete row from databse
    var url = products_subpage
    var payload = {"rowToDelete": thisID, "action":"delete"}
    var fetchdata = {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: {'Content-Type' : 'application/json'}
    }
    var response = await fetch(url, fetchdata)
    var data = await response.json()
    console.log(data)


    // -------- Step 2: Delete row from HTML
    all_rows = document.querySelectorAll(".customer_row")
    for (var row of all_rows){
        if (row.id == thisID){
            rowToDelete = row
            rowToDelete.remove()
            break
        }       
    }
}