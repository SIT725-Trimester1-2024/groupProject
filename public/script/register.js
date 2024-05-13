const registerForm = document.getElementById("register-form");
registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const firstName = document.getElementById("firstName").value;
    const lastName = document.getElementById("lastName").value;
    const role = "normal user";
    // console.log(email,password,firstName,lastName);
    const response = await fetch("/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password,firstName, lastName, role})
    });
    if (response.status === 200) {
        const data = await response.json();
        localStorage.setItem("token", data.user.token);

        fetch("/users/" + data.user.role, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${data.user.token}`,
            },
        })
            .then((res) => res.text())
            .then((rawHtml) => {
                document.write(rawHtml);
                document.close;
            });
    } else {
        alert("Invalid username or password");
    }
});

