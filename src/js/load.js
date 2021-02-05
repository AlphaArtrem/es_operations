/*let url="http://localhost:3000/test";
fetch(url).then(response => response.json())
.then( (result) => {
    console.log('success:', result)
    let div=document.getElementById('test');
    div.innerHTML=`title: ${result.title}<br/>message: ${result.message}`;
})
.catch(error => console.log('error:', error));*/

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
    });
}

const removeFilter = (filterName) => {
    delete filterValues[filterName.id];
    filterBubbles.innerHTML = "";
    for(let filter in filterValues){
        filterBubbles.innerHTML += filterValues[filter][1];
    }
};