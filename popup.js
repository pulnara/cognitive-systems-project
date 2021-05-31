window.addEventListener('load', (event) => {
    document.getElementById("inputText").addEventListener("change", event =>{
        document.getElementById("headingText").innerHTML = event.target.value;
    });
});