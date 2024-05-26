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
app.delete("/user/:userId/cart", function (req, res) {
  // Get the user ID from the request parameters
  var userId = req.params.userId;

  // Find the user and empty their cart
  User.findById(userId, function (err, user) {
    if (err) {
      console.error(err);
      res.status(500).send(err);
    } else {
      user.cart = [];
      user.save(function (err) {
        if (err) {
          console.error(err);
          res.status(500).send(err);
        } else {
          res.redirect("/user/" + userId + "/cart");
        }
      });
    }
  });
});
