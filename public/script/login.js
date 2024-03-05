const loginForm = document.getElementById("login-form");
loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const response = await fetch("/users/authenticate", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password })
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

