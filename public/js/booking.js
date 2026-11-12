$(document).ready(() =>{
    const text_service = 'Dịch vụ đã chọn';
    var dm_services = JSON.parse($('#dm-service').val());
    var list_services = JSON.parse($('#list-service').val());
    var item_service = JSON.parse($('#item-service').val());
    $('.js-switch').each(function() {
        new Switchery($(this)[0], $(this).data());
    });
    var swiper1 = new Swiper(".mySwiper-step1", {
        slidesPerView: 5,
        slidesPerColumn: 3,
        spaceBetween: 4,
        observer: true,
        observeParents: true,
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },  
    });
    $(document).on('click','.block-service',function(){
        $('#content-step1').hide();
        let html_step2 = step();
        $('#content-step2').show();
        if(!sel.length){
            $('#content-step2').html(html_step2);
            render_item_service();
        }
    })
    $(document).on('click','.nav-service',function(){
        $('.nav-service').removeClass('active');
        $(this).addClass('active');
        $('.js-fullheight').css('height', $('section').height());
    })
    function render_item_service(){
        // let list_item = list_services[id_species];
        let html =``;
        let first="true"
        for (const [id_species, list_item] of Object.entries(list_services)) {
            let default_active ='';
            if(first){
                first = false;
                default_active = "active-content";
            }
            html += `
                <div id="tab-${id_species}" class="md-prevnext-tab ${default_active}">
                    <div class="md-article-list">
            `;
            list_item.forEach(el => {
                html +=`
                    <div class="item-service-header">
                        <label class="control control--checkbox">
                            <div class="content-item d-flex justify-content-between align-items-center">
                                <span>
                                    <div class="title-name pl-2 font-weight-bold">${el.name}</div>
                                    <div class="title-desc pl-2">${el.description}</div>
                                </span>
                                <span class="font-weight-bold">${el.price}</span>
                            </div>
                            <input type="checkbox" name="${el.categoryId}" data-multi="${el.multiSelect ? 1 : 0}" value="${el.id}"/>
                            <div class="control__indicator"></div>
                        </label>
                    </div>  
                `;
            })
            html += `
                    </div>
                </div>
            `;
        };
        $('.category_service').html(html);
        $('.js-fullheight').css('height', $('section').height());
        //
        mobiscroll.settings = {
            theme: 'ios',
            themeVariant: 'light',
            lang: 'en'
        };
    
        var navigation = mobiscroll.nav('#mobiscroll-wrapper', {
            lang: 'en',                          // Specify language like: lang: 'pl' or omit setting to use default
            theme: 'ios',                        // Specify theme like: theme: 'ios' or omit setting to use default
            themeVariant: 'light',               // More info about themeVariant: https://docs.mobiscroll.com/4-10-9/javascript/navigation#opt-themeVariant
            type: 'tab',                         // More info about type: https://docs.mobiscroll.com/4-10-9/javascript/navigation#opt-type
            onItemTap: function (event, inst) {  // More info about onItemTap: https://docs.mobiscroll.com/4-10-9/javascript/navigation#event-onItemTap
                document.querySelector('.active-content').classList.remove('active-content');
                document.getElementById(event.target.getAttribute('data-tab')).classList.add('active-content');
            },
        });
    
        mobiscroll.listview('.md-article-list', {
            theme: 'ios',                        // Specify theme like: theme: 'ios' or omit setting to use default
            themeVariant: 'light',               // More info about themeVariant: https://docs.mobiscroll.com/4-10-9/javascript/navigation#opt-themeVariant
            enhance: true,
            striped: true,
            swipe: false,
        });
    }
    function step(){
        var first = true;
        let step2 = ``;
        step2 += `
        <div class="title-content-service">
            <i class="icon-arrow-left pointer"></i>
            <span class="content-title">Chọn Dịch vụ</span>
        </div>
        <div class="category_tab">
            <div class="swiper-container mySwiper-step2">
                <div id="mobiscroll-wrapper" class="swiper-wrapper">
        `
        for (const [key, value] of Object.entries(dm_services)) {
            let default_active ='';
            if(first){
                first = false;
                default_active = "active";
            }
            step2 += `<div data-tab="tab-${key}" class="swiper-slide nav-service ${default_active}" >${value}</div>`;
        }
        step2 +=`
                </div>
             </div>  
        </div>
        <div class="container category_service">
        </div>
        <div class="choose-service">
            <button id="service-selected" type="button" name="" data-selecteds="">CHỌN <span class="count-service"></span> DỊCH VỤ</button>
        </div>
        `;
        return step2;
    }
    let sel = [];
    $(document).on('click','.item-service-header input[type=checkbox]', function() {
        if(!Number($(this).attr("data-multi"))){
            names = $(this).attr('name');
            $('input[name="'+names+'"]').not(this).prop('checked', false);
        }
        // let key = '';
        sel = $('.category_service input[type=checkbox]:checked').map(function(_, el) {
            return $(el).val();
        }).get();
        $('.count-service').html(sel.length);
    })
    $(document).on('click','#service-selected',function(){
        $('#content-step2').hide();
        $('#content-step1').show();
        let text ="";
        if(!sel.length){
            text = "Mời anh, chị chọn dịch vụ";
        }else{
            text = text_service;
            let html =``;
            sel.forEach(el =>{
                html +=`<div class="service-item">Combo cắt gội 10k</div>`;
            })
        }
        $('.block-service .box-text').children('span').html(text);
        // Lấy các item service đc chọn bên step 2
        let html = ``;
        sel.forEach(el =>{
            html += `<div class="service-item">${item_service[el]}</div>`;
        })
        $('.list-service').html(html);
        get_time_booking();
        check_complete_booking();
    })
    $(document).on('click','.block-time',function(e){
        drop = $(this).closest('.block-box').children('.box-dropdown');
        if(drop.hasClass('fade-in')){
            drop.removeClass('fade-in');
            $(this).find('.title-iconright i').attr('class','icon-caret-right');
        }else{
            drop.addClass('fade-in');
            $(this).find('.title-iconright i').attr('class','icon-caret-down');
            e.stopPropagation();
        }
    })
    $(document).on('click','.item-action',function(){
        $('.select span').text($(this).text());
        day_time = $(this).children('span').data('day');
        $('.select span').attr('data-id',day_time);
        get_time_booking();
        check_complete_booking();
    })
    $(document).click(function() {
        $('.block-box').children('.box-dropdown').removeClass('fade-in')
    });
    function get_time_booking(){
        let html =``;
        $('#content-step1 .swiper-wrapper').empty();
        if(sel.length){
            time_selected = Number($('.select span').attr('data-id'));
            date = new Date(time_selected*1000);
            html = presenttime(date.getDate());
            $('#content-step1 .swiper-wrapper').html(html);
            $('.box-time').show();
        }else{
            $('.box-time').hide();
        }
    }
    function presenttime(time_selected){
        let date = new Date();
        let mins = date.getMinutes();
        let hrs = date.getHours();
        var m = (Math.round(mins/30) * 30) % 60;
        m = m < 10 ? '0' + m : m;
        var h = mins > 30 ? (hrs === 23 ? 0 : ++hrs) : hrs;
        h = h < 10 ? '0' + h : h;
        //
        let unchoose = "";
        html = ``;
        for(let i=8; i <= 17 ; ++i){
            if((h < i-1 &&  i == 8) || (date.getDate() != time_selected)){
                unchoose = "available";
            }else{
                if(h < i-1){
                    unchoose = "available";
                }else{
                    unchoose = "";
                }
            }
            html += `
                <div class="swiper-slide box-time-item ${unchoose}">${i}h00</div>
                <div class="swiper-slide box-time-item ${unchoose}">${i}h30</div>
            `;
        }
        return html;
    }
    $(document).on('click','.available',function(){
        $('.box-time-item').removeClass('active');
        $(this).addClass('active');
        check_complete_booking();
    })
    function check_complete_booking(){
        if(sel.length && $('.swiper-wrapper .box-time-item').hasClass('active')){
            $('#complete-booking').css('background-color','#ffca4a');
            return true;
        }else{
            $('#complete-booking').css('background-color','#e8e8e8');
            return true;
        }
    }
    $(document).on('click','#complete-booking', function(){
        if(check_complete_booking()){
            let servicefree = $('.servicefree:checked').map(function(_,el){return $(el).val();}).get()
            data = {
                'action'        :'booking',
                'service-item'  : sel,
                'time'          : $('#content-step1 .swiper-wrapper .active').text(),
                'date'          : $('.select span').data('id'),
                'service-free'  : JSON.stringify(servicefree),
                'consulting'    : $('input[name=consulting]:checked').val(),
                'photo'         : $('input[name=photo]:checked').val(),
            }
            $.ajax({
                url: 'completebooking',
                type: 'post',
                data: data,
            }).done(function(response){
                if(response)
                    Swal.fire({icon: 'success',title: 'Đặt lịch thành công!',showConfirmButton: false,timer: 2000,})
                .then(function() {
                    window.location.href = "Home";
                });
            })
        }
    })
})
