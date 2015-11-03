/*
$(element).portrait({
    limit: 1024 * 1024 * 1,
    canvas: { width: 360, height: 270, result: 500 },
    lang: {
        reupload: 'Re upload',
        save: 'Save picture',
        cancel: 'Cancel',
        failure: 'update failure',
        success: 'update success',
        filetype: 'please select picture file',
        limit: 'file size must less than 2M',
        leftitle: 'Adjust avatar',
        leftip: 'Drag the box to adjust the position and dimensions.',
        rightitle: 'Preview',
        rightip: 'Avatar preview',
        title: 'Show your best avatar',
        del: 'delete',
        none: 'Please upload a picture',
        min: 'Avatar size min-width 30px'
    },
    fun: function (file) {
        $('.user-face').html('<img src="{0}" />'.format(file));
    },
    cancel: function () {
        alert('click cancel')
    }
});
    limit       :   文件大小( KB )
    canvas      :   
        width   :   画布宽度
        height  :   画布高度
    lang        :   语言包
    fun         :   保存按钮回调事件, base64图片
    cancel      :   取消按钮回调事件
*/
(function ($) {
    
    $.fn.extend({
        portrait: function (ini) {
            var lang = ini.lang || {
                reupload: '重新上传',
                save: '保存',
                cancel: '取消',
                failure: '上传换',
                success: '上传成功',
                filetype: '请选择图片类型的文件',
                limit: '图片文件小于2M',
                leftitle: '调整头像',
                leftip: '拖动方框，调整位置和尺寸',
                rightitle: '预览',
                rightip: '网站头像预览',
                title: '展现您的最佳形像',
                del: '删除头像',
                none: '请先上传头像',
                min: '头像尺寸至少为30像素'
            };
            var par = ini.canvas || { width: '100%', height: '100%', result: 300 };
            var width = par.width + 276;

            $(this).html('<div class="head-portrait-container"><div class="head-portrait-warp"><div class="head-portrait"><div class="head-portrait-choose"><input type="file" name="head-portrait-file" accept="image/gif,image/jpeg,image/x-png" id="uploadHolderPortrait" /></div><div class="head-portrait-holder"><div class="head-portrait-light"></div></div><div class="head-portrait-foot"><input class="head-portrait-reupload" type="button" value="" title="{4}" /></div></div></div><div class="head-portrait-button"><input type="button" class="btn btn-primary head-portrait-button-save" style="display:none" data-dismiss="modal" aria-label="Close" aria-hidden="true" value="{7}"/><button type="button" class="head-portrait-button-cancel" data-dismiss="modal" aria-label="Close" style="display:none" aria-hidden="true">{8}</button/> <label class="head-portrait-button-tips"></label></div></div>'.format(
                lang.leftitle,
                lang.leftip,
                lang.rightitle,
                lang.rightip,
                lang.reupload,
                lang.title,
                lang.del,
                lang.save,
                lang.cancel,
                width
            ));

            $('.head-portrait-preview').css({ height: '{0}px'.format(par.height) });
            $('.head-portrait-left').css({ width: '{0}px'.format(par.width) });
            $('.head-portrait-foot,.head-portrait-reupload').css({ width: '{0}px'.format(par.width) });
            $('.head-portrait-button-tips').data('lang', lang);
            var fun = ini.fun || undefined;
            var max = ini.limit || 1024 * 1024;

            $('input[name=head-portrait-file]').change(function () {
                console.log($('input[name=head-portrait-file]').val());
                var file = this.files[0];

                if (file.size > max) {
                    alert(lang.limit);
                    console.log('limit');
                    return true;
                };
                if (!/image\/\w+/.test(file.type)) {
                    alert(lang.filetype);
                    console.log('filetype');
                    return true;
                }
                console.log(file,par);
                $('.head-portrait-choose').fadeOut(500);
                $('.head-portrait-holder').fadeIn(500);
                imgstream(file, par);
                $('.head-portrait-button-save').data('base64', null);
                $('.head-portrait-reupload,.head-portrait-buttom,.head-portrait-cancel').show();
            });

            $('.head-portrait-reupload,.head-portrait-button-link').click(function () {
                $('input[name=head-portrait-file]').val('');
                $('.head-portrait-holder').fadeOut(500);
                $('.head-portrait-choose').fadeIn(500);
                $('.head-portrait-preview div').html('');
                $('.head-portrait-button-save').data('base64', null);
            });

            
            $('.head-portrait-button-cancel').click(function () {
                if (ini.cancel && typeof (ini.cancel) == 'function') {
                    ini.cancel.call(this);
                }
            });
            $('.head-portrait-button-save').click(function () {
                var data = $(this).data('base64');
                if (!data) {
                    $('.head-portrait-button-tips').css({ color: 'red' }).html(lang.none);
                    setTimeout(function () {
                        $('.head-portrait-button-tips').css({ color: '#666' }).html('');
                    }, 3000);
                    return true;
                }
                if (ini.fun && typeof (ini.fun) == 'function') {
                    ini.fun.call(this, data);
                }
            });
        }
    });
    
    String.prototype.format = function () {
        var args = arguments;
        return this.replace(/\{(\d+)\}/g, function (m, i) {
            return args[i];
        });
    };
    var imgsize = function (width, height, holderWidth, holderHeight) {
        var w = holderWidth, h = holderHeight;
        if (width / height >= holderWidth / holderHeight) {
            if (width > holderWidth) {
                w = holderWidth;
                h = (holderWidth / width) * height;
            }
        } else {
            if (height > holderHeight) {
                h = holderHeight;
                w = (holderHeight / height) * width;
            }
        }
        return { width: w, height: h, ratio: width / w };
    };
    var imgstream = function (file, par) {
        var img = new Image();
        var reader = new FileReader();
        reader.onloadend = function (e) {
            var url = this.result;
            img.src = url;
            img.onload = function () {
                var width = this.width, height = this.height;
                var dorp = imgsize(width, height, par.width, par.height);
                var left = parseInt((par.width - dorp.width) / 2);
                var top = parseInt((par.height - dorp.height) / 2);
                var ncvs = document.createElement('canvas');
                ncvs.width = dorp.width;
                ncvs.height = dorp.height;
                var con = ncvs.getContext('2d');
                con.clearRect(0, 0, dorp.width, dorp.height);
                con.drawImage(img, 0, 0, dorp.width, dorp.height);
                var base64 = ncvs.toDataURL('image/jpeg', 1);

                $('.head-portrait-light').css({ left: '{0}px'.format(left), top: '{0}px'.format(top) }).html('<img src="{0}" />'.format(base64));
                $('.head-portrait-preview div').each(function () {
                    console.log($(this).html());
                    $(this).html('<img src="{0}" />'.format(base64));
                });
                var x = (dorp.width - par.width) / 2, y = (dorp.height - par.height) / 2, x1 = x + par.width, y1 = y + par.height;
                $('.head-portrait-light img').Jcrop({
                    onChange: showPreview,
                    onSelect: showPreview,
                    aspectRatio: 1,
                    setSelect: [x, y, x1, y1],
                    minSize: [40, 40]
                });
                var tips = $('.head-portrait-button-tips');
                function showPreview(coords) {
                    $('.title-36').html(JSON.stringify(coords));
                    if (parseInt(coords.w) > 30) {
                        var s = [200, 60, 40, 30, 50];
                        $('.head-portrait-preview img').each(function (index) {
                            var rx = s[index] / coords.w;
                            var ry = s[index] / coords.h;
                            $(this).css({
                                width: Math.round(rx * dorp.width) + 'px',
                                height: Math.round(ry * dorp.height) + 'px',
                                marginLeft: '-' + Math.round(rx * coords.x) + 'px',
                                marginTop: '-' + Math.round(ry * coords.y) + 'px'
                            });
                        });

                        var cvs = document.createElement('canvas');
                        var size = par.result || 300;
                        size = size < 30 ? 100 : size;
                        cvs.width = size;
                        cvs.height = size;
                        var con = cvs.getContext('2d');
                        con.clearRect(0, 0, size, size);
                        var scale = width / dorp.width;
                        con.drawImage(img, coords.x * scale, coords.y * scale, coords.w * scale, coords.h * scale, 0, 0, size, size);
                        $('.head-portrait-button-save').data('base64', cvs.toDataURL('image/jpeg', 0.8));
                    } 
                };
            };
        };
        reader.readAsDataURL(file);
    };
})(jQuery);
