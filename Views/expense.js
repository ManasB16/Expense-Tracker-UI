const token = localStorage.getItem("token");

window.addEventListener("DOMContentLoaded", async () => {
  if (!localStorage.getItem("ExpPerPage")) {
    localStorage.setItem("ExpPerPage", 2);
  }
  if (!localStorage.getItem("CurrentPage")) {
    refresh(1);
  } else {
    refresh(localStorage.getItem("CurrentPage"));
  }
  document.getElementById("expPerPage").value =
    localStorage.getItem("ExpPerPage");
});

document.getElementById("setExp").addEventListener("click", () => {
  let val = document.getElementById("expPerPage").value;
  localStorage.setItem("ExpPerPage", val);
});

async function refresh(currPage) {
  try {
    let expPerPage = localStorage.getItem("ExpPerPage");
    let getExpenses = await axios.get(
      `http://13.126.34.251:3000/expense/getExpenses?page=${currPage}&expPerPage=${expPerPage}`,
      { headers: { Authorization: token } }
    );
    if (getExpenses.data.ispremiumuser == true) {
      afterPremium();
      showPrevFileData();
    }
    let currpage = getExpenses.data.currPage;
    localStorage.setItem("CurrentPage", currpage);
    showPagination(getExpenses.data);
  } catch (err) {
    document.body.innerHTML += `<p>${err}</p>`;
  }
}

async function afterPremium() {
  try {
    //showing you're a premium user
    let button = document.getElementById("rzp-btn");
    button.style.display = "none";

    // after premium showing text leaderboard and download button
    const parentNode = document.getElementById("btn1");
    const childElement = `<b>You are Premium User</b>
                          <button class="btn btn-outline-dark" data-bs-toggle="button" onclick=leaderboard()> Leaderboard </button>
                          <button class="btn btn-outline-success" data-bs-toggle="button" onclick=downloadexp()> Download File</button> `;

    parentNode.innerHTML += childElement;
    //after premium adding all files text
    const allfiles = document.getElementById("allfiles");
    const h3 = document.createElement("h3");
    h3.textContent = "All Files";
    allfiles.appendChild(h3);
  } catch (err) {
    document.body.innerHTML += `<p>${err}</p>`;
  }
}

async function leaderboard() {
  try {
    const userLeaderBoardArr = await axios.get(
      "http://13.126.34.251:3000/premium/showLeaderBoard",
      { headers: { Authorization: token } }
    );

    var leaderboardElem = document.getElementById("leaderboard");
    leaderboardElem.innerHTML += `<h3>Leader Board</h3><br>`;
    userLeaderBoardArr.data.allExp.forEach((user) => {
      leaderboardElem.innerHTML += `<li class="fw-semibold">Name - ${user.name} Total Expense - ${user.totalExp}`;
    });
  } catch (err) {
    document.body.innerHTML += `<p>${err}</p>`;
  }
}

async function downloadexp() {
  try {
    const download = await axios.get(
      "http://13.126.34.251:3000/expense/download",
      {
        headers: { Authorization: token },
      }
    );
    if (download.status === 200) {
      // backend is sending a download link, if we open that link in browser our file would be downloaded
      var a = document.createElement("a");
      a.href = download.data.fileURL;
      a.download = "myexpense.csv";
      a.click();
    } else {
      throw new Error(download.data.message);
    }
  } catch (err) {
    document.body.innerHTML += `<p>${err}</p>`;
  }
}

async function showPrevFileData() {
  let allfiles = await axios.get(
    "http://13.126.34.251:3000/expense/showFiles",
    {
      headers: { Authorization: token },
    }
  );

  allfiles.data.contenturl.forEach((url) => {
    showAllDownloadedFiles(url);
  });
}

function showAllDownloadedFiles(url) {
  const parentNode = document.getElementById("allfiles");
  const childElement = `<li><a href=${url.contenturl}>${url.filename}<a></li>`;
  parentNode.innerHTML = parentNode.innerHTML + childElement;
}

