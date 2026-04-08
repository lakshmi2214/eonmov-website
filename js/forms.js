import { submitToSheet } from "./sheetsClient.js";

function showPopup(popupEl) {
  if (!popupEl) return;
  popupEl.style.display = "flex";
}

function hidePopup(popupEl) {
  if (!popupEl) return;
  popupEl.style.display = "none";
}

window.closePopup = function closePopup() {
  hidePopup(document.getElementById("thankYouPopup"));
};

async function handleSubmit({ form, sheet, getData }) {
  const popup = document.getElementById("thankYouPopup");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    
    console.log("🚀 Form submission started");
    console.log("📋 Sheet:", sheet);

    try {
      const data = getData();
      console.log("📊 Form data:", data);
      
      console.log("📡 Sending to Google Sheets...");
      await submitToSheet(sheet, data);
      
      console.log("✅ Submission successful!");
      showPopup(popup);
      form.reset();
    } catch (err) {
      console.error("❌ Submission failed:", err);
      alert(err?.message || "Submission failed");
    }
  });
}

window.addEventListener("DOMContentLoaded", () => {
  console.log("🎯 DOM loaded, looking for forms...");
  
  const enquiryForm = document.getElementById("enquiryForm");
  console.log("📝 Enquiry form found:", !!enquiryForm);
  
  if (enquiryForm) {
    console.log("✅ Setting up enquiry form handler");
    handleSubmit({
      form: enquiryForm,
      sheet: "Enquiries",
      getData: () => ({
        Date: new Date().toISOString(),
        Name: enquiryForm.querySelector('[name="name"]').value,
        Phone: enquiryForm.querySelector('[name="phone"]').value,
        Email: enquiryForm.querySelector('[name="email"]').value,
        Organisation: enquiryForm.querySelector('[name="organisation"]').value,
        Message: enquiryForm.querySelector('[name="message"]').value,
      }),
    });
  }

  const partnershipForm = document.getElementById("partnershipForm");
  console.log("📝 Partnership form found:", !!partnershipForm);
  
  if (partnershipForm) {
    console.log("✅ Setting up partnership form handler");
    handleSubmit({
      form: partnershipForm,
      sheet: "Partnerships",
      getData: () => ({
        Date: new Date().toISOString(),
        Name: partnershipForm.querySelector('[name="name"]').value,
        Phone: partnershipForm.querySelector('[name="phone"]').value,
        Email: partnershipForm.querySelector('[name="email"]').value,
        Type: partnershipForm.querySelector('[name="inquiry_type"]').value,
        State: partnershipForm.querySelector('[name="state"]').value,
        City: partnershipForm.querySelector('[name="city"]').value,
        Found_Us: partnershipForm.querySelector('[name="found_us"]').value,
      }),
    });
  }
});
