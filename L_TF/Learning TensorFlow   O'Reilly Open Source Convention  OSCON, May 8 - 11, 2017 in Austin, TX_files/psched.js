function psched_init(options) {
  window.psched_options = options;
  psched_ids = options["psched_ids"];
  for (i in psched_ids) {
    make_scheduled(psched_ids[i]);
  }
  respids = options["responsible_ids"];
  for (i in respids) {
    make_responsible(respids[i]);
  }
  $('a.en_psched_add').each(function(){
    init_sched_ajax_link(this, 'add');
  });
}

function make_unscheduled(schedulable) {
  var d = psched_find_toggle(schedulable);
  if (psched_options.remove_only) {
    d.parent("div.en_session").remove();
  } else {
    d.empty().append(psched_add_link(schedulable));
    make_unscheduled_hook(d, schedulable);
  }
}

// Isolate the code that depends on which page we're on.
function make_unscheduled_hook(d, schedulable) {
  var is_detail = psched_options.is_detail;
  if (is_detail) {
    $(".en_psched_add").append(psched_add_label());
  }

  d.find("a").each(function() {
    if (is_detail) {
      psched_handle_click(this, 'add', schedulable);
    } else {
      init_sched_ajax_link(this, 'add');
    }
  });

  var is_remove_only = psched_options.remove_only;
  var is_grid = psched_options.is_grid;
  if (!is_remove_only && !is_grid) {
    d.parent("div.en_session").removeClass("en_session_highlight");
  }
}

function make_responsible(schedulable) {
  var d = psched_find_toggle(schedulable);
  if (psched_options.is_grid) {
    d.empty().append(psched_responsible_icon());
  }
  if (!psched_options.remove_only) {
    d.parent("div.en_session").addClass("en_session_highlight");
  }
}

function make_scheduled(schedulable) {
  var d = psched_find_toggle(schedulable);
  d.empty().append(psched_remove_link(schedulable));
  d.find("a").each(function() {
    init_sched_ajax_link(this, 'remove');
  });
  make_scheduled_hook(d, schedulable);
}

// Isolate the code that depends on which page we're on.
function make_scheduled_hook(d, schedulable) {
  var is_detail = psched_options.is_detail;
  if (is_detail) {
    psched_render_add_label(d, schedulable);
  }

  var is_remove_only = psched_options.remove_only;
  var is_grid = psched_options.is_grid;
  if (!is_remove_only && !is_grid) {
    d.parent("div.en_session").addClass("en_session_highlight");
  }
};

function psched_render_add_label(d, schedulable) {
  $(".en_psched_remove").append(
    '<div class="en_psched_add_label">'+psched_options.translations.remove_short+'</div>&nbsp;'
  )
}

function sched_cb(schedulable, how) {
  if (how == 'add') {
    return(function(data) {
      if (data == 'ok') {
        make_scheduled(schedulable);
      } else {
        alert(psched_options.translations.error_add);
      }
      return false;
    });
  } else {
    return(function(data) {
      if (data == 'ok') {
        make_unscheduled(schedulable);
      } else {
        alert(psched_options.translations.error_remove);
      }
      return false;
    });
  }
}

function psched_handle_click(ele, how, schedulable) {
  $(ele).click(function () {
    if (psched_options.remove_only) {
      if (how=='remove' && !confirm(psched_options.translations.remove_confirm)) {
        return(false);
      }
    }
    $(this).find('img').remove();
    $(this).prepend(psched_loading_icon());
    var token = $('meta[name=csrf-token]').attr('content')
    $.post(ele.href, {_token: token }, sched_cb(schedulable, how));
    return false;
  });
}

function init_sched_ajax_link(ele, how) {
  var full_html_id = $(ele).parents("div.en_session_psched").attr("id");
  var html_id = full_html_id.replace(/^psched/, "");
  var attributes_array = full_html_id.split("_");
  var type = attributes_array[1].charAt(0).toUpperCase() + attributes_array[1].slice(1);
  var ele_id = attributes_array[2];
  psched_handle_click(ele, how, { id: ele_id, type: type, html_id: html_id });
}

function psched_url(schedulable, url) {
  var url_array = url.split("?");
  var base_url = url_array[0];
  var url_params =
    (typeof url_array[1] !== 'undefined') ? '&' + url_array[1] : '';
  return base_url + '/' + schedulable.id + '?type=' + schedulable.type + url_params;
}

function psched_remove_url(schedulable) {
  var url = psched_options.actions.remove;
  return psched_url(schedulable, url);
}

function psched_add_url(schedulable) {
  var url = psched_options.actions.add;
  return psched_url(schedulable, url);
}

function psched_add_link(schedulable) {
  return '<a class="en_psched_add" href="' +
    psched_add_url(schedulable) +
    '" title="' + psched_options.translations.add + '">' +
    psched_removed_icon() +
    '</a>';
}

function psched_remove_link(schedulable) {
  return '<a class="en_psched_remove" href="' +
    psched_remove_url(schedulable) +
    '" title="' + psched_options.translations.remove +'">' +
    psched_added_icon() + '</a>';
}

function psched_added_icon() {
  return '<img src="/images/personal-schedule-icon2.png" ' +
    'width="17" height="18" alt="' +
    psched_options.translations.remove +
    '" />';
}

function psched_removed_icon() {
  return '<img src="/images/personal-schedule-icon.png" ' +
    'width="17" height="18" alt="' +
    psched_options.translations.add + '" />';
}

function psched_responsible_icon() {
  return '<img src="/images/respon.gif" width="16" height="16" ' +
      'alt="' + psched_options.translations.responsibility + '" />';
}

function psched_loading_icon() {
  return '<img src="/images/loading.gif" width="16" height="16" ' +
    'style="margin-top: 2px; margin-right: 1px;" alt="Processing..." />';
}

function psched_add_label() {
  return '<div class="en_psched_add_label">' +
    psched_options.translations.add_short +
    '</div>&nbsp;';
}

function psched_find_toggle(schedulable) {
  return $("div#psched" + schedulable.html_id);
}