function showPagination(data) {
  const {
    prevPage,
    currPage,
    nextPage,
    lastPage,
    hasNextPage,
    hasPrevPage,
    expenses,
  } = data;
  let pagination = document.getElementById("pagination");
  pagination.innerHTML = "";

  expenses.forEach((exp) => {
    showNewExpOnScreen(exp);
  });
  if (hasPrevPage) {
    const btn2 = document.createElement("button");
    btn2.className = "btn btn-outline-primary";
    btn2.innerHTML = prevPage;
    btn2.addEventListener("click", () => {
      expenses.forEach((exp) => {
        removeExpFromScreen(exp.id);
      });
      getExpenses(prevPage);
      localStorage.setItem("CurrentPage", prevPage);
    });
    pagination.appendChild(btn2);
  }
  const btn1 = document.createElement("button");
  btn1.className = "btn btn-outline-primary";
  btn1.innerHTML = `<h3>${currPage}</h3>`;
  btn1.addEventListener("click", () => {
    expenses.forEach((exp) => {
      removeExpFromScreen(exp.id);
    });
    getExpenses(currPage);
    localStorage.setItem("CurrentPage", currPage);
  });
  pagination.appendChild(btn1);
  if (hasNextPage) {
    const btn3 = document.createElement("button");
    btn3.className = "btn btn-outline-primary";
    btn3.innerHTML = nextPage;
    btn3.addEventListener("click", () => {
      expenses.forEach((exp) => {
        removeExpFromScreen(exp.id);
      });
      getExpenses(nextPage);
      localStorage.setItem("CurrentPage", nextPage);
    });
    pagination.appendChild(btn3);
  }
}

async function getExpenses(page) {
  try {
    let expPerPage = localStorage.getItem("ExpPerPage");
    const getExpensesPerPage = await axios.get(
      `http://13.126.34.251:3000/expense/getExpenses?page=${page}&expPerPage=${expPerPage}`,
      { headers: { Authorization: token } }
    );

    showPagination(getExpensesPerPage.data);
  } catch (err) {
    document.body.innerHTML += `<p>${err}</p>`;
  }
}

async function onAddExpense(e) {
  try {
    e.preventDefault();

    let obj = {
      amount: e.target.amount.value,
      description: e.target.description.value,
      category: e.target.category.value,
    };

    let newExpense = await axios.post(
      "http://13.126.34.251:3000/expense/addExpense",
      obj,
      { headers: { Authorization: token } }
    );
    showNewExpOnScreen(newExpense.data.newExp);
  } catch (err) {
    document.body.innerHTML += `<p>${err}</p>`;
  }
}

function showNewExpOnScreen(expense) {
  document.getElementById("amount").value = "";
  document.getElementById("category").value = "";
  document.getElementById("description").value = "";
  const parentNode = document.getElementById("users");
  const childElement = `<span id=${expense.id}><li class="fw-semibold"> ${expense.amount} - ${expense.category} - ${expense.description}
                        <button class="btn btn-outline-danger" onclick=deleteExp('${expense.id}')> Delete </button>&nbsp&nbsp&nbsp
                        <button class="btn btn-outline-secondary" onclick=editExp('${expense.id}','${expense.amount}','${expense.category}','${expense.description}')> Edit </button>
                        </li><br /></span>`;

  parentNode.innerHTML = parentNode.innerHTML + childElement;
}

async function deleteExp(expID) {
  try {
    await axios.delete(
      `http://13.126.34.251:3000/expense/deleteExpense/${expID}`,
      {
        headers: { Authorization: token },
      }
    );

    removeExpFromScreen(expID);
  } catch (err) {
    document.body.innerHTML += `<p>${err}</p>`;
  }
}

async function editExp(expID, amount, category, description) {
  try {
    document.getElementById("amount").value = amount;
    document.getElementById("category").value = category;
    document.getElementById("description").value = description;

    await axios.delete(
      `http://13.126.34.251:3000/expense/deleteExpense/${expID}`,
      {
        headers: { Authorization: token },
      }
    );

    removeExpFromScreen(expID);
  } catch (err) {
    document.body.innerHTML += `<p>${err}</p>`;
  }
}

function removeExpFromScreen(expID) {
  const parentNode = document.getElementById("users");
  const childnodetobeDeleted = document.getElementById(expID);
  if (childnodetobeDeleted) {
    parentNode.removeChild(childnodetobeDeleted);
  }
}

document.getElementById("rzp-btn").onclick = async (e) => {
  try {
    const response = await axios.get(
      "http://13.126.34.251:3000/purchase/premiumMembership",
      { headers: { Authorization: token } }
    );

    var options = {
      key: response.data.key_id, // key id generated from dashboard
      order_id: response.data.order.id, // for one time payment
      // this handler function will handle the success payment
      handler: async (response) => {
        await axios.post(
          "http://13.126.34.251:3000/purchase/updateTransactionStatus",
          {
            order_id: options.order_id,
            payment_id: response.razorpay_payment_id,
          },
          { headers: { Authorization: token } }
        );
        alert("You are a Premium User Now");
        afterPremium();
      },
    };

    const rzp1 = new Razorpay(options);
    rzp1.open();
    e.preventDefault();

    rzp1.on("payment.failed", async function (response) {
      await axios.post(
        "http://13.126.34.251:3000/purchase/updateTransactionStatus",
        {
          order_id: options.order_id,
        },
        { headers: { Authorization: token } }
      );
      alert("Something went wrong");
    });
  } catch (err) {
    document.body.innerHTML += `<p>${err}</p>`;
  }
};
