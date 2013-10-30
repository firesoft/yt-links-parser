(function ( $ ) {
	$.fn.ytLinksParse = function(options) {
		
		 var settings = $.extend({
			width: 420,
			height: 315,
			replace_html: '<iframe width="##WIDTH##" height="##HEIGHT##" src="http://www.youtube.com/embed/##CODE##" frameborder="0" allowfullscreen></iframe>'
		}, options );
		
		var invalid_matches_beginnings = ['src=', 'value=', 'href='];
		
		var get_replace_html = function(code) {
			return settings.replace_html.replace('##WIDTH##', settings.width).replace('##HEIGHT##', settings.height).replace('##CODE##', code);
		}
		
		var is_false_positive = function(match) {
			for (var i=0; i<invalid_matches_beginnings.length; i++)
			{
				if (match.substring(0, invalid_matches_beginnings[i].length) == invalid_matches_beginnings[i])
					return true;
			}
			return false;
		}
		
		var replace_matches = function(matches, html) {
			var new_html = '';
			
			var offset = 0;
			
			for(var i=0; i<matches.length; i++) {
				var match = matches[i];
				new_html += html.slice(offset, match.offset) + get_replace_html(match.video_code);
				offset = match.offset + match.length;
			}
			new_html += html.slice(offset, html.length);
			
			return new_html;
		}
		
		var get_yt_host = function(match) {
			var host = match.split('/');
			if (host.length < 2)
				return '';
				
			return host[0];
		}
		
		var get_video_code = function(match) {
			match = remove_protocol(match);
		
			var host = get_yt_host(match);
			match = remove_host(match, host);
			
			if (!host || !match)
				return '';
			
			if (host.replace('www.', '') == 'youtu.be') {
				return get_youtu_be_code(match);
			}
			
			var match_arr = match.split('/');
			
			if (match_arr.length > 1) {
				return get_embed_or_v_code(match_arr);
			}
			
			match_arr = match.split('?');
			if (match_arr[0] == 'watch' && match_arr.length > 1) {
				return get_watch_code(match_arr);
			}
			
			return '';
		}
		
		var remove_protocol = function(match) {
			return match.replace(/(https?:)?\/\//i, '');
		}
		
		var remove_host = function(match, host) {
			return match = match.replace(host+'/', '');
		}
		
		var get_youtu_be_code = function(match) {
			match = match.split('?');
			return match[0];
		}
		
		var get_embed_or_v_code = function(match_arr) {
			if (match_arr[0] = 'v' || match_arr[0] == 'embed') {
				match_arr = match_arr[1].split('?');
				return match_arr[0];
			}
			return '';
		}
		
		var get_watch_code = function(match_arr) {
			match_arr = match_arr[1].split('&');
			for (var i=0; i<match_arr.length; i++) {
				var pair = match_arr[i].split('=');
				if (pair.length !=2) {
					continue;
				}
				if (pair[0] == 'v') {
					return pair[1];
				}
			}
			return '';
		}
		
		var remove_ending_from_match = function(match) {
			var last_char = match.charAt(match.length-1);
			
			if (last_char.search(/'|"|<|\s/g) != -1) {
				match = match.substr(0, match.length-1);
			}
			return match;
		}
		
		return this.each(function() {
			var html = $(this).html();
			var pattern = /(href=['"]|src=['"]|value=['"])?((https?:)?\/\/){0,1}(www.youtube.com|youtu.be)\/(.+?)('|"|<|\s|$)/gi;
			
			var matches = [];
			var result = true;
			while(result = pattern.exec(html)) {
				var match = remove_ending_from_match(result[0]);
				
				if (is_false_positive(match))
					continue;
				var video_code = get_video_code(match);
				if (video_code) {
					matches.push({video_code: video_code, offset: result['index'], length: match.length});
				}
			}
			html = replace_matches(matches, html);
			$(this).html(html);
		});
	};
}( jQuery ));