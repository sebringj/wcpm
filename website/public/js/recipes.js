(function() {
	var rows = [];

	$('.collection .row').each(function() {
		var $this = $(this);
		rows.push({
			title: $this.find('.title').text(),
			contributor: $this.find('.description p a').text(),
			meats: $this.find('img').attr('alt').split(','),
			html: '<div class="col-md-6"><div class="row">' + $this.html() + '</div></div>'
		});
	});

	var $fc = $('.filter-contributor');
	var options = [];
	var contributorLookup = {};
	var contributors = [];

	_.each(rows, function(row) {
		for(var i = 0; i < row.meats.length; i++) {
			if (row.meats[i].trim() === '') {
				row.meats.splice(i, 1);
				i--;
			}
		}
		if (!row.contributor || row.contributor.trim() === '')
			return;
		if (contributorLookup[row.contributor])
			return;
		contributorLookup[row.contributor] = true;
		contributors.push({ contributor: row.contributor });
	});

	contributors = _.sortByOrder(contributors, ['contributor'], ['asc'])
	_.each(contributors, function(row) {
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
				return row.meats.indexOf(sortFilter.meat) > -1;
			});
		if (sortFilter.contributor)
			rowsClone = _.filter(rowsClone, function(row) {
				return row.contributor === sortFilter.contributor;
			});
		rowsClone = _.sortByOrder(rowsClone, ['title'], [sortFilter.sort]);
		var html = _.map(rowsClone, function(row) {
			return row.html;
		});
		var rendered = html.join('');
		if (rendered === '')
			rendered = '<div class="no-results">Oops, nothing matches.</div>'
		else
			rendered = '<div class="row">' + rendered + '</div>';
		$('.collection').html(rendered);
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
