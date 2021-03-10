const filters = ["sport", "entity", "writer", "start-time", "end-time"];
let filterValues = {};
let filterBubbles = document.getElementById("filters");
let currentIndex = 0;
let lastIndices = [];

currentQueryResult = null;
dateCount = {};

const removeFilter = (filterName) => {
    delete filterValues[filterName];
    filterBubbles.innerHTML = "";
    for(let filter in filterValues){
        filterBubbles.innerHTML += filterValues[filter][1];
    }
    showFilteredData();
};

const lenghtOfObject = (object) =>{
    let length = 0;
    for(let _ in object){
        length++;
    }
    return length;
}

const copyToClipboard = (str) => {
    const el = document.createElement('textarea');
    el.value = str;
    el.setAttribute('readonly', '');
    el.style.position = 'absolute';
    el.style.left = '-9999px';
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    var x = document.getElementById("snackbar");
    x.className = "show";
    setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
    return false;
};


const buildFilterBubbles = ({key, value, text = null, removeKey = null, reBuild = true, reFetch = true}) => {
    filterValues[key] = [
        value,
        `<div class="col-sm-auto" style="background-color: white; margin-right: 1%">
            <div class="col-sm">
                <div class="row">
                    <div class="col-sm-auto">
                    ${text}
                    </div>
                    <div class="col-sm-auto">
                    <button class="btn" style="padding: 0%;" onClick="removeFilter('${removeKey}')"><i class="fa fa-close"></i></button>
                    </button>
                    </div>
                </div>
            </div>
        </div>`
    ];
    if(text === null){
        filterValues[key][1] = '';
    }
    if(reBuild){
        filterBubbles.innerHTML = "";
        for(let filter in filterValues){
            filterBubbles.innerHTML += filterValues[filter][1];
        }
        if(lenghtOfObject(filterValues) == 5){
            filterBubbles.innerHTML += `
            <div class="col-sm-auto">
                <button class="btn btn-dark" style="padding: 3% 20% 3% 20%;" onClick="showFilteredData()"">Filter</button>
            </div>
           `;
        }
    }
    if(reFetch){
        showFilteredData();
    }
};

$(function() {

    var start = moment();
    var end = moment();

    function cb(start, end) {
        buildFilterBubbles({
            key: 'startTime',
            value: start._d.toISOString(),
            reBuild: false,
            reFetch: false
        });
        buildFilterBubbles({
            key: 'endTime',
            value: end._d.toISOString(),
            text: start._d.toLocaleDateString() + ' - ' + end._d.toLocaleDateString(),
            removeKey : 'endTime'
        });
        $('#reportrange span').html(start._d.toLocaleDateString() + ' - ' + end._d.toLocaleDateString());
    }

    $('#reportrange').daterangepicker({
        startDate: start,
        endDate: end,
        ranges: {
           'Today': [moment(), moment()],
           'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
           'Last 7 Days': [moment().subtract(6, 'days'), moment()],
           'Last 30 Days': [moment().subtract(29, 'days'), moment()],
           'This Month': [moment().startOf('month'), moment().endOf('month')],
           'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
        }
    }, cb);

});

const staticDropdownFetch = async () => {
    await fetch(`http://${window.location.host}/sports`).then(response => response.json())
    .then( (result) => {
        if("error" in result){
            console.log(result);
        }else{
            let foundSport = {};
            let sports = document.getElementById("sport");
            sports.innerHTML = "<option selected>All Sports</option>";
            for(const data in result.result.rows){
                if(result.result.rows[data].sports != ""){
                    if(result.result.rows[data].sports.includes(",")){
                        const sportsCur = result.result.rows[data].sports.split(",");
                        for(const index in sportsCur){
                            if(sportsCur[index][0] == " "){
                                const sport = sportsCur[index].substring(1, sportsCur[index].length);
                                if(!(sport in foundSport)){
                                    sports.innerHTML += `<option value="${sport}">${sport}</option>`;
                                    foundSport[sport] = true;
                                }
                            }else{
                                if(!(sportsCur[index] in foundSport)){
                                    sports.innerHTML += `<option value="${sportsCur[index]}">${sportsCur[index]}</option>`;
                                    foundSport[sportsCur[index]] = true;
                                }
                            }
                        }
                    }else{
                        if(!(result.result.rows[data].sports in foundSport)){
                            sports.innerHTML += `<option value="${result.result.rows[data].sports}">${result.result.rows[data].sports}</option>`;
                            foundSport[result.result.rows[data].sports] = true;
                        }
                    }
                }
            }
        }
    })
    .catch(error => console.log('error:', error));

    await fetch(`http://${window.location.host}/writers`).then(response => response.json())
    .then( (result) => {
        if("error" in result){
            console.log(result);
        }else{
            let foundWriters = {};
            let writers = document.getElementById("writer");
            writers.innerHTML = "<option selected>All Writers</option>";
            for(const data in result.result.rows){
                if(result.result.rows[data].author != ""){
                    if(result.result.rows[data].author.includes(",")){
                        const writerCur = result.result.rows[data].author.split(",");
                        for(const index in writerCur){
                            if(writerCur[index][0] == " "){
                                const writer = writerCur[index].substring(1, writerCur[index].length);
                                if(!(writer in foundWriters)){
                                    writers.innerHTML += `<option value="${writer}">${writer}</option>`;
                                    foundWriters[writer] = true;
                                }
                            }else{
                                if(!(writerCur[index] in foundWriters)){
                                    writers.innerHTML += `<option value="${writerCur[index]}">${writerCur[index]}</option>`;
                                    foundWriters[writerCur[index]] = true;
                                }
                            }
                        }
                    }else{
                        if(!(result.result.rows[data].author in foundWriters)){
                            writers.innerHTML += `<option value="${result.result.rows[data].author}">${result.result.rows[data].author}</option>`;
                            foundWriters[result.result.rows[data].author] = true;
                        }
                    }
                }
            }
        }
    })
    .catch(error => console.log('error:', error));
}

