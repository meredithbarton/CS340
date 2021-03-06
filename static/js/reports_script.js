

// ----------------- Site URL construction -----------------
// ---Step 1: Specify server and port number
var flip_server = 1     // Choose the server you're using (1, 2, or 3)
var port_num = 1027     // Choose a port number of your choice

// ---Step 2: initialize variables (Don't change any of these)
var baseURL = `http://flip${flip_server}.engr.oregonstate.edu:${port_num}/`
var customers_subpage = baseURL + "customers"
var orders_subpage = baseURL + "orders"
var products_subpage = baseURL + "products"
var departments_subpage = baseURL + "departments"
var seasons_subpage = baseURL + "seasons"



// Master event listener (On page Load)
document.addEventListener('DOMContentLoaded', async () => {

    // 'Cancel' button event listener
    document.querySelectorAll(".cancelItem").forEach(item => {item.addEventListener('click', cancelOrder)});

    

});




// ----------------------------------------------- Function(s) block -----------------------------------------------
// Function 1: cancel an order
async function cancelOrder(){

    // ---Step 1: Access the details of cancelling item
    var parentRow = this.parentNode.parentNode
    var kidCells = parentRow.children
    var p_ID = kidCells.item(0).textContent
    var o_ID = kidCells.item(1).textContent
    var season = kidCells.item(2).textContent
    var quantity = kidCells.item(3).textContent
    var itemTotal = kidCells.item(4).textContent
    //console.log(p_ID, o_ID, season, quantity, itemTotal)      // For debugging


    // ---Step 2: Send request to remove item from OrderProducts
    var payload = {
        "productID": p_ID,
        "orderID": o_ID,
        "seasonID": season,
        "quantitySold": quantity,
        "productTotal": itemTotal
    }
    var url = baseURL
    var fetchdata = {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: {'Content-Type' : 'application/json'}
    }

    var response = await fetch(url, fetchdata)
    var data = await response.json()

    // ---Step 2: Delete the row
    parentRow.remove()


    


}
