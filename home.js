let currentTab = '';
const active = ['btn-primary'];
const inactive = ['btn-nutral'];

let allissue = [];
let singleissue = [];
let searchkey = [];

const spinner = document.querySelector('#loader');

const showLoader = () => spinner.classList.remove('hidden');
const hideLoader = () => spinner.classList.add('hidden');


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

    [allCon, openCon, closeCon].forEach(c => c.classList.add('hidden'));

    const issueNumber = document.querySelector('#issue-number');

    if (tab === 'all') {
        allCon.classList.remove('hidden');
        issueNumber.innerText = `${allCon.children.length} Issues`;
    }
    else if (tab === 'open') {
        openCon.classList.remove('hidden');
        issueNumber.innerText = `${openCon.children.length} Issues`;
    }
    else {
        closeCon.classList.remove('hidden');
        issueNumber.innerText = `${closeCon.children.length} Issues`;
    }
};

switchTab('all');



const allIssueUrl = 'https://phi-lab-server.vercel.app/api/v1/lab/issues';

const loadCards = () => {
    showLoader();

    fetch(allIssueUrl)
        .then(res => res.json())
        .then(data => {
            allissue = data.data;
            displayCards(allissue);
            hideLoader();
        });
};

loadCards();


const loadModal = (id) => {
    fetch(`https://phi-lab-server.vercel.app/api/v1/lab/issue/${id}`)
        .then(res => res.json())
        .then(data => {
            singleissue = data.data;
            displayModal(singleissue);
        });
};


const createModal = (mod) => {
    const modalelemt = document.createElement('div');

    modalelemt.innerHTML = `
        <div class="modal-box space-y-5">
            <h3 class="text-lg font-bold">${mod.title}</h3>

            <div class="flex items-center gap-3">
                <button class="btn btn-success rounded-full">${mod.status}</button>
                <div class="w-2 h-2 bg-[#64748B] rounded-full"></div>
                <p>Opened by ${mod.author}</p>
                <div class="w-2 h-2 bg-[#64748B] rounded-full"></div>
                <p>${new Date(mod.createdAt).toLocaleDateString("en-GB")}</p>
            </div>

            <div class="flex gap-2">
                <button class="btn btn-outline btn-error rounded-full">${mod.labels[0]}</button>
                <button class="btn btn-outline btn-warning rounded-full">${mod.labels[1]}</button>
            </div>

            <p>${mod.description}</p>

            <div class="flex gap-15 items-center">
                <div>
                    <p>Assignee:</p>
                    <p class="font-bold">${mod.assignee}</p>
                </div>

                <div>
                    <p>Priority:</p>
                    <button class="btn btn-error text-white rounded-full">${mod.priority}</button>
                </div>
            </div>

            <form method="dialog" class="flex justify-end">
                <button class="btn btn-primary">Close</button>
            </form>
        </div>
    `;

    return modalelemt;
};

const renderModal = (data, containerId) => {
    const renderContainer = document.querySelector(containerId);
    renderContainer.innerHTML = '';
    renderContainer.appendChild(createModal(data));
};

const displayModal = (data) => {
    renderModal(data, '#modal-container');
};


const createCards = (element) => {
    const cardElemnt = document.createElement('div');

    cardElemnt.innerHTML = `
        <div class="bg-white w-full rounded-b-md shadow-lg p-5 space-y-5 cursor-pointer"
             id="card-${element.id}"
             onclick="loadModal('${element.id}'); my_modal_5.showModal()">

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
                    <button class="btn btn-outline btn-error rounded-full">${element.labels[0]}</button>
                    <button class="btn btn-outline btn-warning rounded-full">${element.labels[1]}</button>
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
    });
};


const displayCards = (data) => {
    const openIssues = data.filter(issue => issue.status === 'open');
    const closeIssues = data.filter(issue => issue.status === 'closed');

    render(data, '#card-container');
    render(openIssues, '#open-container');
    render(closeIssues, '#close-container');

    switchTab(currentTab || 'all');
};

document.querySelector('#search-btn').addEventListener('click', () => {
    const searchKeyword = document.querySelector('#search-keyword');
    const searchV = searchKeyword.value.trim().toLowerCase();

    if (!searchV) {
        displayCards(allissue);
        return;
    }

    showLoader();

    fetch(`https://phi-lab-server.vercel.app/api/v1/lab/issues/search?q=${searchV}`)
        .then(res => res.json())
        .then(data => {
            searchkey = data.data;
            displayCards(searchkey);
            hideLoader();
        });
});