staticDropdownFetch();

for(let i = 0; i < filters.length; i++){
    let filterDropdown = document.getElementById(filters[i]);
    filterDropdown.addEventListener("change", async () => {
        if(filters[i] == "sport"){
            await fetch(`http://${window.location.host}/entities?sport=${filterDropdown.value}`).then(response => response.json())
            .then( (result) => {
                if("error" in result){
                    console.log(result);
                }else{
                    let foundEntities = {};
                    let entities = document.getElementById("entity");
                    entities.innerHTML = "<option selected>Choose Entity</option>";
                    for(const data in result.result.rows){
                        if(result.result.rows[data].entities != ""){
                            if(result.result.rows[data].entities.includes(",")){
                                const entitiesCur = result.result.rows[data].entities.split(",");
                                for(const index in entitiesCur){
                                    if(entitiesCur[index][0] == " "){
                                        const entity = entitiesCur[index].substring(1, entitiesCur[index].length);
                                        if(!(entity in foundEntities)){
                                            entities.innerHTML += `<option value="${entity}">${entity}</option>`;
                                            foundEntities[entity] = true;
                                        }
                                    }else{
                                        if(!(entitiesCur[index] in foundEntities)){
                                            entities.innerHTML += `<option value="${entitiesCur[index]}">${entitiesCur[index]}</option>`;
                                            foundEntities[entitiesCur[index]] = true;
                                        }
                                    }
                                }
                            }else{
                                if(!(result.result.rows[data].entities in foundEntities)){
                                    entities.innerHTML += `<option value="${result.result.rows[data].entities}">${result.result.rows[data].entities}</option>`;
                                    foundEntities[result.result.rows[data].entities] = true;
                                }
                            }
                        }
                    }
                }
            })
            .catch(error => console.log('error:', error));
            buildFilterBubbles({
                key: filters[i],
                value: filterDropdown.value,
                text: filterDropdown.value,
                removeKey : filters[i]
            });
        }else if(filters[i] == "start-time" || filters[i] == "end-time"){
            if(document.getElementById("start-time").value == '' || document.getElementById("end-time").value == ''){
                return;
            }
            let start = document.getElementById("start-time").value.split(":");
            let end = document.getElementById("end-time").value.split(":");
            if(Number(start[0]) > Number(end[0])){
                return;
            }
            if(Number(start[0]) == Number(end[0])){
                if(Number(start[1]) > Number(end[1])){
                    return;
                }
            }
            buildFilterBubbles({
                key: 'time',
                value: filterDropdown.value,
                text: `${document.getElementById("start-time").value} - ${document.getElementById("end-time").value}`,
                removeKey : filters[i]
            });
        }else{
            buildFilterBubbles({
                key: filters[i],
                value: filterDropdown.value,
                text: filterDropdown.value,
                removeKey : filters[i]
            });
        }
    });
}

