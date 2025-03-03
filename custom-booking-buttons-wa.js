(function ($) {
    "use strict";

    $(document).ready(function () {
        const confirmButton = $('#confirm-wa-button').closest('.vrcordcancbox');
        const cancellationSection = $('.vrcordcancbox').first(); // Target the first instance of .vrcordcancbox

        if (confirmButton.length && cancellationSection.length) {
            confirmButton.insertBefore(cancellationSection);
        }
    });
    // WhatsApp Confirmation Button
    $(document).on("click", "#confirm-wa-button", function (e) {
        e.preventDefault();

        // Extract personal details dynamically
        const personalDetails = {};
        const personalDetailsText = $('.vrc-order-details-top-cdet').text().trim();
        personalDetailsText.split('\n').forEach(line => {
            const separatorIndex = line.indexOf(':'); // Find the first colon
            if (separatorIndex !== -1) {
                const key = line.substring(0, separatorIndex).trim(); // Extract the key
                const value = line.substring(separatorIndex + 1).trim(); // Extract the value
                personalDetails[key] = value; // Add to the personalDetails object
            }
        });

        // Extract order details dynamically
        const orderDetails = {};
        $('.vrc-order-details-top-odet .vrc-order-details-info-inner').each(function () {
            const key = $(this).find('.vrc-order-details-info-key').text().trim();
            const value = $(this).find('.vrc-order-details-info-val').text().trim();
            if (key && value) {
                orderDetails[key] = value; // Add to the orderDetails object
            }
        });

        console.log("ORDER::", orderDetails)

        // Extract order details dynamically
        const summaryDetails = {};
        $('.vrc-order-details-summary .vrc-order-details-summary-entry').each(function () {
            const key = $(this).find('.vrc-order-details-summary-key').text().trim();
            const value = $(this).find('.vrc-order-details-summary-val').text().trim();
            if (key && value) {
                summaryDetails[key] = value; // Add to the summaryDetails object
            }
        });

        console.log("SUMMARY::", summaryDetails)

        // Extract car details dynamically
        const carDetails = {};
        const carDetailsText = $('.vrc-order-details-car-info').text().trim();
        console.log("CARS::", carDetailsText)

        // Extract total price
        const totalPrice = $('.vrc-order-details-costs-row-total .vrc_price').text().trim();

        // Format the WhatsApp message
        // Format pesan WhatsApp
        let message = `Halo, saya ingin mengonfirmasi pesanan sewa mobil saya:\n\n`;
        message += `*Detail Pribadi:*\n`;
        for (const [key, value] of Object.entries(personalDetails)) {
            message += `- ${key}: ${value}\n`;
        }
        message += `\n`;

        message += `*Detail Pesanan:*\n`;
        for (const [key, value] of Object.entries(orderDetails)) {
            message += `- ${key}: ${value}\n`;
        }
        message += `\n`;

        message += `*Ringkasan:*\n`;
        for (const [key, value] of Object.entries(summaryDetails)) {
            message += `- ${key}: ${value}\n`;
        }
        message += `\n`;

        message += `*Detail Mobil:*\n`;
        message += carDetailsText

        message += `\n\n`;

        message += `*Total Harga:* Rp${totalPrice}\n\n`;
        message += `Mohon konfirmasi pesanan saya.`;

        console.log("PESAN::", message);

        // Open WhatsApp with the pre-filled message
        const whatsappNumber = bookingData.whatsappNumber; // Use the WhatsApp number from plugin settings
        const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
    });
}(jQuery));