async function onlogin(e) {
  try {
    e.preventDefault();

    let loginuser = {
      email: e.target.email.value,
      password: e.target.password.value,
    };

    let login = await axios.post(
      "http://13.126.34.251:3000/user/login",
      loginuser
    );
    alert(login.data.message);
    localStorage.setItem("token", login.data.token);
    window.location.href = "expense.html";
  } catch (err) {
    document.body.innerHTML += `<p>${err}</p>`;
  }
}
