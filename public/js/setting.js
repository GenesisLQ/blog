$('.info').click(function () {
	$(this).addClass('current')
	$('.account').removeClass('current')
	$('.info-setting').css("display", "block")
	$('.account-setting').css("display", "none")
})
$('.account').click(function () {
	$(this).addClass('current')
	$('.info').removeClass('current')
	$('.info-setting').css("display", "none")
	$('.account-setting').css("display", "block")
})

$('#personal-info-form').on('submit', function (e) {
	e.preventDefault()
	// 不能序列化文件数据
	// var formData = $(this).serialize()
	$.ajax({
		url: '/modify_personal',
		type: 'post',
		data: new FormData($('#personal-info-form')[0]),
		async: false,
		cache: false,
		contentType: false,
		processData: false,
		dataType: 'json',
		success: function (data) {
			if (data.res_code === 6) {
				$('.alert').css('display', 'block')
				setTimeout(function () {
					window.location.href = '/'
				}, 1200)
			}
		}
	})
})

// 点击选择按钮同时触发选择文件的按钮
$(".upload").click(function () {
	$('.select_file').click()
})

// 头像预览
$('.select_file').on('change', function () {
	// var reader = new FileReader()
	// // $('.select_file')[0].files[0] 获取 File 对象
	// reader.readAsDataURL($('.select_file')[0].files[0])
	// reader.onload = function () {
	// 	$('.ava-img').attr('src', this.result)
	// }
	var src = window.URL.createObjectURL($('.select_file')[0].files[0])
	$('.ava-img').attr('src', src)
})

$('#pwd-form').on('submit', function (e) {
	e.preventDefault()
	var oldPwd = $('#oldPwd').val()
	var newPwd = $('#newPwd').val()
	var confirm = $('#confirm').val()
	
	console.log(oldPwd, newPwd, confirm)
	
	if (newPwd && confirm && newPwd === confirm) {
		var formData = $(this).serialize()
		$.ajax({
			url: '/modify_pwd',
			type: 'post',
			data: formData,
			dataType: 'json',
			success: function (data) {
				if (data.res_code === 7) {
					$('.success').css('display', 'block')
					setTimeout(function () {
						window.location.href = '/login'
					}, 1200)
				} else if (data.res_code === 8) {
					$('.error-oldpwd').css('display', 'block')
					setTimeout(function () {
						$('.error-oldpwd').css('display', 'none')
					}, 1000)
				}
			}
		})
	} else if (!oldPwd || !newPwd || !confirm) {
		$('.empty-pwd').css('display', 'block')
		setTimeout(function () {
			$('.empty-pwd').css('display', 'none')
		}, 1000)
	} else {
		$('.confirm-pwd').css('display', 'block')
		setTimeout(function () {
			$('.confirm-pwd').css('display', 'none')
		}, 1000)
	}
})



