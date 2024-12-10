/*
 *
 * MailChimp
 * @ThemeEaster
 */
(function ($) {
    "use strict";
    // Get the form.
    var form = $('#ajax_mc_form');

    // Get the messages div.
    var formMessages = $('#mc-form-messages');
    formMessages.hide();

    // Set up an event listener for the contact form.
    $(form).submit(function (event) {
        // Stop the browser from submitting the form.
        event.preventDefault();

        // Serialize the form data.
        var formData = $(form).serialize();
        // Submit the form using AJAX.
        $.ajax({
                type: 'POST',
                url: $(form).attr('action'),
                data: formData
            })
            .done(function (response) {
                // Make sure that the formMessages div has the 'success' class.
                $(formMessages).removeClass('alert-danger');
                $(formMessages).addClass('alert-success');

                // Set the message text.
                $(formMessages).text(response);
                formMessages.show();

                setTimeout(function(){
                    formMessages.hide();
                }, 5000);

                // Clear the form.
                $('#mc_email').val('');
            })
            .fail(function (data) {
                // Make sure that the formMessages div has the 'error' class.
                $(formMessages).removeClass('alert-success');
                $(formMessages).addClass('alert-danger');

                // Set the message text.
                if (data.responseText !== '') {
                    $(formMessages).text(data.responseText);
                } else {
                    $(formMessages).text('Oops! An error occured and your message could not be sent.');
                }
                formMessages.show();

                setTimeout(function(){
                    formMessages.hide();
                }, 5000);
            });

    });

})(jQuery);
