async function sendemail(e) {
  try {
    e.preventDefault();
    let email = {
      email: e.target.email.value,
    };
    let Email = await axios.post(
      "http://13.126.34.251:3000/password/forgotpassword",
      email
    );
    alert("Check your email");
  } catch (err) {
    document.body.innerHTML += `<p>${err}</p>`;
  }
}
