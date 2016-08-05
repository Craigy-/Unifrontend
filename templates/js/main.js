$(function () {
  // Визуальная обработка ошибок в формах
  var inputs = '.input, select, textarea, .SSContainerDivWrapper',
      defaultValues = ['', 0];

  var $formErrors = $('.form .form-error');
  if ($formErrors.length) {
    setInterval(function () {
      $formErrors.find(inputs).each(function () {
        var $par = $(this).hasClass('SSContainerDivWrapper') ? $(this).parent().parent() : $(this).parent(),
            val = $(this).hasClass('SSContainerDivWrapper') ? $(this).parent().prev().val() : $(this).val(),
            activeState = $(this).hasClass('SSContainerDivWrapper') ? $(this).is(':visible') : $(this).is(':focus');
        if (activeState) {
          $par.data('wasError', true);
          $par.removeClass('form-error');
        } else {
          if ($par.data('wasError')) {
            $par.removeClass('form-error');
            if ($.inArray(val, defaultValues) != -1) {
              $par.addClass('form-error');
            }
          }
        }
      });
    }, 111);
  }
});