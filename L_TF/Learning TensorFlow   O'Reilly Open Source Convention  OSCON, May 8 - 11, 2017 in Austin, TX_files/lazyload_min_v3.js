function getLazy(){var lazy_elements=$(".lazy");var current_view=$(window).height()+$(window).scrollTop();lazy_elements.each(function(){var that=$(this),current_vertical_element_position=that.offset().top;if(current_view>current_vertical_element_position){that.attr("src",that.data("imgSrc"));that.next(".lazy_placeholder").remove();that.removeClass("lazy")}})}function delayLazy(){var lazy_elements=$(".lazy");lazy_elements.each(function(){var that=$(this);that.attr("src",that.data("imgSrc"));that.next(".lazy_placeholder").remove();that.removeClass("lazy")})}getLazy();setTimeout(delayLazy,3000);