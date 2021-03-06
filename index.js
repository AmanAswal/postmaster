// utility function
// 1. to get DOM element from string
function getElementFromString(string) {
    let div = document.createElement('div');
    div.innerHTML = string;
    return div.firstElementChild;
}

// initialize no. of parameters
let addedParamsCount = 0;

// hide the parameters box initially
let parametersBox = document.getElementById('parametersBox');
parametersBox.style.display = 'none';

// if the user clicks on params, hide the json box
let paramsRadio = document.getElementById('paramsRadio');
paramsRadio.addEventListener('click', () => {
    document.getElementById('requestJsonBox').style.display = 'none';
    document.getElementById('parametersBox').style.display = 'block';
})

// if the user clicks on json, hide the params box
let jsonRadio = document.getElementById('jsonRadio');
jsonRadio.addEventListener('click', () => {
    document.getElementById('parametersBox').style.display = 'none';
    document.getElementById('requestJsonBox').style.display = 'block';
})

// if the user clicks on + button, add more parameters
let addParam = document.getElementById('addParam');
addParam.addEventListener('click', () => {
    let params = document.getElementById('params');
    let string = `
    <div class="form-row my-2">
        <label for="url" class="col-sm-2 col-form-label">Parameter ${addedParamsCount + 2}</label>
        <div class="col-md-4">
            <input type="text" class="form-control" id="parameterKey${addedParamsCount + 2}" placeholder="Enter Parameter ${addedParamsCount + 2} Key">
        </div>
        <div class="col-md-4">
            <input type="text" class="form-control" id="parameterValue${addedParamsCount + 2}" placeholder="Enter Parameter ${addedParamsCount + 2} Value">
        </div>
        <button class="btn btn-primary deleteParam">-</button>  
    </div>
    `;

    // convert the element string to DOM node
    let paramElement = getElementFromString(string);
    params.appendChild(paramElement);

    // add an event listener to remove the parameter on clicking - button
    let deleteParam = document.getElementsByClassName('deleteParam');
    for (item of deleteParam) {
        item.addEventListener('click', (e) => {
            // add alert if you want to confirm deletion
            e.target.parentElement.remove();
        })
    }

    addedParamsCount++;
})

// if the user clicks on submit button
let submit = document.getElementById('submit');
submit.addEventListener('click', () => {
    // show "please wait" in the response box to request patience from the user
    // document.getElementById('responseJsonText').value = "please wait.. Fetching response..";
    document.getElementById('responsePrism').innerHTML = "please wait.. Fetching response..";

    // fetch all the values that user has entered
    let url = document.getElementById('url').value;
    let requestType = document.querySelector("input[name='requestType']:checked").value;
    let contentType = document.querySelector("input[name='contentType']:checked").value;

    // if user has selected params option instead of json, collect all the paramaters in an object

    if (contentType == 'params') {
        data = {};
        for (let i = 0; i < addedParamsCount + 1; i++) {
            if (document.getElementById('parameterKey' + (i + 1)) != undefined) {
                let key = document.getElementById('parameterKey' + (i + 1)).value;
                let value = document.getElementById('parameterValue' + (i + 1)).value;
                data[key] = value;
            }
        }
        data = JSON.stringify(data);
    }
    else {
        data = document.getElementById('requestJsonText').value;
    }

    // log all values in the console for debugging
    console.log('URL is ', url);
    console.log('req type : ', requestType);
    console.log('contentType : ', contentType);
    console.log('data : ', data);

    // if the request type is get, invoke fetch api to create a get request
    if (requestType == 'GET') {
        fetch(url, {
            method: 'GET'
        })
            .then(response => response.text())
            .then((text) => {
                // document.getElementById('responseJsonText').value = text;
                document.getElementById('responsePrism').innerHTML = text;
                Prism.highlightAll();
            })
    }
    // post request
    else {
        fetch(url, {
            method: 'POST',
            body: data,
            headers: {
                'Content-Type': 'application/json; charset=UTF-8',
            }
        })
            .then(response => response.text())
            .then((text) => {
                // document.getElementById('responseJsonText').value = text;
                document.getElementById('responsePrism').innerHTML = text;
                Prism.highlightAll();
            })
    }
});
