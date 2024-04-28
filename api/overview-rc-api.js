const toastElement = document.getElementById("kt_docs_toast_toggle")
const toast = bootstrap.Toast.getOrCreateInstance(toastElement)
var state = false;

if(window.location.hash){
    const params = new URLSearchParams(window.location.search);
    const idRc = params.get("id");
}


function buttonState(posts) {
    // console.log(posts.data['open'])
    return posts.data['open']
}

function OpenBox() {
    
    const e = document.getElementById("kt_user_follow_button");
    const id = e.getAttribute("data-id-casilla");
    $.ajax({
        url: "https://hcpboca.ddns.net:3050/api/openCasilla/"+id,
        dataType: "JSON",
        method: 'POST',
        async: false,
        success: function (i) {
            state = i.data['open']
        }
    })
    return state
}

function loadingPage() {
    const loadingEl = document.createElement("div")
    document.body.prepend(loadingEl)
    loadingEl.classList.add("page-loader");
    loadingEl.classList.add("flex-column");
    loadingEl.classList.add("bg-dark");
    loadingEl.classList.add("bg-opacity-25");
    loadingEl.innerHTML = `
        <span class="spinner-border text-primary" role="status"></span>
        <span class="text-gray-800 fs-6 fw-semibold mt-5">Cargando...</span>
    `;

    // Show page loading
    KTApp.showPageLoading();

    // Hide after 3 seconds
    setTimeout(function() {
        KTApp.hidePageLoading();
        loadingEl.remove();
        if(window.location.hash){

        }else{
            window.location.replace("ciudadanos-rc.html")
        }
        
    }, 3000);
}