const showFilteredData = async (intialLoad = false) => {
    currentIndex = 0;
    lastIndices = [];
    document.getElementById("loader").style.display = "block";
    document.getElementById("count-table").style.display = "none";
    document.getElementById("filter-table").style.display = "none";
    if(!intialLoad){
        if(!("startTime" in filterValues) || !("endTime" in filterValues)){
            document.getElementById("loader").style.display = "none";
            document.getElementById("filter-table").style.display = "none";
            document.getElementById("error").style = "margin: 1% 5% 1% 5%; visibility: visible";
            document.getElementById("error").innerHTML = "You need to select a date.";
            return;
        }
    }
    let start = document.getElementById("start-time").value.split(":");
    let end = document.getElementById("end-time").value.split(":");
    if(start[0] === "" || end[0] === ""){
        start = ["00", "00"];
        end = ["23", "59"];
    }
    let url = `http://${window.location.host}/articles?`;
    for(let filter in filterValues){
        url += filter + "=" + filterValues[filter][0].replace(/ /g, '_') + '&';
    }
    if(intialLoad){
        const urlParams = new URLSearchParams(window.location.search);
        if(urlParams.has("startTime")){
            await staticDropdownFetch();
            url = `http://${window.location.host}/articles?` + urlParams.toString();
            urlParams.forEach(function(value, key) {
                value = value.replace(/_/g, " ");
                if(key == "startTime" || key == "endTime"){
                    var start = new Date(urlParams.get("startTime"));
                    var end = new Date(urlParams.get("endTime"));
                    buildFilterBubbles({
                        key: 'startTime',
                        value: start.toISOString(),
                        reBuild: false,
                        reFetch: false
                    });
                    buildFilterBubbles({
                        key: 'endTime',
                        value: end.toISOString(),
                        text: start.toLocaleDateString() + ' - ' + end.toLocaleDateString(),
                        removeKey : 'endTime',
                        reFetch: false
                    });
                    $('#reportrange span').html(start.toLocaleDateString() + ' - ' + end.toLocaleDateString());
                }else{
                    buildFilterBubbles({
                        key: key,
                        value: value,
                        text: value,
                        removeKey : key,
                        reFetch: false
                    });
                    if(key in filters){
                        setSelectedIndex(document.getElementById(key), value);
                    }
                }
            });
        }
    }
    await fetch(url).then(response => response.json())
    .then( (result) => {
        console.log(result)
        if("error" in result){
            document.getElementById("filter-table").style.display = "none";
            document.getElementById("error").style = "margin: 1% 5% 1% 5%; visibility: visible";
            document.getElementById("error").innerHTML = error.error;
            console.log(result);
        }else{
            const shareURL = url.replace(`http://${window.location.host}/articles?`, `http://${window.location.host}/?`);
            document.getElementById("share-btn").innerHTML = 
            `<button class="btn btn-outline-success my-2 my-sm-0" onClick="return copyToClipboard('${shareURL}')">
            <i class="fa fa-copy"></i> Share Link</button>`;
            document.getElementById("error").style.display = "none";
            currentQueryResult = result.result.rows;
            for(var row in result.count.rows){
                var date = new Date(result.count.rows[row].date);
                dateCount[date.toLocaleDateString()] = result.count.rows[row].count;
            }
            console.log(dateCount);
            getNextPage(1);
        }
    })
    .catch(error => console.log('error:', error));
    document.getElementById("loader").style.display = "none";
}

let getNextPage = (direction) => {
    currentDateCount = {}
    if((currentIndex >= currentQueryResult.length && direction == 1) || (currentIndex == 0 && direction == -1)){
        return;
    }
    let start = document.getElementById("start-time").value.split(":");
    let end = document.getElementById("end-time").value.split(":");
    if(start[0] === "" || end[0] === ""){
        start = ["00", "00"];
        end = ["23", "59"];
    }
    document.getElementById("filter-table").style.display = "block";
    let tableData = document.getElementById("filter-table-body");
    document.getElementById("count-table").style.display = "block";
    let countTableHead = document.getElementById("count-table-head");
    let countTableData = document.getElementById("count-table-body");
    if(direction == -1){
        if(lastIndices.length > 1){
            lastIndices.pop();
            currentIndex = lastIndices.pop();
        }else{
            return;
        }
    }
    result = currentQueryResult.slice(currentIndex);
    let resultCount = 0;
    let i = 0;
    if(lastIndices[lastIndices.length - 1] != currentIndex){
        lastIndices.push(currentIndex);
    }else{
        return;
    }
    tableData.innerHTML = "";
    countTableData.innerHTML = "";
    countTableHead.innerHTML = "";
    for(const data in result){
        if(resultCount === 50 || currentIndex + i >= currentQueryResult.length){
            currentIndex += i; 
            break;
        }
        const dateTime = new Date(result[data].timestamp_ist);
        if(dateTime.getHours() >= Number(start[0]) && dateTime.getHours() <= Number(end[0])){
            if(dateTime.getHours() == Number(start[0])){
                if(dateTime.getMinutes() < Number(start[1])){
                    continue;
                }
            }

            if(dateTime.getHours() == Number(end[0])){
                if(dateTime.getMinutes() > Number(end[1])){
                    continue;
                }
            }

            tableData.innerHTML += `
            <tr>
                <td>${dateTime.toLocaleDateString()}</td>
                <td><a href='${result[data].article_url} target='_blank'>${result[data].article_title}</td>
                <td>${result[data].sports}</td>
                <td>${result[data].entities}</td>
                <td>${result[data].author}</td>
                <td>${dateTime.toLocaleTimeString()}</td>
                <td>${result[data].editor}</td>
                <td>${result[data].word_count}</td>
                <td>${result[data].youtube_videos_count}</td>
            </tr>
            `;
            resultCount++;
            currentDateCount[dateTime.toLocaleDateString()] = dateCount[dateTime.toLocaleDateString()];
        }
        i++;
    }

    for(var date in currentDateCount){
        countTableHead.innerHTML += `<th scope="col">${date}</th>`;
        countTableData.innerHTML += `<td>${dateCount[date]}</td>`;
    }

    countTableHead.innerHTML += `<th scope="col">Total</th></tr>`;
    countTableData.innerHTML += `<tr><td>${currentQueryResult.length}</td>`;
}

function setSelectedIndex(s, v) {
    for ( var i = 0; i < s.options.length; i++ ) {
        if ( s.options[i].value == v ) {
            s.options[i].selected = true;
            return;
        }
    }
}


showFilteredData(true);