let currentTab = '';
const active = ['btn-primary'];
const inactive = ['btn-neutral'];
let allissue = [];

const switchTab = (tab) => {
    const tabs = ['all', 'open', 'close'];
    currentTab = tab;
    for (let t of tabs) {
        const tabName = document.querySelector(`#${t}-btn`);

        if (tab === t) {
            tabName.classList.add(...active);
            tabName.classList.remove(...inactive);
        } else {
            tabName.classList.remove(...active);
            tabName.classList.add(...inactive);
        }
    }
    const allCon = document.querySelector("#card-container");
    const openCon = document.querySelector("#open-container");
    const closeCon = document.querySelector("#close-container");

    const containers = [allCon, openCon, closeCon];

    
    containers.forEach(c => c.classList.add('hidden'));

    if (tab === 'all') {
        allCon.classList.remove('hidden');
    }
    else if (tab === 'open') {
        openCon.classList.remove('hidden');
    }
    else {
        closeCon.classList.remove('hidden');
    }
};

switchTab('all');


// API Loading
const allIssueUrl = 'https://phi-lab-server.vercel.app/api/v1/lab/issues';

const loadCards = () => {
    fetch(allIssueUrl)
        .then(res => res.json())
        .then(data => {
            allissue = data.data;
            console.log(allissue);
            displayCards(allissue);
        });
};

loadCards();


// Creating card template
const createCards = (element) => {
    const cardElemnt = document.createElement('div');
    cardElemnt.innerHTML = `
        <div class="bg-white w-full rounded-b-md shadow-lg p-5 space-y-5 cursor-pointer ${element.status === 'open' ? 'open' : 'close'}" id="card-${element.id}"
             onclick="my_modal_5.showModal()">

            <div class="space-y-5">
                <div class="flex justify-between">
                    <img src="./assets/Open-Status.png" alt="" class="w-8">
                    <button class="btn btn-soft btn-error rounded-full">
                        ${element.priority}
                    </button>
                </div>

                <h2 class="font-bold">${element.title}</h2>
                <p>${element.description.slice(0, 40)}...</p>

                <div class="flex gap-2 text-[8px] scale-[0.8] justify-center">
                    <button class="btn btn-outline btn-error rounded-full">
                        ${element.labels[0]}
                    </button>
                    <button class="btn btn-outline btn-warning rounded-full">
                        ${element.labels[1]}
                    </button>
                </div>
            </div>

            <hr class="border-1 border-black/10 w-full inline-block">

            <div>
                <p>#${element.id} by ${element.author}</p>
                <p>${new Date(element.createdAt).toLocaleDateString("en-GB")}</p>
            </div>
        </div>
    `;
    return cardElemnt;
};

const render = (data, containerId) => {

    const renderContainer = document.querySelector(containerId);
    renderContainer.innerHTML = '';
    data.forEach(issue => {
        renderContainer.appendChild(createCards(issue));
    })

}

const displayCards = (data) => {

    const openIssues = data.filter(issue => issue.status === 'open');
    const closeIssues = data.filter(issue => issue.status === 'closed');
    //switchTab();
    console.log(currentTab);
    render(data, '#card-container');
    render(openIssues, '#open-container');
    render(closeIssues, '#close-container');
    switchTab('all');
};

