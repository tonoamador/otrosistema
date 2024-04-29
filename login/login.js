"use strict";

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
                  .post("https://hcpboca.ddns.net:3050/api/login/", {
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
                    console.log(token);
                    localStorage.setItem("token", JSON.stringify(token));
                    Swal.fire({
                      text: "You have successfully logged in!",
                      icon: "success",
                      buttonsStyling: !1,
                      confirmButtonText: "Ok, got it!",
                      customClass: { confirmButton: "btn btn-primary" },
                    }).then(function (e) {
                      if (e.isConfirmed) {
                        var redirectUrl = t.getAttribute(
                          "data-kt-redirect-url"
                        );
                        var additionalParams = "";

                        if (redirectUrl) {
                          location.href = redirectUrl + additionalParams;
                        }
                      }
                    });
                  })
                  .catch(function (error) {
                    {
                      Swal.fire({
                        text: "Los datos ingresados son incorrectos, por favor intente de nuevo.",
                        icon: "error",
                        buttonsStyling: !1,
                        confirmButtonText: "Ok, got it!",
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
