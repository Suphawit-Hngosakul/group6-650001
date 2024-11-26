//LoadLocalStorage
document.addEventListener('DOMContentLoaded', () => {
    const user = JSON.parse(localStorage.getItem('user'));

    if (user) {
        document.getElementById('user-name').innerText = user.username;
        document.getElementById('user-ID').innerText = user.studentID;
        document.getElementById('user-email').innerText = user.email;
    } else {
        window.location.href = 'index.html';
    }
});

// Dropdown content
function toggleDropdown() {
    var dropdown = document.getElementById("dropdown-content");
    dropdown.style.display = dropdown.style.display === "block" ? "none" : "block";
}

//logout
function logout() {
    localStorage.clear();
    window.location.href = 'index.html';
}