var add = document.querySelectorAll(".addToCart");
add.forEach((a) => {
  a.addEventListener("click", addToCart);
});

function addToCart(e) {
  var object = e.target.value;
  console.log("In frontend")
  console.log(parseInt(object));
  fetch("/add", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ "id": parseInt(object) }),
  }).then((res) => {
    console.log("Request complete! response:", res);
  });
}
