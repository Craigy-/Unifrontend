$(function () {
  // Обработка ошибок в формах
  $('.form .form-error').each(function () {
    $(this).find('.input, textarea').on('focus', function () {
      $(this).data('wasError', true).parent().removeClass('form-error');
    }).on('blur', function () {
      if ($(this).data('wasError') && $(this).val() == '') {
        $(this).parent().addClass('form-error');
      }
    });
  });
});