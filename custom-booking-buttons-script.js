(function ($){
    "use strict";
    // WhatsApp Booking Button
    $(document).on("click", "#whatsapp-booking-button", function (e) {
        e.preventDefault();
        const formData = getFormData();
        const message = formatWhatsAppMessage(formData);
        const url = `https://wa.me/${bookingData.whatsappNumber}?text=${encodeURIComponent(message)}`;

        // Debugging: Log the WhatsApp URL
        // console.log('WhatsApp URL:', url);

        window.open(url, '_blank');
    });

    // Email Booking Button
    $(document).on("click", "#email-booking-button", function (e) {
        const formData = getFormData();
        const subject = `Booking Inquiry: ${bookingData.tourTitle}`;
        const body = formatEmailBody(formData);
        const url = `mailto:${bookingData.emailAddress}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

        // Debugging: Log the Email URL
        // console.log('Email URL:', url);

        window.location.href = url;
    });

    // Function to get form data
    function getFormData() {
        const formData = {
            startDate: $('#ttbm_tour_datetime').val(),
            totalPrice: $('#ttbm_total_price').val(),
            tickets: [],
            services: [],
        };

        // Get ticket data
        $('.mp_tour_ticket_type tbody tr').each(function () {
            // Check if the row contains the ticket quantity input
            const ticketQtyInput = $(this).find('input[name="ticket_qty[]"]');
            
            if (ticketQtyInput.length > 0) {
                const ticketPrice = ticketQtyInput.attr('data-price'); // Get the data-price attribute        
                const ticketName = $(this).find('[data-ticket-type-name]').attr('data-ticket-type-name');
                const ticketQty = ticketQtyInput.val();
                
                // console.log("TICKET::", { name: ticketName, qty: ticketQty, price: ticketPrice });
                
                if (ticketName && ticketQty > 0) {
                    formData.tickets.push({ name: ticketName, qty: ticketQty, price: ticketPrice });
                }
            }
        });
        

        // Get service data
        $('.mp_tour_ticket_extra tbody tr').each(function () {

            const serviceQtyInput = $(this).find('input[name="service_qty[]"]');

            if (serviceQtyInput.length > 0) {
                const servicePrice = serviceQtyInput.attr('data-price'); // Get the data-price attribute        
                const servicetName = $(this).find('[data-ticket-type-name]').attr('data-ticket-type-name');
                const serviceQty = serviceQtyInput.val();
                
                // console.log("SERVICES::", { name: servicetName, qty: serviceQty, price: servicePrice });
                
                if (servicetName && serviceQty > 0) {
                    formData.tickets.push({ name: servicetName, qty: serviceQty, price: servicePrice });
                }
            }
        });

        // Debugging: Log the form data
        console.log('Form Data:', formData);

        return formData;
    }

    // Function to format WhatsApp message
    function formatWhatsAppMessage(formData) {
        let message = `Hello, I want to book a tour: ${bookingData.tourTitle} (#${bookingData.tourId}).\n\n`;
        message += `Start Date: ${formData.startDate}\n`;
        message += `Total Price: Rp${formData.totalPrice}\n\n`;

        if (formData.tickets.length > 0) {
            message += 'Tickets:\n';
            formData.tickets.forEach(ticket => {
                message += `- ${ticket.name} (${ticket.price}): ${ticket.qty}\n`;
                message += `- Total: ${ticket.price * ticket.qty}\n`;
                message += `- ----------------------\n`;
            });
        }

        if (formData.services.length > 0) {
            message += '\nExtra Services:\n';
            formData.services.forEach(service => {
                message += `- ${service.name} (${service.price}): ${service.qty}\n`;
                message += `- Total: ${service.price * service.qty}\n`;
                message += `- ----------------------\n`;
            });
        }

        // Debugging: Log the WhatsApp message
        // console.log('WhatsApp Message:', message);

        return message;
    }

    // Function to format email body
    function formatEmailBody(formData) {
        let body = `I would like to book the following tour: ${bookingData.tourTitle} (#${bookingData.tourId}).\n\n`;
        body += `Start Date: ${formData.startDate}\n`;
        body += `Total Price: Rp${formData.totalPrice}\n\n`;

        if (formData.tickets.length > 0) {
            body += 'Tickets:\n';
            formData.tickets.forEach(ticket => {
                body += `- ${ticket.name} (${ticket.price}): ${ticket.qty}\n`;
                body += `- Total: ${ticket.price * ticket.qty}\n`;
                body += `- ----------------------\n`;
            });
        }

        if (formData.services.length > 0) {
            body += '\nExtra Services:\n';
            formData.services.forEach(service => {
                body += `- ${service.name} (${service.price}): ${service.qty}\n`;
                body += `- Total: ${service.price * service.qty}\n`;
                body += `- ----------------------\n`;
            });
        }

        body += '\nPlease provide more details.';

        // Debugging: Log the email body
        // console.log('Email Body:', body);

        return body;
    }
}(jQuery));