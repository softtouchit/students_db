/**
 * My module:
 *  description about what it does
 */
X.sub("initTable", function(evt, table) {
    
    var limit = 8;
    var items = [];
    var start=1;
    var tableEl = X(table.id);
    
    var listService = tableEl.dataset.src;
    
    var cols = null;
    if (tableEl.dataset.cols) {
        cols = tableEl.dataset.cols.split(',');
    }
    
    var html ="";
    html += '<thead><tr>';
    
    var colNames = tableEl.dataset.colNames.split(',');
    
    colNames.forEach(function(item) {
       html += '<th>' +item + '</th>'; 
    });
    
    html += '</tr></thead><tbody id="pList"></tbody>';
   
    tableEl.innerHTML = html;
    
    var elList = X('pList');
    
    load();

    function gotoPage(evt, page) {
        start = page.start;
        load();
    }
    
    X.sub("refresh", load);

    X.sub('gotoPage', gotoPage);

    function load() {
        var service =listService + ((listService.indexOf('?')<0) ? '?' : '&' ) + 'limit=' + limit + '&start=' + start+'&'+(tableEl.dataset.query||"");
        X.get(service, displayList);
    }    
    
    function renderRow(item) {
        var res ='';
        for (var i=0;i<colNames.length;++i) {
           var r = table.render || render;
           res += '<td>' + r(i, colNames[i], item) + '</td>';
        }
        return res;
    }
    
    function render(i, name, item) {
        if (cols && cols.length>i) {
            return item[cols[i]];
        }
        return "No cols defined";
    }
    

    function displayList(txtResp) {
        var resp = JSON.parse(txtResp);
        items = [];
        resp.meta = resp.meta || {
            total: "0",
            size: "0"
        };
        if (resp.meta && resp.meta.total === '0') {
            elList.innerHTML = "";
        } else {
            items = resp.data;
            var size = parseInt(resp.meta.size);
            var res = "";
            for (var i = 0; i < size; ++i) {
                var item = resp.data[i];
                res += '<tr>' +renderRow(item) + '</tr>';
            }
            elList.innerHTML = res;
        }

        resp.limit = limit;
        X.pub('pagination', resp);
    }

    X.sub("pagination", function(evt, resp) {
        
        //pagination
        var pagination = X('pagination');
    
        var limit = resp.limit || 10;
        limit = parseInt(limit);
        var sb ="";
        var start = parseInt(resp.meta.start);
        var total = parseInt(resp.meta.total);
        var totalPages = Math.ceil(total / limit);
        var currentPage = Math.floor(start / limit) + 1;
    
    
        var firstPage = Math.max(currentPage - 4, 1);
        var lastPage = Math.min(Math.max(currentPage + 4, 9), totalPages);
    
        sb +='<nav aria-label="Page navigation ">';
        sb +='<ul class="pagination">';
    
    
        if (currentPage > 1) {
            sb  +='<li class="page-item"><a class="page-link" href="#" data-onclick="gotoPage" data-start="'+ (((currentPage - 2) * limit) + 1)   +'">Previous</a></li>' ;
        }
        if (firstPage > 2) {
            sb  +='<li class="page-item"><a class="page-link" href="#" data-onclick="gotoPage" data-start="'+ 0   +'">Previous</a></li>' ;
        }
    
        for (var i = firstPage; i < lastPage + 1; ++i) {
            if (i === currentPage) {
                sb +='<li class="page-item active"><a class="page-link" href="#">'+ i + '</a></li>';
            } else {
                sb  +='<li class="page-item"><a class="page-link" href="#" data-onclick="gotoPage" data-start="'+ (((i - 1) * limit) + 1)   +'">'+i+'</a></li>' ;
            }
        }
    
        if (lastPage < totalPages) {
                sb  +='<li class="page-item"><a class="page-link" href="#" data-onclick="gotoPage" data-start="'+ (((totalPages - 1) * limit) + 1)   +'">'+totalPages+'</a></li>' ;
        }
    
        if (currentPage * limit < total) {
            sb  +='<li class="page-item"><a class="page-link" href="#" data-onclick="gotoPage" data-start="'+ ((currentPage * limit) + 1)   +'">Next</a></li>' ;
        }
        
        sb += '</ul></nav>';
        
        pagination.innerHTML = sb;
    
    
    });    
    
});
