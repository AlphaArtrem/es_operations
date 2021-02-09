const filters = ["date", "sport", "entity", "writer", "publishedTime", "editor"];
let filterValues = {};
let filterBubbles = document.getElementById("filters")

for(let i = 0; i < filters.length; i++){
    let filterDropdown = document.getElementById(filters[i]);
    filterDropdown.addEventListener("change", () => {
        filterValues[filters[i]] = [filterDropdown.value ,`
        <div class="col-sm-auto" style="background-color: white; margin-right: 1%">
            <div class="col-sm">
                <div class="row">
                    <div class="col-sm-auto">
                    ${filterDropdown.value}
                    </div>
                    <div class="col-sm-auto">
                    <button class="btn" style="padding: 0%;" onClick="removeFilter(${filters[i]})"><i class="fa fa-close"></i></button>
                    </button>
                    </div>
                </div>
            </div>
        </div>`];
        filterBubbles.innerHTML = "";
        for(let filter in filterValues){
            filterBubbles.innerHTML += filterValues[filter][1];
        }

        if(lenghtOfObject(filterValues) <= 6){
            filterBubbles.innerHTML += `
            <div class="col-sm-auto">
                <button class="btn btn-dark" style="padding: 3% 20% 3% 20%;" onClick="showFilteredData()"">Filter</button>
            </div>
           `;
        }
    });
}

const removeFilter = (filterName) => {
    delete filterValues[filterName];
    filterBubbles.innerHTML = "";
    for(let filter in filterValues){
        filterBubbles.innerHTML += filterValues[filter][1];
    }
};

const lenghtOfObject = (object) =>{
    let length = 0;
    for(let _ in object){
        length++;
    }
    return length;
}

const showFilteredData = () => {
    let url = `http://${window.location.host}/test?`;
    for(let filter in filterValues){
        url += filter + "=" + filterValues[filter][0] + '&';
    }
    console.log(url);
    fetch(url).then(response => response.json())
    .then( (result) => {
        if("error" in result){
            console.log(result);
        }else{
            console.log(result);
            document.getElementById("filter-table").style.visibility = "visible";
            let tableData = document.getElementById("filter-table-body");
            tableData.innerHTML = "";
            for(const data in result.result.rows){
                const dateTime = new Date(result.result.rows[data].timestamp_ist);
                tableData.innerHTML += `
                <tr>
                    <td>${dateTime.getDate()}/${dateTime.getMonth()}/${dateTime.getFullYear()}</td>
                    <td>${result.result.rows[data].sports}</td>
                    <td>${result.result.rows[data].entities}</td>
                    <td>${result.result.rows[data].author}</td>
                    <td>${dateTime.getTime()}</td>
                    <td>${result.result.rows[data].editor}</td>
                    <td>${result.result.rows[data].word_count}</td>
                    <td>${result.result.rows[data].youtube_videos_count}</td>
                </tr>
                `;
            }
        }
    })
    .catch(error => console.log('error:', error));
}