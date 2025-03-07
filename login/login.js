"use strict";
var serverUrl = 'https://interna.ddns.net:3050/';
var KTSigninGeneral = (function () {
  var t, e, r;
  return {
    init: function () {
      (t = document.querySelector("#kt_sign_in_form")),
        (e = document.querySelector("#kt_sign_in_submit")),
        (r = FormValidation.formValidation(t, {
          fields: {
            username: {
              validators: {
                notEmpty: { message: "Se requiere usuario" },
              },
            },
            password: {
              validators: { notEmpty: { message: "Se requiere contraseña" } },
            },
          },
          plugins: {
            trigger: new FormValidation.plugins.Trigger(),
            bootstrap: new FormValidation.plugins.Bootstrap5({
              rowSelector: ".fv-row",
              eleInvalidClass: "",
              eleValidClass: "",
            }),
          },
        }));

      e.addEventListener("click", function (i) {
        i.preventDefault(),
          r.validate().then(function (r) {
            if ("Valid" == r) {
              e.setAttribute("data-kt-indicator", "on"),
                (e.disabled = !0),
                axios
                  .post(serverUrl + "api/login/", {
                    username: t.querySelector('[name="username"]').value,
                    password: t.querySelector('[name="password"]').value,
                  })
                  .then(function (response) {
                    const base64Url = response.data.token.split(".")[1];
                    const base64 = base64Url
                      .replace(/-/g, "+")
                      .replace(/_/g, "/");
                    const jsonPayload = decodeURIComponent(
                      atob(base64)
                        .split("")
                        .map(function (c) {
                          return (
                            "%" +
                            ("00" + c.charCodeAt(0).toString(16)).slice(-2)
                          );
                        })
                        .join("")
                    );

                    const token = JSON.parse(jsonPayload);
                    localStorage.setItem("token", JSON.stringify(token));
                    var redirectUrl = "main.html";
                    switch (token.user_type) {
                      case "rc":
                        redirectUrl = "overview-rc.html";
                        break;
                        case "admin":
                        redirectUrl = "main.html";
                        break;
                    }
                    var additionalParams = "";

                    if (redirectUrl) {
                      location.href = redirectUrl + additionalParams;
                    }
                  })
                  .catch(function (error) {
                    {
                      Swal.fire({
                        text: "Los datos ingresados son incorrectos, por favor intente de nuevo.",
                        icon: "error",
                        buttonsStyling: !1,
                        confirmButtonText: "Aceptar",
                        customClass: { confirmButton: "btn btn-primary" },
                      });
                    }
                  })
                  .finally(function () {
                    e.removeAttribute("data-kt-indicator"), (e.disabled = !1);
                  });
            }
          });
      });
    },
  };
})();

KTSigninGeneral.init();
