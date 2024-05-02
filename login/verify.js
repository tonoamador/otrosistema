const token = JSON.parse(localStorage.getItem("token"));
function isTokenExpired(token) {
  const currentTime = Date.now() / 1000;
  return token.exp < currentTime;
}
if (
  
  (token &&
    (token.user_type === "rc" || token.user_type === "admin") &&
    !isTokenExpired(token))
) {
  switch (token.user_type) {
    case "admin":
      window.location.replace("main.html");
      break;
    case "rc":
      window.location.replace("overview-rc.html");
      break;
  }
}
