if (typeof _demo==='undefined') _demo={};
_demo.setup = (function(){

    function bindEvents(){
        $('.toggle-code-example').on('click', toggleCodeExamples);
        $('#check').on('click', checkDiff);
    }

    function checkDiff(e){
        e.preventDefault();
        var oldVersion = $('#version').val(),
            newVersion = $('.wiki-header small').text().replace('v'),
            route = 'http://analytics.global.sky.com',
            file = $(this).attr("data-diff") + '.html';
        if (oldVersion.split('.').length<3 || (oldVersion.split('.')[0]<1)){
            $('.sky-form .error').text("The version number is required, and must be '1.0.1' or higher");
            oldVersion = '1.0.1';//get lowest version available
        }
        toolkit.diff({
            oldFile: route + '/' + oldVersion + '/_site/_includes/' + file,
            newFile: route + '/' + newVersion + '/_site/_includes/' + file
        });
    }

    function toggleCodeExamples(){
        var $toggler = $(this);
        var $example = $('#' + $toggler.attr('for'));
        if ($example.hasClass('open')){
            $toggler.removeClass('open');
            $example.removeClass('open');
        } else {
            $toggler.addClass('open');
            $example.addClass('open');
        }
    }

    bindEvents();

}(_demo.tests));


//just for require
if (typeof window.define === "function" && window.define.amd) {
    define("demo", ['tests/tests'], function() {
        return _demo;
    });
}