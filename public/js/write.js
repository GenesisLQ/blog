// 渲染 markdown 文章
function markdown() {
	var converter = new showdown.Converter(),
		text = $('.write').val(),
		html = converter.makeHtml(text);
	$('.preview-text').html(html)
}

// 显示提示信息
function tips(html, handler) {
	$('.tip').html(html)
	$('#titleModal').modal('hide')
	$('#modal-sm').modal('show')
	setTimeout(handler, 1300)
}

$('.write').on('change', function () {
	markdown()
})

$('#article-form').on('submit', function (e) {
	e.preventDefault()
	var $content = $('.write').val()
	var $title = $('.title').val()
	var $des = $('.des').val()
	if (!$content) {
		tips('内容不能为空', function () {
			$('#modal-sm').modal('hide')
		})
	} else if (!$title || !$des) {
		tips('标题或描述不能为空', function () {
			$('#modal-sm').modal('hide')
		})
	} else if ($content && $title && $des) {
		var formData = $(this).serialize()
		$.ajax({
			url: '/publish_article',
			type: 'post',
			data: formData,
			dataType: 'json',
			success: function (data) {
				if (data.res_code === 9) {
					tips('发表成功', function () {
						window.location.href = '/personal_home'
					})
				}
			}
		})
	}
})
