const toastElement = document.getElementById("kt_docs_toast_toggle")
const toast = bootstrap.Toast.getOrCreateInstance(toastElement)

function OpenBox() {
    var status = false;
    const e = document.getElementById("kt_user_follow_button");
    const id = e.getAttribute("data-id-casilla");
    fetch("https://hcpboca.ddns.net:3050/api/openCasilla/"+id, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
    })
    .then((response) => {
        if(!response.ok){
            throw new Error("Network response was not ok")
            console.log('Si hay pex')
        }else{
            status = true
            console.log('No hay pex')
        }
        return response.json()
    })
    .catch((error) => {
        console.error("Error fetching data: ", error)
    });
    
    return status;
}
