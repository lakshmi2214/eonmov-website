// Simple form handler - no modules, no complexity
window.addEventListener("DOMContentLoaded", function() {
    console.log("🎯 Forms initialized");
    
    // Google Apps Script URL
    const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwVFuVILsf19rCOemlriZ10IqmNv8-nSXK2qlMAZ5N2KiNNaWOWmFaNl2LSNh12iLb8ew/exec";
    
    // Handle enquiry form
    const enquiryForm = document.getElementById("enquiryForm");
    if (enquiryForm) {
        enquiryForm.addEventListener("submit", async function(e) {
            e.preventDefault();
            await submitForm(enquiryForm, "Enquiries");
        });
    }
    
    // Handle partnership form  
    const partnershipForm = document.getElementById("partnershipForm");
    if (partnershipForm) {
        partnershipForm.addEventListener("submit", async function(e) {
            e.preventDefault();
            await submitForm(partnershipForm, "Partnerships");
        });
    }
    
    function normalizeForSheet(sheetName, data) {
        if (sheetName === "Partnerships") {
            return {
                Date: data.Date,
                Name: data.name || "",
                Phone: data.phone || "",
                Email: data.email || "",
                Type: data.inquiry_type || "",
                State: data.state || "",
                City: data.city || "",
                Found_Us: data.found_us || "",
            };
        }

        if (sheetName === "Enquiries") {
            return {
                Date: data.Date,
                Name: data.name || "",
                Phone: data.phone || "",
                Email: data.email || "",
                Organisation: data.organisation || "",
                Message: data.message || "",
            };
        }

        return data;
    }
    
    // Universal form submit function
    async function submitForm(form, sheetName) {
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        
        try {
            // Show loading state
            submitBtn.textContent = "Sending...";
            submitBtn.disabled = true;
            
            // Collect form data
            const formData = new FormData(form);
            const data = {};
            for (let [key, value] of formData.entries()) {
                data[key] = value;
            }
            data.Date = new Date().toISOString();

            const normalizedData = normalizeForSheet(sheetName, data);
            
            console.log("📊 Submitting to", sheetName, normalizedData);
            
            // Send to Google Sheets
            let response;
            try {
                // Try normal fetch first (works with http://localhost)
                response = await fetch(SCRIPT_URL, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        sheet: sheetName,
                        data: normalizedData
                    })
                });
            } catch (corsError) {
                // Fallback: use no-cors mode for file:// protocol
                console.warn("CORS error, trying no-cors mode...");
                response = await fetch(SCRIPT_URL, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        sheet: sheetName,
                        data: normalizedData
                    }),
                    mode: 'no-cors'
                });
                
                // With no-cors, we can't read response but assume success
                console.log("✅ Form submitted (no-cors mode)");
                showSuccessMessage("Thank you! Your submission has been received.");
                form.reset();
                return;
            }
            
            // If we get here, we have a proper response
            if (!response.ok) {
                const contentType = response.headers.get("content-type") || "";
                const payload = contentType.includes("application/json") ? await response.json() : await response.text();
                const msg = typeof payload === "string" ? payload : (payload && payload.message) ? payload.message : "Submission failed";
                throw new Error(msg);
            }

            console.log("✅ Form submitted successfully");
            showSuccessMessage("Thank you! Your submission has been received.");
            form.reset();
            
        } catch (error) {
            console.error("❌ Error:", error);
            showErrorMessage("Sorry, there was an error. Please try again.");
        } finally {
            // Reset button
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    }
    
    // Show success message
    function showSuccessMessage(message) {
        showMessage(message, "success");
    }
    
    // Show error message
    function showErrorMessage(message) {
        showMessage(message, "error");
    }
    
    // Universal message function
    function showMessage(message, type) {
        // Remove any existing messages
        const existing = document.querySelector('.form-message');
        if (existing) existing.remove();
        
        // Create message element
        const messageEl = document.createElement('div');
        messageEl.className = `form-message ${type}`;
        messageEl.textContent = message;
        messageEl.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 8px;
            font-weight: 600;
            z-index: 9999;
            max-width: 300px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;
        
        // Style based on type
        if (type === "success") {
            messageEl.style.background = "#10b981";
            messageEl.style.color = "white";
        } else {
            messageEl.style.background = "#ef4444";
            messageEl.style.color = "white";
        }
        
        // Add to page
        document.body.appendChild(messageEl);
        
        // Animate in
        setTimeout(() => {
            messageEl.style.transform = "translateX(0)";
        }, 100);
        
        // Remove after 4 seconds
        setTimeout(() => {
            messageEl.style.transform = "translateX(100%)";
            setTimeout(() => messageEl.remove(), 300);
        }, 4000);
    }
});
