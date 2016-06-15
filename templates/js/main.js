$(function () {
  // Обработка ошибок в формах
  $('.form .form-error').each(function () {
    $(this).find('.input, select, textarea').on('focus', function () {
      $(this).data('wasError', true).parent().removeClass('form-error');
    }).on('blur', function () {
      if ($(this).data('wasError') && ($(this).val() == '' || $(this).val() == 'default')) {
        $(this).parent().addClass('form-error');
      }
    });
  });
});