(function() {
	var rows = [];

	$('.collection .row').each(function() {
		var $this = $(this);
		rows.push({
			title: $this.find('.title').text(),
			contributor: $this.find('.description p a').text(),
			meat: $this.find('img').attr('alt'),
			html: '<div class="row">' + $this.html() + '</div>'
		});
	});

	var $fc = $('.filter-contributor');
	var options = [];
	rows = _.sortByOrder(rows, ['contributor'], ['asc'])
	_.each(rows, function(row) {
		var $option = $('<option>').text(row.contributor);
		options.push($('<div>').append($('<option>').text(row.contributor)).html());
	});

	$fc.append(options.join(''));

	var sortFilter = {
		sort: 'asc',
		meat: '',
		contributor: ''
	};

	function renderRows() {
		var rowsClone = _.clone(rows);
		if (sortFilter.meat)
			rowsClone = _.filter(rowsClone, function(row) {
				return row.meat === sortFilter.meat;
			});
		if (sortFilter.contributor)
			rowsClone = _.filter(rowsClone, function(row) {
				return row.contributor === sortFilter.contributor;
			});
		rowsClone = _.sortByOrder(rowsClone, ['title'], [sortFilter.sort]);
		var html = _.map(rowsClone, function(row) {
			return row.html;
		});
		$('.collection').html(html.join(''));
	}

	$('.content a.sort').on('click', function() {
		var sort = $(this).data('sort') || 'asc';
		sortFilter.sort = (sort === 'asc') ? 'desc' : 'asc';
		var sortText = sortFilter.sort === 'asc' ? 'a-z' : 'z-a';
		$(this).data('sort', sortFilter.sort);
		$(this).find('.sort-by').text(sortText);
		renderRows();
	});

	$('.content .filter-meat').on('change', function() {
		if ($(this).get(0).selectedIndex === 0)
			sortFilter.meat = '';
		else
			sortFilter.meat = $(this).find('option:selected').text();
		renderRows();
	});

	$('.content .filter-contributor').on('change', function() {
		if ($(this).get(0).selectedIndex === 0)
			sortFilter.contributor = '';
		else
			sortFilter.contributor = $(this).find('option:selected').text();
		renderRows();
	});

	renderRows();

})();
