//Check all items in the cart
document.getElementById("selectAll").addEventListener("change", function (e) {
  var isChecked = e.target.checked;
  var checkboxes = document.querySelectorAll(".item-checkbox");
  checkboxes.forEach(function (checkbox) {
    checkbox.checked = isChecked;
  });
});

//Discount function
document.getElementById("applyButton").addEventListener("click", function (e) {
  e.preventDefault();
  var discountCode = document.getElementById("discountCode").value;
  fetch("/apply-discount", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ discountCode: discountCode }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        // Update the total price
        document.getElementById("total").textContent = "$" + data.newTotal;
      } else {
        // Show an error message
        alert("Invalid discount code");
      }
    });
});
