console.log("Back-to-top script loaded");

// get button
      const backToTopButton = document.getElementById("backToTop");

      // show button when user scrolls center length down
      window.onscroll = function () {
        if (
          document.body.scrollTop > 100 ||
          document.documentElement.scrollTop > 100
        ) {
          backToTopButton.style.display = "block";
        } else {
          backToTopButton.style.display = "none";
        }
      };

      // scroll to top when button clicked
      backToTopButton.addEventListener("click", function () {
        window.scrollTo({ top: 0, behavior: "smooth" });
      });